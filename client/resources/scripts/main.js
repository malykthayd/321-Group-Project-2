// Main JavaScript file for AQE Platform
// Vanilla ES6+ JavaScript with DOM manipulation

class AQEPlatform {
  constructor() {
    this.currentUser = null;
    this.currentLanguage = 'en';
    this.isDarkMode = false;
    this.notifications = [];
    this.translations = {};
    
    this.init();
  }

  // Initialize the application
  init() {
    this.loadDarkModePreference();
    this.loadTranslations();
    this.setupEventListeners();
    this.loadUserData();
    this.updateUI();
    this.initializeSearch();
  }
  
  // Load dark mode preference from localStorage
  loadDarkModePreference() {
    const savedDarkMode = localStorage.getItem('darkMode');
    this.isDarkMode = savedDarkMode === 'true';
    this.applyTheme();
  }

  // Load translation data
  async loadTranslations() {
    try {
      // In a real app, this would fetch from an API
      this.translations = {
        en: {
          header: {
            welcome: 'Accessible Quality Education',
            welcomeSubtitle: 'Welcome to your learning platform!',
            searchPlaceholder: 'Search lessons...'
          },
          user: {
            guest: 'Guest User',
            role: 'guest'
          },
          navigation: {
            dashboard: 'Dashboard',
            lessons: 'Lessons',
            library: 'Library',
            admin: 'Admin Panel'
          }
        },
        es: {
          header: {
            welcome: 'Educación de Calidad Accesible',
            welcomeSubtitle: '¡Bienvenido a tu plataforma de aprendizaje!',
            searchPlaceholder: 'Buscar lecciones...'
          },
          user: {
            guest: 'Usuario Invitado',
            role: 'invitado'
          },
          navigation: {
            dashboard: 'Panel de Control',
            lessons: 'Lecciones',
            library: 'Biblioteca',
            admin: 'Panel de Administración'
          }
        }
        // Add more languages as needed
      };
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  // Setup event listeners
  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
    }

    // Library search
    const librarySearch = document.getElementById('librarySearch');
    if (librarySearch) {
      librarySearch.addEventListener('input', this.debounce(this.handleLibrarySearch.bind(this), 300));
    }

    // Tab switching
    const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabButtons.forEach(button => {
      button.addEventListener('shown.bs.tab', this.handleTabSwitch.bind(this));
    });

    // Mobile menu toggle
    document.addEventListener('click', this.handleMobileMenuClick.bind(this));

    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
  }

  // Load user data
  loadUserData() {
    // Check if user is already logged in via AuthManager
    if (window.authManager && window.authManager.currentUser) {
      this.currentUser = window.authManager.currentUser;
    } else {
      // Default guest user
      this.currentUser = {
        id: null,
        name: 'Guest User',
        role: null, // No role selected initially
        email: null,
        preferences: {
          language: 'en',
          darkMode: false
        }
      };
    }

    // Update user interface
    this.updateUserInterface();
  }

  // Update user interface
  updateUserInterface() {
    const userFullName = document.getElementById('userFullName');
    const userRole = document.getElementById('userRole');

    if (userFullName) {
      userFullName.textContent = this.currentUser.name || 'Guest User';
    }

    if (userRole) {
      userRole.textContent = this.currentUser.role || 'No role selected';
    }

    // Update dropdown menu based on login status
    this.updateUserDropdown();

    // Show/hide admin tab based on user role
    const adminTab = document.getElementById('adminTab');
    const adminMobileTab = document.getElementById('adminMobileTab');
    
    if (this.currentUser.role === 'admin') {
      if (adminTab) adminTab.classList.remove('d-none');
      if (adminMobileTab) adminMobileTab.classList.remove('d-none');
    } else {
      if (adminTab) adminTab.classList.add('d-none');
      if (adminMobileTab) adminMobileTab.classList.add('d-none');
    }

    // Show/hide student metrics based on user role
    this.updateRoleBasedVisibility();

    // Initialize role-specific managers
    if (this.currentUser.role === 'teacher' && !window.teacherManager) {
      setTimeout(() => {
        if (window.TeacherManager) {
          window.teacherManager = new TeacherManager();
        }
      }, 100);
    } else if (this.currentUser.role === 'student' && !window.studentManager) {
      setTimeout(() => {
        if (window.StudentManager) {
          window.studentManager = new StudentManager();
        }
      }, 100);
    } else if (this.currentUser.role === 'parent' && !window.parentManager) {
      setTimeout(() => {
        if (window.ParentManager) {
          window.parentManager = new ParentManager();
        }
      }, 100);
    } else if (this.currentUser.role === 'admin' && !window.adminManager) {
      setTimeout(() => {
        if (window.AdminManager) {
          window.adminManager = new AdminManager();
        }
      }, 100);
    }
  }

