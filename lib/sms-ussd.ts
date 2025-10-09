export interface SMSTemplate {
  id: number
  name: string
  template: string
  language: string
  is_active: boolean
  created_at: string
}

export interface USSDMenu {
  id: number
  menu_text: string
  language: string
  is_active: boolean
  created_at: string
}

export interface SMSMessage {
  to: string
  message: string
  template_id?: number
  user_id?: number
}

export interface USSDResponse {
  message: string
  next_menu?: string
  end_session: boolean
}

export class SMSUSSDService {
  // SMS Gateway Integration
  static async sendSMS(message: SMSMessage): Promise<boolean> {
    try {
      // Mock SMS gateway - replace with actual gateway integration
      const gatewayUrl = process.env.SMS_GATEWAY_URL || 'https://api.sms-gateway.com/send'
      const apiKey = process.env.SMS_GATEWAY_API_KEY || 'mock-api-key'

      const response = await fetch(gatewayUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: message.to,
          message: message.message,
          sender: 'AQE'
        })
      })

      return response.ok
    } catch (error) {
      console.error('SMS sending failed:', error)
      return false
    }
  }

  static async sendLessonSMS(studentId: number, lessonContent: string, language: string = 'en'): Promise<boolean> {
    // Get student phone number
    const student = await this.getStudentPhone(studentId)
    if (!student?.phone) {
      return false
    }

    // Get SMS template
    const template = await this.getSMSTemplate('lesson_content', language)
    if (!template) {
      return false
    }

    // Format message
    const message = template.template.replace('{content}', lessonContent)

    return await this.sendSMS({
      to: student.phone,
      message,
      template_id: template.id,
      user_id: studentId
    })
  }

  static async sendQuizSMS(studentId: number, question: string, options: string[], language: string = 'en'): Promise<boolean> {
    const student = await this.getStudentPhone(studentId)
    if (!student?.phone) {
      return false
    }

    const template = await this.getSMSTemplate('quiz_question', language)
    if (!template) {
      return false
    }

    const optionsText = options.map((opt, index) => `${index + 1}. ${opt}`).join('\n')
    const message = template.template
      .replace('{question}', question)
      .replace('{options}', optionsText)

    return await this.sendSMS({
      to: student.phone,
      message,
      template_id: template.id,
      user_id: studentId
    })
  }

  static async sendFeedbackSMS(studentId: number, isCorrect: boolean, explanation: string, language: string = 'en'): Promise<boolean> {
    const student = await this.getStudentPhone(studentId)
    if (!student?.phone) {
      return false
    }

    const templateName = isCorrect ? 'correct_answer' : 'incorrect_answer'
    const template = await this.getSMSTemplate(templateName, language)
    if (!template) {
      return false
    }

    const message = template.template.replace('{explanation}', explanation)

    return await this.sendSMS({
      to: student.phone,
      message,
      template_id: template.id,
      user_id: studentId
    })
  }

  // USSD Integration
  static async processUSSDRequest(phoneNumber: string, sessionId: string, userInput: string, language: string = 'en'): Promise<USSDResponse> {
    try {
      // Get or create user session
      const session = await this.getUSSDUserSession(phoneNumber, sessionId)
      
      if (!session) {
        // New session - show main menu
        return await this.showMainMenu(language)
      }

      // Process user input based on current menu
      return await this.processMenuInput(session, userInput, language)
    } catch (error) {
      console.error('USSD processing failed:', error)
      return {
        message: 'Sorry, an error occurred. Please try again.',
        end_session: true
      }
    }
  }

  static async showMainMenu(language: string): Promise<USSDResponse> {
    const menu = await this.getUSSDMenu('main_menu', language)
    
    if (!menu) {
      return {
        message: 'Welcome to AQE Learning Platform!\n1. Read Today\'s Lesson\n2. Practice Quiz\n3. Check Progress\n4. Parent/Teacher Access\n0. Exit',
        end_session: false
      }
    }

    return {
      message: menu.menu_text,
      end_session: false,
      next_menu: 'main_menu'
    }
  }

  static async processMenuInput(session: any, input: string, language: string): Promise<USSDResponse> {
    switch (input.trim()) {
      case '1':
        return await this.showTodaysLesson(session.user_id, language)
      case '2':
        return await this.showPracticeQuiz(session.user_id, language)
      case '3':
        return await this.showProgress(session.user_id, language)
      case '4':
        return await this.showParentTeacherAccess(language)
      case '0':
        return {
          message: 'Thank you for using AQE Learning Platform. Goodbye!',
          end_session: true
        }
      default:
        return {
          message: 'Invalid option. Please select 1-4 or 0 to exit.',
          end_session: false,
          next_menu: 'main_menu'
        }
    }
  }

  static async showTodaysLesson(userId: number, language: string): Promise<USSDResponse> {
    // Get today's lesson for the user
    const lesson = await this.getTodaysLesson(userId)
    
    if (!lesson) {
      return {
        message: 'No lesson available for today. Please check back tomorrow.',
        end_session: false,
        next_menu: 'main_menu'
      }
    }

    return {
      message: `Today's Lesson: ${lesson.title}\n\n${lesson.content.substring(0, 150)}...\n\nPress 1 to continue or 0 to return to main menu.`,
      end_session: false,
      next_menu: 'lesson_detail'
    }
  }

  static async showPracticeQuiz(userId: number, language: string): Promise<USSDResponse> {
    // Get a practice question for the user
    const question = await this.getPracticeQuestion(userId)
    
    if (!question) {
      return {
        message: 'No practice questions available at the moment.',
        end_session: false,
        next_menu: 'main_menu'
      }
    }

    const optionsText = question.options.map((opt: string, index: number) => 
      `${index + 1}. ${opt}`
    ).join('\n')

    return {
      message: `Practice Quiz:\n\n${question.question}\n\n${optionsText}\n\nSelect your answer (1-${question.options.length}) or 0 to return to main menu.`,
      end_session: false,
      next_menu: 'quiz_answer'
    }
  }

  static async showProgress(userId: number, language: string): Promise<USSDResponse> {
    // Get user's progress
    const progress = await this.getUserProgress(userId)
    
    const message = `Your Progress:\n\nLessons Completed: ${progress.completedLessons}\nBooks Read: ${progress.booksRead}\nCurrent Streak: ${progress.streak} days\n\nPress 0 to return to main menu.`

    return {
      message,
      end_session: false,
      next_menu: 'main_menu'
    }
  }

  static async showParentTeacherAccess(language: string): Promise<USSDResponse> {
    return {
      message: 'Parent/Teacher Access:\n\n1. View Student Progress\n2. Contact Support\n0. Return to Main Menu\n\nPlease select an option.',
      end_session: false,
      next_menu: 'parent_teacher'
    }
  }

  // Helper methods (these would typically interact with the database)
  static async getStudentPhone(studentId: number): Promise<{ phone: string } | null> {
    // Mock implementation - replace with actual database query
    return { phone: '+1234567890' }
  }

  static async getSMSTemplate(name: string, language: string): Promise<SMSTemplate | null> {
    // Mock implementation - replace with actual database query
    const templates: Record<string, Record<string, SMSTemplate>> = {
      lesson_content: {
        en: {
          id: 1,
          name: 'lesson_content',
          template: 'AQE Lesson:\n\n{content}\n\nReply with your thoughts or questions!',
          language: 'en',
          is_active: true,
          created_at: new Date().toISOString()
        }
      },
      quiz_question: {
        en: {
          id: 2,
          name: 'quiz_question',
          template: 'AQE Quiz:\n\n{question}\n\n{options}\n\nReply with your answer number.',
          language: 'en',
          is_active: true,
          created_at: new Date().toISOString()
        }
      },
      correct_answer: {
        en: {
          id: 3,
          name: 'correct_answer',
          template: 'Correct! Well done!\n\n{explanation}\n\nKeep up the great work!',
          language: 'en',
          is_active: true,
          created_at: new Date().toISOString()
        }
      },
      incorrect_answer: {
        en: {
          id: 4,
          name: 'incorrect_answer',
          template: 'Not quite right, but that\'s okay!\n\n{explanation}\n\nTry again next time!',
          language: 'en',
          is_active: true,
          created_at: new Date().toISOString()
        }
      }
    }

    return templates[name]?.[language] || null
  }

  static async getUSSDMenu(name: string, language: string): Promise<USSDMenu | null> {
    // Mock implementation
    return null
  }

  static async getUSSDUserSession(phoneNumber: string, sessionId: string): Promise<any> {
    // Mock implementation
    return null
  }

  static async getTodaysLesson(userId: number): Promise<any> {
    // Mock implementation
    return {
      title: 'Introduction to Fractions',
      content: 'Fractions represent parts of a whole. A fraction has two parts: the numerator (top number) and the denominator (bottom number).'
    }
  }

  static async getPracticeQuestion(userId: number): Promise<any> {
    // Mock implementation
    return {
      question: 'What is 1/2 + 1/4?',
      options: ['3/4', '2/6', '1/3', '1/6']
    }
  }

  static async getUserProgress(userId: number): Promise<any> {
    // Mock implementation
    return {
      completedLessons: 15,
      booksRead: 8,
      streak: 5
    }
  }
}
