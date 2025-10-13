'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
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

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }
    loadDashboardData()
  }, [user, router])

  const loadDashboardData = async () => {
    try {
      // Mock data for demo - in real app, this would fetch from API
      const mockData: DashboardData = {
        stats: {
          totalLessons: 24,
          completedLessons: 18,
          totalBooks: 12,
          checkedOutBooks: 3,
          badges: 8,
          streak: 7
        },
        recentActivity: [
          {
            id: '1',
            type: 'lesson',
            title: 'Introduction to Fractions',
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
            title: 'Math Practice Problems',
            timestamp: '2 days ago',
            status: 'pending'
          },
          {
            id: '4',
            type: 'quiz',
            title: 'Science Quiz - Plants',
            timestamp: '3 days ago',
            status: 'overdue'
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
          labels: ['Math', 'Science', 'Reading', 'Writing'],
          datasets: [
            {
              data: [85, 72, 90, 68],
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
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Digital Library</h3>
                <p className="text-gray-600">Library content will be displayed here...</p>
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
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Materials</h3>
                <p className="text-gray-600">Practice materials will be displayed here...</p>
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
