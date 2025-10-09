import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { DigitalLibraryService } from '@/lib/digital-library'

export const GET = withAuth(async (req) => {
  try {
    const checkouts = await DigitalLibraryService.getStudentCheckouts(req.user!.id)
    const overdueBooks = await DigitalLibraryService.getOverdueBooks(req.user!.id)
    const progress = await DigitalLibraryService.getReadingProgress(req.user!.id)

    return NextResponse.json({
      checkouts,
      overdueBooks,
      progress
    })
  } catch (error) {
    console.error('Failed to fetch checkouts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch checkouts' },
      { status: 500 }
    )
  }
})
