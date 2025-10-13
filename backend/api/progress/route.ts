import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { AdaptiveLearningEngine } from '@/lib/adaptive-learning'

export const GET = withAuth(async (req) => {
  try {
    const progress = await AdaptiveLearningEngine.getStudentProgress(req.user!.id)
    const recommendations = await AdaptiveLearningEngine.getAdaptiveRecommendations(req.user!.id)

    return NextResponse.json({
      progress,
      recommendations
    })
  } catch (error) {
    console.error('Failed to fetch progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
})
