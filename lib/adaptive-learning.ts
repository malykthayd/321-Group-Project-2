import { db } from './database'

export interface Concept {
  id: number
  name: string
  description?: string
  subject: string
  grade_level: number
  created_at: string
}

export interface Mastery {
  id: number
  student_id: number
  concept_id: number
  mastery_level: number
  attempts: number
  correct_attempts: number
  last_practiced: string
  updated_at: string
}

export interface PracticeItem {
  id: number
  question: string
  options: string[]
  correct_answer: number
  explanation?: string
  lesson_id?: number
  concept_id?: number
  difficulty_level: number
  created_at: string
}

export interface PracticeAttempt {
  id: number
  student_id: number
  practice_item_id: number
  selected_answer?: number
  is_correct?: boolean
  time_spent: number
  attempted_at: string
}

export class AdaptiveLearningEngine {
  static async getStudentMastery(studentId: number): Promise<Mastery[]> {
    if (!db) return []
    const stmt = db.prepare(`
      SELECT * FROM mastery WHERE student_id = ?
    `)
    return stmt.all(studentId) as Mastery[]
  }

  static async updateMastery(
    studentId: number, 
    conceptId: number, 
    isCorrect: boolean, 
    timeSpent: number = 0
  ): Promise<void> {
    if (!db) return
    
    const existingMastery = db.prepare(`
      SELECT * FROM mastery WHERE student_id = ? AND concept_id = ?
    `).get(studentId, conceptId) as Mastery | null

    if (existingMastery) {
      // Update existing mastery
      const newAttempts = existingMastery.attempts + 1
      const newCorrectAttempts = existingMastery.correct_attempts + (isCorrect ? 1 : 0)
      const newMasteryLevel = newCorrectAttempts / newAttempts

      db.prepare(`
        UPDATE mastery 
        SET mastery_level = ?, attempts = ?, correct_attempts = ?, 
            last_practiced = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE student_id = ? AND concept_id = ?
      `).run(newMasteryLevel, newAttempts, newCorrectAttempts, studentId, conceptId)
    } else {
      // Create new mastery record
      db.prepare(`
        INSERT INTO mastery (student_id, concept_id, mastery_level, attempts, correct_attempts, last_practiced)
        VALUES (?, ?, ?, 1, ?, CURRENT_TIMESTAMP)
      `).run(studentId, conceptId, isCorrect ? 1 : 0, isCorrect ? 1 : 0)
    }
  }

  static async getRecommendedDifficulty(studentId: number, conceptId: number): Promise<number> {
    if (!db) return 1
    
    const mastery = db.prepare(`
      SELECT mastery_level FROM mastery WHERE student_id = ? AND concept_id = ?
    `).get(studentId, conceptId) as { mastery_level: number } | null

    if (!mastery) {
      return 1 // Start with easiest difficulty
    }

    const masteryLevel = mastery.mastery_level

    if (masteryLevel >= 0.9) return 5 // Expert
    if (masteryLevel >= 0.7) return 4 // Advanced
    if (masteryLevel >= 0.5) return 3 // Intermediate
    if (masteryLevel >= 0.3) return 2 // Beginner+
    return 1 // Beginner
  }

