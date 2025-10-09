import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { AdaptiveLearningEngine } from '@/lib/adaptive-learning'

export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const conceptId = searchParams.get('concept_id')
    const difficulty = searchParams.get('difficulty')
    const limit = searchParams.get('limit') || '10'

    const practiceItems = await AdaptiveLearningEngine.getPracticeItems(
      req.user!.id,
      conceptId ? parseInt(conceptId) : undefined,
      difficulty ? parseInt(difficulty) : undefined,
      parseInt(limit)
    )

    return NextResponse.json({ practiceItems })
  } catch (error) {
    console.error('Failed to fetch practice items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch practice items' },
      { status: 500 }
    )
  }
})
