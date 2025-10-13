import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { DigitalLibraryService } from '@/lib/digital-library'

export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const gradeLevel = searchParams.get('grade_level')
    const subject = searchParams.get('subject')
    const language = searchParams.get('language') || 'en'

    const books = await DigitalLibraryService.getBooks(
      gradeLevel ? parseInt(gradeLevel) : undefined,
      subject || undefined,
      language
    )

    return NextResponse.json({ books })
  } catch (error) {
    console.error('Failed to fetch books:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
})
