// Gamification features
class Gamification {
    constructor() {
        this.userStats = this.loadUserStats();
        this.achievements = this.loadAchievements();
    }

    loadUserStats() {
        const stats = localStorage.getItem('userStats');
        return stats ? JSON.parse(stats) : {
            level: 1,
            experience: 0,
            coins: 0,
            streak: 0,
            badges: [],
            totalLessonsCompleted: 0,
            totalTimeSpent: 0,
            perfectScores: 0
        };
    }

    loadAchievements() {
        return [
            {
                id: 'first_lesson',
                name: 'First Steps',
                description: 'Complete your first lesson',
                icon: '🎯',
                requirement: { lessonsCompleted: 1 },
                unlocked: false
            },
            {
                id: 'perfect_score',
                name: 'Perfectionist',
                description: 'Get a perfect score on a lesson',
                icon: '💯',
                requirement: { perfectScores: 1 },
                unlocked: false
            },
            {
                id: 'streak_7',
                name: 'Week Warrior',
                description: 'Maintain a 7-day learning streak',
                icon: '🔥',
                requirement: { streak: 7 },
                unlocked: false
            },
            {
                id: 'lesson_master',
                name: 'Lesson Master',
                description: 'Complete 10 lessons',
                icon: '🎓',
                requirement: { lessonsCompleted: 10 },
                unlocked: false
            },
            {
                id: 'speed_demon',
                name: 'Speed Demon',
                description: 'Complete a lesson in under 5 minutes',
                icon: '⚡',
                requirement: { fastCompletion: true },
                unlocked: false
            },
            {
                id: 'dedication',
                name: 'Dedicated Learner',
                description: 'Spend 10 hours learning',
                icon: '⏰',
                requirement: { timeSpent: 36000 }, // 10 hours in seconds
                unlocked: false
            }
        ];
    }

    saveUserStats() {
        localStorage.setItem('userStats', JSON.stringify(this.userStats));
    }

    addExperience(amount, source = 'lesson_completion') {
        this.userStats.experience += amount;
        
        // Check for level up
        const newLevel = this.calculateLevel(this.userStats.experience);
        const leveledUp = newLevel > this.userStats.level;
        this.userStats.level = newLevel;

        // Add coins based on experience
        this.userStats.coins += Math.floor(amount / 10);

        // Update streaks and other stats
        this.updateStats(source);

        // Check achievements
        const newAchievements = this.checkAchievements();
        
        this.saveUserStats();

        return {
            leveledUp,
            newLevel,
            experienceGained: amount,
            newAchievements
        };
    }

    calculateLevel(experience) {
        // Simple level calculation: every 100 XP = 1 level
        return Math.floor(experience / 100) + 1;
    }

    updateStats(source) {
        switch (source) {
            case 'lesson_completion':
                this.userStats.totalLessonsCompleted++;
                this.userStats.streak++;
                break;
            case 'perfect_score':
                this.userStats.perfectScores++;
                break;
            case 'fast_completion':
                // Tracked separately in achievements
                break;
        }
    }

    checkAchievements() {
        const newAchievements = [];

        this.achievements.forEach(achievement => {
            if (!achievement.unlocked && this.meetsRequirement(achievement.requirement)) {
                achievement.unlocked = true;
                this.userStats.badges.push(achievement.id);
                newAchievements.push(achievement);
                
                // Award bonus XP for achievements
                this.addExperience(50, 'achievement');
            }
        });

        return newAchievements;
    }

    meetsRequirement(requirement) {
        for (const [key, value] of Object.entries(requirement)) {
            switch (key) {
                case 'lessonsCompleted':
                    if (this.userStats.totalLessonsCompleted < value) return false;
                    break;
                case 'perfectScores':
                    if (this.userStats.perfectScores < value) return false;
                    break;
                case 'streak':
                    if (this.userStats.streak < value) return false;
                    break;
                case 'timeSpent':
                    if (this.userStats.totalTimeSpent < value) return false;
                    break;
                case 'fastCompletion':
                    // This would be tracked per lesson completion
                    break;
            }
        }
        return true;
    }

    getProgressToNextLevel() {
        const currentLevelExp = (this.userStats.level - 1) * 100;
        const nextLevelExp = this.userStats.level * 100;
        const progress = this.userStats.experience - currentLevelExp;
        const total = nextLevelExp - currentLevelExp;
        
        return {
            current: progress,
            total: total,
            percentage: Math.round((progress / total) * 100)
        };
    }

    getLeaderboard() {
        // Mock leaderboard data
        return [
            { rank: 1, name: 'Alex Johnson', level: 15, experience: 1450 },
            { rank: 2, name: 'Sarah Chen', level: 14, experience: 1390 },
            { rank: 3, name: 'Mike Wilson', level: 13, experience: 1280 },
            { rank: 4, name: 'Emma Davis', level: 12, experience: 1190 },
            { rank: 5, name: 'You', level: this.userStats.level, experience: this.userStats.experience }
        ];
    }

    getDailyChallenge() {
        const challenges = [
            {
                id: 'daily_lesson',
                name: 'Daily Learner',
                description: 'Complete any lesson',
                reward: 25,
                icon: '📚'
            },
            {
                id: 'perfect_score',
                name: 'Perfect Day',
                description: 'Get a perfect score on any lesson',
                reward: 50,
                icon: '💯'
            },
            {
                id: 'time_challenge',
                name: 'Quick Study',
                description: 'Complete a lesson in under 10 minutes',
                reward: 30,
                icon: '⚡'
            }
        ];

        // Return a random daily challenge
        return challenges[Math.floor(Math.random() * challenges.length)];
    }

    completeDailyChallenge(challengeId) {
        // Check if challenge was completed
        const challenge = this.getDailyChallenge();
        if (challenge.id === challengeId) {
            const result = this.addExperience(challenge.reward, 'daily_challenge');
            return {
                completed: true,
                reward: challenge.reward,
                ...result
            };
        }
        
        return { completed: false };
    }

    getRewards() {
        return {
            coins: this.userStats.coins,
            experience: this.userStats.experience,
            level: this.userStats.level,
            badges: this.userStats.badges.length,
            streak: this.userStats.streak
        };
    }

    resetStreak() {
        this.userStats.streak = 0;
        this.saveUserStats();
    }

    addTimeSpent(seconds) {
        this.userStats.totalTimeSpent += seconds;
        this.saveUserStats();
    }
}
