import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { DigitalLibraryService } from '@/lib/digital-library'

export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const subject = searchParams.get('subject')
    const language = searchParams.get('language') || 'en'

    // Use the logged-in user's grade level to filter books
    const userGradeLevel = req.user?.grade_level

    const books = await DigitalLibraryService.getBooks(
      userGradeLevel, // Filter by user's grade level
      subject || undefined,
      language,
      false // Show all books, not just available ones
    )

    // Get all checkouts once instead of per book (more efficient)
    const checkouts = await DigitalLibraryService.getStudentCheckouts(req.user!.id)
    const checkedOutBookIds = new Set(
      checkouts
        .filter(checkout => !checkout.returned_at)
        .map(checkout => checkout.book_id)
    )
    
    // Add checkout status to each book
    const booksWithCheckoutStatus = books.map(book => ({
      ...book,
      is_checked_out: checkedOutBookIds.has(book.id)
    }))

    return NextResponse.json({ books: booksWithCheckoutStatus })
  } catch (error) {
    console.error('Failed to fetch books:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
})
