import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { LessonService } from '@/lib/lessons'

export const GET = withAuth(async (req) => {
  try {
    const subjects = await LessonService.getSubjects()
    return NextResponse.json({ subjects })
  } catch (error) {
    console.error('Failed to fetch subjects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    )
  }
})

