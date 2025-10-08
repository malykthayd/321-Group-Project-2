// Dashboard functionality
class Dashboard {
    constructor() {
        this.container = document.getElementById('dashboard-page');
    }

    async loadStats() {
        try {
            // Get all data for statistics
            const [lessons, progress] = await Promise.all([
                apiService.getLessons(),
                apiService.getProgress()
            ]);

            this.updateStats(lessons, progress);
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
            this.showError('Failed to load dashboard statistics');
        }
    }

    updateStats(lessons, progress) {
        // Total lessons
        const totalLessonsElement = document.getElementById('total-lessons');
        if (totalLessonsElement) {
            totalLessonsElement.textContent = lessons.length;
        }

        // Completed lessons
        const completedLessons = progress.filter(p => p.completed).length;
        const completedLessonsElement = document.getElementById('completed-lessons');
        if (completedLessonsElement) {
            completedLessonsElement.textContent = completedLessons;
        }

        // Average score
        const completedProgress = progress.filter(p => p.completed);
        const averageScore = completedProgress.length > 0 
            ? Math.round(completedProgress.reduce((sum, p) => sum + p.score, 0) / completedProgress.length)
            : 0;
        
        const averageScoreElement = document.getElementById('average-score');
        if (averageScoreElement) {
            averageScoreElement.textContent = `${averageScore}%`;
        }

        // Current streak (mock data for now)
        const currentStreak = this.calculateStreak(progress);
        const currentStreakElement = document.getElementById('current-streak');
        if (currentStreakElement) {
            currentStreakElement.textContent = `${currentStreak} days`;
        }
    }

    calculateStreak(progress) {
        // Simple streak calculation based on recent completions
        const completedDates = progress
            .filter(p => p.completed)
            .map(p => new Date(p.completedAt))
            .sort((a, b) => b - a);

        if (completedDates.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < completedDates.length; i++) {
            const date = new Date(completedDates[i]);
            date.setHours(0, 0, 0, 0);
            
            const diffTime = today - date;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === streak) {
                streak++;
                today.setDate(today.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            background: #ffebee;
            color: #c62828;
            padding: 1rem;
            border-radius: 5px;
            margin: 1rem 0;
            border-left: 4px solid #c62828;
        `;

        this.container.insertBefore(errorDiv, this.container.firstChild);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
}
