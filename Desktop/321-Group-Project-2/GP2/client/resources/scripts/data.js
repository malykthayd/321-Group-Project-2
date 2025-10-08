/**
 * EduConnect - Sample Data
 * Mock data for development and demonstration
 */

window.SampleData = {
  // User roles and authentication
  users: {
    student: {
      id: 'student_001',
      name: 'Alex Johnson',
      email: 'alex.johnson@student.edu',
      role: 'student',
      avatar: '👨‍🎓',
      points: 1250,
      streak: 7,
      level: 5,
      studyTime: '12h 30m',
      accuracy: 87,
      joinDate: '2024-09-01'
    },
    teacher: {
      id: 'teacher_001',
      name: 'Dr. Sarah Williams',
      email: 'sarah.williams@teacher.edu',
      role: 'teacher',
      avatar: '👩‍🏫',
      classes: ['MATH_101', 'SCIENCE_201'],
      students: 32,
      joinDate: '2024-08-15'
    },
    parent: {
      id: 'parent_001',
      name: 'Michael Davis',
      email: 'michael.davis@parent.com',
      role: 'parent',
      avatar: '👨‍👩‍👧‍👦',
      children: ['student_001', 'student_002'],
      notifications: true,
      joinDate: '2024-09-01'
    },
    admin: {
      id: 'admin_001',
      name: 'Jennifer Martinez',
      email: 'jennifer.martinez@admin.edu',
      role: 'admin',
      avatar: '👩‍💼',
      permissions: ['user_management', 'content_management', 'analytics'],
      joinDate: '2024-08-01'
    }
  },

  // Lesson content and structure
  lessons: [
    {
      id: 'math_001',
      title: 'Introduction to Algebra',
      description: 'Learn basic algebraic concepts and operations including variables, expressions, and equations.',
      subject: 'Mathematics',
      grade: '5th Grade',
      difficulty: 'Easy',
      duration: 15,
      points: 50,
      prerequisites: [],
      learningObjectives: [
        'Understand what variables are',
        'Solve simple algebraic equations',
        'Apply algebraic thinking to word problems'
      ],
      content: {
        sections: [
          {
            title: 'What is Algebra?',
            type: 'video',
            duration: 5,
            content: 'Introduction to algebraic thinking'
          },
          {
            title: 'Variables and Expressions',
            type: 'interactive',
            duration: 5,
            content: 'Practice identifying variables'
          },
          {
            title: 'Simple Equations',
            type: 'quiz',
            duration: 5,
            content: 'Solve basic equations'
          }
        ]
      },
      adaptiveSettings: {
        difficultyAdjustment: 0.1,
        timeMultiplier: 1.0,
        hintFrequency: 0.3
      },
      tags: ['algebra', 'variables', 'equations', 'beginner'],
      icon: 'bi-calculator',
      color: '#667eea'
    },
    {
      id: 'science_001',
      title: 'Photosynthesis Process',
      description: 'Explore how plants convert sunlight into energy through the process of photosynthesis.',
      subject: 'Science',
      grade: '6th Grade',
      difficulty: 'Medium',
      duration: 20,
      points: 75,
      prerequisites: ['science_001'],
      learningObjectives: [
        'Understand the photosynthesis equation',
        'Identify plant structures involved',
        'Explain the role of sunlight and chlorophyll'
      ],
      content: {
        sections: [
          {
            title: 'What is Photosynthesis?',
            type: 'video',
            duration: 7,
            content: 'Overview of the process'
          },
          {
            title: 'Plant Structures',
            type: 'interactive',
            duration: 8,
            content: 'Explore leaf anatomy'
          },
          {
            title: 'The Process',
            type: 'simulation',
            duration: 5,
            content: 'Interactive photosynthesis simulation'
          }
        ]
      },
      adaptiveSettings: {
        difficultyAdjustment: 0.15,
        timeMultiplier: 1.2,
        hintFrequency: 0.25
      },
      tags: ['photosynthesis', 'plants', 'biology', 'energy'],
      icon: 'bi-flower1',
      color: '#10b981'
    },
    {
      id: 'english_001',
      title: 'Creative Writing Basics',
      description: 'Learn storytelling techniques, character development, and narrative structure.',
      subject: 'English Language Arts',
      grade: '7th Grade',
      difficulty: 'Hard',
      duration: 25,
      points: 100,
      prerequisites: ['english_basic'],
      learningObjectives: [
        'Create compelling characters',
        'Develop engaging plots',
        'Use descriptive language effectively'
      ],
      content: {
        sections: [
          {
            title: 'Character Development',
            type: 'video',
            duration: 8,
            content: 'Creating memorable characters'
          },
          {
            title: 'Plot Structure',
            type: 'interactive',
            duration: 10,
            content: 'Building engaging stories'
          },
          {
            title: 'Writing Practice',
            type: 'assignment',
            duration: 7,
            content: 'Write a short story'
          }
        ]
      },
      adaptiveSettings: {
        difficultyAdjustment: 0.2,
        timeMultiplier: 1.5,
        hintFrequency: 0.2
      },
      tags: ['writing', 'creativity', 'storytelling', 'language'],
      icon: 'bi-pencil-square',
      color: '#f59e0b'
    }
  ],

  // Gamification elements
  achievements: [
    {
      id: 'math_master',
      name: 'Math Master',
      description: 'Complete 10 math lessons with 90%+ accuracy',
      icon: '🧮',
      points: 200,
      rarity: 'common',
      category: 'subject',
      requirements: {
        subject: 'Mathematics',
        lessonsCompleted: 10,
        minAccuracy: 90
      }
    },
    {
      id: 'streak_keeper',
      name: 'Streak Keeper',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      points: 150,
      rarity: 'common',
      category: 'engagement',
      requirements: {
        streak: 7
      }
    },
    {
      id: 'quick_learner',
      name: 'Quick Learner',
      description: 'Complete a lesson in under 10 minutes',
      icon: '⚡',
      points: 100,
      rarity: 'uncommon',
      category: 'performance',
      requirements: {
        maxTime: 10,
        minAccuracy: 80
      }
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Achieve 100% accuracy on 5 consecutive lessons',
      icon: '💎',
      points: 500,
      rarity: 'rare',
      category: 'performance',
      requirements: {
        consecutivePerfect: 5
      }
    },
    {
      id: 'explorer',
      name: 'Subject Explorer',
      description: 'Complete lessons in 5 different subjects',
      icon: '🗺️',
      points: 300,
      rarity: 'uncommon',
      category: 'exploration',
      requirements: {
        subjectsCompleted: 5
      }
    }
  ],

  // Progress tracking data
  progressData: {
    student_001: {
      completedLessons: 17,
      totalLessons: 25,
      totalPoints: 1250,
      currentStreak: 7,
      longestStreak: 12,
      accuracy: 87,
      studyTime: '12h 30m',
      achievements: ['math_master', 'streak_keeper', 'quick_learner'],
      lessonProgress: {
        'math_001': { completed: true, score: 95, timeSpent: 12, attempts: 1 },
        'science_001': { completed: true, score: 88, timeSpent: 18, attempts: 2 },
        'english_001': { completed: false, score: 0, timeSpent: 5, attempts: 1 }
      },
      adaptiveProfile: {
        preferredDifficulty: 'Medium',
        averageTimePerLesson: 14.5,
        learningStyle: 'visual',
        weakAreas: ['reading_comprehension'],
        strongAreas: ['mathematical_reasoning']
      }
    }
  },

  // Leaderboard data
  leaderboard: [
    {
      rank: 1,
      name: 'Alex Johnson',
      points: 1250,
      avatar: '👨‍🎓',
      streak: 7,
      level: 5
    },
    {
      rank: 2,
      name: 'Emma Wilson',
      points: 1180,
      avatar: '👩‍🎓',
      streak: 5,
      level: 5
    },
    {
      rank: 3,
      name: 'Liam Chen',
      points: 1100,
      avatar: '👨‍🎓',
      streak: 9,
      level: 4
    },
    {
      rank: 4,
      name: 'Sophia Rodriguez',
      points: 1050,
      avatar: '👩‍🎓',
      streak: 3,
      level: 4
    },
    {
      rank: 5,
      name: 'Noah Kim',
      points: 980,
      avatar: '👨‍🎓',
      streak: 6,
      level: 4
    }
  ],

  // Class and teacher data
  classData: {
    MATH_101: {
      name: 'Introduction to Mathematics',
      teacher: 'Dr. Sarah Williams',
      students: 32,
      activeStudents: 28,
      avgProgress: 74,
      totalLessons: 12,
      completedLessons: 156
    },
    SCIENCE_201: {
      name: 'Life Sciences',
      teacher: 'Dr. Sarah Williams',
      students: 28,
      activeStudents: 25,
      avgProgress: 68,
      totalLessons: 10,
      completedLessons: 134
    }
  },

  // System statistics for admin
  systemStats: {
    totalUsers: 1247,
    totalStudents: 892,
    totalTeachers: 156,
    totalParents: 189,
    totalAdmins: 10,
    totalLessons: 89,
    totalCompletedLessons: 15420,
    avgEngagement: 82,
    systemHealth: 98,
    dailyActiveUsers: 456,
    weeklyActiveUsers: 892
  },

  // Offline sync data structure
  offlineData: {
    pendingSync: [],
    lastSync: null,
    offlineProgress: {},
    queuedActions: []
  },

  // Notification templates
  notifications: {
    lessonCompleted: {
      title: 'Lesson Completed! 🎉',
      message: 'Great job completing "{lessonName}". You earned {points} points!',
      type: 'success'
    },
    streakReminder: {
      title: 'Keep Your Streak Alive! 🔥',
      message: 'You have a {streak} day streak. Complete a lesson today to keep it going!',
      type: 'warning'
    },
    achievementEarned: {
      title: 'Achievement Unlocked! 🏆',
      message: 'You earned the "{achievementName}" badge!',
      type: 'info'
    },
    parentProgress: {
      title: 'Your Child\'s Progress Update',
      message: '{childName} completed {lessonName} with {score}% accuracy.',
      type: 'info'
    }
  },

  // Adaptive learning parameters
  adaptiveLearning: {
    difficultyLevels: ['Easy', 'Medium', 'Hard'],
    performanceThresholds: {
      excellent: 90,
      good: 80,
      fair: 70,
      poor: 60
    },
    timeAdjustments: {
      fast: 0.8,
      normal: 1.0,
      slow: 1.3
    },
    hintStrategies: {
      visual: ['diagrams', 'images', 'videos'],
      auditory: ['explanations', 'audio', 'discussions'],
      kinesthetic: ['interactive', 'simulations', 'practices']
    }
  }
};

