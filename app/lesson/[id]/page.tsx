'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { BookOpen, ArrowLeft, Clock, Target } from 'lucide-react'
import { InteractiveLesson } from '@/components/InteractiveLesson'
import toast from 'react-hot-toast'

interface Lesson {
  id: number
  title: string
  description?: string
  content: string
  subject: string
  grade_level: number
  difficulty_level: number
  estimated_duration: number
}

export default function LessonPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFullyComplete, setIsFullyComplete] = useState(false)
  const [progress, setProgress] = useState<{ completed: number; total: number }>({ completed: 0, total: 0 })

  const handleCompletionChange = useCallback((isComplete: boolean, prog?: { completed: number; total: number }) => {
    setIsFullyComplete(isComplete)
    if (prog) setProgress(prog)
  }, [])

  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/')
      return
    }
    if (user && !authLoading) {
      loadLesson()
    }
  }, [user, authLoading, params.id, router])

  const loadLesson = async () => {
    try {
      // For now, we'll fetch from our existing lessons
      // In production, you'd have a proper API endpoint
      const response = await fetch(`/api/lessons/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setLesson(data.lesson)
      } else {
        toast.error('Lesson not found')
        router.push('/resource-hub')
      }
    } catch (error) {
      console.error('Failed to load lesson:', error)
      toast.error('Failed to load lesson')
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Beginner'
      case 2: return 'Easy'
      case 3: return 'Intermediate'
      case 4: return 'Advanced'
      case 5: return 'Expert'
      default: return `Level ${level}`
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Checking authentication...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we verify your session</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-700 font-semibold text-lg">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center card max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-900 font-bold text-lg mb-2">Lesson not found</p>
          <button onClick={() => router.push('/resource-hub')} className="btn btn-primary mt-4">
            Back to Lessons
          </button>
        </div>
      </div>
    )
  }

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Mathematics': return { bg: 'from-blue-500 to-blue-600', badge: 'bg-blue-100 text-blue-700 border-blue-200' }
      case 'English': return { bg: 'from-purple-500 to-purple-600', badge: 'bg-purple-100 text-purple-700 border-purple-200' }
      case 'Science': return { bg: 'from-green-500 to-green-600', badge: 'bg-green-100 text-green-700 border-green-200' }
      case 'Technology': return { bg: 'from-orange-500 to-orange-600', badge: 'bg-orange-100 text-orange-700 border-orange-200' }
      default: return { bg: 'from-gray-500 to-gray-600', badge: 'bg-gray-100 text-gray-700 border-gray-200' }
    }
  }

  const subjectColors = getSubjectColor(lesson?.subject || '')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <header className="glass-effect border-b border-gray-200/50 sticky top-0 z-10 shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push('/resource-hub')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-700 font-semibold mb-4 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Lessons
          </button>
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 bg-gradient-to-br ${subjectColors.bg} rounded-2xl flex items-center justify-center shadow-xl text-3xl`}>
              {lesson.subject === 'Mathematics' && '🔢'}
              {lesson.subject === 'English' && '📖'}
              {lesson.subject === 'Science' && '🔬'}
              {lesson.subject === 'Technology' && '💻'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${subjectColors.badge}`}>
                  {lesson.subject}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-semibold">
                  {lesson.grade_level === 0 ? 'Kindergarten' : `Grade ${lesson.grade_level}`}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{lesson.title}</h1>
              {lesson.description && (
                <p className="text-gray-600 text-lg mb-3">{lesson.description}</p>
              )}
              <div className="flex items-center gap-5 text-sm text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-primary-600" />
                  {lesson.estimated_duration} minutes
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Target className="w-4 h-4 text-primary-600" />
                  {getDifficultyLabel(lesson.difficulty_level)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="card animate-slide-up">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Lesson Content</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"></div>
            </div>
          </div>

          <article className="max-w-none">
            <InteractiveLesson 
              content={lesson.content} 
              onCompletionChange={handleCompletionChange}
            />
          </article>

          {/* Action buttons */}
          <div className="mt-10 pt-8 border-t border-gray-200 flex flex-wrap gap-3">
            <button
              onClick={() => {
                if (isFullyComplete) {
                  toast.success('🎉 Great job! Lesson completed!')
                  router.push('/resource-hub')
                } else {
                  toast.error('Please complete all activities before marking the lesson complete!')
                }
              }}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                isFullyComplete 
                  ? 'btn btn-success' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!isFullyComplete}
            >
              {isFullyComplete ? '✓ Mark as Complete' : '⏳ Complete All Activities First'}
            </button>
            <button
              onClick={() => router.push('/resource-hub')}
              className="btn btn-secondary px-6"
            >
              Back to Hub
            </button>
          </div>
          
          {/* Progress indicator */}
          {!isFullyComplete && progress.total > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">{progress.completed}/{progress.total}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-blue-900">Complete all activities to finish this lesson</p>
                    <span className="text-sm text-blue-600 font-medium">{progress.completed} of {progress.total} completed</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">Answer all questions and solve all problems to unlock the "Mark as Complete" button.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

