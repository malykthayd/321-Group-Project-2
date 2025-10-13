import { db } from './database'

export interface Translation {
  id: number
  key: string
  language: string
  value: string
  context?: string
  created_at: string
}

export interface Language {
  code: string
  name: string
  native_name: string
  is_rtl: boolean
}

export class TranslationService {
  private static translations: Map<string, Map<string, string>> = new Map()
  private static currentLanguage: string = 'en'

  static readonly SUPPORTED_LANGUAGES: Language[] = [
    { code: 'en', name: 'English', native_name: 'English', is_rtl: false },
    { code: 'es', name: 'Spanish', native_name: 'Español', is_rtl: false },
    { code: 'fr', name: 'French', native_name: 'Français', is_rtl: false },
    { code: 'ar', name: 'Arabic', native_name: 'العربية', is_rtl: true },
    { code: 'sw', name: 'Swahili', native_name: 'Kiswahili', is_rtl: false },
    { code: 'hi', name: 'Hindi', native_name: 'हिन्दी', is_rtl: false },
    { code: 'zh', name: 'Chinese', native_name: '中文', is_rtl: false },
    { code: 'pt', name: 'Portuguese', native_name: 'Português', is_rtl: false }
  ]

  static async loadTranslations(language: string = 'en'): Promise<void> {
    try {
      const stmt = db.prepare(`
        SELECT key, value FROM translations WHERE language = ?
      `)
      const translations = stmt.all(language) as Array<{ key: string, value: string }>
      
      const langMap = new Map<string, string>()
      translations.forEach(t => langMap.set(t.key, t.value))
      
      this.translations.set(language, langMap)
      this.currentLanguage = language
    } catch (error) {
      console.error('Failed to load translations:', error)
    }
  }

  static t(key: string, params?: Record<string, string | number>): string {
    const langMap = this.translations.get(this.currentLanguage)
    let translation = langMap?.get(key) || key

    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{${paramKey}}`, String(paramValue))
      })
    }

    return translation
  }

  static setLanguage(language: string): void {
    this.currentLanguage = language
  }

  static getCurrentLanguage(): string {
    return this.currentLanguage
  }

  static getSupportedLanguages(): Language[] {
    return this.SUPPORTED_LANGUAGES
  }

  static async addTranslation(
    key: string, 
    language: string, 
    value: string, 
    context?: string
  ): Promise<void> {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO translations (key, language, value, context)
      VALUES (?, ?, ?, ?)
    `)
    
    stmt.run(key, language, value, context || null)
    
