import { initializeDatabase } from '../lib/database.js'
import { AuthService } from '../lib/auth.js'
import { DigitalLibraryService } from '../lib/digital-library.js'
import { TranslationService } from '../lib/translations.js'
import { AdaptiveLearningEngine } from '../lib/adaptive-learning.js'
import { db } from '../lib/database.js'
import { generateLessonContent } from './lesson-content.js'

async function seedDatabase() {
  console.log('Starting database seeding...')

  try {
    // Initialize database
    await initializeDatabase()
    console.log('Database initialized successfully')

    // Create admin user
    console.log('Creating admin user...')
    const adminUser = await AuthService.createUser({
      email: 'admin@aqe.com',
      password: 'admin123',
      role: 'admin',
      first_name: 'Admin',
      last_name: 'User',
      phone: '+1234567890',
      language: 'en'
    })
    console.log('Admin user created:', adminUser?.email)

    // Create demo student user
    console.log('Creating demo student...')
    const studentUser = await AuthService.createUser({
      email: 'malyk@example.com',
      password: 'password123',
      role: 'student',
      first_name: 'Malyk',
      last_name: 'Hayden',
      phone: '+1234567891',
      language: 'en',
      grade_level: 4
    })
    console.log('Demo student created:', studentUser?.email)

    // Create demo teacher user
    console.log('Creating demo teacher...')
    const teacherUser = await AuthService.createUser({
      email: 'teacher@example.com',
      password: 'password123',
      role: 'teacher',
      first_name: 'Sarah',
      last_name: 'Johnson',
      phone: '+1234567892',
      language: 'en'
    })
    console.log('Demo teacher created:', teacherUser?.email)

    // Create demo parent user
    console.log('Creating demo parent...')
    const parentUser = await AuthService.createUser({
      email: 'parent@example.com',
      password: 'password123',
      role: 'parent',
      first_name: 'John',
      last_name: 'Hayden',
      phone: '+1234567893',
      language: 'en'
    })
    console.log('Demo parent created:', parentUser?.email)

    // Create lessons - 5 per subject per grade (K-6)
    console.log('Creating lessons...')
    
    // Helper to generate grade-appropriate lessons using our new content generator
    function generateLessonsForAllGrades() {
      const allLessons: any[] = []
      
      for (let grade = 0; grade <= 6; grade++) {
        const subjects = ['Science', 'English', 'Technology', 'Mathematics']
        
        subjects.forEach((subject) => {
          // Generate 5 lessons per subject per grade
          for (let lessonNum = 1; lessonNum <= 5; lessonNum++) {
            const lessonId = `grade-${grade}-${subject.toLowerCase()}-${lessonNum}`
            const lessonContent = generateLessonContent(grade, subject, lessonNum)
            
            allLessons.push({
              id: lessonId,
              title: lessonContent.title,
              desc: lessonContent.description,
              content: lessonContent.content,
              grade_level: grade,
              subject: subject,
              difficulty_level: Math.min(Math.max(1, grade), 5), // 1-5 difficulty scale
              estimated_duration: lessonContent.duration
            })
          }
        })
      }
      
      return allLessons
    }
    
    const lessons = generateLessonsForAllGrades()
    console.log(`Generated ${lessons.length} lessons total (5 per subject per grade K-6)`)
    
    // Insert lessons into database
    for (const lesson of lessons) {
      db.prepare(`
        INSERT OR IGNORE INTO lessons (title, description, content, grade_level, subject, difficulty_level, estimated_duration, language)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(lesson.title, lesson.desc, lesson.content, lesson.grade_level, lesson.subject, lesson.difficulty_level, lesson.estimated_duration, 'en')
    }
    console.log(`Inserted ${lessons.length} lessons into database`)

    // Create practice questions - 5 per subject per grade (K-6)
    console.log('Creating practice questions...')
    
    function generatePracticeQuestions() {
      const allQuestions: any[] = []
      
      for (let grade = 0; grade <= 6; grade++) {
        const subjects = ['Science', 'English', 'Technology', 'Mathematics']
        
        subjects.forEach((subject) => {
          // Generate 5 practice questions per subject per grade
          for (let questionNum = 1; questionNum <= 5; questionNum++) {
            const questionContent = generatePracticeQuestionContent(grade, subject, questionNum)
            
            allQuestions.push({
              question: questionContent.question,
              options: JSON.stringify(questionContent.options),
              correct_answer: questionContent.correctAnswer,
              explanation: questionContent.explanation,
              difficulty_level: Math.min(Math.max(1, grade), 5),
              grade_level: grade,
              subject: subject
            })
          }
        })
      }
      
      return allQuestions
    }

    function generatePracticeQuestionContent(grade: number, subject: string, questionNum: number) {
      const questions = {
        Science: {
          1: {
            question: "What do plants need to grow?",
            options: ["Water only", "Sunlight only", "Soil only", "Water, sunlight, and soil"],
            correctAnswer: 3,
            explanation: "Plants need water, sunlight, and soil to grow healthy and strong!"
          },
          2: {
            question: "What is the first stage of a plant's life cycle?",
            options: ["Flower", "Seed", "Leaf", "Root"],
            correctAnswer: 1,
            explanation: "All plants start as seeds, which contain everything needed to grow!"
          },
          3: {
            question: "What happens to water when it gets very cold?",
            options: ["It disappears", "It turns to ice", "It turns to steam", "It stays the same"],
            correctAnswer: 1,
            explanation: "Water turns to ice when it gets cold enough - that's how snow and ice are made!"
          },
          4: {
            question: "What do we call animals that eat only plants?",
            options: ["Carnivores", "Herbivores", "Omnivores", "Predators"],
            correctAnswer: 1,
            explanation: "Herbivores are animals that eat only plants, like cows and rabbits!"
          },
          5: {
            question: "What gas do plants produce that we need to breathe?",
            options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Water vapor"],
            correctAnswer: 1,
            explanation: "Plants produce oxygen during photosynthesis, which is what we breathe!"
          }
        },
        Mathematics: {
          1: {
            question: "What is 5 + 3?",
            options: ["6", "7", "8", "9"],
            correctAnswer: 2,
            explanation: "5 + 3 = 8. You can count: 5, 6, 7, 8!"
          },
          2: {
            question: "How many sides does a triangle have?",
            options: ["2", "3", "4", "5"],
            correctAnswer: 1,
            explanation: "A triangle has 3 sides and 3 corners!"
          },
          3: {
            question: "What comes after 7 when counting?",
            options: ["6", "7", "8", "9"],
            correctAnswer: 2,
            explanation: "When counting, 8 comes right after 7!"
          },
          4: {
            question: "If you have 10 cookies and eat 3, how many are left?",
            options: ["5", "6", "7", "8"],
            correctAnswer: 2,
            explanation: "10 - 3 = 7. You would have 7 cookies left!"
          },
          5: {
            question: "What shape has 4 equal sides?",
            options: ["Triangle", "Circle", "Square", "Rectangle"],
            correctAnswer: 2,
            explanation: "A square has 4 equal sides and 4 equal corners!"
          }
        },
        English: {
          1: {
            question: "What letter comes after 'C' in the alphabet?",
            options: ["A", "B", "C", "D"],
            correctAnswer: 3,
            explanation: "D comes right after C in the alphabet: A, B, C, D!"
          },
          2: {
            question: "Which word rhymes with 'cat'?",
            options: ["dog", "hat", "fish", "bird"],
            correctAnswer: 1,
            explanation: "Hat rhymes with cat - they both end with the 'at' sound!"
          },
          3: {
            question: "What do we call the person in a story?",
            options: ["Setting", "Character", "Plot", "Theme"],
            correctAnswer: 1,
            explanation: "Characters are the people or animals in a story!"
          },
          4: {
            question: "Which word is a noun (person, place, or thing)?",
            options: ["run", "happy", "book", "quickly"],
            correctAnswer: 2,
            explanation: "Book is a noun because it's a thing you can hold!"
          },
          5: {
            question: "What do we call the beginning sound in 'ball'?",
            options: ["/a/", "/b/", "/l/", "/all/"],
            correctAnswer: 1,
            explanation: "Ball starts with the /b/ sound!"
          }
        },
        Technology: {
          1: {
            question: "What do we use to type on a computer?",
            options: ["Mouse", "Keyboard", "Monitor", "Speaker"],
            correctAnswer: 1,
            explanation: "The keyboard is what we use to type letters and numbers!"
          },
          2: {
            question: "What should you never share online?",
            options: ["Your favorite color", "Your home address", "Your favorite game", "Your pet's name"],
            correctAnswer: 1,
            explanation: "Never share your home address or other personal information online!"
          },
          3: {
            question: "What do we call the main screen of a computer?",
            options: ["Keyboard", "Desktop", "Mouse", "Printer"],
            correctAnswer: 1,
            explanation: "The desktop is the main screen where you see icons and programs!"
          },
          4: {
            question: "What should you do if someone online asks to meet you?",
            options: ["Meet them", "Tell an adult", "Keep it secret", "Say yes"],
            correctAnswer: 1,
            explanation: "Always tell a trusted adult if someone online wants to meet you!"
          },
          5: {
            question: "What do we use to click on things on the computer?",
            options: ["Keyboard", "Monitor", "Mouse", "Speaker"],
            correctAnswer: 2,
            explanation: "The mouse is what we use to click and select things on the screen!"
          }
        }
      }
      
      return questions[subject as keyof typeof questions]?.[questionNum as keyof typeof questions.Science] || {
        question: `What is an important concept in ${subject.toLowerCase()}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 2,
        explanation: `${subject} is an important subject that helps us learn and grow!`
      }
    }
    
    const practiceQuestions = generatePracticeQuestions()
    console.log(`Generated ${practiceQuestions.length} practice questions total (5 per subject per grade K-6)`)
    
    // Insert practice questions into database
    for (const question of practiceQuestions) {
      db.prepare(`
        INSERT OR IGNORE INTO practice_items (question, options, correct_answer, explanation, difficulty_level, grade_level, subject)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(question.question, question.options, question.correct_answer, question.explanation, question.difficulty_level, question.grade_level, question.subject)
    }
    console.log(`Inserted ${practiceQuestions.length} practice questions into database`)

    // Create some sample books
    console.log('Creating books...')
    const books = [
      {
        title: 'The Magic Tree House',
        author: 'Mary Pope Osborne',
        isbn: '9780679824114',
        genre: 'Fantasy',
        grade_level: 2,
        language: 'en',
        available_copies: 3
      },
      {
        title: 'Charlotte\'s Web',
        author: 'E.B. White',
        isbn: '9780064400558',
        genre: 'Classic',
        grade_level: 3,
        language: 'en',
        available_copies: 2
      },
      {
        title: 'The Cat in the Hat',
        author: 'Dr. Seuss',
        isbn: '9780394800011',
        genre: 'Children\'s',
        grade_level: 1,
        language: 'en',
        available_copies: 5
      }
    ]

    for (const book of books) {
      await DigitalLibraryService.addBook(book)
    }
    console.log(`Created ${books.length} books`)

    console.log('Database seeding completed successfully!')
    console.log('\nDemo accounts created:')
    console.log('Admin: admin@aqe.com / admin123')
    console.log('Student: malyk@example.com / password123')
    console.log('Teacher: teacher@example.com / password123')
    console.log('Parent: parent@example.com / password123')

  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Seeding failed:', error)
      process.exit(1)
    })
}

export { seedDatabase }
