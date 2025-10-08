// Adaptive learning functionality
class AdaptiveLearning {
    constructor() {
        this.userProfile = this.loadUserProfile();
        this.learningPath = [];
    }

    loadUserProfile() {
        // Load user profile from localStorage or API
        const profile = localStorage.getItem('userProfile');
        return profile ? JSON.parse(profile) : {
            strengths: [],
            weaknesses: [],
            learningStyle: 'visual', // visual, auditory, kinesthetic
            preferredDifficulty: 'medium',
            learningGoals: []
        };
    }

    saveUserProfile() {
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
    }

    analyzePerformance(lessonId, score, timeSpent) {
        // Analyze user performance to adjust learning path
        const performance = {
            lessonId,
            score,
            timeSpent,
            timestamp: new Date().toISOString()
        };

        // Update user profile based on performance
        this.updateUserProfile(performance);
        
        // Adjust learning path
        this.adjustLearningPath(performance);
    }

    updateUserProfile(performance) {
        // Update strengths and weaknesses based on performance
        if (performance.score >= 80) {
            // Add to strengths
            if (!this.userProfile.strengths.includes(performance.lessonId)) {
                this.userProfile.strengths.push(performance.lessonId);
            }
        } else if (performance.score < 60) {
            // Add to weaknesses
            if (!this.userProfile.weaknesses.includes(performance.lessonId)) {
                this.userProfile.weaknesses.push(performance.lessonId);
            }
        }

        // Adjust preferred difficulty based on performance
        if (performance.score >= 90 && performance.timeSpent < 300) {
            // User is excelling, suggest harder content
            this.userProfile.preferredDifficulty = 'hard';
        } else if (performance.score < 70 || performance.timeSpent > 600) {
            // User is struggling, suggest easier content
            this.userProfile.preferredDifficulty = 'easy';
        }

        this.saveUserProfile();
    }

    adjustLearningPath(performance) {
        // Create personalized learning recommendations
        const recommendations = this.generateRecommendations();
        this.learningPath = recommendations;
        
        // Save to localStorage
        localStorage.setItem('learningPath', JSON.stringify(this.learningPath));
    }

    generateRecommendations() {
        const recommendations = [];

        // Recommend content based on weaknesses
        this.userProfile.weaknesses.forEach(weaknessId => {
            recommendations.push({
                type: 'review',
                lessonId: weaknessId,
                priority: 'high',
                reason: 'Address knowledge gaps'
            });
        });

        // Recommend advanced content based on strengths
        this.userProfile.strengths.forEach(strengthId => {
            recommendations.push({
                type: 'advance',
                lessonId: strengthId,
                priority: 'medium',
                reason: 'Build on existing strengths'
            });
        });

        return recommendations.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    getNextLesson() {
        // Get the next recommended lesson
        if (this.learningPath.length === 0) {
            this.adjustLearningPath({ score: 0, timeSpent: 0 });
        }

        return this.learningPath[0] || null;
    }

    getPersonalizedContent(lessons) {
        // Filter and sort lessons based on user profile
        return lessons
            .filter(lesson => this.isAppropriateDifficulty(lesson))
            .sort((a, b) => this.getLessonPriority(a) - this.getLessonPriority(b));
    }

    isAppropriateDifficulty(lesson) {
        const difficultyMap = { easy: 1, medium: 2, hard: 3 };
        const userLevel = difficultyMap[this.userProfile.preferredDifficulty] || 2;
        
        // Allow lessons within one level of user's preference
        return Math.abs(lesson.difficulty - userLevel) <= 1;
    }

    getLessonPriority(lesson) {
        let priority = 0;

        // Higher priority for lessons addressing weaknesses
        if (this.userProfile.weaknesses.includes(lesson.id)) {
            priority -= 10;
        }

        // Lower priority for lessons already mastered
        if (this.userProfile.strengths.includes(lesson.id)) {
            priority += 5;
        }

        // Adjust priority based on difficulty preference
        const difficultyMap = { easy: 1, medium: 2, hard: 3 };
        const userLevel = difficultyMap[this.userProfile.preferredDifficulty] || 2;
        priority += Math.abs(lesson.difficulty - userLevel);

        return priority;
    }

    getLearningInsights() {
        return {
            totalLessonsCompleted: this.userProfile.strengths.length,
            averagePerformance: this.calculateAveragePerformance(),
            learningStreak: this.calculateLearningStreak(),
            recommendedFocus: this.getRecommendedFocus(),
            nextMilestone: this.getNextMilestone()
        };
    }

    calculateAveragePerformance() {
        // This would be calculated from actual performance data
        // For now, return a mock value
        return 75;
    }

    calculateLearningStreak() {
        // This would be calculated from actual learning activity
        // For now, return a mock value
        return 7;
    }

    getRecommendedFocus() {
        if (this.userProfile.weaknesses.length > this.userProfile.strengths.length) {
            return 'Focus on strengthening your weak areas';
        } else if (this.userProfile.strengths.length > 5) {
            return 'Ready for advanced challenges';
        } else {
            return 'Continue building your foundation';
        }
    }

    getNextMilestone() {
        const completed = this.userProfile.strengths.length;
        const milestones = [5, 10, 20, 50, 100];
        
        for (const milestone of milestones) {
            if (completed < milestone) {
                return `Complete ${milestone - completed} more lessons to reach ${milestone} lessons completed`;
            }
        }
        
        return 'Congratulations! You\'ve reached all milestones';
    }
}
