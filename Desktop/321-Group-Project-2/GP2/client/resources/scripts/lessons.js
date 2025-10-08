// Lessons functionality
class Lessons {
    constructor() {
        this.container = document.getElementById('lessons-container');
    }

    async loadLessons() {
        try {
            const lessons = await apiService.getLessons();
            this.renderLessons(lessons);
        } catch (error) {
            console.error('Error loading lessons:', error);
            this.showError('Failed to load lessons');
        }
    }

    renderLessons(lessons) {
        if (!this.container) return;

        if (lessons.length === 0) {
            this.container.innerHTML = '<p class="no-lessons">No lessons available yet.</p>';
            return;
        }

        this.container.innerHTML = lessons.map(lesson => this.createLessonCard(lesson)).join('');
        
        // Add event listeners to lesson cards
        this.addLessonCardListeners();
    }

    createLessonCard(lesson) {
        const difficultyLabels = {
            1: 'Beginner',
            2: 'Intermediate', 
            3: 'Advanced'
        };

        return `
            <div class="lesson-card" data-lesson-id="${lesson.id}">
                <h3>${this.escapeHtml(lesson.title)}</h3>
                <div class="category">${this.escapeHtml(lesson.category)}</div>
                <div class="difficulty">${difficultyLabels[lesson.difficulty] || 'Unknown'}</div>
                <div class="content">${this.escapeHtml(lesson.content)}</div>
                <button class="btn start-lesson-btn" data-lesson-id="${lesson.id}">
                    Start Lesson
                </button>
            </div>
        `;
    }

    addLessonCardListeners() {
        const startButtons = document.querySelectorAll('.start-lesson-btn');
        startButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lessonId = parseInt(e.target.getAttribute('data-lesson-id'));
                this.startLesson(lessonId);
            });
        });
    }

    async startLesson(lessonId) {
        try {
            // For now, just show an alert
            // In a real app, this would navigate to the lesson content
            const lesson = await apiService.getLesson(lessonId);
            alert(`Starting lesson: ${lesson.title}`);
            
            // You could also create progress tracking here
            // await this.trackLessonStart(lessonId);
        } catch (error) {
            console.error('Error starting lesson:', error);
            alert('Failed to start lesson. Please try again.');
        }
    }

    async trackLessonStart(lessonId) {
        try {
            // Create a progress entry for the lesson
            const progress = {
                userId: 1, // This would come from user authentication
                lessonId: lessonId,
                completed: false,
                score: 0
            };

            await apiService.createProgress(progress);
        } catch (error) {
            console.error('Error tracking lesson start:', error);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        if (!this.container) return;

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
            text-align: center;
        `;

        this.container.innerHTML = '';
        this.container.appendChild(errorDiv);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
}
