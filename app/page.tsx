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
  const [gradeLevel, setGradeLevel] = useState<number | ''>('')
  const [phone, setPhone] = useState('')
  const [subjectArea, setSubjectArea] = useState('')

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
      toast.error('Please select your grade level')
      return
    }

    if (selectedRole === 'parent' && !phone) {
      toast.error('Please enter your phone number')
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
        grade_level: selectedRole === 'student' ? gradeLevel : undefined,
        phone: selectedRole === 'parent' ? phone : undefined,
        subject_area: selectedRole === 'teacher' ? subjectArea : undefined
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl w-full relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-3xl shadow-xl mb-6 transform hover:rotate-6 transition-transform">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Accessible</span>
            <br />
            <span className="text-gray-900">Quality Education</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Personalized learning experiences designed for students of all levels
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
          {/* Tabs */}
          <div className="flex bg-gray-50/50">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-5 px-8 text-center font-bold text-lg transition-all duration-300 relative ${
                mode === 'login'
                  ? 'text-primary-700 bg-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              {mode === 'login' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-purple-500"></div>
              )}
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-5 px-8 text-center font-bold text-lg transition-all duration-300 relative ${
                mode === 'register'
                  ? 'text-primary-700 bg-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              {mode === 'register' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-purple-500"></div>
              )}
              Create Account
            </button>
          </div>

          <div className="p-10 bg-white">
            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-6 max-w-md mx-auto">
                <div className="space-y-2">
                  <label className="label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="input"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="label">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="input"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Logging in...
                    </span>
                  ) : 'Login'}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Demo Accounts</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Try these credentials:</p>
                  <div className="space-y-1 text-sm">
                    <p className="font-mono text-gray-800">📚 malyk@example.com / password123</p>
                    <p className="font-mono text-gray-800">👨‍🏫 teacher@example.com / password123</p>
                    <p className="font-mono text-gray-800">👨‍👩‍👧‍👦 parent@example.com / password123</p>
                    <p className="font-mono text-gray-800">⚙️ admin@aqe.com / admin123</p>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <label className="label">
                    Select Your Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">Choose your role...</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="label">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input"
                      placeholder="John"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="label">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="label">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="label">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                  />
                </div>

                {selectedRole === 'student' && (
                  <div className="space-y-2">
                    <label className="label">
                      Grade Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(parseInt(e.target.value))}
                      className="input"
                      required
                    >
                      <option value="">Select your grade...</option>
                      <option value="0">Kindergarten</option>
                      <option value="1">1st Grade</option>
                      <option value="2">2nd Grade</option>
                      <option value="3">3rd Grade</option>
                      <option value="4">4th Grade</option>
                      <option value="5">5th Grade</option>
                      <option value="6">6th Grade</option>
                    </select>
                  </div>
                )}

                {selectedRole === 'parent' && (
                  <div className="space-y-2">
                    <label className="label">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                )}

                {selectedRole === 'teacher' && (
                  <div className="space-y-2">
                    <label className="label">
                      Subject Area (Optional)
                    </label>
                    <select
                      value={subjectArea}
                      onChange={(e) => setSubjectArea(e.target.value)}
                      className="input"
                    >
                      <option value="">Select subject area...</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="English">English</option>
                      <option value="Technology">Technology</option>
                      <option value="General">General/All Subjects</option>
                    </select>
                  </div>
                )}


                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Account...
                    </span>
                  ) : '✨ Create Account'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
