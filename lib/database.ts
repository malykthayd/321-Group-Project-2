// Database configuration with fallbacks for different environments
// This file handles SQLite database setup with proper error handling

// Type definitions for better compatibility
interface DatabaseInterface {
  exec(sql: string): void;
  pragma(sql: string): void;
  close(): void;
}

// Declare global variables for Node.js environment
declare const process: any;
declare const __dirname: string;

// Database imports with fallbacks
let Database: any = null;
let path: any = null;

// Try to load dependencies safely
try {
  // Use dynamic imports for better compatibility
  Database = eval('require')('better-sqlite3');
  path = eval('require')('path');
} catch (error) {
  console.warn('Database dependencies not available - using fallback mode');
}

// Get the current working directory safely
const getDbPath = (): string => {
  try {
    // Try different methods to get the current directory
    if (typeof process !== 'undefined' && process.cwd) {
      return path ? path.join(process.cwd(), 'data', 'aqe.db') : './data/aqe.db';
    }
    
    // Fallback for other environments
    if (typeof __dirname !== 'undefined') {
      return path ? path.join(__dirname, '..', 'data', 'aqe.db') : './data/aqe.db';
    }
    
    // Ultimate fallback
    return './data/aqe.db';
  } catch (error) {
    console.warn('Could not determine database path, using fallback:', error);
    return './data/aqe.db';
  }
};

const dbPath = getDbPath();

// Create database instance with error handling
let db: DatabaseInterface | null = null;

if (Database) {
  try {
    db = new Database(dbPath);
    console.log(`Database connected: ${dbPath}`);
    
    // Enable foreign keys
    try {
      if (db) {
        db.pragma('foreign_keys = ON');
      }
    } catch (error) {
      console.error('Failed to enable foreign keys:', error);
    }
  } catch (error) {
    console.error('Failed to connect to database:', error);
    db = null;
  }
} else {
  console.warn('Database module not available - running in mock mode');
}

export { db };