  static async getPracticeItems(
    studentId: number, 
    conceptId?: number, 
    difficulty?: number,
    limit: number = 10
  ): Promise<PracticeItem[]> {
    if (!db) return []
    
    let query = `
      SELECT pi.*, 
             COALESCE(m.mastery_level, 0) as current_mastery
      FROM practice_items pi
      LEFT JOIN mastery m ON pi.concept_id = m.concept_id AND m.student_id = ?
    `
    
    const conditions = []
    const params = [studentId]

    if (conceptId) {
      conditions.push('pi.concept_id = ?')
      params.push(conceptId)
    }

    if (difficulty) {
      conditions.push('pi.difficulty_level = ?')
      params.push(difficulty)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    query += ' ORDER BY RANDOM() LIMIT ?'
    params.push(limit)

    const stmt = db.prepare(query)
    const results = stmt.all(...params) as any[]

    return results.map(item => ({
      ...item,
      options: JSON.parse(item.options)
    }))
  }

  static async recordPracticeAttempt(
    studentId: number,
    practiceItemId: number,
    selectedAnswer: number,
    timeSpent: number
  ): Promise<boolean> {
    if (!db) return false
    
    const practiceItem = db.prepare(`
      SELECT correct_answer, concept_id FROM practice_items WHERE id = ?
    `).get(practiceItemId) as { correct_answer: number, concept_id: number }

    if (!practiceItem) {
      throw new Error('Practice item not found')
    }

    const isCorrect = selectedAnswer === practiceItem.correct_answer

    // Record the attempt
    db.prepare(`
      INSERT INTO practice_attempts (student_id, practice_item_id, selected_answer, is_correct, time_spent)
      VALUES (?, ?, ?, ?, ?)
    `).run(studentId, practiceItemId, selectedAnswer, isCorrect, timeSpent)

    // Update mastery if concept is associated
    if (practiceItem.concept_id) {
      await this.updateMastery(studentId, practiceItem.concept_id, isCorrect, timeSpent)
    }

    return isCorrect
  }

  static async getStudentProgress(studentId: number): Promise<{
    totalAttempts: number
    correctAttempts: number
    averageTime: number
    conceptsMastered: number
    recentImprovements: Array<{
      concept_name: string
      improvement: number
    }>
  }> {
    if (!db) {
      return {
        totalAttempts: 0,
        correctAttempts: 0,
        averageTime: 0,
        conceptsMastered: 0,
        recentImprovements: []
      }
    }
    
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_attempts,
        SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct_attempts,
        AVG(time_spent) as average_time
      FROM practice_attempts 
      WHERE student_id = ?
    `).get(studentId) as {
      total_attempts: number
      correct_attempts: number
      average_time: number
    }

    const conceptsMastered = db.prepare(`
      SELECT COUNT(*) as count FROM mastery 
      WHERE student_id = ? AND mastery_level >= 0.8
    `).get(studentId) as { count: number }

    const recentImprovements = db.prepare(`
      SELECT c.name as concept_name, m.mastery_level
      FROM mastery m
      JOIN concepts c ON m.concept_id = c.id
      WHERE m.student_id = ?
      ORDER BY m.updated_at DESC
      LIMIT 5
    `).all(studentId) as Array<{
      concept_name: string
      mastery_level: number
    }>

    return {
      totalAttempts: stats.total_attempts || 0,
      correctAttempts: stats.correct_attempts || 0,
      averageTime: Math.round(stats.average_time || 0),
      conceptsMastered: conceptsMastered.count,
      recentImprovements: recentImprovements.map(item => ({
        concept_name: item.concept_name,
        improvement: Math.round(item.mastery_level * 100)
      }))
    }
  }

  static async getAdaptiveRecommendations(studentId: number): Promise<{
    weakConcepts: Array<{
      concept: Concept
      mastery_level: number
      recommended_difficulty: number
    }>
    strongConcepts: Array<{
      concept: Concept
      mastery_level: number
    }>
    nextSteps: string[]
  }> {
    if (!db) {
      return {
        weakConcepts: [],
        strongConcepts: [],
        nextSteps: []
      }
    }
    
    const weakConcepts = db.prepare(`
      SELECT c.*, m.mastery_level
      FROM concepts c
      JOIN mastery m ON c.id = m.concept_id
      WHERE m.student_id = ? AND m.mastery_level < 0.6
      ORDER BY m.mastery_level ASC
      LIMIT 5
    `).all(studentId) as Array<Concept & { mastery_level: number }>

    const strongConcepts = db.prepare(`
      SELECT c.*, m.mastery_level
      FROM concepts c
      JOIN mastery m ON c.id = m.concept_id
      WHERE m.student_id = ? AND m.mastery_level >= 0.8
      ORDER BY m.mastery_level DESC
      LIMIT 3
    `).all(studentId) as Array<Concept & { mastery_level: number }>

    const weakConceptsWithDifficulty = await Promise.all(
      weakConcepts.map(async (concept) => ({
        concept,
        mastery_level: concept.mastery_level,
        recommended_difficulty: await this.getRecommendedDifficulty(studentId, concept.id)
      }))
    )

    const nextSteps = [
      'Focus on practicing weak concepts with easier difficulty levels',
      'Review explanations for incorrect answers',
      'Take breaks between practice sessions for better retention',
      'Celebrate progress on strong concepts'
    ]

    return {
      weakConcepts: weakConceptsWithDifficulty,
      strongConcepts,
      nextSteps
    }
  }
}
