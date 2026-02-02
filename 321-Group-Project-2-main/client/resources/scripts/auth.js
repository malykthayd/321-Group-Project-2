// Unified Authentication System for AQE Platform
// Single source of truth for all authentication logic

class Auth {
    constructor() {
        this.apiBaseUrl = window.AQEConfig?.getApiBaseUrl() || 'http://localhost:5001';
        this.sessionKey = 'aqe.session.v1';
        this.currentUser = null;
        this.token = null;
        
        // Initialize on construction
        this.hydrateSession();
        
        // Always start with landing page visible
        this.showLandingContent();
        this.hideRoleDashboard();
    }

    // Core authentication methods
    async login(role, credentials) {
        try {
            let endpoint, payload;
            
            if (role === 'student' && credentials.accessCode) {
                // Student access code login
                endpoint = '/api/auth/login-student-access-code';
                payload = {
                    name: credentials.name,
                    accessCode: credentials.accessCode
                };
            } else {
                // Standard email/password login
                endpoint = '/api/auth/login';
                payload = {
                    email: credentials.email,
                    password: credentials.password
                };
            }

            const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.user) {
                this.currentUser = data.user;
                this.token = this.generateToken(data.user);
                this.storeSession();
                this.updateUI();
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.message || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error during login' };
        }
    }

    logout() {
        this.currentUser = null;
        this.token = null;
        this.clearSession();
        this.updateUI();
        
        // Dispatch logout event
        window.dispatchEvent(new CustomEvent('userLogout'));
        
        // Route to landing page
        this.routeToLanding();
    }

    getSession() {
        return {
            user: this.currentUser,
            token: this.token,
            isAuthenticated: !!this.currentUser
        };
    }

    requireRole(allowedRoles) {
        if (!this.currentUser) {
            this.routeToLogin();
            return false;
        }
        
        if (!allowedRoles.includes(this.currentUser.role)) {
            this.routeToUnauthorized();
            return false;
        }
        
        return true;
    }

    withAuthHeaders(fetchArgs = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...fetchArgs.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return {
            ...fetchArgs,
            headers
        };
    }

    // Session management
    hydrateSession() {
        try {
            const sessionData = localStorage.getItem(this.sessionKey);
            if (sessionData) {
                const session = JSON.parse(sessionData);
                const sessionAge = Date.now() - session.timestamp;
                const maxAge = 24 * 60 * 60 * 1000; // 24 hours

                if (sessionAge < maxAge && session.user && session.user.id && session.user.role) {
                    this.currentUser = session.user;
                    this.token = session.token;
                    
                    // Don't immediately update UI - let user choose to login
                    // This ensures the landing page is always shown first
                    return true;
                } else {
                    this.clearSession();
                }
            }
        } catch (error) {
            console.error('Error hydrating session:', error);
            this.clearSession();
        }
        return false;
    }

    storeSession() {
        if (this.currentUser && this.token) {
            const sessionData = {
                user: this.currentUser,
                token: this.token,
                timestamp: Date.now()
            };
            localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
        }
    }

    clearSession() {
        localStorage.removeItem(this.sessionKey);
    }

    // UI and routing
    updateUI() {
        if (this.currentUser) {
            this.showRoleDashboard();
            this.hideLandingContent();
        } else {
            this.hideRoleDashboard();
            this.showLandingContent();
        }
    }

    // Method to login with existing session (called when user clicks login)
    loginWithExistingSession() {
        if (this.currentUser && this.token) {
            this.updateUI();
            return true;
        }
        return false;
    }

