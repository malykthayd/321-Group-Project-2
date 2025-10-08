/**
 * EduConnect - Digital Learning Platform
 * Main Application Controller
 * University of Alabama MIS 321 Group Project 2 (Fall 2025)
 */

class EduConnectApp {
  constructor() {
    this.currentUser = null;
    this.currentRole = null;
    this.isOnline = navigator.onLine;
    this.offlineData = this.loadOfflineData();
    
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      // Hide loading spinner
      this.hideLoading();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Check authentication status
      await this.checkAuthStatus();
      
      // Initialize offline sync
      this.initOfflineSync();
      
      // Render initial view
      this.renderCurrentView();
      
    } catch (error) {
      console.error('App initialization failed:', error);
      this.showError('Failed to initialize application');
    }
  }

  /**
   * Set up global event listeners
   */
  setupEventListeners() {
    // Online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.hideOfflineIndicator();
      this.syncOfflineData();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showOfflineIndicator();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        this.showHelp();
      }
    });
  }

  /**
   * Check user authentication status
   */
  async checkAuthStatus() {
    const token = localStorage.getItem('educonnect_token');
    if (token) {
      try {
        // In a real app, validate token with backend
        const userData = JSON.parse(localStorage.getItem('educonnect_user'));
        if (userData) {
          this.currentUser = userData;
          this.currentRole = userData.role;
          return true;
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        this.logout();
      }
    }
    return false;
  }

  /**
   * Render the current view based on authentication status
   */
  renderCurrentView() {
    const app = document.getElementById('app');
    
    if (this.currentUser) {
      this.renderDashboard();
    } else {
      this.renderLogin();
    }
  }

  /**
   * Render login page
   */
  renderLogin() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="min-vh-100 gradient-bg d-flex align-items-center">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-6 col-lg-5">
              <div class="card glass-effect shadow-lg border-0">
                <div class="card-body p-5">
                  <div class="text-center mb-4">
                    <i class="bi bi-mortarboard-fill text-primary" style="font-size: 3rem;"></i>
                    <h2 class="mt-3 mb-1">EduConnect</h2>
                    <p class="text-muted">Digital Learning Platform</p>
                    <small class="text-muted">Supporting UN SDG #4 - Quality Education</small>
                  </div>
                  
                  <form id="loginForm">
                    <div class="mb-3">
                      <label for="roleSelect" class="form-label">I am a...</label>
                      <select class="form-select" id="roleSelect" required>
                        <option value="">Select your role</option>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="parent">Parent</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                    
                    <div class="mb-3">
                      <label for="emailInput" class="form-label">Email</label>
                      <input type="email" class="form-control" id="emailInput" required>
                    </div>
                    
                    <div class="mb-3">
                      <label for="passwordInput" class="form-label">Password</label>
                      <input type="password" class="form-control" id="passwordInput" required>
                    </div>
                    
                    <div class="mb-3 form-check">
                      <input type="checkbox" class="form-check-input" id="rememberCheck">
                      <label class="form-check-label" for="rememberCheck">
                        Remember me
                      </label>
                    </div>
                    
                    <button type="submit" class="btn btn-primary w-100 mb-3">
                      <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
                    </button>
                    
                    <div class="text-center">
                      <small class="text-muted">
                        <a href="#" class="text-decoration-none">Forgot password?</a>
                      </small>
                    </div>
                  </form>
                </div>
              </div>
              
              <!-- Demo Credentials -->
              <div class="card mt-4 glass-effect">
                <div class="card-body">
                  <h6 class="card-title">Demo Credentials</h6>
                  <div class="row g-2">
                    <div class="col-6">
                      <button class="btn btn-outline-primary btn-sm w-100" onclick="app.demoLogin('student')">
                        <i class="bi bi-person me-1"></i>Student
                      </button>
                    </div>
                    <div class="col-6">
                      <button class="btn btn-outline-primary btn-sm w-100" onclick="app.demoLogin('teacher')">
                        <i class="bi bi-person-badge me-1"></i>Teacher
                      </button>
                    </div>
                    <div class="col-6">
                      <button class="btn btn-outline-primary btn-sm w-100" onclick="app.demoLogin('parent')">
                        <i class="bi bi-people me-1"></i>Parent
                      </button>
                    </div>
                    <div class="col-6">
                      <button class="btn btn-outline-primary btn-sm w-100" onclick="app.demoLogin('admin')">
                        <i class="bi bi-shield-check me-1"></i>Admin
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Set up login form handler
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleLogin();
    });
  }

  /**
   * Handle login form submission
   */
  async handleLogin() {
    const role = document.getElementById('roleSelect').value;
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    
    if (!role || !email || !password) {
      this.showError('Please fill in all fields');
      return;
    }
    
    try {
      // Simulate API call
      await this.simulateLogin(role, email, password);
      this.renderCurrentView();
    } catch (error) {
      this.showError('Login failed. Please try again.');
    }
  }

  /**
   * Demo login for different roles
   */
  async demoLogin(role) {
    const demoUsers = {
      student: { email: 'student@demo.com', password: 'demo123' },
      teacher: { email: 'teacher@demo.com', password: 'demo123' },
      parent: { email: 'parent@demo.com', password: 'demo123' },
      admin: { email: 'admin@demo.com', password: 'demo123' }
    };
    
    document.getElementById('roleSelect').value = role;
    document.getElementById('emailInput').value = demoUsers[role].email;
    document.getElementById('passwordInput').value = demoUsers[role].password;
    
    await this.handleLogin();
  }

  /**
   * Simulate login process
   */
  async simulateLogin(role, email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          email: email,
          role: role,
          name: this.getDemoName(role),
          avatar: this.getDemoAvatar(role),
          lastLogin: new Date().toISOString()
        };
        
        localStorage.setItem('educonnect_token', 'demo_token_' + Date.now());
        localStorage.setItem('educonnect_user', JSON.stringify(userData));
        
        this.currentUser = userData;
        this.currentRole = role;
        
        resolve(userData);
      }, 1000);
    });
  }

  /**
   * Get demo name for role
   */
  getDemoName(role) {
    const names = {
      student: 'Alex Johnson',
      teacher: 'Dr. Sarah Williams',
      parent: 'Michael Davis',
      admin: 'Jennifer Martinez'
    };
    return names[role] || 'Demo User';
  }

  /**
   * Get demo avatar for role
   */
  getDemoAvatar(role) {
    const avatars = {
      student: '👨‍🎓',
      teacher: '👩‍🏫',
      parent: '👨‍👩‍👧‍👦',
      admin: '👩‍💼'
    };
    return avatars[role] || '👤';
  }

  /**
   * Render dashboard based on user role
   */
  renderDashboard() {
    const app = document.getElementById('app');
    
    // Add role-specific theme class
    document.body.className = `${this.currentRole}-theme`;
    
    app.innerHTML = `
      <div class="min-vh-100">
        <!-- Navigation -->
        <nav class="navbar navbar-expand-lg navbar-dark gradient-bg shadow-sm">
          <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="#">
              <i class="bi bi-mortarboard-fill me-2"></i>
              EduConnect
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav me-auto">
                <li class="nav-item">
                  <a class="nav-link active" href="#" onclick="app.navigateTo('dashboard')">
                    <i class="bi bi-house-door me-1"></i>Dashboard
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#" onclick="app.navigateTo('lessons')">
                    <i class="bi bi-book me-1"></i>Lessons
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#" onclick="app.navigateTo('leaderboard')">
                    <i class="bi bi-trophy me-1"></i>Leaderboard
                  </a>
                </li>
                ${this.currentRole === 'teacher' ? `
                  <li class="nav-item">
                    <a class="nav-link" href="#" onclick="app.navigateTo('analytics')">
                      <i class="bi bi-graph-up me-1"></i>Analytics
                    </a>
                  </li>
                ` : ''}
                ${this.currentRole === 'admin' ? `
                  <li class="nav-item">
                    <a class="nav-link" href="#" onclick="app.navigateTo('admin')">
                      <i class="bi bi-gear me-1"></i>Admin
                    </a>
                  </li>
                ` : ''}
              </ul>
              
              <div class="d-flex align-items-center">
                <div class="me-3">
                  <span class="text-light me-2">${this.currentUser.avatar}</span>
                  <span class="text-light">${this.currentUser.name}</span>
                </div>
                <button class="btn btn-outline-light btn-sm" onclick="app.logout()">
                  <i class="bi bi-box-arrow-right me-1"></i>Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        <!-- Main Content -->
        <main class="container my-4">
          <div id="main-content" class="fade-in">
            <!-- Content will be loaded here -->
          </div>
        </main>
        
        <!-- Offline Indicator -->
        <div id="offline-indicator" class="offline-indicator">
          <i class="bi bi-wifi-off me-2"></i>Offline Mode
        </div>
      </div>
    `;
    
    // Load initial dashboard content
    this.navigateTo('dashboard');
  }

  /**
   * Navigate to different sections
   */
  navigateTo(section) {
    const mainContent = document.getElementById('main-content');
    
    switch (section) {
      case 'dashboard':
        this.renderDashboardContent();
        break;
      case 'lessons':
        this.renderLessonsPage();
        break;
      case 'leaderboard':
        this.renderLeaderboard();
        break;
      case 'analytics':
        this.renderAnalytics();
        break;
      case 'admin':
        this.renderAdminPanel();
        break;
      default:
        this.renderDashboardContent();
    }
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    if (event && event.target) {
      event.target.classList.add('active');
    }
  }

  /**
   * Render dashboard content based on user role
   */
  renderDashboardContent() {
    const mainContent = document.getElementById('main-content');
    
    if (window.DashboardManager) {
      const dashboardManager = new window.DashboardManager(this);
      dashboardManager.renderDashboardContent();
    } else {
      mainContent.innerHTML = `
        <div class="row">
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-body text-center py-5">
                <h3>Dashboard Loading...</h3>
                <p class="text-muted">Please wait while we load your dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  /**
   * Render lessons page
   */
  renderLessonsPage() {
    if (window.lessonManager) {
      window.lessonManager.renderLessonsPage();
    } else {
      const mainContent = document.getElementById('main-content');
      mainContent.innerHTML = `
        <div class="row">
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-body text-center py-5">
                <h3>Lessons Module Loading...</h3>
                <p class="text-muted">Please wait while we load the lessons.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  /**
   * Render leaderboard page
   */
  renderLeaderboard() {
    if (window.gamificationManager) {
      window.gamificationManager.renderLeaderboard();
    } else {
      const mainContent = document.getElementById('main-content');
      mainContent.innerHTML = `
        <div class="row">
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-body text-center py-5">
                <h3>Leaderboard Loading...</h3>
                <p class="text-muted">Please wait while we load the leaderboard.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  /**
   * Render analytics page (for teachers)
   */
  renderAnalytics() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
      <div class="row">
        <div class="col-12 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h2 class="mb-1">
                <i class="bi bi-graph-up text-primary me-2"></i>
                Analytics Dashboard
              </h2>
              <p class="text-muted mb-0">Track student performance and engagement metrics</p>
            </div>
          </div>
        </div>
        
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="text-center py-5">
                <i class="bi bi-bar-chart text-muted" style="font-size: 4rem;"></i>
                <h4 class="mt-3 mb-2">Analytics Coming Soon</h4>
                <p class="text-muted">Advanced analytics features will be available in the next update.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render admin panel
   */
  renderAdminPanel() {
    if (window.DashboardManager) {
      const dashboardManager = new window.DashboardManager(this);
      dashboardManager.renderAdminDashboard();
    } else {
      const mainContent = document.getElementById('main-content');
      mainContent.innerHTML = `
        <div class="row">
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-body text-center py-5">
                <h3>Admin Panel Loading...</h3>
                <p class="text-muted">Please wait while we load the admin panel.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('educonnect_token');
    localStorage.removeItem('educonnect_user');
    this.currentUser = null;
    this.currentRole = null;
    document.body.className = '';
    this.renderCurrentView();
  }

  /**
   * Show error message
   */
  showError(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-danger border-0';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
    
    document.body.appendChild(toast);
    new bootstrap.Toast(toast).show();
    
    setTimeout(() => toast.remove(), 5000);
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-success border-0';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
    
    document.body.appendChild(toast);
    new bootstrap.Toast(toast).show();
    
    setTimeout(() => toast.remove(), 5000);
  }

  /**
   * Hide loading spinner
   */
  hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.style.display = 'none';
    }
  }

  /**
   * Show offline indicator
   */
  showOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.style.display = 'block';
    }
  }

  /**
   * Hide offline indicator
   */
  hideOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }

  /**
   * Initialize offline sync
   */
  initOfflineSync() {
    // This will be implemented in offline-sync.js
    if (window.OfflineSync) {
      window.OfflineSync.init(this);
    }
  }

  /**
   * Load offline data from localStorage
   */
  loadOfflineData() {
    try {
      return JSON.parse(localStorage.getItem('educonnect_offline_data')) || {};
    } catch (error) {
      return {};
    }
  }

  /**
   * Sync offline data when coming back online
   */
  async syncOfflineData() {
    // This will be implemented in offline-sync.js
    if (window.OfflineSync) {
      await window.OfflineSync.syncWithServer();
    }
  }

  /**
   * Show help modal
   */
  showHelp() {
    // This will be implemented later
    console.log('Help requested');
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new EduConnectApp();
});
