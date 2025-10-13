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

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
  }

  const handleContinue = async () => {
    if (!selectedRole) {
      toast.error('Please select a role')
      return
    }

    setIsLoading(true)
    
    // For demo purposes, we'll create a demo user based on role
    const demoUsers = {
      student: { email: 'student@demo.com', password: 'demo123' },
      teacher: { email: 'teacher@demo.com', password: 'demo123' },
      parent: { email: 'parent@demo.com', password: 'demo123' },
      admin: { email: 'admin@demo.com', password: 'demo123' }
    }

    const demoUser = demoUsers[selectedRole as keyof typeof demoUsers]
    
    try {
      const success = await login(demoUser.email, demoUser.password)
      if (success) {
        router.push('/resource-hub')
      } else {
        toast.error('Login failed. Please try again.')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Accessible Quality Education
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your role to access personalized learning experiences designed for offline-capable education
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedRole === role.id
                    ? 'border-primary-500 bg-primary-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${role.color} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {role.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {role.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
            className="btn btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Continue'}
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Demo credentials will be used for each role</p>
        </div>
      </div>
    </div>
  )
}
