import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { createAuthResponse } from '@/lib/middleware'

export async function POST(req: NextRequest) {
  try {
    const { email, password, role, first_name, last_name, phone, language } = await req.json()

    if (!email || !password || !role || !first_name || !last_name) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      )
    }

    if (!['student', 'teacher', 'parent', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = AuthService.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    const user = await AuthService.createUser({
      email,
      password,
      role,
      first_name,
      last_name,
      phone,
      language
    })

    const token = AuthService.generateToken(user)
    return createAuthResponse(user, token)
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
