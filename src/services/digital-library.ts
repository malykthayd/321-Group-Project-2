import { db } from './database'

export interface Book {
  id: number
  title: string
  author: string
  isbn?: string
  grade_level: number
  subject: string
  language: string
  file_path?: string
  cover_image?: string
  description?: string
  is_available: boolean
  created_at: string
}

export interface BookCheckout {
  id: number
  student_id: number
  book_id: number
  checked_out_at: string
  returned_at?: string
  due_date?: string
}

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

export interface LessonBookLink {
  id: number
  lesson_id: number
  book_id: number
}

export class DigitalLibraryService {
  static async getBooks(
    gradeLevel?: number,
    subject?: string,
    language: string = 'en',
    availableOnly: boolean = true
  ): Promise<Book[]> {
    let query = 'SELECT * FROM books WHERE language = ?'
    const params = [language]

    if (gradeLevel) {
      query += ' AND grade_level = ?'
      params.push(gradeLevel)
    }

    if (subject) {
      query += ' AND subject = ?'
      params.push(subject)
    }

    if (availableOnly) {
      query += ' AND is_available = 1'
    }

    query += ' ORDER BY title ASC'

    const stmt = db.prepare(query)
    return stmt.all(...params) as Book[]
  }

  static async getBookById(id: number): Promise<Book | null> {
    const stmt = db.prepare('SELECT * FROM books WHERE id = ?')
    return stmt.get(id) as Book | null
  }

  static async checkoutBook(studentId: number, bookId: number): Promise<boolean> {
    const book = await this.getBookById(bookId)
    if (!book || !book.is_available) {
      return false
    }

    // Check if student already has this book checked out
    const existingCheckout = db.prepare(`
      SELECT * FROM book_checkouts 
      WHERE student_id = ? AND book_id = ? AND returned_at IS NULL
    `).get(studentId, bookId)

    if (existingCheckout) {
      return false // Already checked out
    }

    // Calculate due date (7 days from now)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 7)

    // Create checkout record
    db.prepare(`
      INSERT INTO book_checkouts (student_id, book_id, due_date)
      VALUES (?, ?, ?)
    `).run(studentId, bookId, dueDate.toISOString())

    // Mark book as unavailable
    db.prepare('UPDATE books SET is_available = 0 WHERE id = ?').run(bookId)

    return true
  }

