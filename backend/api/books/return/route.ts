import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { DigitalLibraryService } from '@/lib/digital-library'

export const POST = withAuth(async (req) => {
  try {
    const { bookId } = await req.json()
    
    if (!bookId) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      )
    }

    const success = await DigitalLibraryService.returnBook(req.user!.id, bookId)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to return book. It may not be checked out by you.' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to return book:', error)
    return NextResponse.json(
      { error: 'Failed to return book' },
      { status: 500 }
    )
  }
})
