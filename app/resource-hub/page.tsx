'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { LessonCard } from '@/components/LessonCard'
import { 
  BookOpen, 
  BarChart3, 
  Target, 
  Award, 
  Clock, 
  TrendingUp,
  Users,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface DashboardData {
  stats: {
    totalLessons: number
    completedLessons: number
    totalBooks: number
    checkedOutBooks: number
    badges: number
    streak: number
  }
  recentActivity: Array<{
    id: string
    type: string
    title: string
    timestamp: string
    status: 'completed' | 'pending' | 'overdue'
  }>
  progressData: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
    }>
  }
  masteryData: {
    labels: string[]
    datasets: Array<{
      data: number[]
      backgroundColor: string[]
    }>
  }
}

export default function ResourceHub() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'lessons' | 'library' | 'progress' | 'practice'>('lessons')
  const [books, setBooks] = useState<any[]>([])
  const [practiceItems, setPracticeItems] = useState<any[]>([])
  const [lessons, setLessons] = useState<any[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('All')

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }
    loadDashboardData()
  }, [user, router])

  const loadDashboardData = async () => {
    try {
      // Fetch real data from API
      const [booksRes, practiceRes, progressRes, lessonsRes, subjectsRes] = await Promise.all([
        fetch('/api/books', { credentials: 'include' }).catch(() => null),
        fetch('/api/practice', { credentials: 'include' }).catch(() => null),
        fetch('/api/progress', { credentials: 'include' }).catch(() => null),
        fetch('/api/lessons', { credentials: 'include' }).catch(() => null),
        fetch('/api/lessons/subjects', { credentials: 'include' }).catch(() => null)
      ])

      const booksData = booksRes && booksRes.ok ? await booksRes.json() : { books: [] }
      const practiceData = practiceRes && practiceRes.ok ? await practiceRes.json() : { practiceItems: [] }
      const progress = progressRes && progressRes.ok ? await progressRes.json() : null
      const lessonsData = lessonsRes && lessonsRes.ok ? await lessonsRes.json() : { lessons: [] }
      const subjectsData = subjectsRes && subjectsRes.ok ? await subjectsRes.json() : { subjects: [] }

      // Set data
      setBooks(booksData.books || [])
      setPracticeItems(practiceData.practiceItems || [])
      setLessons(lessonsData.lessons || [])
      setSubjects(['All', ...(subjectsData.subjects || [])])

      const mockData: DashboardData = {
        stats: {
          totalLessons: lessonsData.lessons?.length || 0,
          completedLessons: progress?.completedLessons || 0,
          totalBooks: booksData.books?.length || 0,
          checkedOutBooks: progress?.checkedOutBooks || 0,
          badges: progress?.badges || 5,
          streak: progress?.streak || 0
        },
        recentActivity: [
          {
            id: '1',
            type: 'lesson',
            title: 'Introduction to Addition',
            timestamp: '2 hours ago',
            status: 'completed'
          },
          {
            id: '2',
            type: 'book',
            title: 'The Magic Tree House',
            timestamp: '1 day ago',
            status: 'completed'
          },
          {
            id: '3',
            type: 'assignment',
            title: 'Understanding Fractions',
            timestamp: '2 days ago',
            status: 'pending'
          },
          {
            id: '4',
            type: 'quiz',
            title: 'Plant Life Cycle Quiz',
            timestamp: '3 days ago',
            status: 'completed'
          }
        ],
        progressData: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              label: 'Lessons Completed',
              data: [3, 5, 4, 6],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)'
            },
            {
              label: 'Books Read',
              data: [2, 3, 2, 4],
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)'
            }
          ]
        },
        masteryData: {
          labels: ['Addition', 'Fractions', 'Reading', 'Plants'],
          datasets: [
            {
              data: [80, 60, 90, 70],
              backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(34, 197, 94, 0.8)',
                'rgba(168, 85, 247, 0.8)',
                'rgba(245, 158, 11, 0.8)'
              ]
            }
          ]
        }
      }
      
      setDashboardData(mockData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      case 'overdue':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load dashboard data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resource Hub</h1>
              <p className="text-gray-600">Welcome back, {user?.first_name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="btn btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lessons</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.completedLessons}/{dashboardData.stats.totalLessons}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Books</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.stats.checkedOutBooks}/{dashboardData.stats.totalBooks}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Badges</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.badges}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Streak</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.streak} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'lessons', label: 'My Lessons', icon: BookOpen },
              { id: 'library', label: 'Digital Library', icon: FileText },
              { id: 'progress', label: 'Progress & Insights', icon: BarChart3 },
              { id: 'practice', label: 'Practice Materials', icon: Target }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'lessons' && (
              <div className="space-y-6">
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Available Lessons</h3>
                    {subjects.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {subjects.map((subject) => (
                          <button
                            key={subject}
                            onClick={() => setSelectedSubject(subject)}
                            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                              selectedSubject === subject
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {subject}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {lessons.length === 0 ? (
                    <p className="text-gray-600">No lessons available</p>
                  ) : (
                    <div className="space-y-3">
                      {lessons
                        .filter((lesson) => selectedSubject === 'All' || lesson.subject === selectedSubject)
                        .map((lesson) => (
                          <LessonCard key={lesson.id} lesson={lesson} />
                        ))}
                      {lessons.filter((lesson) => selectedSubject === 'All' || lesson.subject === selectedSubject).length === 0 && (
                        <p className="text-gray-600 text-sm">No lessons found for {selectedSubject}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {dashboardData.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(activity.status)}
                          <div>
                            <p className="font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-500">{activity.timestamp}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Overview</h3>
                  <Line data={dashboardData.progressData} options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                      title: {
                        display: false,
                      },
                    },
                  }} />
                </div>
              </div>
            )}

            {activeTab === 'library' && (
              <div className="space-y-4">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Digital Library</h3>
                  {books.length === 0 ? (
                    <p className="text-gray-600">No books available</p>
                  ) : (
                    <div className="grid gap-4">
                      {books.map((book) => (
                        <div key={book.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{book.title}</h4>
                              <p className="text-sm text-gray-600">by {book.author}</p>
                              <div className="flex gap-2 mt-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{book.subject}</span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">Grade {book.grade_level}</span>
                              </div>
                              {book.description && (
                                <p className="text-sm text-gray-600 mt-2">{book.description}</p>
                              )}
                            </div>
                            <button className="btn btn-primary text-sm ml-4">
                              {book.is_available ? 'Checkout' : 'Checked Out'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Mastery</h3>
                <Doughnut data={dashboardData.masteryData} options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    },
                  },
                }} />
              </div>
            )}

            {activeTab === 'practice' && (
              <div className="space-y-4">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Materials</h3>
                  {practiceItems.length === 0 ? (
                    <p className="text-gray-600">No practice items available</p>
                  ) : (
                    <div className="space-y-4">
                      {practiceItems.map((item, idx) => (
                        <div key={item.id || idx} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-gray-900">Question {idx + 1}</h4>
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                              Level {item.difficulty_level || 1}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{item.question}</p>
                          {item.options && typeof item.options === 'string' && (
                            <div className="space-y-2">
                              {JSON.parse(item.options).map((option: string, optIdx: number) => (
                                <div key={optIdx} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                                  <span className="font-medium text-gray-600">{String.fromCharCode(65 + optIdx)}.</span>
                                  <span className="text-gray-700">{option}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <button className="btn btn-primary text-sm mt-3">Start Practice</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full btn btn-primary text-left">
                  Start New Lesson
                </button>
                <button className="w-full btn btn-secondary text-left">
                  Browse Library
                </button>
                <button className="w-full btn btn-secondary text-left">
                  Take Practice Quiz
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-gray-900">Reading Champion</p>
                    <p className="text-sm text-gray-500">Completed 10 books</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Math Master</p>
                    <p className="text-sm text-gray-500">Perfect score on 5 quizzes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