  // Update user dropdown menu
  updateUserDropdown() {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (dropdownMenu && this.currentUser.role) {
      // User is logged in
      dropdownMenu.innerHTML = `
        <li><span class="dropdown-item-text small text-muted">${this.currentUser.name}</span></li>
        <li><span class="dropdown-item-text small text-muted">${this.currentUser.role}</span></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#" onclick="showLoginModal()">Switch Account</a></li>
        <li><a class="dropdown-item" href="#" onclick="authManager.logout()">Logout</a></li>
      `;
    } else {
      // User is not logged in
      dropdownMenu.innerHTML = `
        <li><span class="dropdown-item-text small text-muted">Guest User</span></li>
        <li><span class="dropdown-item-text small text-muted">No role selected</span></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="#" onclick="showLoginModal()">Login</a></li>
      `;
    }
  }

  // Update role-based visibility
  updateRoleBasedVisibility() {
    const roleDashboard = document.getElementById('roleDashboard');
    
    // Hide all role-specific content first - be very explicit
    const studentDashboard = document.getElementById('studentDashboard');
    const teacherDashboard = document.getElementById('teacherDashboard');
    const parentDashboard = document.getElementById('parentDashboard');
    const adminDashboard = document.getElementById('adminDashboard');
    
    const studentTabs = document.getElementById('studentTabs');
    const teacherTabs = document.getElementById('teacherTabs');
    const parentTabs = document.getElementById('parentTabs');
    const adminTabs = document.getElementById('adminTabs');
    
    // Hide all dashboards
    [studentDashboard, teacherDashboard, parentDashboard, adminDashboard].forEach(el => {
      if (el) el.classList.remove('show');
    });
    
    // Hide all navigation tabs
    [studentTabs, teacherTabs, parentTabs, adminTabs].forEach(el => {
      if (el) el.classList.remove('show');
    });
    
    // Only show dashboard if a role is selected
    if (this.currentUser.role && roleDashboard) {
      roleDashboard.classList.add('show');
      
      // Show only the selected role's dashboard content
      const roleDashboardContent = document.getElementById(`${this.currentUser.role}Dashboard`);
      if (roleDashboardContent) {
        roleDashboardContent.classList.add('show');
      }
      
      // Show only the selected role's navigation tabs
      const roleNavigation = document.getElementById(`${this.currentUser.role}Tabs`);
      if (roleNavigation) {
        roleNavigation.classList.add('show');
      }
    } else {
      // Hide entire dashboard if no role selected
      if (roleDashboard) {
        roleDashboard.classList.remove('show');
      }
    }
    
    // Debug: Log what's being shown
    console.log('Current role:', this.currentUser.role);
    console.log('Student dashboard visible:', document.getElementById('studentDashboard')?.classList.contains('show'));
    console.log('Student tabs visible:', document.getElementById('studentTabs')?.classList.contains('show'));
  }

  // Update UI based on current state
  updateUI() {
    this.updateStats();
    this.updateRecentActivity();
    this.applyTheme();
  }

  // Update dashboard statistics
  updateStats() {
    // In a real app, this would fetch from an API
    const stats = {
      totalLessons: 24,
      completedLessons: 8,
      studyTime: '12h 30m',
      achievements: 3,
      totalBooks: 12,
      booksRead: 2,
      readingTime: '8h 15m',
      studyStreak: 5
    };

    // Update dashboard stats
    this.updateElement('totalLessons', stats.totalLessons);
    this.updateElement('completedLessons', stats.completedLessons);
    this.updateElement('studyTime', stats.studyTime);
    this.updateElement('achievements', stats.achievements);
    this.updateElement('studyStreak', stats.studyStreak);

    // Update library stats
    this.updateElement('totalBooks', stats.totalBooks);
    this.updateElement('booksRead', stats.booksRead);
    this.updateElement('readingTime', stats.readingTime);

    // Update progress indicators
    this.updateProgressIndicators();
  }

  // Update progress indicators
  updateProgressIndicators() {
    const progressElements = document.querySelectorAll('.metric-progress');
    if (progressElements.length >= 4) {
      progressElements[0].textContent = '8/24 completed';
      progressElements[1].textContent = '2/12 read';
      progressElements[2].textContent = 'Earned';
      progressElements[3].textContent = 'days';
    }
  }