// Create tables
export function createTables(): void {
  if (!db) {
    console.warn('Database not available - skipping table creation');
    return;
  }
  
  try {
    console.log('Creating database tables...');
    
    // Users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'parent', 'admin')),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        language TEXT DEFAULT 'en',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Students and Parents relationship
    db.exec(`
      CREATE TABLE IF NOT EXISTS students_parents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        parent_id INTEGER NOT NULL,
        relationship TEXT DEFAULT 'parent',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(student_id, parent_id)
      )
    `);

    // Classes
    db.exec(`
      CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        grade_level INTEGER NOT NULL,
        teacher_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Enrollments
    db.exec(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        class_id INTEGER NOT NULL,
        enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
        UNIQUE(student_id, class_id)
      )
    `);

    // Books
    db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT,
        grade_level INTEGER NOT NULL,
        subject TEXT NOT NULL,
        language TEXT DEFAULT 'en',
        file_path TEXT,
        cover_image TEXT,
        description TEXT,
        is_available BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Lessons
    db.exec(`
      CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        content TEXT NOT NULL,
        grade_level INTEGER NOT NULL,
        subject TEXT NOT NULL,
        difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
        estimated_duration INTEGER DEFAULT 30,
        language TEXT DEFAULT 'en',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Lesson-Book Links
    db.exec(`
      CREATE TABLE IF NOT EXISTS lesson_book_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lesson_id INTEGER NOT NULL,
        book_id INTEGER NOT NULL,
        FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
        UNIQUE(lesson_id, book_id)
      )
    `);

    // Concepts
    db.exec(`
      CREATE TABLE IF NOT EXISTS concepts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        subject TEXT NOT NULL,
        grade_level INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Lesson Concepts
    db.exec(`
      CREATE TABLE IF NOT EXISTS lesson_concepts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lesson_id INTEGER NOT NULL,
        concept_id INTEGER NOT NULL,
        FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
        FOREIGN KEY (concept_id) REFERENCES concepts(id) ON DELETE CASCADE,
        UNIQUE(lesson_id, concept_id)
      )
    `);

    // Assignments
    db.exec(`
      CREATE TABLE IF NOT EXISTS assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        lesson_id INTEGER,
        book_id INTEGER,
        teacher_id INTEGER NOT NULL,
        class_id INTEGER,
        due_date DATETIME,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE SET NULL,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE SET NULL,
        FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
      )
    `);

    // Assignment Students
    db.exec(`
      CREATE TABLE IF NOT EXISTS assignment_students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assignment_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(assignment_id, student_id)
      )
    `);

    // Submissions
    db.exec(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assignment_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        content TEXT,
        score INTEGER,
        feedback TEXT,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        graded_at DATETIME,
        FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(assignment_id, student_id)
      )
    `);

    // Practice Items
    db.exec(`
      CREATE TABLE IF NOT EXISTS practice_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        options TEXT NOT NULL,
        correct_answer INTEGER NOT NULL,
        explanation TEXT,
        lesson_id INTEGER,
        concept_id INTEGER,
        difficulty_level INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE SET NULL,
        FOREIGN KEY (concept_id) REFERENCES concepts(id) ON DELETE SET NULL
      )
    `);

    // Practice Attempts
    db.exec(`
      CREATE TABLE IF NOT EXISTS practice_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        practice_item_id INTEGER NOT NULL,
        selected_answer INTEGER,
        is_correct BOOLEAN,
        time_spent INTEGER DEFAULT 0,
        attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (practice_item_id) REFERENCES practice_items(id) ON DELETE CASCADE
      )
    `);

    // Mastery tracking
    db.exec(`
      CREATE TABLE IF NOT EXISTS mastery (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        concept_id INTEGER NOT NULL,
        mastery_level REAL DEFAULT 0.0 CHECK (mastery_level BETWEEN 0.0 AND 1.0),
        attempts INTEGER DEFAULT 0,
        correct_attempts INTEGER DEFAULT 0,
        last_practiced DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (concept_id) REFERENCES concepts(id) ON DELETE CASCADE,
        UNIQUE(student_id, concept_id)
      )
    `);

    // Badges
    db.exec(`
      CREATE TABLE IF NOT EXISTS badges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        criteria TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Earned Badges
    db.exec(`
      CREATE TABLE IF NOT EXISTS earned_badges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        badge_id INTEGER NOT NULL,
        earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
        UNIQUE(student_id, badge_id)
      )
    `);

    // Translations
    db.exec(`
      CREATE TABLE IF NOT EXISTS translations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL,
        language TEXT NOT NULL,
        value TEXT NOT NULL,
        context TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(key, language)
      )
    `);

    // Kiosk Content Packages
    db.exec(`
      CREATE TABLE IF NOT EXISTS kiosk_content_packages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        version TEXT NOT NULL,
        content_data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sync Jobs
    db.exec(`
      CREATE TABLE IF NOT EXISTS sync_jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        sync_type TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        data TEXT,
        error_message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // SMS Templates
    db.exec(`
      CREATE TABLE IF NOT EXISTS sms_templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        template TEXT NOT NULL,
        language TEXT DEFAULT 'en',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // USSD Menus
    db.exec(`
      CREATE TABLE IF NOT EXISTS ussd_menus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        menu_text TEXT NOT NULL,
        language TEXT DEFAULT 'en',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Notifications
    db.exec(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info',
        is_read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Audit Logs
    db.exec(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action TEXT NOT NULL,
        resource_type TEXT,
        resource_id INTEGER,
        details TEXT,
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Book Checkouts
    db.exec(`
      CREATE TABLE IF NOT EXISTS book_checkouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        book_id INTEGER NOT NULL,
        checked_out_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        returned_at DATETIME,
        due_date DATETIME,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Failed to create database tables:', error);
    throw error;
  }
}

// Create indexes for better performance
export function createIndexes(): void {
  if (!db) {
    console.warn('Database not available - skipping index creation');
    return;
  }
  
  try {
    console.log('Creating database indexes...');
    
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
      'CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id)',
      'CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(class_id)',
      'CREATE INDEX IF NOT EXISTS idx_submissions_student ON submissions(student_id)',
      'CREATE INDEX IF NOT EXISTS idx_practice_attempts_student ON practice_attempts(student_id)',
      'CREATE INDEX IF NOT EXISTS idx_mastery_student ON mastery(student_id)',
      'CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_books_grade_subject ON books(grade_level, subject)',
      'CREATE INDEX IF NOT EXISTS idx_lessons_grade_subject ON lessons(grade_level, subject)',
    ];

    indexes.forEach(index => {
      try {
        if (db) {
          db.exec(index);
        }
      } catch (error) {
        console.warn(`Failed to create index: ${index}`, error);
      }
    });
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Failed to create database indexes:', error);
    throw error;
  }
}

// Initialize database
export function initializeDatabase(): void {
  try {
    console.log('Initializing database...');
    createTables();
    createIndexes();
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// Database health check
export function checkDatabaseHealth(): boolean {
  if (!db) {
    console.warn('Database not available');
    return false;
  }
  
  try {
    // Test basic database operations
    db.exec('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Close database connection
export function closeDatabase(): void {
  if (!db) {
    console.warn('Database not available - nothing to close');
    return;
  }
  
  try {
    db.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Failed to close database:', error);
  }
}