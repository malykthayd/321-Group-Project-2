import { db } from './database'

export interface Lesson {
  id: number
  title: string
  description?: string
  content: string
  grade_level: number
  subject: string
  difficulty_level: number
  estimated_duration: number
  language: string
  is_active: boolean
  created_at: string
}

export class LessonService {
  static async getLessons(filters?: {
    subject?: string
    gradeLevel?: number
    language?: string
    difficulty?: number
  }): Promise<Lesson[]> {
    if (!db) return []
    
    let query = 'SELECT * FROM lessons WHERE is_active = 1'
    const params: any[] = []

    if (filters?.subject) {
      query += ' AND subject = ?'
      params.push(filters.subject)
    }

    if (filters?.gradeLevel !== undefined) {
      query += ' AND grade_level = ?'
      params.push(filters.gradeLevel)
    }

    if (filters?.language) {
      query += ' AND language = ?'
      params.push(filters.language)
    }

    if (filters?.difficulty) {
      query += ' AND difficulty_level = ?'
      params.push(filters.difficulty)
    }

    query += ' ORDER BY subject, grade_level, difficulty_level'

    const stmt = db.prepare(query)
    return stmt.all(...params) as Lesson[]
  }

  static async getLessonById(id: number): Promise<Lesson | null> {
    if (!db) return null
    
    const stmt = db.prepare('SELECT * FROM lessons WHERE id = ? AND is_active = 1')
    return stmt.get(id) as Lesson | null
  }

  static async getLessonsByGradeRange(minGrade: number, maxGrade: number, subject?: string): Promise<Lesson[]> {
    if (!db) return []
    
    let query = 'SELECT * FROM lessons WHERE is_active = 1 AND grade_level BETWEEN ? AND ?'
    const params: any[] = [minGrade, maxGrade]

    if (subject) {
      query += ' AND subject = ?'
      params.push(subject)
    }

    query += ' ORDER BY subject, grade_level, difficulty_level'

    const stmt = db.prepare(query)
    return stmt.all(...params) as Lesson[]
  }

  static async getSubjects(): Promise<string[]> {
    if (!db) return []
    
    const stmt = db.prepare('SELECT DISTINCT subject FROM lessons WHERE is_active = 1 ORDER BY subject')
    const results = stmt.all() as Array<{ subject: string }>
    return results.map(r => r.subject)
  }
}