  // Update recent activity
  updateRecentActivity() {
    const recentActivity = document.getElementById('recentActivity');
    if (!recentActivity) return;

    const activities = [
      {
        icon: 'bi-book',
        title: 'Started lesson: "Introduction to Mathematics"',
        time: '2 hours ago',
        color: 'primary'
      },
      {
        icon: 'bi-check',
        title: 'Completed quiz: "Basic Algebra"',
        time: '1 day ago',
        color: 'success'
      },
      {
        icon: 'bi-star',
        title: 'Earned achievement: "Math Beginner"',
        time: '2 days ago',
        color: 'warning'
      }
    ];

    recentActivity.innerHTML = activities.map(activity => `
      <div class="d-flex align-items-center gap-3 mb-3">
        <div class="bg-${activity.color} rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
          <i class="${activity.icon} text-white"></i>
        </div>
        <div class="flex-grow-1">
          <p class="mb-1">${activity.title}</p>
          <small class="text-muted">${activity.time}</small>
        </div>
      </div>
    `).join('');
  }

  // Initialize search functionality
  initializeSearch() {
    // Load sample lessons for search
    this.lessons = [
      { id: 1, title: 'Introduction to Mathematics', category: 'Math', difficulty: 'Beginner' },
      { id: 2, title: 'Basic Algebra', category: 'Math', difficulty: 'Intermediate' },
      { id: 3, title: 'World History', category: 'History', difficulty: 'Beginner' },
      { id: 4, title: 'Chemistry Basics', category: 'Science', difficulty: 'Intermediate' },
      { id: 5, title: 'English Grammar', category: 'Language', difficulty: 'Beginner' }
    ];
  }

  // Handle search input
  handleSearch(event) {
    const query = event.target.value.toLowerCase().trim();
    const searchResults = document.getElementById('searchResults');

    if (query.length < 2) {
      searchResults.classList.add('d-none');
      return;
    }

    const results = this.lessons.filter(lesson => 
      lesson.title.toLowerCase().includes(query) ||
      lesson.category.toLowerCase().includes(query)
    );

    this.displaySearchResults(results, searchResults);
  }

  // Display search results
  displaySearchResults(results, container) {
    if (results.length === 0) {
      container.innerHTML = '<div class="p-3 text-muted">No results found</div>';
    } else {
      container.innerHTML = results.map(lesson => `
        <div class="search-result-item" onclick="app.selectLesson(${lesson.id})">
          <div class="fw-bold">${lesson.title}</div>
          <small class="text-muted">${lesson.category} • ${lesson.difficulty}</small>
        </div>
      `).join('');
    }

    container.classList.remove('d-none');
  }

  // Handle library search
  handleLibrarySearch(event) {
    const query = event.target.value.toLowerCase().trim();
    // Implement library search logic
    console.log('Library search:', query);
  }

  // Handle tab switching
  handleTabSwitch(event) {
    const tabId = event.target.getAttribute('data-bs-target');
    console.log('Switched to tab:', tabId);

    // Load content for the active tab
    if (tabId === '#lessons-content') {
      this.loadLessons();
    } else if (tabId === '#library-content') {
      this.loadLibrary();
    } else if (tabId === '#admin-content') {
      this.loadAdminPanel();
    }
  }

