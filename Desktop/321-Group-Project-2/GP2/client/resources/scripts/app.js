// Main application entry point
class App {
    constructor() {
        this.currentPage = 'dashboard';
        this.apiBaseUrl = 'https://localhost:7001/api';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadDashboard();
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.target.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });
    }

    navigateToPage(pageName) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.remove('active'));

        // Show selected page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => btn.classList.remove('active'));
        
        const activeBtn = document.querySelector(`[data-page="${pageName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        this.currentPage = pageName;

        // Load page-specific content
        switch (pageName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'lessons':
                this.loadLessons();
                break;
            case 'progress':
                this.loadProgress();
                break;
        }
    }

    async loadDashboard() {
        try {
            const dashboard = new Dashboard();
            await dashboard.loadStats();
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    async loadLessons() {
        try {
            const lessons = new Lessons();
            await lessons.loadLessons();
        } catch (error) {
            console.error('Error loading lessons:', error);
        }
    }

    async loadProgress() {
        try {
            const progress = new Progress();
            await progress.loadProgress();
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
