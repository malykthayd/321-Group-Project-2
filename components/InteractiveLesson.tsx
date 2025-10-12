'use client'

import React, { useState } from 'react'
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'

interface InteractiveLessonProps {
  content: string
  onCompletionChange?: (isComplete: boolean, progress?: { completed: number; total: number }) => void
}

export function InteractiveLesson({ content, onCompletionChange }: InteractiveLessonProps) {
  const [answers, setAnswers] = useState<{ [key: string]: any }>({})
  const [showResults, setShowResults] = useState<{ [key: string]: boolean }>({})
  const [completed, setCompleted] = useState<{ [key: string]: boolean }>({})
  const [totalActivities, setTotalActivities] = useState(0)

  // Count total activities when content changes
  React.useEffect(() => {
    const lines = content.split('\n')
    let activityCount = 0
    let inMultipleChoice = false
    
    for (let i = 0; i < lines.length; i++) {
      const trimmedLine = lines[i].trim()
      
      // Check for clickable options (multiple [bracketed] items in one line, but not checkbox format)
      if (trimmedLine.match(/\[([^\]]+)\]/g)?.length >= 2 && !trimmedLine.includes('- [ ]')) {
        activityCount++
      }
      // Check for multiple choice questions (- [ ] format)
      else if (trimmedLine.includes('- [ ]') && !inMultipleChoice) {
        // Look ahead to see if this is actually a multiple choice question
        let hasCheckmark = false
        for (let j = i; j < Math.min(i + 10, lines.length); j++) {
          if (lines[j].includes('✓')) {
            hasCheckmark = true
            break
          }
          if (!lines[j].includes('- [ ]') && lines[j].trim() !== '') {
            break
          }
        }
        if (hasCheckmark) {
          activityCount++
          inMultipleChoice = true
        }
      }
      // Check for math problems with input
      else if (trimmedLine.includes('= ?')) {
        activityCount++
      }
      // Reset multiple choice flag when we hit a non-checkbox line
      else if (!trimmedLine.includes('- [ ]') && trimmedLine !== '') {
        inMultipleChoice = false
      }
    }
    
    setTotalActivities(activityCount)
  }, [content])

  // Track completion status
  React.useEffect(() => {
    const completedCount = Object.values(completed).filter(Boolean).length
    const isFullyComplete = totalActivities > 0 && completedCount === totalActivities
    onCompletionChange?.(isFullyComplete, { completed: completedCount, total: totalActivities })
  }, [completed, totalActivities])

  // Parse markdown-like content and render interactive elements
  const renderContent = (text: string) => {
    const lines = text.split('\n')
    const elements: JSX.Element[] = []
    let key = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Interactive Activity with clickable options - detect any line with multiple [bracketed] options
      if (line.match(/\[([^\]]+)\]/g)?.length >= 2 && !line.includes('- [ ]')) {
        const options = line.match(/\[([^\]]+)\]/g)?.map(opt => opt.slice(1, -1)) || []
        const activityKey = `activity_${key++}`
        
        // Determine correct answer - look for ✓ marker or default to first
        let correctAnswer = options[0]
        if (line.includes('✓')) {
          const correctMatch = line.match(/\[([^\]]+)\]\s*✓/)
          if (correctMatch) {
            correctAnswer = correctMatch[1]
          }
        }
        
        elements.push(
          <InteractiveOptions
            key={activityKey}
            options={options}
            correctAnswer={correctAnswer}
            onSelect={(selected) => {
              setAnswers(prev => ({ ...prev, [activityKey]: selected }))
              // Only mark as completed if the answer is correct
              if (selected === correctAnswer) {
                setCompleted(prev => ({ ...prev, [activityKey]: true }))
              }
            }}
            selected={answers[activityKey]}
            completed={completed[activityKey]}
          />
        )
      }
      // Multiple choice questions
      else if (line.includes('- [ ]')) {
        // Collect all related checkbox options
        const questionLines = []
        let j = i
        while (j < lines.length && (lines[j].includes('- [ ]') || lines[j].trim() === '')) {
          if (lines[j].includes('- [ ]') || lines[j].trim() === '') {
            questionLines.push(lines[j])
            j++
          } else {
            break
          }
        }
        
        // Only create interactive element if there's a checkmark (correct answer marker)
        const hasCorrectAnswer = questionLines.some(l => l.includes('✓'))
        if (hasCorrectAnswer && questionLines.filter(l => l.includes('- [ ]')).length > 0) {
          i = j - 1
          
          const questionKey = `question_${key++}`
          const options = questionLines
            .filter(l => l.includes('- [ ]'))
            .map(l => l.replace(/^[\s-]*\[\s*\]\s*/, '').replace(/\s*✓\s*$/, '').trim())
          const correctIndex = questionLines.findIndex(l => l.includes('✓'))
          
          // Find the question text (usually 1-3 lines before the options)
          let questionText = 'Question'
          for (let k = i - 5; k < i; k++) {
            if (k >= 0 && lines[k].trim() && !lines[k].includes('**') && !lines[k].startsWith('#')) {
              questionText = lines[k].replace(/^[0-9]+\.\s*/, '').trim()
            }
          }
          
          elements.push(
            <InteractiveQuestion
              key={questionKey}
              question={questionText}
              options={options}
              correctAnswer={correctIndex}
              onSelect={(selected) => {
                setAnswers(prev => ({ ...prev, [questionKey]: selected }))
                // Only mark as completed if the answer is correct
                if (selected === correctIndex) {
                  setCompleted(prev => ({ ...prev, [questionKey]: true }))
                }
              }}
              selected={answers[questionKey]}
              completed={completed[questionKey]}
            />
          )
        }
      }
      // Story problems with input fields
      else if (line.includes('= ?') && !line.includes('[5]')) {
        const problemKey = `problem_${key++}`
        const problem = line.replace('= ?', '')
        
        elements.push(
          <InteractiveMathProblem
            key={problemKey}
            problem={problem}
            onSolve={(answer) => {
              setAnswers(prev => ({ ...prev, [problemKey]: answer }))
              // Calculate correct answer and only mark as completed if correct
              const expression = problem.replace(/[^0-9+\-*/=]/g, '')
              let correctAnswer = '?'
              if (expression.includes('+')) {
                const [a, b] = expression.split('+').map(Number)
                correctAnswer = (a + b).toString()
              } else if (expression.includes('-')) {
                const [a, b] = expression.split('-').map(Number)
                correctAnswer = (a - b).toString()
              } else if (expression.includes('*')) {
                const [a, b] = expression.split('*').map(Number)
                correctAnswer = (a * b).toString()
              }
              
              if (answer === correctAnswer) {
                setCompleted(prev => ({ ...prev, [problemKey]: true }))
              }
            }}
            answer={answers[problemKey]}
            completed={completed[problemKey]}
          />
        )
      }
      // Regular text
      else if (line && !line.startsWith('**') && !line.startsWith('- [ ]')) {
        if (line.startsWith('#')) {
          const level = line.match(/^#+/)?.[0].length || 1
          const text = line.replace(/^#+\s*/, '')
          elements.push(
            React.createElement(`h${Math.min(level + 1, 6)}`, {
              key: key++,
              className: `text-${level === 1 ? '3xl' : level === 2 ? '2xl' : 'xl'} font-bold text-gray-900 mb-4 mt-6`
            }, text)
          )
        } else if (line.startsWith('**') && line.endsWith('**')) {
          const text = line.replace(/\*\*/g, '')
          elements.push(
            <p key={key++} className="font-bold text-lg text-gray-800 mb-3 mt-4">
              {text}
            </p>
          )
        } else if (line.startsWith('- ')) {
          const text = line.replace(/^- /, '')
          elements.push(
            <li key={key++} className="text-gray-700 mb-2 ml-4">
              {text}
            </li>
          )
        } else if (line.trim()) {
          elements.push(
            <p key={key++} className="text-gray-700 mb-3 leading-relaxed">
              {line}
            </p>
          )
        }
      }
    }

    return elements
  }

  return (
    <div className="space-y-6">
      {renderContent(content)}
    </div>
  )
}

