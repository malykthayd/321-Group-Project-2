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

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Mathematics': return 'from-blue-500 to-blue-600'
      case 'English': return 'from-purple-500 to-purple-600'
      case 'Science': return 'from-green-500 to-green-600'
      case 'Technology': return 'from-orange-500 to-orange-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'Mathematics': return '🔢'
      case 'English': return '📖'
      case 'Science': return '🔬'
      case 'Technology': return '💻'
      default: return '📚'
    }
  }

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
      <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 hover:border-transparent">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${getSubjectColor(lesson.subject)} rounded-xl flex items-center justify-center shadow-md text-2xl`}>
                {getSubjectIcon(lesson.subject)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-700 transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {lesson.grade_level === 0 ? 'Kindergarten' : `Grade ${lesson.grade_level}`} • {lesson.estimated_duration} min
                </p>
              </div>
            </div>
            
            {lesson.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{lesson.description}</p>
            )}
            
            <div className="flex flex-wrap gap-2">
              <span className={`badge ${getDifficultyColor(lesson.difficulty_level)}`}>
                {getDifficultyLabel(lesson.difficulty_level)}
              </span>
              <span className="badge bg-gray-100 text-gray-700 border border-gray-200">
                <Clock className="w-3 h-3 mr-1" />
                {lesson.estimated_duration} minutes
              </span>
            </div>
          </div>
          
          <button
            onClick={() => router.push(`/lesson/${lesson.id}`)}
            className="btn btn-primary text-sm whitespace-nowrap self-start group-hover:scale-110 transition-transform"
          >
            Start →
          </button>
        </div>
      </div>
    </div>
  )
}