    // Update in-memory cache
    if (!this.translations.has(language)) {
      this.translations.set(language, new Map())
    }
    this.translations.get(language)!.set(key, value)
  }

  static async getTranslations(language: string): Promise<Translation[]> {
    const stmt = db.prepare(`
      SELECT * FROM translations WHERE language = ? ORDER BY key
    `)
    return stmt.all(language) as Translation[]
  }

  static async updateTranslation(
    id: number, 
    value: string, 
    context?: string
  ): Promise<boolean> {
    const stmt = db.prepare(`
      UPDATE translations SET value = ?, context = ? WHERE id = ?
    `)
    
    const result = stmt.run(value, context || null, id)
    return result.changes > 0
  }

  static async deleteTranslation(id: number): Promise<boolean> {
    const stmt = db.prepare('DELETE FROM translations WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }

  static async translateLesson(lessonId: number, targetLanguage: string): Promise<boolean> {
    try {
      // Get original lesson
      const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(lessonId)
      if (!lesson) {
        return false
      }

      // Check if translation already exists
      const existingTranslation = db.prepare(`
        SELECT id FROM lessons WHERE id = ? AND language = ?
      `).get(lessonId, targetLanguage)

      if (existingTranslation) {
        return true // Already translated
      }

      // Mock translation - in real app, this would use a translation API
      const translatedTitle = await this.mockTranslate(lesson.title, targetLanguage)
      const translatedDescription = lesson.description ? 
        await this.mockTranslate(lesson.description, targetLanguage) : null
      const translatedContent = await this.mockTranslate(lesson.content, targetLanguage)

      // Create translated lesson
      const stmt = db.prepare(`
        INSERT INTO lessons (title, description, content, grade_level, subject, difficulty_level, estimated_duration, language, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      
      stmt.run(
        translatedTitle,
        translatedDescription,
        translatedContent,
        lesson.grade_level,
        lesson.subject,
        lesson.difficulty_level,
        lesson.estimated_duration,
        targetLanguage,
        lesson.is_active
      )

      return true
    } catch (error) {
      console.error('Lesson translation failed:', error)
      return false
    }
  }

  static async translateBook(bookId: number, targetLanguage: string): Promise<boolean> {
    try {
      const book = db.prepare('SELECT * FROM books WHERE id = ?').get(bookId)
      if (!book) {
        return false
      }

      const existingTranslation = db.prepare(`
        SELECT id FROM books WHERE id = ? AND language = ?
      `).get(bookId, targetLanguage)

      if (existingTranslation) {
        return true
      }

      const translatedTitle = await this.mockTranslate(book.title, targetLanguage)
      const translatedAuthor = await this.mockTranslate(book.author, targetLanguage)
      const translatedDescription = book.description ? 
        await this.mockTranslate(book.description, targetLanguage) : null

      const stmt = db.prepare(`
        INSERT INTO books (title, author, isbn, grade_level, subject, language, file_path, cover_image, description, is_available)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      
      stmt.run(
        translatedTitle,
        translatedAuthor,
        book.isbn,
        book.grade_level,
        book.subject,
        targetLanguage,
        book.file_path,
        book.cover_image,
        translatedDescription,
        book.is_available
      )

      return true
    } catch (error) {
      console.error('Book translation failed:', error)
      return false
    }
  }

  private static async mockTranslate(text: string, targetLanguage: string): Promise<string> {
    // Mock translation - replace with actual translation service
    const translations: Record<string, Record<string, string>> = {
      'Introduction to Fractions': {
        es: 'Introducción a las Fracciones',
        fr: 'Introduction aux Fractions',
        ar: 'مقدمة في الكسور',
        sw: 'Utangulizi wa Sehemu',
        hi: 'भिन्नों का परिचय',
        zh: '分数介绍',
        pt: 'Introdução às Frações'
      },
      'Mathematics': {
        es: 'Matemáticas',
        fr: 'Mathématiques',
        ar: 'الرياضيات',
        sw: 'Hisabati',
        hi: 'गणित',
        zh: '数学',
        pt: 'Matemática'
      },
      'Science': {
        es: 'Ciencias',
        fr: 'Sciences',
        ar: 'العلوم',
        sw: 'Sayansi',
        hi: 'विज्ञान',
        zh: '科学',
        pt: 'Ciências'
      }
    }

    return translations[text]?.[targetLanguage] || text
  }

  static async initializeDefaultTranslations(): Promise<void> {
    const defaultTranslations = [
      // Common UI elements
      { key: 'welcome', en: 'Welcome', es: 'Bienvenido', fr: 'Bienvenue', ar: 'أهلاً وسهلاً' },
      { key: 'login', en: 'Login', es: 'Iniciar sesión', fr: 'Connexion', ar: 'تسجيل الدخول' },
      { key: 'logout', en: 'Logout', es: 'Cerrar sesión', fr: 'Déconnexion', ar: 'تسجيل الخروج' },
      { key: 'register', en: 'Register', es: 'Registrarse', fr: 'S\'inscrire', ar: 'التسجيل' },
      { key: 'email', en: 'Email', es: 'Correo electrónico', fr: 'E-mail', ar: 'البريد الإلكتروني' },
      { key: 'password', en: 'Password', es: 'Contraseña', fr: 'Mot de passe', ar: 'كلمة المرور' },
      { key: 'submit', en: 'Submit', es: 'Enviar', fr: 'Soumettre', ar: 'إرسال' },
      { key: 'cancel', en: 'Cancel', es: 'Cancelar', fr: 'Annuler', ar: 'إلغاء' },
      { key: 'save', en: 'Save', es: 'Guardar', fr: 'Sauvegarder', ar: 'حفظ' },
      { key: 'edit', en: 'Edit', es: 'Editar', fr: 'Modifier', ar: 'تعديل' },
      { key: 'delete', en: 'Delete', es: 'Eliminar', fr: 'Supprimer', ar: 'حذف' },
      
      // Learning specific
      { key: 'lessons', en: 'Lessons', es: 'Lecciones', fr: 'Leçons', ar: 'الدروس' },
      { key: 'books', en: 'Books', es: 'Libros', fr: 'Livres', ar: 'الكتب' },
      { key: 'progress', en: 'Progress', es: 'Progreso', fr: 'Progrès', ar: 'التقدم' },
      { key: 'practice', en: 'Practice', es: 'Práctica', fr: 'Pratique', ar: 'الممارسة' },
      { key: 'quiz', en: 'Quiz', es: 'Cuestionario', fr: 'Quiz', ar: 'اختبار' },
      { key: 'assignment', en: 'Assignment', es: 'Tarea', fr: 'Devoir', ar: 'المهمة' },
      { key: 'grade', en: 'Grade', es: 'Calificación', fr: 'Note', ar: 'الدرجة' },
      { key: 'badge', en: 'Badge', es: 'Insignia', fr: 'Badge', ar: 'شارة' },
      
      // Roles
      { key: 'student', en: 'Student', es: 'Estudiante', fr: 'Étudiant', ar: 'طالب' },
      { key: 'teacher', en: 'Teacher', es: 'Maestro', fr: 'Enseignant', ar: 'معلم' },
      { key: 'parent', en: 'Parent', es: 'Padre/Madre', fr: 'Parent', ar: 'ولي الأمر' },
      { key: 'admin', en: 'Administrator', es: 'Administrador', fr: 'Administrateur', ar: 'مدير' }
    ]

    for (const translation of defaultTranslations) {
      for (const [lang, value] of Object.entries(translation)) {
        if (lang !== 'key') {
          await this.addTranslation(translation.key, lang, value, 'ui')
        }
      }
    }
  }
}
