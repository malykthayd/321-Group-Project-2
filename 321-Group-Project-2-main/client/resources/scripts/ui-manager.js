/* AQE Platform - Unified UI JavaScript */
/* Handles new design system components and interactions */

// Toast Notification System
class ToastManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Create toast container if it doesn't exist
        if (!document.getElementById('aqe-toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'aqe-toast-container';
            this.container.className = 'aqe-toast-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('aqe-toast-container');
        }
    }

    show(message, type = 'info', duration = 5000) {
        const toast = this.createToast(message, type);
        this.container.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => this.remove(toast), duration);
        }

        return toast;
    }

    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `aqe-toast aqe-toast-${type}`;

        const iconMap = {
            success: 'bi-check-circle-fill',
            error: 'bi-x-circle-fill',
            warning: 'bi-exclamation-triangle-fill',
            info: 'bi-info-circle-fill'
        };

        const titleMap = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Info'
        };

        toast.innerHTML = `
            <div class="aqe-toast-header">
                <div class="aqe-toast-icon aqe-toast-icon-${type}">
                    <i class="bi ${iconMap[type]}"></i>
                </div>
                <div class="aqe-toast-title">${titleMap[type]}</div>
                <button class="aqe-toast-close" onclick="window.toastManager.remove(this.parentElement.parentElement)">
                    <i class="bi bi-x"></i>
                </button>
            </div>
            <div class="aqe-toast-message">${message}</div>
            <div class="aqe-toast-progress aqe-toast-progress-${type}"></div>
        `;

        // Add close functionality
        const closeBtn = toast.querySelector('.aqe-toast-close');
        closeBtn.addEventListener('click', () => this.remove(toast));

        return toast;
    }

    remove(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    success(message, duration = 5000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 7000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 6000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 5000) {
        return this.show(message, 'info', duration);
    }
}

// Loading State Manager
class LoadingManager {
    constructor() {
        this.overlay = null;
        this.init();
    }

    init() {
        // Create loading overlay if it doesn't exist
        if (!document.getElementById('aqe-loading-overlay')) {
            this.overlay = document.createElement('div');
            this.overlay.id = 'aqe-loading-overlay';
            this.overlay.className = 'aqe-loading-overlay';
            this.overlay.innerHTML = `
                <div class="aqe-loading-spinner"></div>
                <div class="aqe-loading-text">Loading...</div>
            `;
            document.body.appendChild(this.overlay);
        } else {
            this.overlay = document.getElementById('aqe-loading-overlay');
        }
    }

    show(text = 'Loading...') {
        const textElement = this.overlay.querySelector('.aqe-loading-text');
        if (textElement) {
            textElement.textContent = text;
        }
        this.overlay.classList.add('show');
    }

    hide() {
        this.overlay.classList.remove('show');
    }
}

// Mobile Navigation Manager
class MobileNavManager {
    constructor() {
        this.toggle = null;
        this.sidebar = null;
        this.overlay = null;
        this.init();
    }

    init() {
        this.toggle = document.getElementById('mobileNavToggle');
        this.createSidebar();
        this.createOverlay();
        this.bindEvents();
    }

    createSidebar() {
        if (!document.getElementById('aqe-sidebar')) {
            this.sidebar = document.createElement('div');
            this.sidebar.id = 'aqe-sidebar';
            this.sidebar.className = 'aqe-sidebar';
            this.sidebar.innerHTML = `
                <div class="aqe-sidebar-header">
                    <div class="aqe-logo">
                        <div class="aqe-logo-icon">
                            <i class="bi bi-mortarboard-fill"></i>
                        </div>
                        <div class="aqe-brand">
                            <h2 class="aqe-brand-title">AQE Platform</h2>
                        </div>
                    </div>
                </div>
                <nav class="aqe-sidebar-nav">
                    <div class="aqe-sidebar-nav-item">
                        <a href="#gettingStarted" class="aqe-sidebar-nav-link">
                            <i class="bi bi-play-circle"></i>
                            <span>Getting Started</span>
                        </a>
                    </div>
                    <div class="aqe-sidebar-nav-item">
                        <a href="#chooseExperience" class="aqe-sidebar-nav-link">
                            <i class="bi bi-people"></i>
                            <span>Choose Experience</span>
                        </a>
                    </div>
                    <div class="aqe-sidebar-nav-item">
                        <a href="#institutional" class="aqe-sidebar-nav-link">
                            <i class="bi bi-building"></i>
                            <span>Institutional</span>
                        </a>
                    </div>
                </nav>
            `;
            document.body.appendChild(this.sidebar);
        } else {
            this.sidebar = document.getElementById('aqe-sidebar');
        }
    }

    createOverlay() {
        if (!document.getElementById('aqe-sidebar-overlay')) {
            this.overlay = document.createElement('div');
            this.overlay.id = 'aqe-sidebar-overlay';
            this.overlay.className = 'aqe-sidebar-overlay';
            this.overlay.addEventListener('click', () => this.hide());
            document.body.appendChild(this.overlay);
        } else {
            this.overlay = document.getElementById('aqe-sidebar-overlay');
        }
    }

