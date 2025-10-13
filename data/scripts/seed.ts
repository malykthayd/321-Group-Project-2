import { initializeDatabase } from './lib/database'
import { AuthService } from './lib/auth'
import { DigitalLibraryService } from './lib/digital-library'
import { TranslationService } from './lib/translations'
import { AdaptiveLearningEngine } from './lib/adaptive-learning'
import { db } from './lib/database'

async function seedDatabase() {
  console.log('Starting database seeding...')

  try {
    // Initialize database
    initializeDatabase()

    // Create demo users
    console.log('Creating demo users...')
    
    const demoUsers = [
      {
        email: 'student@demo.com',
        password: 'demo123',
        role: 'student' as const,
        first_name: 'Alex',
        last_name: 'Johnson',
        phone: '+1234567890',
        language: 'en'
      },
      {
        email: 'teacher@demo.com',
        password: 'demo123',
        role: 'teacher' as const,
        first_name: 'Sarah',
        last_name: 'Williams',
        phone: '+1234567891',
        language: 'en'
      },
      {
        email: 'parent@demo.com',
        password: 'demo123',
        role: 'parent' as const,
        first_name: 'Michael',
        last_name: 'Johnson',
        phone: '+1234567892',
        language: 'en'
      },
      {
        email: 'admin@demo.com',
        password: 'demo123',
        role: 'admin' as const,
        first_name: 'Admin',
        last_name: 'User',
        phone: '+1234567893',
        language: 'en'
      }
    ]

    for (const userData of demoUsers) {
      try {
        await AuthService.createUser(userData)
        console.log(`Created ${userData.role}: ${userData.email}`)
      } catch (error) {
        console.log(`User ${userData.email} already exists, skipping...`)
      }
    }

    // Link student and parent
    const student = AuthService.getUserByEmail('student@demo.com')
    const parent = AuthService.getUserByEmail('parent@demo.com')
    
    if (student && parent) {
      await AuthService.linkStudentParent(student.id, parent.id)
      console.log('Linked student and parent')
    }

    // Create concepts
    console.log('Creating concepts...')
    const concepts = [
      { name: 'Addition', description: 'Basic addition operations', subject: 'Mathematics', grade_level: 1 },
      { name: 'Subtraction', description: 'Basic subtraction operations', subject: 'Mathematics', grade_level: 1 },
      { name: 'Fractions', description: 'Understanding fractions and decimals', subject: 'Mathematics', grade_level: 3 },
      { name: 'Multiplication', description: 'Multiplication tables and operations', subject: 'Mathematics', grade_level: 2 },
      { name: 'Division', description: 'Division operations and remainders', subject: 'Mathematics', grade_level: 3 },
      { name: 'Reading Comprehension', description: 'Understanding and analyzing text', subject: 'English', grade_level: 2 },
      { name: 'Vocabulary', description: 'Word meanings and usage', subject: 'English', grade_level: 1 },
      { name: 'Grammar', description: 'Sentence structure and parts of speech', subject: 'English', grade_level: 2 },
      { name: 'Plants', description: 'Plant life cycles and parts', subject: 'Science', grade_level: 2 },
      { name: 'Animals', description: 'Animal habitats and characteristics', subject: 'Science', grade_level: 1 },
      { name: 'Weather', description: 'Weather patterns and seasons', subject: 'Science', grade_level: 2 },
      { name: 'Solar System', description: 'Planets and space exploration', subject: 'Science', grade_level: 3 }
    ]

    for (const concept of concepts) {
      db.prepare(`
        INSERT OR IGNORE INTO concepts (name, description, subject, grade_level)
        VALUES (?, ?, ?, ?)
      `).run(concept.name, concept.description, concept.subject, concept.grade_level)
    }

    // Create lessons
    console.log('Creating lessons...')
    const lessons = [
      {
        title: 'Introduction to Addition',
        description: 'Learn the basics of addition with simple numbers',
        content: 'Addition is combining two or more numbers to find their total. For example, 2 + 3 = 5. We can use counting, number lines, or objects to help us add.',
        grade_level: 1,
        subject: 'Mathematics',
        difficulty_level: 1,
        estimated_duration: 30,
        language: 'en'
      },
      {
        title: 'Understanding Fractions',
        description: 'Learn what fractions are and how to read them',
        content: 'A fraction represents parts of a whole. The top number (numerator) tells us how many parts we have, and the bottom number (denominator) tells us how many equal parts the whole is divided into.',
        grade_level: 3,
        subject: 'Mathematics',
        difficulty_level: 2,
        estimated_duration: 45,
        language: 'en'
      },
      {
        title: 'Reading Comprehension Basics',
        description: 'Learn how to understand what you read',
        content: 'Reading comprehension means understanding what you read. Ask yourself: Who? What? When? Where? Why? How? These questions help you understand the story better.',
        grade_level: 2,
        subject: 'English',
        difficulty_level: 1,
        estimated_duration: 40,
        language: 'en'
      },
      {
        title: 'Plant Life Cycle',
        description: 'Learn how plants grow and change',
        content: 'Plants start as seeds, grow into seedlings, become mature plants, produce flowers, and create new seeds. This cycle repeats over and over.',
        grade_level: 2,
        subject: 'Science',
        difficulty_level: 2,
        estimated_duration: 35,
        language: 'en'
      }
    ]

    for (const lesson of lessons) {
      db.prepare(`
        INSERT OR IGNORE INTO lessons (title, description, content, grade_level, subject, difficulty_level, estimated_duration, language)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(lesson.title, lesson.description, lesson.content, lesson.grade_level, lesson.subject, lesson.difficulty_level, lesson.estimated_duration, lesson.language)
    }

    // Create books
    console.log('Creating books...')
    const books = [
      {
        title: 'The Magic Tree House: Dinosaurs Before Dark',
        author: 'Mary Pope Osborne',
        isbn: '9780679824114',
        grade_level: 2,
        subject: 'English',
        language: 'en',
        description: 'Jack and Annie discover a magic tree house that takes them back to the time of dinosaurs.',
        is_available: true
      },
      {
        title: 'Charlotte\'s Web',
        author: 'E.B. White',
        isbn: '9780064400558',
        grade_level: 3,
        subject: 'English',
        language: 'en',
        description: 'A heartwarming story about friendship between a pig named Wilbur and a spider named Charlotte.',
        is_available: true
      },
      {
        title: 'The Very Hungry Caterpillar',
        author: 'Eric Carle',
        isbn: '9780399226908',
        grade_level: 1,
        subject: 'Science',
        language: 'en',
        description: 'Follow the journey of a caterpillar as it eats its way through various foods and transforms into a butterfly.',
        is_available: true
      },
      {
        title: 'Math Curse',
        author: 'Jon Scieszka',
        isbn: '9780670861941',
        grade_level: 2,
        subject: 'Mathematics',
        language: 'en',
        description: 'A fun story that shows how math is everywhere in our daily lives.',
        is_available: true
      }
    ]

    for (const book of books) {
      await DigitalLibraryService.addBook(book)
    }

    // Create practice items
    console.log('Creating practice items...')
    const practiceItems = [
      {
        question: 'What is 5 + 3?',
        options: JSON.stringify(['6', '7', '8', '9']),
        correct_answer: 2,
        explanation: '5 + 3 = 8. You can count: 5, 6, 7, 8.',
        concept_id: 1, // Addition concept
        difficulty_level: 1
      },
      {
        question: 'What is 1/2 + 1/4?',
        options: JSON.stringify(['1/6', '2/6', '3/4', '2/4']),
        correct_answer: 2,
        explanation: '1/2 = 2/4, so 2/4 + 1/4 = 3/4.',
        concept_id: 3, // Fractions concept
        difficulty_level: 2
      },
      {
        question: 'What is the main idea of a story?',
        options: JSON.stringify(['The first sentence', 'What the story is mostly about', 'The last sentence', 'The title']),
        correct_answer: 1,
        explanation: 'The main idea is what the story is mostly about - the central message or theme.',
        concept_id: 6, // Reading Comprehension concept
        difficulty_level: 1
      },
      {
        question: 'What part of a plant makes food?',
        options: JSON.stringify(['Roots', 'Stem', 'Leaves', 'Flowers']),
        correct_answer: 2,
        explanation: 'Leaves use sunlight to make food through a process called photosynthesis.',
        concept_id: 9, // Plants concept
        difficulty_level: 2
      }
    ]

    for (const item of practiceItems) {
      db.prepare(`
        INSERT OR IGNORE INTO practice_items (question, options, correct_answer, explanation, concept_id, difficulty_level)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(item.question, item.options, item.correct_answer, item.explanation, item.concept_id, item.difficulty_level)
    }

    // Create badges
    console.log('Creating badges...')
    const badges = [
      {
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        criteria: JSON.stringify({ type: 'lessons_completed', count: 1 })
      },
      {
        name: 'Reading Champion',
        description: 'Read 10 books',
        icon: '📚',
        criteria: JSON.stringify({ type: 'books_read', count: 10 })
      },
      {
        name: 'Math Master',
        description: 'Get 5 perfect scores on math quizzes',
        icon: '🧮',
        criteria: JSON.stringify({ type: 'perfect_math_scores', count: 5 })
      },
      {
        name: 'Streak Keeper',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        criteria: JSON.stringify({ type: 'learning_streak', count: 7 })
      },
      {
        name: 'Explorer',
        description: 'Complete lessons in 3 different subjects',
        icon: '🌍',
        criteria: JSON.stringify({ type: 'subjects_explored', count: 3 })
      }
    ]

    for (const badge of badges) {
      db.prepare(`
        INSERT OR IGNORE INTO badges (name, description, icon, criteria)
        VALUES (?, ?, ?, ?)
      `).run(badge.name, badge.description, badge.icon, badge.criteria)
    }

    // Initialize translations
    console.log('Initializing translations...')
    await TranslationService.initializeDefaultTranslations()

    // Create some sample mastery data for the student
    if (student) {
      console.log('Creating sample mastery data...')
      const sampleMastery = [
        { concept_id: 1, mastery_level: 0.8, attempts: 10, correct_attempts: 8 }, // Addition
        { concept_id: 3, mastery_level: 0.6, attempts: 8, correct_attempts: 5 }, // Fractions
        { concept_id: 6, mastery_level: 0.9, attempts: 12, correct_attempts: 11 }, // Reading Comprehension
        { concept_id: 9, mastery_level: 0.7, attempts: 6, correct_attempts: 4 } // Plants
      ]

      for (const mastery of sampleMastery) {
        db.prepare(`
          INSERT OR IGNORE INTO mastery (student_id, concept_id, mastery_level, attempts, correct_attempts, last_practiced)
          VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).run(student.id, mastery.concept_id, mastery.mastery_level, mastery.attempts, mastery.correct_attempts)
      }
    }

    console.log('Database seeding completed successfully!')
  } catch (error) {
    console.error('Database seeding failed:', error)
    throw error
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Seeding failed:', error)
      process.exit(1)
    })
}

export { seedDatabase }