function InteractiveOptions({ 
  options, 
  correctAnswer, 
  onSelect, 
  selected, 
  completed 
}: {
  options: string[]
  correctAnswer: string
  onSelect: (option: string) => void
  selected?: string
  completed?: boolean
}) {
  const isCorrect = selected === correctAnswer
  const hasAnswered = selected !== undefined

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 my-4">
      <p className="font-semibold text-blue-900 mb-4">Click your answer:</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {options.map((option) => {
          let buttonClass = "px-4 py-3 rounded-lg font-semibold transition-all duration-200 "
          
          if (completed) {
            // Only show final state when correct answer is selected
            if (option === correctAnswer) {
              buttonClass += "bg-green-500 text-white shadow-lg"
            } else if (option === selected) {
              buttonClass += "bg-red-500 text-white shadow-lg"
            } else {
              buttonClass += "bg-gray-300 text-gray-600"
            }
          } else if (hasAnswered) {
            // Show feedback but allow retry - only show incorrect answer in red
            if (option === selected) {
              buttonClass += "bg-red-500 text-white shadow-lg"
            } else {
              buttonClass += "bg-white text-blue-700 border-2 border-blue-300 hover:bg-blue-100 hover:scale-105"
            }
          } else if (selected === option) {
            buttonClass += "bg-blue-500 text-white shadow-md transform scale-105"
          } else {
            buttonClass += "bg-white text-blue-700 border-2 border-blue-300 hover:bg-blue-100 hover:scale-105"
          }

          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={buttonClass}
              disabled={completed}
            >
              {option}
              {completed && option === correctAnswer && (
                <CheckCircle className="w-4 h-4 ml-2 inline" />
              )}
              {hasAnswered && !completed && option === selected && option !== correctAnswer && (
                <XCircle className="w-4 h-4 ml-2 inline" />
              )}
            </button>
          )
        })}
      </div>
      {hasAnswered && (
        <div className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isCorrect ? (
            '🎉 Correct! Great job!'
          ) : (
            <div>
              <p className="font-semibold">❌ Not quite. Try again!</p>
              <p className="text-sm mt-1">Think about what plants really need to grow.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function InteractiveQuestion({
  question,
  options,
  correctAnswer,
  onSelect,
  selected,
  completed
}: {
  question: string
  options: string[]
  correctAnswer: number
  onSelect: (index: number) => void
  selected?: number
  completed?: boolean
}) {
  const isCorrect = selected === correctAnswer
  const hasAnswered = selected !== undefined

  return (
    <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 my-4">
      <p className="font-semibold text-purple-900 mb-4">{question}</p>
      <div className="space-y-2">
        {options.map((option, index) => {
          let optionClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 "
          
          if (completed) {
            // Only show final state when correct answer is selected
            if (index === correctAnswer) {
              optionClass += "bg-green-100 border-green-500 text-green-800"
            } else if (index === selected) {
              optionClass += "bg-red-100 border-red-500 text-red-800"
            } else {
              optionClass += "bg-gray-100 border-gray-300 text-gray-600"
            }
          } else if (hasAnswered) {
            // Show feedback but allow retry - only show incorrect answer in red
            if (index === selected) {
              optionClass += "bg-red-100 border-red-500 text-red-800"
            } else {
              optionClass += "bg-white border-purple-300 text-purple-700 hover:bg-purple-50"
            }
          } else if (selected === index) {
            optionClass += "bg-purple-100 border-purple-500 text-purple-800"
          } else {
            optionClass += "bg-white border-purple-300 text-purple-700 hover:bg-purple-50"
          }

          return (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={optionClass}
              disabled={completed}
            >
              <span className="flex items-center justify-between">
                <span>{String.fromCharCode(65 + index)}. {option}</span>
                {completed && index === correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {hasAnswered && !completed && index === selected && index !== correctAnswer && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </span>
            </button>
          )
        })}
      </div>
      {hasAnswered && (
        <div className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isCorrect ? (
            '🎉 Correct! Well done!'
          ) : (
            <div>
              <p className="font-semibold">❌ Not quite. Try again!</p>
              <p className="text-sm mt-1">Read the question carefully and think about your answer.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function InteractiveMathProblem({
  problem,
  onSolve,
  answer,
  completed
}: {
  problem: string
  onSolve: (answer: string) => void
  answer?: string
  completed?: boolean
}) {
  const [inputValue, setInputValue] = useState('')
  
  // Calculate the correct answer
  const calculateAnswer = (prob: string) => {
    try {
      // Simple math calculation
      const expression = prob.replace(/[^0-9+\-*/=]/g, '')
      if (expression.includes('+')) {
        const [a, b] = expression.split('+').map(Number)
        return (a + b).toString()
      } else if (expression.includes('-')) {
        const [a, b] = expression.split('-').map(Number)
        return (a - b).toString()
      } else if (expression.includes('*')) {
        const [a, b] = expression.split('*').map(Number)
        return (a * b).toString()
      }
    } catch (e) {
      return '?'
    }
    return '?'
  }

  const correctAnswer = calculateAnswer(problem)
  const isCorrect = answer === correctAnswer
  const hasAnswered = answer !== undefined

  const handleSubmit = () => {
    onSolve(inputValue)
  }

  const handleTryAgain = () => {
    setInputValue('')
    onSolve('')
  }

  return (
    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 my-4">
      <p className="font-semibold text-green-900 mb-4">Solve this problem:</p>
      <div className="text-2xl font-bold text-green-800 mb-4">{problem}</div>
      
      {!completed ? (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Your answer"
              className="px-4 py-2 border-2 border-green-300 rounded-lg text-lg font-semibold focus:border-green-500 focus:outline-none"
            />
            <button
              onClick={handleSubmit}
              disabled={!inputValue}
              className="btn btn-success disabled:opacity-50"
            >
              Check Answer
            </button>
          </div>
          
          {hasAnswered && (
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                <span className="font-bold text-lg">
                  {isCorrect ? '🎉 Correct!' : '❌ Not quite!'}
                </span>
              </div>
              <p className="mb-3">
                {isCorrect 
                  ? `Yes! ${problem} = ${answer}` 
                  : `Try solving ${problem} step by step.`
                }
              </p>
              {!isCorrect && (
                <button
                  onClick={handleTryAgain}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className={`p-4 rounded-lg bg-green-200 text-green-800`}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-6 h-6" />
            <span className="font-bold text-lg">🎉 Correct!</span>
          </div>
          <p>
            Yes! {problem} = {answer}
          </p>
        </div>
      )}
    </div>
  )
}
