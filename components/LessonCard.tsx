'use client'

import { useRouter } from 'next/navigation'
import { BookOpen, Clock } from 'lucide-react'

interface Lesson {
  id: number
  title: string
  description?: string
  subject: string
  grade_level: number
  difficulty_level: number
  estimated_duration: number
}

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const router = useRouter()

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

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-100 text-green-700'
      case 2: return 'bg-blue-100 text-blue-700'
      case 3: return 'bg-yellow-100 text-yellow-700'
      case 4: return 'bg-orange-100 text-orange-700'
      case 5: return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-lg text-gray-900">{lesson.title}</h3>
          </div>
          
          {lesson.description && (
            <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
          )}
          
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
              {lesson.subject}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
              {lesson.grade_level === 0 ? 'Kindergarten' : `Grade ${lesson.grade_level}`}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(lesson.difficulty_level)}`}>
              {getDifficultyLabel(lesson.difficulty_level)}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lesson.estimated_duration} min
            </span>
          </div>
        </div>
        
        <button
          onClick={() => router.push(`/lesson/${lesson.id}`)}
          className="btn btn-primary text-sm whitespace-nowrap self-start"
        >
          Start Lesson
        </button>
      </div>
    </div>
  )
}

