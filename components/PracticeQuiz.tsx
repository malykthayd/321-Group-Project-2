'use client'

import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

interface PracticeQuizProps {
  question: {
    id: number
    question: string
    options: string[]
    correct_answer: number
    explanation: string
    subject: string
    difficulty_level: number
  }
  questionNumber: number
}

export function PracticeQuiz({ question, questionNumber }: PracticeQuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleSelect = (index: number) => {
    if (showResult) return // Don't allow changing after submission
    setSelectedAnswer(index)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) return
    setShowResult(true)
  }

  const isCorrect = selectedAnswer === question.correct_answer
  
  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Mathematics': return { bg: 'from-blue-500 to-blue-600', light: 'from-blue-100 to-blue-200', text: 'text-blue-700', border: 'border-blue-300' }
      case 'English': return { bg: 'from-purple-500 to-purple-600', light: 'from-purple-100 to-purple-200', text: 'text-purple-700', border: 'border-purple-300' }
      case 'Science': return { bg: 'from-green-500 to-green-600', light: 'from-green-100 to-green-200', text: 'text-green-700', border: 'border-green-300' }
      case 'Technology': return { bg: 'from-orange-500 to-orange-600', light: 'from-orange-100 to-orange-200', text: 'text-orange-700', border: 'border-orange-300' }
      default: return { bg: 'from-gray-500 to-gray-600', light: 'from-gray-100 to-gray-200', text: 'text-gray-700', border: 'border-gray-300' }
    }
  }

  const colors = getSubjectColor(question.subject)

  return (
    <div className="group relative">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.bg} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300`}></div>
      <div className="relative p-6 border-2 border-gray-200 rounded-2xl bg-white hover:border-transparent transition-all">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${colors.bg} rounded-xl flex items-center justify-center text-white font-bold shadow-md`}>
              {questionNumber}
            </div>
            <h4 className="font-bold text-gray-900 text-lg">Question {questionNumber}</h4>
          </div>
          <span className={`badge bg-gradient-to-r ${colors.light} ${colors.text} ${colors.border}`}>
            {question.subject}
          </span>
        </div>
        
        <p className="text-gray-900 mb-5 font-medium text-base leading-relaxed">{question.question}</p>
        
        <div className="space-y-3 mb-5">
          {question.options.map((option: string, optIdx: number) => {
            const isSelected = selectedAnswer === optIdx
            const isCorrectOption = optIdx === question.correct_answer
            
            let optionClass = 'flex items-start space-x-3 p-4 rounded-xl transition-all border-2 cursor-pointer '
            
            if (showResult) {
              if (isCorrectOption) {
                optionClass += 'bg-green-50 border-green-500 shadow-md'
              } else if (isSelected && !isCorrect) {
                optionClass += 'bg-red-50 border-red-500'
              } else {
                optionClass += 'bg-gray-50 border-gray-200 opacity-50'
              }
            } else {
              if (isSelected) {
                optionClass += `bg-gradient-to-r ${colors.light} ${colors.border} shadow-md scale-[1.02]`
              } else {
                optionClass += 'bg-gray-50/50 border-gray-200 hover:border-primary-300 hover:bg-blue-50/30 hover:scale-[1.01]'
              }
            }
            
            return (
              <div
                key={optIdx}
                onClick={() => handleSelect(optIdx)}
                className={optionClass}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-sm flex-shrink-0 ${
                  showResult && isCorrectOption
                    ? 'bg-green-500 text-white'
                    : showResult && isSelected && !isCorrect
                    ? 'bg-red-500 text-white'
                    : isSelected
                    ? `bg-gradient-to-br ${colors.bg} text-white`
                    : 'bg-white text-primary-700 border-2 border-primary-200'
                }`}>
                  {String.fromCharCode(65 + optIdx)}
                </div>
                <span className="text-gray-800 font-medium flex-1 pt-0.5">{option}</span>
                {showResult && isCorrectOption && (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                )}
                {showResult && isSelected && !isCorrect && (
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                )}
              </div>
            )
          })}
        </div>
        
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        ) : (
          <div className={`p-4 rounded-xl border-2 ${
            isCorrect
              ? 'bg-green-50 border-green-300'
              : 'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-green-800 text-lg">Correct! 🎉</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-600" />
                  <span className="font-bold text-red-800 text-lg">Not quite!</span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold">Explanation:</span> {question.explanation}
            </p>
            <button
              onClick={() => {
                setSelectedAnswer(null)
                setShowResult(false)
              }}
              className="btn btn-secondary text-sm mt-3"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

