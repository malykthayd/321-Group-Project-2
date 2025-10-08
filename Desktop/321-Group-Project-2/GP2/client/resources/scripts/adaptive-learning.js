/**
 * EduConnect - Adaptive Learning Engine
 * Adjusts content difficulty and pacing based on performance
 */

class AdaptiveLearningEngine {
  constructor(app) {
    this.app = app;
    this.currentLesson = null;
    this.performanceHistory = [];
    this.userProfile = null;
  }

  /**
   * Initialize adaptive learning for a lesson
   */
  startLesson(lesson) {
    this.currentLesson = lesson;
    this.userProfile = this.getUserProfile();
    
    // Adjust lesson parameters based on user profile
    this.adjustLessonParameters();
    
    console.log('Adaptive learning initialized for:', lesson.title);
  }

  /**
   * Adjust lesson parameters based on user performance
   */
  adjustLessonParameters() {
    if (!this.currentLesson || !this.userProfile) return;

    const adaptiveSettings = this.currentLesson.adaptiveSettings;
    
    // Adjust difficulty based on recent performance
    if (this.userProfile.avgAccuracy > 90) {
      adaptiveSettings.difficultyAdjustment += 0.1;
      adaptiveSettings.hintFrequency -= 0.1;
    } else if (this.userProfile.avgAccuracy < 70) {
      adaptiveSettings.difficultyAdjustment -= 0.1;
      adaptiveSettings.hintFrequency += 0.1;
    }

    // Adjust time based on learning speed
    if (this.userProfile.avgTimePerLesson < this.currentLesson.duration * 0.8) {
      adaptiveSettings.timeMultiplier *= 1.2;
    } else if (this.userProfile.avgTimePerLesson > this.currentLesson.duration * 1.2) {
      adaptiveSettings.timeMultiplier *= 0.9;
    }

    // Ensure values stay within bounds
    adaptiveSettings.difficultyAdjustment = Math.max(0, Math.min(0.5, adaptiveSettings.difficultyAdjustment));
    adaptiveSettings.hintFrequency = Math.max(0, Math.min(0.5, adaptiveSettings.hintFrequency));
    adaptiveSettings.timeMultiplier = Math.max(0.5, Math.min(2.0, adaptiveSettings.timeMultiplier));
  }

  /**
   * Track user performance during lesson
   */
  trackPerformance(action, data = {}) {
    const performanceData = {
      timestamp: Date.now(),
      action: action,
      data: data,
      lessonId: this.currentLesson?.id
    };

    this.performanceHistory.push(performanceData);
    
    // Update user profile in real-time
    this.updateUserProfile(performanceData);
  }

  /**
   * Update user profile based on performance
   */
  updateUserProfile(performanceData) {
    if (!this.userProfile) return;

    switch (performanceData.action) {
      case 'answer_submitted':
        this.updateAccuracy(performanceData.data.correct);
        break;
      case 'hint_requested':
        this.updateHintUsage();
        break;
      case 'time_spent':
        this.updateTimeProfile(performanceData.data.timeSpent);
        break;
      case 'lesson_completed':
        this.updateOverallPerformance(performanceData.data);
        break;
    }
  }

  /**
   * Update accuracy metrics
   */
  updateAccuracy(isCorrect) {
    if (!this.userProfile.accuracyHistory) {
      this.userProfile.accuracyHistory = [];
    }

    this.userProfile.accuracyHistory.push(isCorrect ? 1 : 0);
    
    // Keep only last 20 responses
    if (this.userProfile.accuracyHistory.length > 20) {
      this.userProfile.accuracyHistory.shift();
    }

    // Calculate running average
    this.userProfile.avgAccuracy = this.userProfile.accuracyHistory.reduce((a, b) => a + b, 0) / this.userProfile.accuracyHistory.length * 100;
  }

  /**
   * Update hint usage patterns
   */
  updateHintUsage() {
    if (!this.userProfile.hintUsage) {
      this.userProfile.hintUsage = 0;
    }
    this.userProfile.hintUsage++;
  }

  /**
   * Update time-based learning profile
   */
  updateTimeProfile(timeSpent) {
    if (!this.userProfile.timeHistory) {
      this.userProfile.timeHistory = [];
    }

    this.userProfile.timeHistory.push(timeSpent);
    
    // Keep only last 10 lessons
    if (this.userProfile.timeHistory.length > 10) {
      this.userProfile.timeHistory.shift();
    }

    this.userProfile.avgTimePerLesson = this.userProfile.timeHistory.reduce((a, b) => a + b, 0) / this.userProfile.timeHistory.length;
  }

  /**
   * Update overall performance metrics
   */
  updateOverallPerformance(data) {
    this.userProfile.totalLessonsCompleted = (this.userProfile.totalLessonsCompleted || 0) + 1;
    this.userProfile.totalPoints = (this.userProfile.totalPoints || 0) + (data.pointsEarned || 0);
    
    // Update learning style based on performance patterns
    this.updateLearningStyle(data);
  }