  // Load lessons
  loadLessons() {
    const lessonsGrid = document.getElementById('lessonsGrid');
    if (!lessonsGrid) return;

    const lessons = [
      {
        id: 1,
        title: 'Introduction to Mathematics',
        description: 'Learn the basics of mathematics',
        category: 'Math',
        difficulty: 'Beginner',
        progress: 75,
        duration: '2 hours'
      },
      {
        id: 2,
        title: 'Basic Algebra',
        description: 'Master algebraic equations',
        category: 'Math',
        difficulty: 'Intermediate',
        progress: 100,
        duration: '3 hours'
      },
      {
        id: 3,
        title: 'World History',
        description: 'Explore world civilizations',
        category: 'History',
        difficulty: 'Beginner',
        progress: 25,
        duration: '4 hours'
      }
    ];

    lessonsGrid.innerHTML = lessons.map(lesson => `
      <div class="col-md-6 col-lg-4">
        <div class="card lesson-card h-100" onclick="app.selectLesson(${lesson.id})">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-primary">${lesson.category}</span>
              <span class="badge bg-secondary">${lesson.difficulty}</span>
            </div>
            <h6 class="card-title">${lesson.title}</h6>
            <p class="card-text small text-muted">${lesson.description}</p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">${lesson.duration}</small>
              <div class="lesson-progress" style="width: 60px;">
                <div class="lesson-progress-bar" style="width: ${lesson.progress}%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Load library
  loadLibrary() {
    const libraryGrid = document.getElementById('libraryGrid');
    if (!libraryGrid) return;

    const books = [
      {
        id: 1,
        title: 'Mathematics Fundamentals',
        author: 'John Smith',
        category: 'Math',
        pages: 250,
        read: true
      },
      {
        id: 2,
        title: 'History of the World',
        author: 'Jane Doe',
        category: 'History',
        pages: 400,
        read: false
      },
      {
        id: 3,
        title: 'Science Experiments',
        author: 'Bob Johnson',
        category: 'Science',
        pages: 180,
        read: true
      }
    ];

    libraryGrid.innerHTML = books.map(book => `
      <div class="col-md-6 col-lg-4">
        <div class="card library-item h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-primary">${book.category}</span>
              ${book.read ? '<span class="badge bg-success">Read</span>' : '<span class="badge bg-secondary">Unread</span>'}
            </div>
            <h6 class="card-title">${book.title}</h6>
            <p class="card-text small text-muted">by ${book.author}</p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">${book.pages} pages</small>
              <button class="btn btn-sm btn-outline-primary">Read</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Load admin panel
  loadAdminPanel() {
    console.log('Loading admin panel...');
    // Implement admin panel logic
  }

  // Select a lesson
  selectLesson(lessonId) {
    console.log('Selected lesson:', lessonId);
    // Implement lesson selection logic
    this.showNotification('Lesson selected: ' + this.lessons.find(l => l.id === lessonId)?.title);
  }

  // Handle mobile menu clicks
  handleMobileMenuClick(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && !mobileMenu.contains(event.target) && !event.target.closest('[data-bs-toggle="collapse"]')) {
      mobileMenu.classList.add('d-none');
    }
  }

  // Handle keyboard shortcuts
  handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + K for search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.focus();
      }
    }

    // Escape to close modals/panels
    if (event.key === 'Escape') {
      this.closeAllPanels();
    }
  }

  // Close all panels
  closeAllPanels() {
    const notificationPanel = document.getElementById('notificationPanel');
    const mobileMenu = document.getElementById('mobileMenu');
    const searchResults = document.getElementById('searchResults');

    if (notificationPanel) notificationPanel.classList.add('d-none');
    if (mobileMenu) mobileMenu.classList.add('d-none');
    if (searchResults) searchResults.classList.add('d-none');
  }

  // Apply theme
  applyTheme() {
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      document.body.setAttribute('data-theme', 'dark');
      // Update desktop icons
      document.getElementById('darkModeIcon')?.classList.remove('d-none');
      document.getElementById('lightModeIcon')?.classList.add('d-none');
      // Update mobile icons
      document.getElementById('mobileDarkModeIcon')?.classList.remove('d-none');
      document.getElementById('mobileLightModeIcon')?.classList.add('d-none');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.removeAttribute('data-bs-theme');
      document.body.removeAttribute('data-theme');
      // Update desktop icons
      document.getElementById('darkModeIcon')?.classList.add('d-none');
      document.getElementById('lightModeIcon')?.classList.remove('d-none');
      // Update mobile icons
      document.getElementById('mobileDarkModeIcon')?.classList.add('d-none');
      document.getElementById('mobileLightModeIcon')?.classList.remove('d-none');
    }
  }

  // Show notification
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 1060; min-width: 300px;';
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  // Update element content
  updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = content;
    }
  }

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Global functions for HTML onclick handlers
// Notification functionality removed - no longer needed

function toggleDarkMode() {
  app.isDarkMode = !app.isDarkMode;
  app.applyTheme();
  localStorage.setItem('darkMode', app.isDarkMode);
}

function changeLanguage(language) {
  // Use the translation manager if available
  if (window.translationManager) {
    window.translationManager.changeLanguage(language);
  } else if (window.AQETranslations) {
    window.AQETranslations.changeLanguage(language);
  } else {
    // Fallback for legacy code
    app.currentLanguage = language;
    if (app.updateTranslations) {
      app.updateTranslations();
    }
    localStorage.setItem('language', language);
    localStorage.setItem('aqe_language', language);
    localStorage.setItem('preferredLanguage', language);
  }
  
  // Update both desktop and mobile selectors
  const desktopSelect = document.getElementById('languageSelect');
  const mobileSelect = document.getElementById('mobileLanguageSelect');
  if (desktopSelect) desktopSelect.value = language;
  if (mobileSelect) mobileSelect.value = language;
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) {
    menu.classList.toggle('d-none');
  }
}

function goToTab(tabName) {
  const tabButton = document.querySelector(`[data-bs-target="#${tabName}-content"]`);
  if (tabButton) {
    tabButton.click();
  }
}

function showProfile() {
  app.showNotification('Profile functionality coming soon!');
}

function showSettings() {
  app.showNotification('Settings functionality coming soon!');
}

function logout() {
  app.showNotification('Logout functionality coming soon!');
}

function showAboutModal() {
  app.showNotification('About modal functionality coming soon!');
}

// These functions are now handled by the AuthManager
// Role selection and login are integrated into the authentication system

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait for AuthManager to be initialized first
  setTimeout(() => {
    window.app = new AQEPlatform();
  }, 100);
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AQEPlatform;
}