    bindEvents() {
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Close sidebar when clicking on nav links
        if (this.sidebar) {
            const navLinks = this.sidebar.querySelectorAll('.aqe-sidebar-nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => this.hide());
            });
        }

        // Close sidebar on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.sidebar.classList.contains('show')) {
                this.hide();
            }
        });
    }

    toggleSidebar() {
        if (this.sidebar.classList.contains('show')) {
            this.hide();
        } else {
            this.show();
        }
    }

    show() {
        this.sidebar.classList.add('show');
        this.overlay.classList.add('show');
        this.toggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hide() {
        this.sidebar.classList.remove('show');
        this.overlay.classList.remove('show');
        this.toggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Dashboard Analytics Manager
class DashboardManager {
    constructor() {
        this.charts = new Map();
        this.init();
    }

    init() {
        this.initializeCharts();
        this.bindEvents();
    }

    initializeCharts() {
        // Initialize Chart.js charts if available
        if (typeof Chart !== 'undefined') {
            this.createAnalyticsCharts();
        }
    }

    createAnalyticsCharts() {
        // Teacher Analytics Chart
        const teacherCtx = document.getElementById('teacherAnalyticsChart');
        if (teacherCtx) {
            this.charts.set('teacher', new Chart(teacherCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Completed', 'In Progress', 'Not Started'],
                    datasets: [{
                        data: [65, 25, 10],
                        backgroundColor: [
                            '#059669',
                            '#d97706',
                            '#6b7280'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true
                            }
                        }
                    }
                }
            }));
        }

        // Student Progress Chart
        const studentCtx = document.getElementById('studentProgressChart');
        if (studentCtx) {
            this.charts.set('student', new Chart(studentCtx, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Score %',
                        data: [75, 82, 78, 85],
                        borderColor: '#059669',
                        backgroundColor: 'rgba(5, 150, 105, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            }));
        }
    }

    bindEvents() {
        // Refresh charts on window resize
        window.addEventListener('resize', () => {
            this.charts.forEach(chart => {
                if (chart && typeof chart.resize === 'function') {
                    chart.resize();
                }
            });
        });
    }

    updateChart(chartId, data) {
        const chart = this.charts.get(chartId);
        if (chart) {
            chart.data = data;
            chart.update();
        }
    }
}

// Form Enhancement Manager
class FormManager {
    constructor() {
        this.init();
    }

    init() {
        this.enhanceForms();
        this.bindEvents();
    }

    enhanceForms() {
        // Add loading states to forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                this.handleFormSubmit(form, e);
            });
        });

        // Add focus states to inputs
        const inputs = document.querySelectorAll('.aqe-form-input, .aqe-form-select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });
    }

    handleFormSubmit(form, event) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            this.setButtonLoading(submitBtn, true);
        }
    }

    setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('aqe-btn-loading');
            button.disabled = true;
            const text = button.textContent;
            button.setAttribute('data-original-text', text);
            button.innerHTML = '<div class="aqe-btn-spinner"></div>';
        } else {
            button.classList.remove('aqe-btn-loading');
            button.disabled = false;
            const originalText = button.getAttribute('data-original-text');
            if (originalText) {
                button.textContent = originalText;
                button.removeAttribute('data-original-text');
            }
        }
    }

    bindEvents() {
        // Handle form validation
        document.addEventListener('invalid', (e) => {
            if (e.target.matches('.aqe-form-input, .aqe-form-select')) {
                e.target.classList.add('error');
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.matches('.aqe-form-input, .aqe-form-select')) {
                e.target.classList.remove('error');
            }
        });
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.bindEvents();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aqe-animate-fade-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements that should animate
        const animateElements = document.querySelectorAll('.aqe-card, .aqe-stat-card, .aqe-library-card');
        animateElements.forEach(el => observer.observe(el));
    }

    bindEvents() {
        // Add hover animations
        const cards = document.querySelectorAll('.aqe-card, .aqe-stat-card, .aqe-library-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }
}

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    window.toastManager = new ToastManager();
    window.loadingManager = new LoadingManager();
    window.mobileNavManager = new MobileNavManager();
    window.dashboardManager = new DashboardManager();
    window.formManager = new FormManager();
    window.animationManager = new AnimationManager();

    // Add global utility functions
    window.showToast = (message, type = 'info') => window.toastManager.show(message, type);
    window.showLoading = (text = 'Loading...') => window.loadingManager.show(text);
    window.hideLoading = () => window.loadingManager.hide();

    // Enhanced error handling
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        window.toastManager.error('An unexpected error occurred. Please try again.');
    });

    // Enhanced unhandled promise rejection handling
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        window.toastManager.error('An unexpected error occurred. Please try again.');
    });

    console.log('AQE Platform UI initialized successfully');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ToastManager,
        LoadingManager,
        MobileNavManager,
        DashboardManager,
        FormManager,
        AnimationManager
    };
}
