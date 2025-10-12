import { NextRequest, NextResponse } from 'next/server'
import { AuthService, User } from '@/lib/auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: User
}

export function withAuth(handler: (req: AuthenticatedRequest, context?: any) => Promise<NextResponse>) {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      const token = req.headers.get('authorization')?.replace('Bearer ', '') ||
                   req.cookies.get('auth-token')?.value

      if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 })
      }

      const decoded = AuthService.verifyToken(token)
      
      if (!decoded) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }

      const user = AuthService.getUserById(decoded.id)
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 })
      }

      const authenticatedReq = req as AuthenticatedRequest
      authenticatedReq.user = user

      return handler(authenticatedReq, context)
    } catch (error) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
  }
}

export function withRole(allowedRoles: string[]) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return withAuth(async (req: AuthenticatedRequest) => {
      if (!req.user) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
      }

      if (!allowedRoles.includes(req.user.role)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
      }

      return handler(req)
    })
  }
}

export function createAuthResponse(user: User, token: string) {
  const response = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      language: user.language,
      grade_level: user.grade_level
    },
    token
  })

  // Set HTTP-only cookie
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/'
  })

  return response
}
