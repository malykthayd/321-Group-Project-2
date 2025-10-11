'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { BookOpen, Users, UserCheck, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

const roles = [
  {
    id: 'student',
    name: 'Student',
    description: 'Access lessons, readings, and track your progress',
    icon: BookOpen,
    color: 'bg-blue-500'
  },
  {
    id: 'teacher',
    name: 'Teacher',
    description: 'Create assignments and monitor student progress',
    icon: Users,
    color: 'bg-green-500'
  },
  {
    id: 'parent',
    name: 'Parent/Guardian',
    description: 'View your child\'s progress and support their learning',
    icon: UserCheck,
    color: 'bg-purple-500'
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Manage content, users, and system settings',
    icon: Settings,
    color: 'bg-orange-500'
  }
]

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [isLoading, setIsLoading] = useState(false)
  const { login, register } = useAuth()
  const router = useRouter()

  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!loginEmail || !loginPassword) {
      toast.error('Please enter email and password')
      return
    }

    setIsLoading(true)
    
    try {
      const success = await login(loginEmail, loginPassword)
      if (success) {
        toast.success('Login successful!')
        router.push('/resource-hub')
      } else {
        toast.error('Invalid email or password')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedRole || !firstName || !lastName || !email || !password) {
      toast.error('Please fill in all required fields')
      return
    }

    if (selectedRole === 'student' && !gradeLevel) {
      toast.error('Please enter your grade level')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    
    try {
      const userData = {
        email,
        password,
        role: selectedRole as 'student' | 'teacher' | 'parent' | 'admin',
        first_name: firstName,
        last_name: lastName,
        grade_level: selectedRole === 'student' ? parseInt(gradeLevel) : undefined
      }

      const success = await register(userData)
      if (success) {
        toast.success('Account created successfully!')
        router.push('/resource-hub')
      } else {
        toast.error('Failed to create account. Email may already exist.')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Accessible Quality Education
          </h1>
          <p className="text-lg text-gray-600">
            Personalized learning experiences designed for offline-capable education
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                mode === 'login'
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                mode === 'register'
                  ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-8">
            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-6 max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>

                <div className="text-center text-sm text-gray-600 mt-4">
                  <p className="mb-2">Demo accounts:</p>
                  <p>student@demo.com / demo123</p>
                  <p>teacher@demo.com / demo123</p>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Your Role <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {roles.map((role) => {
                      const Icon = role.icon
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setSelectedRole(role.id)}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                            selectedRole === role.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${role.color} text-white`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{role.name}</h3>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="John"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                  />
                </div>

                {selectedRole === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select grade level</option>
                      <option value="0">Kindergarten</option>
                      {[1, 2, 3, 4, 5, 6].map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
