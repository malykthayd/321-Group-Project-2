'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { BookOpen, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Book {
  id: number
  title: string
  author: string
  description?: string
  content: string
  subject: string
  grade_level: number
  isbn?: string
}

interface Question {
  id: number
  question: string
  options: string[]
  correct_answer: number
  explanation: string
}

export default function BookPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [book, setBook] = useState<Book | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
  const [submittedAnswers, setSubmittedAnswers] = useState<{ [key: number]: boolean }>({})
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/')
      return
    }
    if (user && !authLoading) {
      loadBook()
    }
  }, [user, authLoading, params.id, router])

  const loadBook = async () => {
    try {
      setLoading(true)
      console.log('Loading book with params:', params)
      const response = await fetch(`/api/books/${params.id}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Book data received:', data)
        setBook(data.book)
        setQuestions(data.questions)
      } else {
        const error = await response.json()
        console.error('Book loading error:', {
          status: response.status,
          statusText: response.statusText,
          error: error,
          bookId: params.id,
          user: user?.id
        })
        
        // If the book isn't checked out, redirect to library with a helpful message
        if (response.status === 403) {
          toast.error('Please checkout this book first from the Digital Library.')
          router.push('/resource-hub')
        } else {
          toast.error(`${error.error || 'Failed to load book'} (Status: ${response.status})`)
          router.push('/resource-hub')
        }
      }
    } catch (error) {
      console.error('Failed to load book:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        params: params,
        user: user?.id
      })
      toast.error(`An error occurred while loading the book: ${error instanceof Error ? error.message : 'Unknown error'}`)
      router.push('/resource-hub')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    })
  }

  const handleSubmitAnswer = (questionId: number) => {
    const question = questions.find(q => q.id === questionId)
    if (!question || selectedAnswers[questionId] === undefined) return

    const isCorrect = selectedAnswers[questionId] === question.correct_answer
    
    if (isCorrect) {
      toast.success('Correct! ' + question.explanation)
      setSubmittedAnswers({
        ...submittedAnswers,
        [questionId]: true
      })
    } else {
      toast.error('Not quite right. Try again!')
    }
  }

  const handleShowResults = () => {
    // Check if all questions are answered correctly
    const allCorrect = questions.every(q => submittedAnswers[q.id])
    if (allCorrect) {
      setShowResults(true)
      toast.success('🎉 Congratulations! You answered all questions correctly!')
    } else {
      toast.error('Please answer all questions correctly before finishing.')
    }
  }

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      Science: 'bg-green-100 text-green-700 border-green-300',
      Mathematics: 'bg-blue-100 text-blue-700 border-blue-300',
      English: 'bg-purple-100 text-purple-700 border-purple-300',
      Technology: 'bg-orange-100 text-orange-700 border-orange-300',
    }
    return colors[subject] || 'bg-gray-100 text-gray-700 border-gray-300'
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
          <p className="text-gray-700 font-semibold text-lg">Loading book...</p>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center card max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h2>
          <p className="text-gray-600 mb-6">The book you are looking for does not exist or you haven't checked it out yet.</p>
          <button
            onClick={() => router.push('/resource-hub')}
            className="btn btn-primary px-6"
          >
            Back to Hub
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/resource-hub')}
              className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span className="font-medium">Back to Library</span>
            </button>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSubjectColor(book.subject)}`}>
                {book.subject}
              </span>
              <span className="text-sm text-gray-500">
                {book.grade_level === 0 ? 'Kindergarten' : `Grade ${book.grade_level}`}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Book Info */}
        <div className="card animate-slide-up mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-20 bg-gradient-to-br from-primary-400 to-purple-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-gray-600 mb-2">by {book.author}</p>
              {book.description && (
                <p className="text-gray-500 text-sm">{book.description}</p>
              )}
              {book.isbn && (
                <p className="text-gray-400 text-xs mt-2">ISBN: {book.isbn}</p>
              )}
            </div>
          </div>
        </div>

        {/* Book Content */}
        <div className="card animate-slide-up mb-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Book Content</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full"></div>
            </div>
          </div>

          <article className="prose prose-gray max-w-none">
            <div className="whitespace-pre-wrap">{book.content}</div>
          </article>
        </div>

        {/* Comprehension Questions */}
        {questions.length > 0 && (
          <div className="card animate-slide-up">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Comprehension Questions</h2>
                <div className="text-sm text-gray-500">
                  {Object.keys(submittedAnswers).length} / {questions.length} correct
                </div>
              </div>
              <p className="text-gray-600">Answer these questions to test your understanding of the book!</p>
            </div>

            <div className="space-y-6">
              {questions.map((question, index) => {
                const cleanQuestion = question.question.replace(`[Book: ${book.title}] `, '')
                const isAnswered = submittedAnswers[question.id]
                const selectedAnswer = selectedAnswers[question.id]

                return (
                  <div key={question.id} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-900 font-medium flex-1">{cleanQuestion}</p>
                      {isAnswered && (
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      )}
                    </div>

                    <div className="space-y-3 ml-11">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = selectedAnswer === optionIndex
                        const isCorrect = optionIndex === question.correct_answer
                        const showFeedback = isSelected && !isAnswered

                        return (
                          <button
                            key={optionIndex}
                            onClick={() => !isAnswered && handleAnswerSelect(question.id, optionIndex)}
                            disabled={isAnswered}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                              isAnswered
                                ? isCorrect
                                  ? 'bg-green-50 border-green-300 cursor-not-allowed'
                                  : 'bg-gray-100 border-gray-200 cursor-not-allowed'
                                : isSelected
                                ? 'bg-primary-50 border-primary-300'
                                : 'bg-white border-gray-200 hover:border-primary-200 hover:bg-primary-50/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={isAnswered && isCorrect ? 'font-medium text-green-700' : ''}>{option}</span>
                              {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {!isAnswered && selectedAnswer !== undefined && (
                      <div className="ml-11 mt-4">
                        <button
                          onClick={() => handleSubmitAnswer(question.id)}
                          className="btn btn-primary px-6"
                        >
                          Submit Answer
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Finish Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleShowResults}
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${
                  questions.every(q => submittedAnswers[q.id])
                    ? 'btn btn-success'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!questions.every(q => submittedAnswers[q.id])}
              >
                {questions.every(q => submittedAnswers[q.id])
                  ? '✓ Finish Reading'
                  : '⏳ Answer All Questions to Finish'}
              </button>
            </div>

            {showResults && (
              <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-green-900 text-lg">Great job! You've finished the book!</p>
                    <p className="text-sm text-green-700">You answered all comprehension questions correctly. Keep up the great work!</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

