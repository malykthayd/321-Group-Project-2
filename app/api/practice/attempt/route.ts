import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { AdaptiveLearningEngine } from '@/lib/adaptive-learning'

export const POST = withAuth(async (req) => {
  try {
    const { practiceItemId, selectedAnswer, timeSpent } = await req.json()
    
    if (!practiceItemId || selectedAnswer === undefined) {
      return NextResponse.json(
        { error: 'Practice item ID and selected answer are required' },
        { status: 400 }
      )
    }

    const isCorrect = await AdaptiveLearningEngine.recordPracticeAttempt(
      req.user!.id,
      practiceItemId,
      selectedAnswer,
      timeSpent || 0
    )

    return NextResponse.json({ isCorrect })
  } catch (error) {
    console.error('Failed to record practice attempt:', error)
    return NextResponse.json(
      { error: 'Failed to record practice attempt' },
      { status: 500 }
    )
  }
})
