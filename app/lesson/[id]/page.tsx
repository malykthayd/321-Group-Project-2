'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { BookOpen, ArrowLeft, Clock, Target } from 'lucide-react'
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
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }
    loadLesson()
  }, [user, params.id])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Lesson not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/resource-hub')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lessons
          </button>
          <div className="flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-blue-600 mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {lesson.subject}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {lesson.grade_level === 0 ? 'Kindergarten' : `Grade ${lesson.grade_level}`}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
              {lesson.description && (
                <p className="text-gray-600 mt-1">{lesson.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {lesson.estimated_duration} minutes
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {getDifficultyLabel(lesson.difficulty_level)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <article className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {lesson.content}
            </div>
          </article>

          {/* Action buttons */}
          <div className="mt-8 pt-6 border-t flex gap-3">
            <button
              onClick={() => {
                toast.success('Lesson marked as complete!')
                router.push('/resource-hub')
              }}
              className="btn btn-primary"
            >
              Mark as Complete
            </button>
            <button
              onClick={() => router.push('/resource-hub')}
              className="btn btn-secondary"
            >
              Back to Lessons
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

