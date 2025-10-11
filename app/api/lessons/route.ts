import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { LessonService } from '@/lib/lessons'

export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const subject = searchParams.get('subject') || undefined
    const difficulty = searchParams.get('difficulty') ? parseInt(searchParams.get('difficulty')!) : undefined
    const language = searchParams.get('language') || 'en'
    
    // Use the logged-in user's grade level
    const userGradeLevel = req.user?.grade_level

    const lessons = await LessonService.getLessons({
      subject,
      gradeLevel: userGradeLevel,
      difficulty,
      language
    })

    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('Failed to fetch lessons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
})

