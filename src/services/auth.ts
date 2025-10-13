import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from './database'

export interface User {
  id: number
  email: string
  role: 'student' | 'teacher' | 'parent' | 'admin'
  first_name: string
  last_name: string
  phone?: string
  language: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthUser extends User {
  password_hash?: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  static generateToken(user: User): string {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return null
    }
  }

  static async createUser(userData: {
    email: string
    password: string
    role: 'student' | 'teacher' | 'parent' | 'admin'
    first_name: string
    last_name: string
    phone?: string
    language?: string
  }): Promise<User> {
    const password_hash = await this.hashPassword(userData.password)
    
    const stmt = db.prepare(`
      INSERT INTO users (email, password_hash, role, first_name, last_name, phone, language)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(
      userData.email,
      password_hash,
      userData.role,
      userData.first_name,
      userData.last_name,
      userData.phone || null,
      userData.language || 'en'
    )

    return this.getUserById(result.lastInsertRowid as number)!
  }

  static async authenticate(email: string, password: string): Promise<User | null> {
    const stmt = db.prepare(`
      SELECT * FROM users WHERE email = ? AND is_active = 1
    `)
    
    const user = stmt.get(email) as AuthUser
    
    if (!user) {
      return null
    }

    const isValid = await this.verifyPassword(password, user.password_hash!)
    
    if (!isValid) {
      return null
    }

    // Remove password_hash from returned user
    const { password_hash, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  static getUserById(id: number): User | null {
    const stmt = db.prepare(`
      SELECT id, email, role, first_name, last_name, phone, language, is_active, created_at, updated_at
      FROM users WHERE id = ? AND is_active = 1
    `)
    
    return stmt.get(id) as User | null
  }

  static getUserByEmail(email: string): User | null {
    const stmt = db.prepare(`
      SELECT id, email, role, first_name, last_name, phone, language, is_active, created_at, updated_at
      FROM users WHERE email = ? AND is_active = 1
    `)
    
    return stmt.get(email) as User | null
  }

  static async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const allowedFields = ['first_name', 'last_name', 'phone', 'language']
    const updateFields = Object.keys(updates).filter(key => 
      allowedFields.includes(key) && updates[key as keyof User] !== undefined
    )

    if (updateFields.length === 0) {
      return this.getUserById(id)
    }

    const setClause = updateFields.map(field => `${field} = ?`).join(', ')
    const values = updateFields.map(field => updates[field as keyof User])
    
    const stmt = db.prepare(`
      UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND is_active = 1
    `)
    
    stmt.run(...values, id)
    
    return this.getUserById(id)
  }

  static async changePassword(id: number, currentPassword: string, newPassword: string): Promise<boolean> {
    const stmt = db.prepare(`
      SELECT password_hash FROM users WHERE id = ? AND is_active = 1
    `)
    
    const user = stmt.get(id) as { password_hash: string }
    
    if (!user) {
      return false
    }

    const isValid = await this.verifyPassword(currentPassword, user.password_hash)
    
    if (!isValid) {
      return false
    }

    const newPasswordHash = await this.hashPassword(newPassword)
    
    const updateStmt = db.prepare(`
      UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    updateStmt.run(newPasswordHash, id)
    
    return true
  }

  static async linkStudentParent(studentId: number, parentId: number): Promise<void> {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO students_parents (student_id, parent_id)
      VALUES (?, ?)
    `)
    
    stmt.run(studentId, parentId)
  }

  static getStudentParents(studentId: number): User[] {
    const stmt = db.prepare(`
      SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.phone, u.language, u.is_active, u.created_at, u.updated_at
      FROM users u
      JOIN students_parents sp ON u.id = sp.parent_id
      WHERE sp.student_id = ? AND u.is_active = 1
    `)
    
    return stmt.all(studentId) as User[]
  }

  static getParentStudents(parentId: number): User[] {
    const stmt = db.prepare(`
      SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.phone, u.language, u.is_active, u.created_at, u.updated_at
      FROM users u
      JOIN students_parents sp ON u.id = sp.student_id
      WHERE sp.parent_id = ? AND u.is_active = 1
    `)
    
    return stmt.all(parentId) as User[]
  }
}
