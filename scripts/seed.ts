import { initializeDatabase } from '../lib/database.js'
import { AuthService } from '../lib/auth.js'
import { DigitalLibraryService } from '../lib/digital-library.js'
import { TranslationService } from '../lib/translations.js'
import { AdaptiveLearningEngine } from '../lib/adaptive-learning.js'
import { db } from '../lib/database.js'

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

    // Create lessons - 10 per subject per grade (K-6)
    console.log('Creating lessons...')
    
    // Helper to generate grade-appropriate lessons
    function generateLessonsForAllGrades() {
      const allLessons: any[] = []
      
      for (let grade = 0; grade <= 6; grade++) {
        const gradeLabel = grade === 0 ? 'K' : grade.toString()
        
        // Mathematics - 5 lessons per grade
        const mathLessons = [
          { title: `Numbers & Counting ${gradeLabel}`, desc: `Count and recognize numbers`, content: `Practice counting for grade ${grade}!\n\nCount with me:\n${Array.from({length: 5}, (_, i) => `${i+1}. ${'🔵'.repeat(i+1)}`).join('\n')}\n\n🎯 Try This: Count objects around you!` },
          { title: `Addition & Subtraction ${gradeLabel}`, desc: `Add and subtract numbers`, content: `Math operations!\n\nAddition: ${2 + grade} + ${3 + grade} = ${5 + 2*grade}\nSubtraction: ${10 + grade} - ${3} = ${7 + grade}\n\n🎯 Practice both!` },
          { title: `Shapes & Geometry ${gradeLabel}`, desc: `Shapes and patterns`, content: `Explore shapes!\n\nCircle ⭕ Square ⬜ Triangle 🔺\nPatterns: 🔴🔵🔴🔵\n\n🎯 Find shapes and make patterns!` },
          { title: `Measurement ${gradeLabel}`, desc: `Measure and compare`, content: `Measuring skills!\n\nCompare sizes, use rulers.\n\n🎯 Measure 5 objects!` },
          { title: `Problem Solving ${gradeLabel}`, desc: `Word problems and puzzles`, content: `Math challenges!\n\nSolve word problems, find patterns.\n\n🎯 Complete 3 problems!` },
        ]
        
        mathLessons.forEach((l, i) => {
          allLessons.push({
            title: l.title,
            description: l.desc,
            content: l.content,
            grade_level: grade,
            subject: 'Mathematics',
            difficulty_level: Math.min(5, Math.floor(grade / 2) + 1),
            estimated_duration: 15 + grade * 2,
            language: 'en'
          })
        })
        
        // English - 5 lessons per grade
        const englishLessons = [
          { title: `Reading & Comprehension ${gradeLabel}`, desc: `Read and understand`, content: `Reading for grade ${grade}!\n\nRead stories, answer who/what/where/when/why.\n\n🎯 Read a short story and answer questions!` },
          { title: `Writing Skills ${gradeLabel}`, desc: `Writing and grammar`, content: `Writing practice!\n\nSentences, paragraphs, grammar.\n\n🎯 Write 3 good sentences!` },
          { title: `Phonics & Spelling ${gradeLabel}`, desc: `Sounds and spelling`, content: `Sound it out!\n\nLetter sounds, blends, spelling rules.\n\n🎯 Spell 10 words correctly!` },
          { title: `Vocabulary Builder ${gradeLabel}`, desc: `Learn new words`, content: `Word power!\n\nNew words, synonyms, antonyms.\n\n🎯 Use 5 new words in sentences!` },
          { title: `Creative Writing ${gradeLabel}`, desc: `Stories and poetry`, content: `Be creative!\n\nWrite stories, poems, and more.\n\n🎯 Write a short story or poem!` },
        ]
        
        englishLessons.forEach((l, i) => {
          allLessons.push({
            title: l.title,
            description: l.desc,
            content: l.content,
            grade_level: grade,
            subject: 'English',
            difficulty_level: Math.min(5, Math.floor(grade / 2) + 1),
            estimated_duration: 15 + grade * 2,
            language: 'en'
          })
        })
        
        // Science - 5 lessons per grade
        const scienceLessons = [
          { title: `Life Science ${gradeLabel}`, desc: `Animals and plants`, content: `Living things!\n\nAnimals, plants, habitats, life cycles.\n\n🎯 Observe nature around you!` },
          { title: `Earth Science ${gradeLabel}`, desc: `Weather, rocks, soil`, content: `Our Earth!\n\nWeather, seasons, rocks, soil.\n\n🎯 Track weather for a week!` },
          { title: `Matter & Energy ${gradeLabel}`, desc: `Solids, liquids, forces`, content: `Matter and forces!\n\nStates of matter, push/pull, energy.\n\n🎯 Find solids, liquids, and gases!` },
          { title: `Space Science ${gradeLabel}`, desc: `Sun, moon, planets`, content: `Space exploration!\n\nSolar system, stars, day/night.\n\n🎯 Draw the planets!` },
          { title: `Science Experiments ${gradeLabel}`, desc: `Hands-on discovery`, content: `Be a scientist!\n\nHypothesis, test, observe, conclude.\n\n🎯 Try a safe experiment!` },
        ]
        
        scienceLessons.forEach((l, i) => {
          allLessons.push({
            title: l.title,
            description: l.desc,
            content: l.content,
            grade_level: grade,
            subject: 'Science',
            difficulty_level: Math.min(5, Math.floor(grade / 2) + 1),
            estimated_duration: 15 + grade * 2,
            language: 'en'
          })
        })
        
        // Technology - 5 lessons per grade
        const techLessons = [
          { title: `Computer Basics ${gradeLabel}`, desc: `Hardware and software`, content: `Computer fundamentals!\n\nMonitor, keyboard, mouse, programs.\n\n🎯 Identify computer parts!` },
          { title: `Internet Safety ${gradeLabel}`, desc: `Stay safe online`, content: `Online safety!\n\nPasswords, privacy, be careful online.\n\n🎯 Create a strong password!` },
          { title: `Digital Skills ${gradeLabel}`, desc: `Typing and files`, content: `Tech skills!\n\nTyping, saving files, organizing.\n\n🎯 Practice typing and save a file!` },
          { title: `Using Technology ${gradeLabel}`, desc: `Email, browsing, search`, content: `Online tools!\n\nEmail, web browsers, searching.\n\n🎯 Practice safe browsing!` },
          { title: `Creating Content ${gradeLabel}`, desc: `Art, presentations, coding`, content: `Make things!\n\nDigital art, slides, basic coding.\n\n🎯 Create something digital!` },
        ]
        
        techLessons.forEach((l, i) => {
          allLessons.push({
            title: l.title,
            description: l.desc,
            content: l.content,
            grade_level: grade,
            subject: 'Technology',
            difficulty_level: Math.min(5, Math.floor(grade / 2) + 1),
            estimated_duration: 15 + grade * 2,
            language: 'en'
          })
        })
      }
      
      return allLessons
    }
    
    const lessons = generateLessonsForAllGrades()
    console.log(`Generated ${lessons.length} lessons total (5 per subject per grade K-6)`)
    
    /* Old hardcoded lessons removed - now using programmatically generated set
    const oldLessonsToSkip = [
      // ==================== MATHEMATICS (10 lessons) ====================
      {
        title: 'Counting to 20',
        description: 'Learn to count from 1 to 20 with fun objects',
        content: `Let's learn to count!\n\nCount these animals:\n🐶 🐶 🐶 = 3 dogs\n⭐ ⭐ ⭐ ⭐ ⭐ = 5 stars\n🍎 🍎 🍎 🍎 🍎 🍎 🍎 🍎 = 8 apples\n\nPractice:\nCount to 10: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10\nCount to 20: 11, 12, 13, 14, 15, 16, 17, 18, 19, 20\n\n🎯 Try This!\nCount the items in your room. How many books do you have? How many toys?\n\nRemember: Take your time and point at each object as you count!`,
        grade_level: 0,
        subject: 'Mathematics',
        difficulty_level: 1,
        estimated_duration: 20,
        language: 'en'
      },
      {
        title: 'Introduction to Addition',
        description: 'Combine groups and learn basic addition',
        content: `Addition means putting numbers together!\n\nExample:\n2 apples 🍎🍎 + 3 apples 🍎🍎🍎 = 5 apples 🍎🍎🍎🍎🍎\n\nAddition Symbol: +\nEquals Symbol: =\n\n2 + 3 = 5\n\nTry these:\n• 1 + 1 = ?\n• 3 + 2 = ?\n• 4 + 1 = ?\n• 2 + 2 = ?\n\nUsing a Number Line:\n---|---|---|---|---|---|---\n   1   2   3   4   5   6\n\nTo add 2 + 3, start at 2 and jump 3 spaces forward!\n\n🎯 Practice:\nUse your fingers! Hold up 2 fingers, then 3 more. Count them all together.`,
        grade_level: 1,
        subject: 'Mathematics',
        difficulty_level: 1,
        estimated_duration: 25,
        language: 'en'
      },
      {
        title: 'Simple Subtraction',
        description: 'Take away and find what remains',
        content: `Subtraction means taking away!\n\nExample:\n5 cookies 🍪🍪🍪🍪🍪 - 2 eaten = 3 left 🍪🍪🍪\n\nSubtraction Symbol: -\n\n5 - 2 = 3\n\nStory Problems:\n• You have 7 balloons. 3 float away. How many left?\n  7 - 3 = 4 balloons 🎈🎈🎈🎈\n\n• 6 birds on a fence. 2 fly away. How many remain?\n  6 - 2 = 4 birds 🐦🐦🐦🐦\n\nTry these:\n• 8 - 3 = ?\n• 5 - 1 = ?\n• 10 - 4 = ?\n\n🎯 Practice:\nUse objects at home! Start with 6 toys, take away 2. Count what's left!`,
        grade_level: 1,
        subject: 'Mathematics',
        difficulty_level: 1,
        estimated_duration: 25,
        language: 'en'
      },
      {
        title: 'Shapes All Around Us',
        description: 'Identify and draw basic 2D shapes',
        content: `Let's learn about shapes!\n\nCIRCLE ⭕\n• No corners\n• Round all around\n• Examples: pizza, coin, wheel\n\nSQUARE ⬜\n• 4 equal sides\n• 4 corners\n• Examples: window, checkerboard\n\nTRIANGLE 🔺\n• 3 sides\n• 3 corners\n• Examples: slice of pizza, road sign\n\nRECTANGLE ▭\n• 4 sides (2 long, 2 short)\n• 4 corners\n• Examples: door, book, phone\n\n🎯 Shape Hunt!\nFind shapes in your classroom or home:\n• How many circles can you find?\n• What shape is your desk?\n• What shape is a stop sign?\n\nDraw each shape and color them different colors!`,
        grade_level: 0,
        subject: 'Mathematics',
        difficulty_level: 1,
        estimated_duration: 20,
        language: 'en'
      },
      {
        title: 'Place Value Magic',
        description: 'Understand ones, tens, and hundreds',
        content: `Every digit has a special place!\n\nIn the number 235:\n\nHUNDREDS | TENS | ONES\n    2    |  3   |  5\n\n2 = 200 (2 hundreds)\n3 = 30 (3 tens)\n5 = 5 (5 ones)\n\nTotal: 200 + 30 + 5 = 235\n\nAnother example: 147\n• 1 hundred = 100\n• 4 tens = 40\n• 7 ones = 7\n• Total: 100 + 40 + 7 = 147\n\n🎯 Try This!\nBreak these numbers into parts:\n• 326 = ___ hundreds + ___ tens + ___ ones\n• 589 = ___ hundreds + ___ tens + ___ ones\n\nUsing Base-10 Blocks:\n█ = 1 hundred\n▌= 1 ten\n· = 1 one`,
        grade_level: 2,
        subject: 'Mathematics',
        difficulty_level: 2,
        estimated_duration: 30,
        language: 'en'
      },
      {
        title: 'Multiplication Adventure',
        description: 'Learn groups and skip counting',
        content: `Multiplication = Groups of things!\n\n3 × 4 means "3 groups of 4"\n\n[🟦🟦🟦🟦] [🟦🟦🟦🟦] [🟦🟦🟦🟦]\n\n4 + 4 + 4 = 12\nOR 3 × 4 = 12\n\nSkip Counting:\nBy 2s: 2, 4, 6, 8, 10, 12\nBy 5s: 5, 10, 15, 20, 25, 30\nBy 10s: 10, 20, 30, 40, 50\n\nMultiplication Table (2s):\n2 × 1 = 2\n2 × 2 = 4\n2 × 3 = 6\n2 × 4 = 8\n2 × 5 = 10\n\n🎯 Practice:\n• 3 × 3 = ?\n• 5 × 2 = ?\n• 4 × 4 = ?\n\nMemory Trick:\nAnything times 1 = itself\nAnything times 0 = 0`,
        grade_level: 3,
        subject: 'Mathematics',
        difficulty_level: 2,
        estimated_duration: 35,
        language: 'en'
      },
      {
        title: 'Understanding Fractions',
        description: 'Learn about equal parts',
        content: `Fractions show parts of a whole!\n\n🍕 Pizza Example:\nWhole pizza = 1\nHalf pizza = 1/2\nQuarter pizza = 1/4\n\nFraction Parts:\nNUMERATOR (top) = parts you have\nDENOMINATOR (bottom) = total parts\n\n1/2 = 1 out of 2 equal parts\n2/4 = 2 out of 4 equal parts\n3/4 = 3 out of 4 equal parts\n\nEqual Fractions:\n1/2 = 2/4 = 4/8 (same amount!)\n\n🎯 Fraction Activity:\nColor the fractions:\n[⬜⬜] Color 1/2\n[⬜⬜⬜⬜] Color 2/4\n[⬜⬜⬜⬜⬜⬜⬜⬜] Color 4/8\n\nNotice they're all the same!\n\nComparing Fractions:\n1/2 is BIGGER than 1/4\n3/4 is BIGGER than 1/2`,
        grade_level: 3,
        subject: 'Mathematics',
        difficulty_level: 2,
        estimated_duration: 35,
        language: 'en'
      },
      {
        title: 'Telling Time',
        description: 'Read clocks and understand hours',
        content: `Learning to read a clock! ⏰\n\nClock Parts:\n• BIG hand = minutes\n• SMALL hand = hours\n• 12 numbers around the edge\n\nO'Clock Times:\n3:00 = 3 o'clock (small hand on 3, big hand on 12)\n6:00 = 6 o'clock (small hand on 6, big hand on 12)\n\nHalf Past:\n3:30 = half past 3 (small hand between 3 & 4, big hand on 6)\n\nTime Facts:\n• 60 minutes = 1 hour\n• 24 hours = 1 day\n• 7 days = 1 week\n\n🎯 Practice:\nWhat time is it?\n• When the small hand is on 2 and big hand is on 12?\n  Answer: 2:00\n• When the small hand is on 8 and big hand is on 12?\n  Answer: 8:00\n\nDaily Schedule:\n7:00 - Wake up\n12:00 - Lunch\n3:00 - After school\n8:00 - Bedtime`,
        grade_level: 2,
        subject: 'Mathematics',
        difficulty_level: 2,
        estimated_duration: 30,
        language: 'en'
      },
      {
        title: 'Money Matters',
        description: 'Count coins and make change',
        content: `Let's learn about money! 💰\n\nU.S. Coins:\nPENNY = 1¢\nNICKEL = 5¢\nDIME = 10¢\nQUARTER = 25¢\n\nCounting Coins:\n🪙 + 🪙 + 🪙 = ?\nQuarter + Dime + Nickel = 25¢ + 10¢ + 5¢ = 40¢\n\nMaking Amounts:\nHow to make 30¢:\n• 1 quarter + 1 nickel\n• 3 dimes\n• 6 nickels\n• 30 pennies\n\n🎯 Practice Problems:\n1. You have 2 dimes and 3 nickels. How much money?\n   Answer: 20¢ + 15¢ = 35¢\n\n2. You want to buy a toy for 50¢. You have 2 quarters. Do you have enough?\n   Answer: 2 × 25¢ = 50¢. Yes!\n\n3. You have 75¢. The candy costs 50¢. How much change?\n   Answer: 75¢ - 50¢ = 25¢`,
        grade_level: 2,
        subject: 'Mathematics',
        difficulty_level: 2,
        estimated_duration: 30,
        language: 'en'
      },
      {
        title: 'Measurement Fun',
        description: 'Learn inches, feet, and rulers',
        content: `Let's measure things! 📏\n\nLength Units:\nINCH (in) = about the length of a paperclip\nFOOT (ft) = 12 inches\nYARD (yd) = 3 feet = 36 inches\n\nUsing a Ruler:\n|----|----|----|----|----|\n0    1    2    3    4    5 inches\n\nThis pencil is 4 inches long!\n\n🎯 Estimation Game:\nGuess, then measure:\n• How long is your shoe? ___ inches\n• How wide is your hand? ___ inches\n• How tall is your desk? ___ inches\n\nComparing Lengths:\n• A crayon is about 3 inches\n• A ruler is 12 inches (1 foot)\n• Your arm is about 2 feet\n• A car is about 15 feet\n\nWeight:\nOUNCE (oz) - light (a letter)\nPOUND (lb) - heavier (a book)\n\nVolume:\nCUP (c)\nPINT (pt) = 2 cups\nQUART (qt) = 4 cups\nGALLON (gal) = 16 cups`,
        grade_level: 3,
        subject: 'Mathematics',
        difficulty_level: 2,
        estimated_duration: 35,
        language: 'en'
      },

      // ==================== ENGLISH (10 lessons) ====================
      {
        title: 'The Alphabet Song',
        description: 'Learn all 26 letters',
        content: `The English alphabet has 26 letters!\n\nUppercase (Capital Letters):\nA B C D E F G H I J K L M\nN O P Q R S T U V W X Y Z\n\nLowercase (Small Letters):\na b c d e f g h i j k l m\nn o p q r s t u v w x y z\n\nVowels (Special Letters): A, E, I, O, U\nConsonants (All Other Letters)\n\n🎯 Letter Recognition:\nFind these letters in your name:\n• Which letters are in your first name?\n• Which letters are in your last name?\n• How many letters total?\n\nPractice Writing:\nTrace these letters:\nA - apple 🍎\nB - ball ⚽\nC - cat 🐱\nD - dog 🐕\nE - egg 🥚\n\nSing the alphabet song every day!`,
        grade_level: 0,
        subject: 'English',
        difficulty_level: 1,
        estimated_duration: 20,
        language: 'en'
      },
      {
        title: 'Phonics Sounds',
        description: 'Short and long vowel sounds',
        content: `Vowels make different sounds!\n\nThe 5 Vowels: A, E, I, O, U\n\nSHORT Vowel Sounds:\n• A as in "cat" 🐱 (æ)\n• E as in "bed" 🛏️ (ɛ)\n• I as in "pig" 🐷 (ɪ)\n• O as in "dog" 🐕 (ɒ)\n• U as in "cup" ☕ (ʌ)\n\nLONG Vowel Sounds (say the letter name):\n• A as in "cake" 🎂\n• E as in "bee" 🐝\n• I as in "kite" 🪁\n• O as in "nose" 👃\n• U as in "cube" 🧊\n\n🎯 Word Sorting:\nSHORT A: bat, hat, mat, sat\nLONG A: cake, make, take, bake\n\nPractice:\nCircle the words with short vowel sounds:\ncat, tree, dog, bike, sun\n\nMagic E Rule:\nAdding 'e' makes the vowel long!\nhat → hate\nkit → kite\ncap → cape`,
        grade_level: 1,
        subject: 'English',
        difficulty_level: 1,
        estimated_duration: 25,
        language: 'en'
      },
      {
        title: 'Reading Comprehension',
        description: 'Understanding what you read',
        content: `Reading comprehension means understanding the story!\n\nThe 5 W's and H:\n• WHO - Who is in the story?\n• WHAT - What happens?\n• WHEN - When does it happen?\n• WHERE - Where does it take place?\n• WHY - Why did it happen?\n• HOW - How did it happen?\n\n📖 Sample Story:\n"Max the dog ran to the park. He played with his ball. It was a sunny day."\n\nAnswer the questions:\nWHO? Max the dog\nWHAT? Played with a ball\nWHERE? At the park\nWHEN? On a sunny day\n\n🎯 Finding the Main Idea:\nMain Idea = What the story is mostly about\nDetails = Little facts that support the main idea\n\nPractice:\nRead a short story and ask:\n• What is this mostly about?\n• What are three details I remember?`,
        grade_level: 2,
        subject: 'English',
        difficulty_level: 1,
        estimated_duration: 30,
        language: 'en'
      },
      {
        title: 'Parts of Speech',
        description: 'Nouns, verbs, and adjectives',
        content: `Words have jobs in sentences!\n\n1. NOUNS (naming words)\nPerson: teacher, doctor, mom\nPlace: school, park, home\nThing: book, chair, apple\nAnimal: dog, cat, bird\n\n2. VERBS (action words)\nrun, jump, eat, sleep, think, play\n\nExample:\n"The dog RUNS fast."\ndog = noun, runs = verb\n\n3. ADJECTIVES (describing words)\nDescribe how something looks, feels, sounds\nbig, small, red, happy, soft, loud\n\nExample:\n"The HAPPY dog runs FAST."\nhappy = adjective, fast = adjective\n\n🎯 Practice:\nFind the parts of speech:\n"The small cat sleeps quietly."\n• Nouns: cat\n• Verbs: sleeps\n• Adjectives: small, quietly\n\nTry writing your own sentence with:\n1 noun + 1 verb + 1 adjective!`,
        grade_level: 2,
        subject: 'English',
        difficulty_level: 2,
        estimated_duration: 30,
        language: 'en'
      },
      {
        title: 'Writing Complete Sentences',
        description: 'Build strong sentences',
        content: `A complete sentence has 3 parts!\n\n1. SUBJECT (who or what)\n2. VERB (action)\n3. COMPLETE THOUGHT\n\nExamples:\n✓ "The cat sleeps." (complete)\n✗ "The cat" (incomplete - no verb)\n✗ "Sleeps on" (incomplete - no subject)\n\nSentence Must:\n• Start with a CAPITAL letter\n• End with punctuation (. ! ?)\n• Make sense!\n\nTypes of Sentences:\n. Statement - "I like pizza."\n? Question - "Do you like pizza?"\n! Exclamation - "Pizza is delicious!"\n\n🎯 Fix These Sentences:\n1. "the dog barks" → "The dog barks."\n2. "runs fast" → "The boy runs fast."\n3. "my friend" → "My friend plays games."\n\nPractice:\nWrite 3 sentences about your day!\nRemember: Capital letter + complete thought + punctuation`,
        grade_level: 1,
        subject: 'English',
        difficulty_level: 1,
        estimated_duration: 25,
        language: 'en'
      },
      {
        title: 'Story Elements',
        description: 'Characters, setting, and plot',
        content: `Every story has important parts!\n\n1. CHARACTERS\nWho is in the story?\nPeople, animals, or creatures\nExample: Harry, a friendly dragon\n\n2. SETTING\nWhere and when?\nPlace: forest, castle, school\nTime: long ago, today, future\nExample: A magical forest at night\n\n3. PLOT\nWhat happens in the story?\nBeginning → Middle → End\n\nPlot Structure:\n📍 Beginning - Meet characters, learn setting\n📍 Middle - Problem happens!\n📍 End - Problem is solved\n\n🎯 Story Practice:\n"Once upon a time, a little mouse lived in a big barn. One day, she found a piece of cheese. She shared it with her friends."\n\nCharacters: Little mouse, friends\nSetting: Big barn\nPlot:\n- Beginning: Mouse lives in barn\n- Middle: Finds cheese\n- End: Shares with friends\n\nNow you write a story with all three elements!`,
        grade_level: 2,
        subject: 'English',
        difficulty_level: 2,
        estimated_duration: 30,
        language: 'en'
      },
      {
        title: 'Building Vocabulary',
        description: 'Learn new words every day',
        content: `Growing your word power! 💪\n\nWhat is Vocabulary?\nAll the words you know and use!\n\nWord Learning Strategies:\n\n1. CONTEXT CLUES\nUse surrounding words to guess meaning\n"The enormous elephant was huge!"\nenormous = very big\n\n2. WORD PARTS\nPrefix + Root + Suffix\nun + happy = unhappy (not happy)\nplay + ful = playful (full of play)\n\n3. SYNONYMS (same meaning)\nhappy = glad = joyful = cheerful\nbig = large = huge = enormous\n\n4. ANTONYMS (opposite meaning)\nhot ↔ cold\nfast ↔ slow\nday ↔ night\n\n🎯 New Words This Week:\nWord: CURIOUS\nMeaning: Wanting to learn or know\nSentence: "I am curious about space."\n\nWord: COURAGE\nMeaning: Being brave\nSentence: "It takes courage to try new things."\n\nChallenge:\nLearn 2 new words each day!\nUse them in sentences!`,
        grade_level: 3,
        subject: 'English',
        difficulty_level: 2,
        estimated_duration: 30,
        language: 'en'
      },
      {
        title: 'Punctuation Power',
        description: 'Periods, questions, exclamations',
        content: `Punctuation marks tell us how to read!\n\nPERIOD . \nEnds a statement\n"I have a dog."\n\nQUESTION MARK ?\nEnds a question\n"Do you have a dog?"\n\nEXCLAMATION POINT !\nShows excitement or strong feeling\n"What a cute dog!"\n\nCOMMA ,\nPauses in a list\n"I like apples, oranges, and bananas."\n\nAPOSTROPHE '\nShows ownership or contractions\n"That is Sarah's book."\n"I can't go." (cannot)\n\nQUOTATION MARKS " "\nShows someone talking\n"Hello," said Mom.\n\n🎯 Add Punctuation:\n1. What is your name ___\n2. The sky is blue ___\n3. Watch out ___\n4. I like pizza ___ ice cream ___ and cake ___\n\nAnswers:\n1. ?\n2. .\n3. !\n4. , , .`,
        grade_level: 2,
        subject: 'English',
        difficulty_level: 2,
        estimated_duration: 25,
        language: 'en'
      },
      {
        title: 'Rhyming Words',
        description: 'Words that sound the same',
        content: `Rhyming words end with the same sound!\n\nWord Families:\n-AT family: cat, hat, mat, rat, bat, sat\n-AN family: can, man, pan, ran, tan, van\n-OP family: hop, mop, pop, top, stop, shop\n-UG family: bug, hug, mug, rug, tug, jug\n\nRhyming Pairs:\ndog 🐕 → frog 🐸\nstar ⭐ → car 🚗\ntree 🌳 → bee 🐝\nbook 📖 → look 👀\n\n🎯 Rhyme Time!\nFind the rhyming word:\n1. "The cat sat on the ___" (mat, dog, tree)\n2. "I see a bee in the ___" (car, tree, bug)\n3. "The mouse lives in a ___" (cheese, house, hole)\n\nMake Your Own Rhymes:\nComplete these:\n"Roses are red,\nViolets are blue,\n_____________,\n_____________!"\n\nRhyming helps with:\n• Reading\n• Spelling\n• Poetry\n• Memory!`,
        grade_level: 1,
        subject: 'English',
        difficulty_level: 1,
        estimated_duration: 20,
        language: 'en'
      },
      {
        title: 'Capital Letters',
        description: 'When to use uppercase letters',
        content: `Capital letters have special jobs!\n\nUse CAPITALS for:\n\n1. FIRST WORD in a sentence\n"The sun is bright."\n\n2. The word "I"\n"I am happy."\n\n3. NAMES of people\nSarah, Michael, Dr. Smith\n\n4. NAMES of places\nNew York, Paris, Main Street\n\n5. DAYS and MONTHS\nMonday, Tuesday\nJanuary, February\n\n6. HOLIDAYS\nChristmas, Halloween, Thanksgiving\n\n7. TITLES of books/movies\n"Harry Potter"\n"The Lion King"\n\n🎯 Fix the Capitals:\n1. "my name is john." → "My name is John."\n2. "i live in texas." → "I live in Texas."\n3. "monday is my favorite day." → "Monday is my favorite day."\n\nRemember:\nProper nouns = Always capital!\nCommon nouns = Usually lowercase\n\nExample:\n"The teacher (common) is Mrs. Johnson (proper)."\n"The city (common) is Boston (proper)."`,
        grade_level: 2,
        subject: 'English',
        difficulty_level: 2,
        estimated_duration: 25,
        language: 'en'
      },

      // ==================== SCIENCE (10 lessons) ====================
      {
        title: 'My Five Senses',
        description: 'See, hear, touch, taste, smell',
        content: `We learn about the world through our 5 senses!\n\n1. SIGHT 👁️\nWe see with our EYES\nColors, shapes, movement\n\n2. HEARING 👂\nWe hear with our EARS\nSounds: loud, quiet, music\n\n3. TOUCH ✋\nWe feel with our SKIN\nTextures: soft, hard, rough, smooth\n\n4. TASTE 👅\nWe taste with our TONGUE\nFlavors: sweet, sour, salty, bitter\n\n5. SMELL 👃\nWe smell with our NOSE\nScents: flowers, food, fresh air\n\n🎯 Sense Walk:\nUse each sense to explore:\n• SIGHT: What colors do you see?\n• HEARING: What sounds do you hear?\n• TOUCH: Touch something soft, then something hard\n• TASTE: Describe your lunch\n• SMELL: What does your home smell like?\n\nYour senses keep you safe!\nThey tell you about the world around you.`,
        grade_level: 0,
        subject: 'Science',
        difficulty_level: 1,
        estimated_duration: 20,
        language: 'en'
      },
      {
        title: 'Plant Life Cycle',
        description: 'From seed to flower',
        content: `How do plants grow? 🌱\n\nThe Plant Life Cycle:\n\n1. SEED 🌰\nTiny plant inside waiting to grow\nNeeds: soil, water, warmth\n\n2. SPROUT/GERMINATION 🌱\nSeed breaks open\nTiny root grows down\nTiny shoot grows up\n\n3. SEEDLING 🌿\nBaby plant with first leaves\nStarts making own food\nRoots get stronger\n\n4. ADULT PLANT 🌳\nFully grown\nMany leaves\nStrong stem and roots\n\n5. FLOWERS 🌸\nProduces flowers\nFlowers make pollen\nPollination happens\n\n6. FRUITS & SEEDS 🍎\nFlowers become fruits\nFruits have seeds inside\nSeeds fall and start again!\n\nWhat Plants Need:\n☀️ Sunlight - for energy\n💧 Water - to drink\n🌍 Soil - for nutrients\n🌬️ Air - for breathing\n\n🎯 Grow Your Own:\nPlant a bean seed in a cup!\nWater it every day.\nWatch it grow over 2 weeks!`,
        grade_level: 1,
        subject: 'Science',
        difficulty_level: 1,
        estimated_duration: 30,
        language: 'en'
      },
      {
        title: 'Animal Homes',
        description: 'Where do animals live?',
        content: `Animals live in special places called HABITATS! 🏠\n\nTypes of Habitats:\n\n🌳 FOREST\nAnimals: deer, bears, owls, squirrels\nFeatures: trees, shade, nuts, berries\n\n🏜️ DESERT\nAnimals: camels, snakes, lizards\nFeatures: very hot, sandy, little water\n\n🌊 OCEAN\nAnimals: fish, whales, dolphins, sharks\nFeatures: salty water, waves, coral\n\n❄️ ARCTIC\nAnimals: polar bears, penguins, seals\nFeatures: very cold, ice, snow\n\n🌾 GRASSLAND\nAnimals: lions, zebras, elephants\nFeatures: flat, grassy, few trees\n\n💧 POND/LAKE\nAnimals: frogs, ducks, turtles, fish\nFeatures: fresh water, plants\n\n🎯 Match the Animal:\nWhere do these animals live?\n• Polar bear → Arctic\n• Camel → Desert\n• Frog → Pond\n• Owl → Forest\n\nAnimals are adapted to their habitat!\nThey have special features to survive.`,
        grade_level: 1,
        subject: 'Science',
        difficulty_level: 1,
        estimated_duration: 25,
        language: 'en'
      },
      {
        title: 'The Water Cycle',
        description: 'Water journey around Earth',
        content: `Water moves in a cycle! 💧\n\nThe Water Cycle Steps:\n\n1. EVAPORATION ☀️💧\nSun heats water\nWater turns into vapor (gas)\nRises into the sky\nFrom: oceans, lakes, rivers, puddles\n\n2. CONDENSATION ☁️\nWater vapor cools down\nTurns back into tiny droplets\nForms CLOUDS\n\n3. PRECIPITATION 🌧️❄️\nClouds get heavy with water\nWater falls as:\n- Rain 🌧️\n- Snow ❄️\n- Sleet 🧊\n- Hail ⚪\n\n4. COLLECTION 🌊\nWater collects in:\n- Oceans\n- Lakes\n- Rivers\n- Underground\nCycle starts again!\n\n🎯 Water Cycle in Action:\nWatch what happens:\n1. Put water in a clear bag\n2. Tape to sunny window\n3. Watch droplets form (condensation!)\n4. See water move around!\n\nFun Facts:\n• Same water has been cycling for millions of years!\n• Dinosaurs drank the same water we drink!\n• 97% of Earth water is in oceans!`,
        grade_level: 2,
        subject: 'Science',
        difficulty_level: 2,
        estimated_duration: 30,
        language: 'en'
      },
      {
        title: 'Weather & Seasons',
        description: 'Understanding weather patterns',
        content: `Weather changes every day! 🌤️\n\nTypes of Weather:\n\n☀️ SUNNY\nBright, warm, clear sky\nWear: light clothes, sunscreen\n\n🌧️ RAINY\nWet, cloudy, puddles\nWear: raincoat, boots\n\n❄️ SNOWY\nCold, white, icy\nWear: coat, gloves, hat\n\n🌬️ WINDY\nBreezy, leaves blow\nHold onto your hat!\n\n⛈️ STORMY\nLightning, thunder, heavy rain\nStay inside and safe!\n\nThe Four Seasons:\n\n🌸 SPRING (March-May)\n• Warmer weather\n• Flowers bloom\n• Baby animals born\n• More rain\n\n☀️ SUMMER (June-August)\n• Hottest season\n• Long days\n• Perfect for swimming!\n• Lots of sunshine\n\n🍂 FALL/AUTUMN (September-November)\n• Cooler weather\n• Leaves change colors\n• Harvest time\n• Back to school\n\n❄️ WINTER (December-February)\n• Coldest season\n• Short days\n• Snow in some places\n• Holidays!\n\n🎯 Weather Watch:\nKeep a weather journal!\nEach day record:\n• Temperature\n• Sunny/cloudy/rainy\n• How it feels outside`,
        grade_level: 2,
        subject: 'Science',
        difficulty_level: 2,
        estimated_duration: 30,
        language: 'en'
      },
      {
        title: 'States of Matter',
        description: 'Solid, liquid, and gas',
        content: `Matter exists in 3 forms! 🧊💧☁️\n\n1. SOLID\nKeeps its shape\nParticles are packed tight\nExamples:\n• Ice ❄️\n• Rock 🪨\n• Book 📖\n• Toy 🧸\n• Wood 🪵\n\n2. LIQUID\nTakes shape of container\nParticles slide past each other\nExamples:\n• Water 💧\n• Juice 🧃\n• Milk 🥛\n• Oil\n• Honey 🍯\n\n3. GAS\nSpreads out to fill space\nParticles are far apart\nExamples:\n• Air 🌬️\n• Steam ☁️\n• Oxygen\n• Helium (in balloons) 🎈\n\nChanging States:\n\nSOLID → LIQUID (Melting)\nIce cube → Water puddle\n(add heat)\n\nLIQUID → GAS (Evaporation)\nWater → Water vapor\n(add more heat)\n\nGAS → LIQUID (Condensation)\nSteam → Water droplets\n(remove heat)\n\nLIQUID → SOLID (Freezing)\nWater → Ice\n(remove more heat)\n\n🎯 Experiment:\nWatch ice melt:\n1. Put ice in a bowl\n2. Watch it change from SOLID to LIQUID\n3. That's melting!\n\nWater is special - it can be all three states!`,
        grade_level: 3,
        subject: 'Science',
        difficulty_level: 2,
        estimated_duration: 35,
        language: 'en'
      },
      {
        title: 'Magnets Magic',
        description: 'Attract and repel forces',
        content: `Magnets have invisible powers! 🧲\n\nMagnet Parts:\n\nNORTH POLE (N) - Red end\nSOUTH POLE (S) - Blue end\n\nMagnet Rules:\n\n1. OPPOSITES ATTRACT\nN + S = Pull together! ←→\n\n2. SAME POLES REPEL\nN + N = Push apart! →←\nS + S = Push apart! →←\n\nWhat Do Magnets Attract?\n\n✅ MAGNETIC (stick to magnet)\n• Paper clips 📎\n• Nails\n• Coins (some)\n• Steel cans\n• Refrigerator\n\n❌ NOT MAGNETIC (don't stick)\n• Plastic\n• Wood\n• Paper\n• Aluminum foil\n• Glass\n\nMagnetic Force:\nWorks through:\n• Air\n• Paper\n• Water\n• Thin materials\n\n🎯 Magnet Hunt:\nTest items at home:\n1. Get a magnet\n2. Test different objects\n3. Make two lists:\n   - Things that stick\n   - Things that don't stick\n\nFun with Magnets:\n• Make a paper clip chain\n• Move objects without touching\n• Create a maze game\n• Fish for metal objects`,
        grade_level: 2,
        subject: 'Science',
        difficulty_level: 2,
        estimated_duration: 25,
        language: 'en'
      },
      {
        title: 'Our Solar System',
        description: 'Planets and the Sun',
        content: `Welcome to our Solar System! 🌟\n\nThe SUN ☀️\n• A giant star\n• Gives us light and heat\n• All planets orbit around it\n\nThe 8 Planets (in order):\n\n1. MERCURY 🔴\nClosest to Sun, very hot\n\n2. VENUS 🟡\nHottest planet, thick clouds\n\n3. EARTH 🌍\nOur home! Has water and life\n\n4. MARS 🔴\nThe Red Planet, has ice\n\n5. JUPITER 🟠\nBiggest planet, has Great Red Spot\n\n6. SATURN 🪐\nHas beautiful rings\n\n7. URANUS 🔵\nBlue-green, tilted on its side\n\n8. NEPTUNE 🔵\nFarthest, very windy and cold\n\nMemory Trick:\n"My Very Excellent Mother Just Served Us Nachos"\nMercury Venus Earth Mars Jupiter Saturn Uranus Neptune\n\nOther Space Objects:\n🌙 MOON - orbits Earth\n☄️ COMETS - icy rocks with tails\n⭐ STARS - far away suns\n🌌 GALAXIES - groups of stars\n\n🎯 Make a Model:\nDraw the Solar System!\nMake the Sun biggest.\nShow planets in order.\nAdd rings to Saturn!`,
        grade_level: 3,
        subject: 'Science',
        difficulty_level: 2,
        estimated_duration: 30,
        language: 'en'
      },
      {
        title: 'Rocks and Soil',
        description: 'What is under our feet',
        content: `Let us explore rocks and soil! 🪨\n\n3 Types of Rocks:\n\n1. IGNEOUS (ig-nee-us)\nFormed from cooled lava/magma\nExamples: granite, obsidian, pumice\nFeatures: hard, can have crystals\n\n2. SEDIMENTARY (sed-ih-men-tar-ee)\nFormed from layers of sand/mud\nExamples: sandstone, limestone, shale\nFeatures: layers, may have fossils\n\n3. METAMORPHIC (met-ah-mor-fik)\nFormed when rocks change from heat/pressure\nExamples: marble, slate\nFeatures: harder, different texture\n\nSOIL Layers:\n\nTOP SOIL (dark, rich)\n• Has nutrients\n• Where plants grow\n• Full of life\n\nSUBSOIL (lighter)\n• Less nutrients\n• Some rocks\n\nBEDROCK (solid rock)\n• Hard rock layer\n• Very deep\n\nWhat's in Soil?\n• Tiny rock pieces\n• Dead plants (humus)\n• Water\n• Air\n• Bugs and worms 🪱\n\n🎯 Soil Experiment:\nFind 3 soil samples:\n1. From your yard\n2. From a garden\n3. From a park\n\nCompare:\n• Color\n• Texture\n• What's living in it?\n\nRocks are nature's building blocks!`,
        grade_level: 3,
        subject: 'Science',
        difficulty_level: 2,
        estimated_duration: 30,
        language: 'en'
      },
      {
        title: 'Food Chains',
        description: 'Who eats whom in nature',
        content: `Every living thing needs energy! 🍃\n\nThe Food Chain:\n\n1. PRODUCERS (plants) 🌱\nMake their own food\nUse sunlight + water + air\nExamples: grass, trees, flowers\n\n2. CONSUMERS (animals) 🐰\nEat other living things\n\nTypes of Consumers:\n\nHERBIVORES (plant-eaters) 🐮\n• Eat only plants\n• Examples: rabbits, deer, cows\n• Gentle animals\n\nCARNIVORES (meat-eaters) 🦁\n• Eat only animals\n• Examples: lions, hawks, sharks\n• Usually predators\n\nOMNIVORES (eat both) 🐻\n• Eat plants AND animals\n• Examples: humans, bears, raccoons\n• Flexible diet\n\n3. DECOMPOSERS 🍄\nBreak down dead things\nExamples: mushrooms, worms, bacteria\nReturn nutrients to soil\n\nExample Food Chain:\n☀️ Sun\n  ↓\n🌿 Grass (producer)\n  ↓\n🐰 Rabbit (herbivore)\n  ↓\n🦊 Fox (carnivore)\n  ↓\n🍄 Decomposers\n\n🎯 Create Your Chain:\nDraw a food chain with:\n1. One producer\n2. One herbivore\n3. One carnivore\n\nEnergy flows: Sun → Plants → Animals!`,
        grade_level: 3,
        subject: 'Science',
        difficulty_level: 2,
        estimated_duration: 30,
        language: 'en'
      },

      // ==================== TECHNOLOGY (10 lessons) ====================
      {
        title: 'Parts of a Computer',
        description: 'Hardware basics for beginners',
        content: `Let's learn computer parts! 💻\n\nMain Parts:\n\n🖥️ MONITOR\n• The screen\n• Shows pictures and words\n• Like a TV\n\n⌨️ KEYBOARD\n• Has letters and numbers\n• Type messages\n• Press keys to write\n\n🖱️ MOUSE\n• Point and click\n• Move cursor around\n• Left click and right click\n\n🖥️ COMPUTER CASE/TOWER\n• The "brain"\n• Does all the thinking\n• Stores information\n\n🔊 SPEAKERS\n• Make sounds\n• Music and voices\n• Volume control\n\n🎤 MICROPHONE\n• Records your voice\n• For video calls\n\nHow Computers Work:\n\nINPUT → PROCESS → OUTPUT\n\nExample:\nType on keyboard (INPUT)\n  ↓\nComputer thinks (PROCESS)\n  ↓\nWords appear on screen (OUTPUT)\n\n🎯 Computer Scavenger Hunt:\nFind these parts:\n□ Monitor\n□ Keyboard\n□ Mouse\n□ Speakers\n\nTake care of computers:\n• Keep clean\n• No food or drinks nearby\n• Handle gently\n• Ask adult for help`,
        grade_level: 0,
        subject: 'Technology',
        difficulty_level: 1,
        estimated_duration: 20,
        language: 'en'
      },
      {
        title: 'Internet Safety Rules',
        description: 'Stay safe online',
        content: `Important rules for being online! 🛡️\n\n🔐 PASSWORD SAFETY\n\n Good Passwords:\n• Mix letters, numbers, symbols\n• At least 8 characters\n• Don't use your name\n• Different for each site\n\nExample: Fluffy123! (pet name + number + symbol)\n\n❌ Never Share:\n• Your password\n• Not even with friends!\n• Only tell parents/guardians\n\n🔒 PRIVACY PROTECTION\n\nNEVER share online:\n❌ Full name\n❌ Address\n❌ Phone number\n❌ School name\n❌ Birthday\n❌ Photos without permission\n\n👥 TALKING TO STRANGERS\n\n• Don't chat with people you don't know\n• Not everyone is who they say they are\n• Only friend people you know in real life\n\n📱 TELL AN ADULT IF:\n\n• Someone makes you uncomfortable\n• Someone asks for personal info\n• You see something scary\n• Someone is mean\n• A link looks suspicious\n\n🎯 Safety Rules:\n1. Think before you click\n2. Ask permission to go online\n3. Keep devices in common areas\n4. Tell adults about problems\n5. Be kind online\n\nRemember: Once something is online, it stays online!`,
        grade_level: 1,
        subject: 'Technology',
        difficulty_level: 1,
        estimated_duration: 25,
        language: 'en'
      },
      {
        title: 'Typing Basics',
        description: 'Learn the home row keys',
        content: `Learning to type! ⌨️\n\nThe HOME ROW:\nYour fingers rest here\n\nLeft Hand:          Right Hand:\nA S D F            J K L ;\n\nPinky Ring Middle Index | Index Middle Ring Pinky\n\nFinger Placement:\n• Left pinky → A\n• Left ring → S\n• Left middle → D\n• Left index → F\n• Right index → J\n• Right middle → K\n• Right ring → L\n• Right pinky → ;\n\n👍 Thumbs rest on SPACE BAR\n\nTyping Tips:\n\n1. Sit up straight\n2. Feet flat on floor\n3. Arms relaxed\n4. Look at screen, not keyboard\n5. Use all fingers\n\nPractice Words:\n• aaa sss ddd fff (left hand)\n• jjj kkk lll ;;; (right hand)\n• asdf jkl; (both hands)\n• sad dad fad (short words)\n• all fall hall (longer words)\n\n🎯 Daily Practice:\n\nType these sentences:\n1. "A sad lad had a dad."\n2. "All fall at a hall."\n3. "Dad had a salad."\n\nGame:\nType alphabet 5 times:\na b c d e f g h i j k l m\nn o p q r s t u v w x y z\n\nSpeed comes with practice!\nAccuracy first, speed later!`,
        grade_level: 2,
        subject: 'Technology',
        difficulty_level: 2,
        estimated_duration: 25,
        language: 'en'
      },
      {
        title: 'Using a Web Browser',
        description: 'Explore the internet safely',
        content: `Web browsers help us explore! 🌐\n\nPopular Browsers:\n• Chrome\n• Safari\n• Firefox\n• Edge\n\nBrowser Parts:\n\n📍 ADDRESS BAR (at top)\n• Type website addresses here\n• Shows where you are\n• Example: www.google.com\n\n⬅️ BACK Button\n• Go to previous page\n\n➡️ FORWARD Button\n• Go forward again\n\n🔄 REFRESH Button\n• Reload the page\n• Get latest version\n\n🏠 HOME Button\n• Return to homepage\n\n⭐ BOOKMARKS\n• Save favorite sites\n• Quick access\n\nURL Parts:\nhttps:// www . example . com\n  ↓      ↓      ↓       ↓\nSecure  Web   Name   Type\n\n🎯 Safe Browsing:\n\n✅ DO:\n• Use kid-safe search engines\n• Ask permission before visiting new sites\n• Stay on approved websites\n• Close pop-ups (with adult help)\n\n❌ DON'T:\n• Click on ads\n• Download without permission\n• Enter personal information\n• Click suspicious links\n\nTrusted Sites for Kids:\n• PBS Kids\n• National Geographic Kids\n• Scholastic\n• Educational games approved by school\n\nAlways browse with supervision!`,
        grade_level: 2,
        subject: 'Technology',
        difficulty_level: 2,
        estimated_duration: 25,
        language: 'en'
      },
      {
        title: 'Digital Art Basics',
        description: 'Create art on the computer',
        content: `Let's make digital art! 🎨\n\nDrawing Tools:\n\n🖌️ BRUSH\n• Paint with different sizes\n• Soft or hard edges\n• Many colors!\n\n✏️ PENCIL\n• Draw thin lines\n• Sketch ideas\n• Great for details\n\n🪣 PAINT BUCKET\n• Fill areas with color\n• Click and fill!\n• Quick coloring\n\n⬜ SHAPES\n• Circle, square, triangle\n• Perfect shapes every time\n• Can fill with color\n\n🌈 COLOR PICKER\n• Choose any color\n• Mix custom colors\n• Color wheel\n\n↩️ UNDO Button\n• Fix mistakes\n• Try again\n• No eraser needed!\n\nLayers:\n• Like stacking paper\n• Draw on different layers\n• Move pieces around\n• Bottom layer = background\n\n🎯 Art Projects:\n\n1. DRAW A HOUSE\n□ Use rectangle for house\n△ Use triangle for roof\n⬜ Add square windows\n🚪 Draw a door\n\n2. MAKE A RAINBOW\n🟥 Red on top\n🟧 Orange\n🟨 Yellow\n🟩 Green\n🟦 Blue\n🟪 Purple on bottom\n\n3. CREATE A PATTERN\nRepeat shapes:\n●■●■●■●■\n\nDigital Art Tips:\n• Start with sketches\n• Use layers\n• Save your work often\n• Experiment with tools\n• Have fun!\n\nPrograms to try:\n• Paint (Windows)\n• Tux Paint\n• Drawing apps on tablets`,
        grade_level: 1,
        subject: 'Technology',
        difficulty_level: 1,
        estimated_duration: 30,
        language: 'en'
      },
      {
        title: 'Introduction to Coding',
        description: 'Basic programming concepts',
        content: `Coding is giving instructions! 💻\n\nWhat is Code?\n• Instructions for computers\n• Step-by-step directions\n• Like a recipe!\n\nCoding Concepts:\n\n1. SEQUENCE\nDo things in order\n\nExample: Make a sandwich\n1. Get bread\n2. Add peanut butter\n3. Add jelly\n4. Put bread together\n\nWrong order = mess!\n\n2. LOOPS\nRepeat actions\n\nExample:\n"Jump 5 times"\nJump, Jump, Jump, Jump, Jump\n\nCode: REPEAT 5 times { jump }\n\n3. CONDITIONS (if/then)\nMake decisions\n\nIF it's raining THEN bring umbrella\nIF hungry THEN eat snack\n\nCode:\nIF (hungry) {\n  eat food\n}\n\n🎯 Coding Games:\n\nGame 1: Robot Commands\nGive a friend robot commands:\n• "Walk forward 3 steps"\n• "Turn right"\n• "Pick up pencil"\n\nThey can ONLY do what you say!\n\nGame 2: Draw with Code\nCommands:\n→ Move right\n← Move left\n↑ Move up\n↓ Move down\n\nTry: → → ↑ ↑ ← ←\nDid you draw a shape?\n\nPopular Kid Coding:\n• Scratch (drag & drop)\n• Code.org\n• Blockly Games\n\nCoding is:\n• Problem solving\n• Creative\n• Logical thinking\n• Fun!\n\nAnyone can learn to code!`,
        grade_level: 2,
        subject: 'Technology',
        difficulty_level: 2,
        estimated_duration: 30,
        language: 'en'
      },
      {
        title: 'Organizing Files & Folders',
        description: 'Keep your digital work neat',
        content: `Keep your computer organized! 📁\n\nWhat are Files?\n• Documents you create\n• Pictures you save\n• Videos you record\n• Like papers in your backpack\n\nCommon File Types:\n📝 .doc / .docx = Word documents\n🖼️ .jpg / .png = Pictures\n📹 .mp4 = Videos\n🎵 .mp3 = Music\n📊 .pdf = Documents to read\n\nWhat are Folders?\n• Containers for files\n• Like drawers or boxes\n• Keep similar things together\n• Can have folders inside folders!\n\nOrganization System:\n\n📁 My Documents\n  📁 School\n    📄 Math homework\n    📄 Science project\n  📁 Pictures\n    🖼️ Birthday party\n    🖼️ Family vacation\n  📁 Games\n    🎮 Saved games\n\nNaming Files:\n\n✅ GOOD Names:\n• "Math-Homework-Week1"\n• "Science-Project-2024"\n• "Birthday-Photos"\n\n❌ BAD Names:\n• "untitled1"\n• "asdfgh"\n• "stuff"\n\nFile Tips:\n1. Use clear names\n2. Add dates if needed\n3. Put files in folders\n4. Delete old files\n5. Backup important work\n\n🎯 Practice:\n\nCreate these folders:\n□ Homework\n□ Art Projects\n□ Photos\n□ Games\n\nThen organize your files!\n\nLike cleaning your room, but digital!`,
        grade_level: 2,
        subject: 'Technology',
        difficulty_level: 2,
        estimated_duration: 25,
        language: 'en'
      },
      {
        title: 'Email Basics',
        description: 'Sending digital messages',
        content: `Email is like digital mail! 📧\n\nEmail Parts:\n\n📬 TO:\nWho receives it\nExample: friend@email.com\n\n📝 SUBJECT:\nWhat it's about\nExample: "Homework Question"\n\n💬 BODY:\nYour message\nWhere you type\n\n📎 ATTACHMENT:\nAdd files\nPictures, documents\n\nEmail Address Parts:\nusername @ email . com\n   ↓      ↓   ↓     ↓\n Your   at  mail  type\n  name      company\n\nWriting Good Emails:\n\n1. GREETING\n"Dear Mrs. Smith,"\n"Hi Mom,"\n\n2. MESSAGE\nBe clear and polite\nCheck spelling\n\n3. CLOSING\n"Thank you,"\n"Love,"\n"Sincerely,"\n\n4. YOUR NAME\n"Alex"\n\nExample Email:\n\nTO: teacher@school.com\nSUBJECT: Question about homework\n\nDear Mrs. Smith,\n\nI have a question about the math homework. What does problem 5 mean?\n\nThank you,\nAlex\n\n🎯 Email Etiquette:\n\n✅ DO:\n• Use proper greeting\n• Check spelling\n• Be polite\n• Keep it short\n• Reply promptly\n• Use subject line\n\n❌ DON'T:\n• Use all CAPS (looks like yelling)\n• Send to wrong person\n• Forget subject\n• Be rude\n• Share without permission\n\nSafety Rules:\n• Only email people you know\n• Ask adult before emailing\n• Never share password\n• Don't open suspicious emails\n• Tell adult about strange emails\n\nPractice writing emails to family!`,
        grade_level: 3,
        subject: 'Technology',
        difficulty_level: 2,
        estimated_duration: 25,
        language: 'en'
      },
      {
        title: 'Search Engines',
        description: 'Finding information online',
        content: `How to search the web! 🔍\n\nPopular Search Engines:\n• Google\n• Bing\n• DuckDuckGo (more private)\n• Yahoo\n\nHow Search Works:\n\n1. Type keywords\n2. Press Enter\n3. Get results\n4. Click links\n5. Find information\n\nSearch Tips:\n\n✅ Good Searches:\n"planets in solar system"\n"how do plants grow"\n"fun math games for kids"\n\n❌ Bad Searches:\n"stuff"\n"things"\n"idk"\n\nSearch Tricks:\n\n"  " Quotes\nExact phrase\n"ice cream recipe"\n\n+ Plus\nMust include word\n"science +experiments"\n\n- Minus\nExclude word\n"jaguar -car" (animal not car)\n\nKid-Safe Searching:\n\n🟢 Use:\n• Google Safe Search (ON)\n• Kid-safe search engines\n• Supervised browsing\n• School-approved sites\n\n🔴 Avoid:\n• Clicking ads\n• Random websites\n• Suspicious links\n• Personal info sites\n\n🎯 Search Challenge:\n\nFind answers to:\n1. How many legs does a spider have?\n2. What's the capital of France?\n3. Who wrote "Charlotte's Web"?\n\nEvaluate Websites:\n\nASK:\n• Is this from a trusted source?\n• Is the information accurate?\n• When was it updated?\n• Does it match other sources?\n\nTrusted Sources:\n✅ Educational sites (.edu)\n✅ Government sites (.gov)\n✅ Kid sites (PBSKids, etc.)\n✅ Verified sources\n\nAsk adult if unsure!`,
        grade_level: 3,
        subject: 'Technology',
        difficulty_level: 2,
        estimated_duration: 25,
        language: 'en'
      },
      {
        title: 'Making Presentations',
        description: 'Share ideas with slides',
        content: `Create awesome presentations! 📊\n\nWhat is a Presentation?\n• Slides with information\n• Pictures and words\n• Share with others\n• Like a digital poster\n\nPresentation Tools:\n• PowerPoint\n• Google Slides\n• Keynote\n\nSlide Types:\n\n1. TITLE SLIDE\nFirst slide\n• Project title\n• Your name\n• Date\n• Maybe a picture\n\n2. CONTENT SLIDES\nInformation slides\n• Heading at top\n• Bullet points\n• Pictures\n• Not too much text!\n\n3. CONCLUSION SLIDE\nLast slide\n• Summary\n• "Thank You"\n• Questions?\n\nDesign Tips:\n\n🎨 COLORS\n• Use 2-3 colors\n• Make sure text is readable\n• Dark text on light background\n• Or light text on dark background\n\n📝 TEXT\n• Big enough to read\n• Not too many words\n• Bullet points better than paragraphs\n• Check spelling!\n\n🖼️ PICTURES\n• Add relevant images\n• Not too many\n• Make them big enough\n\n🎯 Sample Presentation:\n\nSlide 1: My Favorite Animal\n"The Elephant"\nBy: Alex\n\nSlide 2: What They Look Like\n• Gray skin\n• Long trunk\n• Big ears\n• 4 legs\n[Picture of elephant]\n\nSlide 3: Where They Live\n• Africa\n• Asia\n• Grasslands and forests\n[Map picture]\n\nSlide 4: What They Eat\n• Grass\n• Leaves\n• Fruit\n• Bark\n[Food pictures]\n\nSlide 5: Fun Facts\n• Largest land animal\n• Very smart\n• Live in families\n• Remember things well\n\nSlide 6: Thank You!\n"Any Questions?"\n\nPresenting Tips:\n• Practice before presenting\n• Speak clearly\n• Face the audience\n• Don't just read slides\n• Make eye contact\n• Smile!`,
        grade_level: 3,
        subject: 'Technology',
        difficulty_level: 2,
        estimated_duration: 30,
        language: 'en'
      }
    ] */

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
if (import.meta.url === `file://${process.argv[1]}`) {
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
