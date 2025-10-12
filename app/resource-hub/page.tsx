'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { LessonCard } from '@/components/LessonCard'
import { PracticeQuiz } from '@/components/PracticeQuiz'
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
import toast from 'react-hot-toast'
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

// Simple cache to avoid refetching on every refresh
const dataCache: { [key: string]: { data: any; timestamp: number } } = {}
const CACHE_DURATION = 60000 // 1 minute

export default function ResourceHub() {
  const { user, logout, loading: authLoading } = useAuth()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'lessons' | 'library' | 'progress' | 'practice'>('lessons')
  const [books, setBooks] = useState<any[]>([])
  const [practiceItems, setPracticeItems] = useState<any[]>([])
  const [lessons, setLessons] = useState<any[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('All')
  const [bookFilter, setBookFilter] = useState<'all' | 'available' | 'checked-out'>('all')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/')
      return
    }
    if (!authLoading && user) {
      loadDashboardData()
    }
  }, [user, authLoading, router])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Check cache first
      const cacheKey = `dashboard-${user?.id}`
      const cached = dataCache[cacheKey]
      const now = Date.now()
      
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        // Use cached data
        setBooks(cached.data.books)
        setPracticeItems(cached.data.practiceItems)
        setLessons(cached.data.lessons)
        setSubjects(cached.data.subjects)
        setDashboardData(cached.data.dashboardData)
        setLoading(false)
        return
      }
      
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
      const booksArray = booksData.books || []
      const practiceArray = practiceData.practiceItems || []
      const lessonsArray = lessonsData.lessons || []
      const subjectsArray = ['All', ...(subjectsData.subjects || [])]
      
      setBooks(booksArray)
      setPracticeItems(practiceArray)
      setLessons(lessonsArray)
      setSubjects(subjectsArray)

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
      
      // Cache the data for faster reloads
      dataCache[cacheKey] = {
        data: {
          books: booksArray,
          practiceItems: practiceArray,
          lessons: lessonsArray,
          subjects: subjectsArray,
          dashboardData: mockData
        },
        timestamp: now
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckoutBook = async (bookId: number) => {
    try {
      const response = await fetch('/api/books/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookId })
      })

      if (response.ok) {
        toast.success('Book checked out successfully! Click "View Book" to start reading.')
        
        // Immediately update the local state to show the book as checked out
        setBooks(prevBooks => 
          prevBooks.map(book => 
            book.id === bookId 
              ? { ...book, is_checked_out: true }
              : book
          )
        )
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to checkout book')
      }
    } catch (error) {
      console.error('Failed to checkout book:', error)
      toast.error('An error occurred while checking out the book')
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
          <p className="text-gray-700 font-semibold text-lg">Loading your dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Getting everything ready for you</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center card max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-gray-900 font-bold text-lg mb-2">Oops! Something went wrong</p>
          <p className="text-gray-600 mb-4">Failed to load dashboard data</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <header className="glass-effect border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Learning Hub</h1>
                <p className="text-sm text-gray-600">Welcome back, <span className="font-semibold text-gray-900">{user?.first_name}</span>! 👋</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50">
                <p className="text-sm font-bold text-gray-900">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-gray-600 capitalize flex items-center gap-1">
                  {user?.role === 'student' && '🎓'}
                  {user?.role === 'teacher' && '👨‍🏫'}
                  {user?.role === 'parent' && '👪'}
                  {user?.role === 'admin' && '⚙️'}
                  {user?.role}
                  {user?.grade_level !== undefined && user?.grade_level !== null && (
                    <span className="ml-1">• Grade {user.grade_level === 0 ? 'K' : user.grade_level}</span>
                  )}
                </p>
              </div>
              <button
                onClick={logout}
                className="btn btn-secondary text-sm px-5"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="stat-card group bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-700 mb-1">Total Lessons</p>
                <p className="text-3xl font-black text-blue-900">
                  {dashboardData.stats.completedLessons}<span className="text-xl text-blue-600">/{dashboardData.stats.totalLessons}</span>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {dashboardData.stats.totalLessons > 0 ? Math.round((dashboardData.stats.completedLessons / dashboardData.stats.totalLessons) * 100) : 0}% Complete
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="stat-card group bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-green-700 mb-1">Books Read</p>
                <p className="text-3xl font-black text-green-900">
                  {dashboardData.stats.checkedOutBooks}<span className="text-xl text-green-600">/{dashboardData.stats.totalBooks}</span>
                </p>
                <p className="text-xs text-green-600 mt-1">Keep reading!</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="stat-card group bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-700 mb-1">Achievements</p>
                <p className="text-3xl font-black text-purple-900">{dashboardData.stats.badges}</p>
                <p className="text-xs text-purple-600 mt-1">Badges earned</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="stat-card group bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-700 mb-1">Learning Streak</p>
                <p className="text-3xl font-black text-orange-900">{dashboardData.stats.streak}</p>
                <p className="text-xs text-orange-600 mt-1">Days in a row 🔥</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-10">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200/50 inline-flex gap-2">
            {[
              { id: 'lessons', label: 'My Lessons', icon: BookOpen },
              { id: 'library', label: 'Digital Library', icon: FileText },
              { id: 'progress', label: 'Progress', icon: BarChart3 },
              { id: 'practice', label: 'Practice', icon: Target }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'lessons' && (
              <div className="space-y-6">
                <div className="card">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">Your Lessons</h3>
                      <p className="text-sm text-gray-600">
                        {lessons.filter((lesson) => selectedSubject === 'All' || lesson.subject === selectedSubject).length} lessons available
                      </p>
                    </div>
                    {subjects.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {subjects.map((subject) => (
                          <button
                            key={subject}
                            onClick={() => setSelectedSubject(subject)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-300 ${
                              selectedSubject === subject
                                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white border-transparent shadow-lg scale-105'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:shadow-md'
                            }`}
                          >
                            {subject === 'All' && '📚'}
                            {subject === 'Mathematics' && '🔢'}
                            {subject === 'English' && '📖'}
                            {subject === 'Science' && '🔬'}
                            {subject === 'Technology' && '💻'}
                            <span className="ml-1.5">{subject}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {lessons.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium">No lessons available yet</p>
                      <p className="text-sm text-gray-500 mt-1">Check back soon for new content!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {lessons
                        .filter((lesson) => selectedSubject === 'All' || lesson.subject === selectedSubject)
                        .map((lesson) => (
                          <LessonCard key={lesson.id} lesson={lesson} />
                        ))}
                      {lessons.filter((lesson) => selectedSubject === 'All' || lesson.subject === selectedSubject).length === 0 && (
                        <div className="text-center py-12">
                          <p className="text-gray-600 font-medium">No lessons found for {selectedSubject}</p>
                          <p className="text-sm text-gray-500 mt-1">Try selecting a different subject</p>
                        </div>
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
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <span className="text-3xl">📚</span>
                      Digital Library
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { id: 'all', label: 'All Books', icon: '📚' },
                        { id: 'available', label: 'Available', icon: '✅' },
                        { id: 'checked-out', label: 'Checked Out', icon: '📖' }
                      ].map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => setBookFilter(filter.id as any)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-300 ${
                            bookFilter === filter.id
                              ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white border-transparent shadow-lg scale-105'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:shadow-md'
                          }`}
                        >
                          <span className="mr-1.5">{filter.icon}</span>
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Book Count Display */}
                  <div className="mb-4 text-sm text-gray-600">
                    {bookFilter === 'all' && `Showing ${books.length} books total`}
                    {bookFilter === 'available' && `Showing ${books.filter(b => !b.is_checked_out).length} available books`}
                    {bookFilter === 'checked-out' && `Showing ${books.filter(b => b.is_checked_out).length} checked-out books`}
                  </div>
                  
                  {books.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium">No books available yet</p>
                    </div>
                  ) : (
                    <div className="grid gap-5">
                      {books
                        .filter((book) => {
                          if (bookFilter === 'all') return true
                          if (bookFilter === 'available') return !book.is_checked_out
                          if (bookFilter === 'checked-out') return book.is_checked_out
                          return true
                        })
                        .map((book) => (
                        <div key={book.id} className="group relative">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
                          <div className="relative p-5 border-2 border-gray-200 rounded-2xl bg-white hover:border-transparent transition-all">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-bold text-lg text-gray-900 mb-1">{book.title}</h4>
                                <p className="text-sm text-gray-600 mb-3">by <span className="font-semibold">{book.author}</span></p>
                                <div className="flex gap-2 mb-3 flex-wrap">
                                  <span className="badge badge-primary">{book.subject}</span>
                                  <span className="badge badge-gray">{book.grade_level === 0 ? 'Kindergarten' : `Grade ${book.grade_level}`}</span>
                                </div>
                                {book.description && (
                                  <p className="text-sm text-gray-600 leading-relaxed">{book.description}</p>
                                )}
                              </div>
                              {book.is_checked_out ? (
                                <button 
                                  onClick={() => router.push(`/book/${book.id}`)}
                                  className="btn btn-primary text-sm ml-4 whitespace-nowrap"
                                >
                                  📖 View Book
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleCheckoutBook(book.id)}
                                  className="btn btn-success text-sm ml-4 whitespace-nowrap"
                                >
                                  ✓ Checkout
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {books.filter((book) => {
                        if (bookFilter === 'all') return true
                        if (bookFilter === 'available') return !book.is_checked_out
                        if (bookFilter === 'checked-out') return book.is_checked_out
                        return true
                      }).length === 0 && (
                        <div className="text-center py-12">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-600 font-medium">
                            {bookFilter === 'available' && 'No books available for checkout'}
                            {bookFilter === 'checked-out' && 'No books currently checked out'}
                            {bookFilter === 'all' && 'No books found'}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {bookFilter === 'available' && 'Check back later for new books!'}
                            {bookFilter === 'checked-out' && 'Check out some books from the library to start reading!'}
                            {bookFilter === 'all' && 'Try selecting a different filter'}
                          </p>
                        </div>
                      )}
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
              <div className="space-y-6">
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                        <span className="text-3xl">🎯</span>
                        Practice Quiz
                      </h3>
                      <p className="text-sm text-gray-600">
                        {practiceItems.length} questions for your grade level
                      </p>
                    </div>
                  </div>
                  
                  {practiceItems.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-4">
                        <Target className="w-10 h-10 text-purple-600" />
                      </div>
                      <p className="text-gray-900 font-bold text-lg mb-2">No practice questions yet</p>
                      <p className="text-gray-600">Check back soon for new practice materials!</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {practiceItems.map((item, idx) => (
                        <PracticeQuiz
                          key={item.id || idx}
                          question={{
                            id: item.id,
                            question: item.question,
                            options: Array.isArray(item.options) ? item.options : JSON.parse(item.options || '[]'),
                            correct_answer: item.correct_answer,
                            explanation: item.explanation || 'No explanation available.',
                            subject: item.subject || 'General',
                            difficulty_level: item.difficulty_level || 1
                          }}
                          questionNumber={idx + 1}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card bg-gradient-to-br from-primary-50 to-purple-50 border-primary-200">
              <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveTab('lessons')}
                  className="w-full btn btn-primary text-left justify-between group"
                >
                  <span>Start New Lesson</span>
                  <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={() => setActiveTab('library')}
                  className="w-full btn btn-secondary text-left justify-between group hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:border-green-300"
                >
                  <span>Browse Library</span>
                  <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
                <button 
                  onClick={() => setActiveTab('practice')}
                  className="w-full btn btn-secondary text-left justify-between group hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 hover:border-orange-300"
                >
                  <span>Take Practice Quiz</span>
                  <Target className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                Achievements
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-white/60 rounded-xl border border-yellow-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Reading Champion</p>
                    <p className="text-xs text-gray-600">Completed 10 books</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-white/60 rounded-xl border border-green-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-md">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Math Master</p>
                    <p className="text-xs text-gray-600">Perfect score on 5 quizzes</p>
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