  static async returnBook(studentId: number, bookId: number): Promise<boolean> {
    const checkout = db.prepare(`
      SELECT * FROM book_checkouts 
      WHERE student_id = ? AND book_id = ? AND returned_at IS NULL
    `).get(studentId, bookId) as BookCheckout | null

    if (!checkout) {
      return false
    }

    // Mark as returned
    db.prepare(`
      UPDATE book_checkouts 
      SET returned_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(checkout.id)

    // Mark book as available
    db.prepare('UPDATE books SET is_available = 1 WHERE id = ?').run(bookId)

    return true
  }

  static async getStudentCheckouts(studentId: number): Promise<Array<BookCheckout & { book: Book }>> {
    const stmt = db.prepare(`
      SELECT bc.*, b.*
      FROM book_checkouts bc
      JOIN books b ON bc.book_id = b.id
      WHERE bc.student_id = ?
      ORDER BY bc.checked_out_at DESC
    `)

    const results = stmt.all(studentId) as any[]
    
    return results.map(row => {
      const { id, student_id, book_id, checked_out_at, returned_at, due_date, ...bookData } = row
      return {
        id,
        student_id,
        book_id,
        checked_out_at,
        returned_at,
        due_date,
        book: bookData as Book
      }
    })
  }

  static async getOverdueBooks(studentId: number): Promise<Array<BookCheckout & { book: Book }>> {
    const stmt = db.prepare(`
      SELECT bc.*, b.*
      FROM book_checkouts bc
      JOIN books b ON bc.book_id = b.id
      WHERE bc.student_id = ? 
        AND bc.returned_at IS NULL 
        AND bc.due_date < CURRENT_TIMESTAMP
      ORDER BY bc.due_date ASC
    `)

    const results = stmt.all(studentId) as any[]
    
    return results.map(row => {
      const { id, student_id, book_id, checked_out_at, returned_at, due_date, ...bookData } = row
      return {
        id,
        student_id,
        book_id,
        checked_out_at,
        returned_at,
        due_date,
        book: bookData as Book
      }
    })
  }

  static async getLessonsForBook(bookId: number): Promise<Lesson[]> {
    const stmt = db.prepare(`
      SELECT l.*
      FROM lessons l
      JOIN lesson_book_links lbl ON l.id = lbl.lesson_id
      WHERE lbl.book_id = ? AND l.is_active = 1
      ORDER BY l.difficulty_level ASC
    `)

    return stmt.all(bookId) as Lesson[]
  }

  static async linkLessonToBook(lessonId: number, bookId: number): Promise<void> {
    db.prepare(`
      INSERT OR IGNORE INTO lesson_book_links (lesson_id, book_id)
      VALUES (?, ?)
    `).run(lessonId, bookId)
  }

  static async getReadingProgress(studentId: number): Promise<{
    totalBooksRead: number
    currentCheckouts: number
    overdueBooks: number
    favoriteSubject: string
    averageReadingTime: number
  }> {
    const totalBooksRead = db.prepare(`
      SELECT COUNT(*) as count FROM book_checkouts 
      WHERE student_id = ? AND returned_at IS NOT NULL
    `).get(studentId) as { count: number }

    const currentCheckouts = db.prepare(`
      SELECT COUNT(*) as count FROM book_checkouts 
      WHERE student_id = ? AND returned_at IS NULL
    `).get(studentId) as { count: number }

    const overdueBooks = db.prepare(`
      SELECT COUNT(*) as count FROM book_checkouts 
      WHERE student_id = ? AND returned_at IS NULL AND due_date < CURRENT_TIMESTAMP
    `).get(studentId) as { count: number }

    const favoriteSubject = db.prepare(`
      SELECT b.subject, COUNT(*) as count
      FROM book_checkouts bc
      JOIN books b ON bc.book_id = b.id
      WHERE bc.student_id = ? AND bc.returned_at IS NOT NULL
      GROUP BY b.subject
      ORDER BY count DESC
      LIMIT 1
    `).get(studentId) as { subject: string } | null

    // Mock average reading time calculation
    const averageReadingTime = 45 // minutes

    return {
      totalBooksRead: totalBooksRead.count,
      currentCheckouts: currentCheckouts.count,
      overdueBooks: overdueBooks.count,
      favoriteSubject: favoriteSubject?.subject || 'General',
      averageReadingTime
    }
  }

  static async searchBooks(query: string, filters: {
    gradeLevel?: number
    subject?: string
    language?: string
  } = {}): Promise<Book[]> {
    let sql = `
      SELECT * FROM books 
      WHERE (title LIKE ? OR author LIKE ? OR description LIKE ?)
        AND is_available = 1
    `
    const params = [`%${query}%`, `%${query}%`, `%${query}%`]

    if (filters.gradeLevel) {
      sql += ' AND grade_level = ?'
      params.push(filters.gradeLevel)
    }

    if (filters.subject) {
      sql += ' AND subject = ?'
      params.push(filters.subject)
    }

    if (filters.language) {
      sql += ' AND language = ?'
      params.push(filters.language)
    }

    sql += ' ORDER BY title ASC'

    const stmt = db.prepare(sql)
    return stmt.all(...params) as Book[]
  }

  static async addBook(bookData: Omit<Book, 'id' | 'created_at'>): Promise<number> {
    const stmt = db.prepare(`
      INSERT INTO books (title, author, isbn, grade_level, subject, language, file_path, cover_image, description, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      bookData.title,
      bookData.author,
      bookData.isbn || null,
      bookData.grade_level,
      bookData.subject,
      bookData.language,
      bookData.file_path || null,
      bookData.cover_image || null,
      bookData.description || null,
      bookData.is_available ? 1 : 0
    )

    return result.lastInsertRowid as number
  }

  static async updateBook(id: number, updates: Partial<Book>): Promise<boolean> {
    const allowedFields = ['title', 'author', 'isbn', 'grade_level', 'subject', 'language', 'file_path', 'cover_image', 'description', 'is_available']
    const updateFields = Object.keys(updates).filter(key => 
      allowedFields.includes(key) && updates[key as keyof Book] !== undefined
    )

    if (updateFields.length === 0) {
      return false
    }

    const setClause = updateFields.map(field => `${field} = ?`).join(', ')
    const values = updateFields.map(field => updates[field as keyof Book])
    
    const stmt = db.prepare(`
      UPDATE books SET ${setClause} WHERE id = ?
    `)
    
    const result = stmt.run(...values, id)
    return result.changes > 0
  }
}