// Utility functions for data access
window.DataUtils = {
  /**
   * Get user data by role
   */
  getUserByRole(role) {
    return this.users[role];
  },

  /**
   * Get lessons by subject
   */
  getLessonsBySubject(subject) {
    return this.lessons.filter(lesson => lesson.subject === subject);
  },

  /**
   * Get lessons by difficulty
   */
  getLessonsByDifficulty(difficulty) {
    return this.lessons.filter(lesson => lesson.difficulty === difficulty);
  },

  /**
   * Get user progress
   */
  getUserProgress(userId) {
    return this.progressData[userId] || null;
  },

  /**
   * Get achievements by category
   */
  getAchievementsByCategory(category) {
    return this.achievements.filter(achievement => achievement.category === category);
  },

  /**
   * Calculate user level from points
   */
  calculateLevel(points) {
    return Math.floor(points / 250) + 1;
  },

  /**
   * Get next achievement
   */
  getNextAchievement(userId) {
    const userProgress = this.getUserProgress(userId);
    if (!userProgress) return null;

    const earnedAchievements = userProgress.achievements || [];
    return this.achievements.find(achievement => 
      !earnedAchievements.includes(achievement.id)
    );
  },

  /**
   * Check if user can earn achievement
   */
  canEarnAchievement(userId, achievementId) {
    const userProgress = this.getUserProgress(userId);
    const achievement = this.achievements.find(a => a.id === achievementId);
    
    if (!userProgress || !achievement) return false;
    
    // Check if already earned
    if (userProgress.achievements && userProgress.achievements.includes(achievementId)) {
      return false;
    }

    // Check requirements
    const requirements = achievement.requirements;
    // This would contain more complex logic based on achievement requirements
    return true; // Simplified for demo
  }
};
