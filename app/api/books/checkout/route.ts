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

    const success = await DigitalLibraryService.checkoutBook(req.user!.id, bookId)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to checkout book. It may already be checked out or unavailable.' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to checkout book:', error)
    return NextResponse.json(
      { error: 'Failed to checkout book' },
      { status: 500 }
    )
  }
})