    showRoleDashboard() {
        const roleDashboard = document.getElementById('roleDashboard');
        if (roleDashboard) {
            roleDashboard.style.display = 'block';
            roleDashboard.classList.add('show');
        }

        // Hide ALL other role dashboards first
        const allRoleDashboards = ['studentDashboard', 'teacherDashboard', 'parentDashboard', 'adminDashboard'];
        allRoleDashboards.forEach(roleId => {
            const element = document.getElementById(roleId);
            if (element) {
                element.style.display = 'none';
                element.classList.remove('show');
            }
        });

        // Hide ALL other role navigation tabs first
        const allRoleTabs = ['studentTabs', 'teacherTabs', 'parentTabs', 'adminTabs'];
        allRoleTabs.forEach(tabId => {
            const element = document.getElementById(tabId);
            if (element) {
                element.style.display = 'none';
                element.classList.remove('show');
            }
        });

        // Show specific role content
        const roleContent = document.getElementById(`${this.currentUser.role}Dashboard`);
        if (roleContent) {
            roleContent.style.display = 'block';
            roleContent.classList.add('show');
        }

        // Show role navigation
        const roleNav = document.getElementById(`${this.currentUser.role}Tabs`);
        if (roleNav) {
            roleNav.style.display = 'flex';
            roleNav.style.flexDirection = 'row';
            roleNav.style.flexWrap = 'wrap';
            roleNav.classList.add('show');
        }
    }

    hideRoleDashboard() {
        const roleDashboard = document.getElementById('roleDashboard');
        if (roleDashboard) {
            roleDashboard.style.display = 'none';
            roleDashboard.classList.remove('show');
        }

        // Hide all role content
        ['student', 'teacher', 'parent', 'admin'].forEach(role => {
            const roleContent = document.getElementById(`${role}Dashboard`);
            if (roleContent) {
                roleContent.style.display = 'none';
                roleContent.classList.remove('show');
            }
            
            const roleNav = document.getElementById(`${role}Tabs`);
            if (roleNav) {
                roleNav.style.display = 'none';
                roleNav.classList.remove('show');
            }
        });
    }

    hideLandingContent() {
        const mainTabContent = document.getElementById('mainTabContent');
        if (mainTabContent) {
            mainTabContent.style.display = 'none';
        }

        const mainNavigationTabs = document.getElementById('mainNavigationTabs');
        if (mainNavigationTabs) {
            mainNavigationTabs.style.display = 'none';
        }

        // Hide marketing sections
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.display = 'none';
        }
    }

    showLandingContent() {
        const mainTabContent = document.getElementById('mainTabContent');
        if (mainTabContent) {
            mainTabContent.style.display = 'block';
        }

        const mainNavigationTabs = document.getElementById('mainNavigationTabs');
        if (mainNavigationTabs) {
            mainNavigationTabs.style.display = 'block';
        }

        // Show marketing sections
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.display = 'block';
        }
    }

    routeToLogin() {
        // Show login modal or redirect to login page
        this.showLoginModal();
    }

    routeToLanding() {
        // Scroll to top and show landing content
        window.scrollTo(0, 0);
        this.updateUI();
    }

    routeToUnauthorized() {
        console.warn('Unauthorized access attempt');
        this.logout();
    }

    showLoginModal() {
        // Trigger login modal display
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            const modal = new bootstrap.Modal(loginModal);
            modal.show();
        }
    }

    // Utility methods
    generateToken(user) {
        // Simple token generation (in production, this should be JWT from server)
        return btoa(JSON.stringify({
            id: user.id,
            role: user.role,
            timestamp: Date.now()
        }));
    }

    // Auth gate for protecting routes
    authGate(allowedRoles = []) {
        if (!this.currentUser) {
            this.routeToLogin();
            return false;
        }
        
        if (allowedRoles.length > 0 && !allowedRoles.includes(this.currentUser.role)) {
            this.routeToUnauthorized();
            return false;
        }
        
        return true;
    }

    // Demo account helpers
    async loginDemo(role) {
        const demoCredentials = {
            admin: { email: 'admin@demo.com', password: 'admin123' },
            teacher: { email: 'teacher@demo.com', password: 'teacher123' },
            parent: { email: 'parent@demo.com', password: 'parent123' },
            student: { email: 'student@demo.com', password: 'student123' }
        };

        const credentials = demoCredentials[role];
        if (!credentials) {
            return { success: false, error: 'Invalid demo role' };
        }

        return await this.login(role, credentials);
    }
}

// Global functions for HTML onclick handlers
function showLoginModal() {
    if (window.auth) {
        window.auth.showLoginModal();
    }
}

function showDemoAccounts() {
    // This will be handled by the login modal
    showLoginModal();
}

// Initialize global auth instance
window.auth = new Auth();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}