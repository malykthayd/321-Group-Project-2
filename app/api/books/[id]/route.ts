import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { DigitalLibraryService } from '@/lib/digital-library'
import { db } from '@/lib/database'

export const GET = withAuth(async (req, context) => {
  try {
    const params = context?.params || {}
    console.log('API Route - Context:', context)
    console.log('API Route - Params:', params)
    console.log('API Route - Params.id:', params.id)
    
    const bookId = parseInt(params.id as string)
    console.log('API Route - Parsed bookId:', bookId)
    
    if (isNaN(bookId)) {
      console.log('API Route - Invalid book ID:', params.id)
      return NextResponse.json(
        { error: 'Invalid book ID', received: params.id },
        { status: 400 }
      )
    }

    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 }
      )
    }

    // Get the book details
    const book = db.prepare(`
      SELECT * FROM books WHERE id = ?
    `).get(bookId)

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    // Check if the student has checked out this book
    const checkouts = await DigitalLibraryService.getStudentCheckouts(req.user!.id)
    const isCheckedOut = checkouts.some(checkout => checkout.book_id === bookId && !checkout.returned_at)

    if (!isCheckedOut) {
      return NextResponse.json(
        { error: 'You must checkout this book before reading it' },
        { status: 403 }
      )
    }

    // Get comprehension questions for this book
    const questions = db.prepare(`
      SELECT * FROM practice_items 
      WHERE question LIKE ? AND grade_level = ? AND subject = ?
    `).all(`[Book: ${book.title}]%`, book.grade_level, book.subject)

    return NextResponse.json({ 
      book,
      questions: questions.map(q => ({
        ...q,
        options: JSON.parse(q.options)
      }))
    })
  } catch (error) {
    console.error('Failed to fetch book:', error)
    console.error('Book ID:', params.id, 'User:', req.user?.id)
    return NextResponse.json(
      { error: 'Failed to fetch book', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
})