  /**
   * Determine learning style based on performance patterns
   */
  updateLearningStyle(data) {
    const patterns = {
      visual: 0,
      auditory: 0,
      kinesthetic: 0
    };

    // Analyze hint preferences
    if (this.userProfile.hintUsage > 0) {
      patterns.visual += 0.3; // Visual hints are most common
    }

    // Analyze time patterns
    if (this.userProfile.avgTimePerLesson < 15) {
      patterns.kinesthetic += 0.4; // Quick learners often prefer hands-on
    } else if (this.userProfile.avgTimePerLesson > 25) {
      patterns.auditory += 0.3; // Slower learners may prefer explanations
    }

    // Analyze accuracy patterns
    if (this.userProfile.avgAccuracy > 85) {
      patterns.visual += 0.3; // High accuracy often correlates with visual learning
    }

    // Determine dominant learning style
    const maxPattern = Math.max(...Object.values(patterns));
    const dominantStyle = Object.keys(patterns).find(key => patterns[key] === maxPattern);
    
    this.userProfile.learningStyle = dominantStyle;
  }

  /**
   * Get personalized recommendations
   */
  getPersonalizedRecommendations() {
    if (!this.userProfile) return [];

    const recommendations = [];

    // Recommend based on weak areas
    if (this.userProfile.avgAccuracy < 80) {
      recommendations.push({
        type: 'practice',
        message: 'Focus on practice exercises to improve accuracy',
        priority: 'high'
      });
    }

    // Recommend based on learning style
    if (this.userProfile.learningStyle === 'visual') {
      recommendations.push({
        type: 'content',
        message: 'Try lessons with more visual content',
        priority: 'medium'
      });
    }

    // Recommend based on time patterns
    if (this.userProfile.avgTimePerLesson > 30) {
      recommendations.push({
        type: 'pacing',
        message: 'Consider shorter, focused study sessions',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  /**
   * Get difficulty recommendation for next lesson
   */
  getDifficultyRecommendation() {
    if (!this.userProfile) return 'Medium';

    const avgAccuracy = this.userProfile.avgAccuracy || 75;
    const hintUsage = this.userProfile.hintUsage || 0;
    const timeSpent = this.userProfile.avgTimePerLesson || 20;

    let difficultyScore = 0;

    // Accuracy-based scoring
    if (avgAccuracy >= 90) difficultyScore += 2;
    else if (avgAccuracy >= 80) difficultyScore += 1;
    else if (avgAccuracy < 70) difficultyScore -= 1;

    // Hint usage scoring
    if (hintUsage === 0) difficultyScore += 1;
    else if (hintUsage > 3) difficultyScore -= 1;

    // Time-based scoring
    if (timeSpent < 15) difficultyScore += 1;
    else if (timeSpent > 30) difficultyScore -= 1;

    // Convert to difficulty level
    if (difficultyScore >= 3) return 'Hard';
    else if (difficultyScore <= -1) return 'Easy';
    else return 'Medium';
  }

  /**
   * Generate adaptive content suggestions
   */
  generateContentSuggestions() {
    if (!this.userProfile) return [];

    const suggestions = [];

    // Suggest content based on learning style
    switch (this.userProfile.learningStyle) {
      case 'visual':
        suggestions.push('Interactive diagrams and charts');
        suggestions.push('Video explanations with visual aids');
        break;
      case 'auditory':
        suggestions.push('Audio explanations and discussions');
        suggestions.push('Group study sessions');
        break;
      case 'kinesthetic':
        suggestions.push('Hands-on activities and simulations');
        suggestions.push('Interactive problem-solving exercises');
        break;
    }

    // Suggest content based on performance
    if (this.userProfile.avgAccuracy < 80) {
      suggestions.push('Review materials and practice exercises');
    }

    if (this.userProfile.avgTimePerLesson > 25) {
      suggestions.push('Shorter, focused content modules');
    }

    return suggestions;
  }

  /**
   * Get user profile
   */
  getUserProfile() {
    if (!this.app.currentUser) return null;

    const userId = this.app.currentUser.id;
    let profile = localStorage.getItem(`educonnect_profile_${userId}`);
    
    if (profile) {
      return JSON.parse(profile);
    }

    // Create new profile
    profile = {
      userId: userId,
      avgAccuracy: 75,
      avgTimePerLesson: 20,
      totalLessonsCompleted: 0,
      totalPoints: 0,
      learningStyle: 'visual',
      hintUsage: 0,
      accuracyHistory: [],
      timeHistory: [],
      createdAt: new Date().toISOString()
    };

    this.saveUserProfile(profile);
    return profile;
  }

  /**
   * Save user profile
   */
  saveUserProfile(profile) {
    if (!this.app.currentUser) return;

    const userId = this.app.currentUser.id;
    localStorage.setItem(`educonnect_profile_${userId}`, JSON.stringify(profile));
  }

  /**
   * Reset adaptive learning data
   */
  resetAdaptiveData() {
    if (!this.app.currentUser) return;

    const userId = this.app.currentUser.id;
    localStorage.removeItem(`educonnect_profile_${userId}`);
    
    this.userProfile = null;
    this.performanceHistory = [];
    this.currentLesson = null;
  }

  /**
   * Export adaptive learning data
   */
  exportAdaptiveData() {
    return {
      userProfile: this.userProfile,
      performanceHistory: this.performanceHistory,
      recommendations: this.getPersonalizedRecommendations(),
      difficultyRecommendation: this.getDifficultyRecommendation(),
      contentSuggestions: this.generateContentSuggestions()
    };
  }
}

// Initialize adaptive learning engine
window.AdaptiveLearning = new AdaptiveLearningEngine(window.app);
