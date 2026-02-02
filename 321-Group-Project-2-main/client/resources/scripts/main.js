// Main JavaScript file for AQE Platform
// Vanilla ES6+ JavaScript with DOM manipulation

class AQEPlatform {
  constructor() {
    this.currentUser = null;
    this.currentLanguage = 'en';
    this.isDarkMode = false;
    this.notifications = [];
    this.translations = {};
    this.apiBaseUrl = window.AQEConfig.getApiBaseUrl();
    
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
            admin: 'Practice Materials'
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
    // Get user data from unified auth system
    if (window.auth && window.auth.currentUser) {
      this.currentUser = window.auth.currentUser;
      console.log('User data loaded from auth system:', this.currentUser.name);
    } else {
      // Default guest user
      this.setGuestUser();
    }

    // Update user interface
    this.updateUserInterface();
  }

  // Set guest user
  setGuestUser() {
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

  // Validate and refresh session
  async validateSession() {
    if (!this.currentUser || !this.currentUser.id) {
      return false;
    }

    try {
      // Check if user session is still valid by making a simple API call
      const response = await fetch(`${this.apiBaseUrl}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.currentUser.id}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return true;
      } else {
        // Session invalid, clear it
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('Session validation error:', error);
      // If API is down, keep the session for offline use
      return true;
    }
  }

  // Enhanced logout method
  logout() {
    this.currentUser = null;
    localStorage.removeItem('aqe_user');
    
    // Reset UI to guest state
    this.setGuestUser();
    this.updateUserInterface();
    this.updateRoleBasedVisibility();
    
    // Show login modal
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
    
    console.log('User logged out');
  }

  // Update user interface
  updateUserInterface() {
    const userFullName = document.getElementById('userFullName');
    const userRole = document.getElementById('userRole');
    const userRoleDisplay = document.getElementById('userRoleDisplay');

    if (userFullName) {
      userFullName.textContent = this.currentUser.name || 'Guest User';
    }

    if (userRole) {
      userRole.textContent = this.currentUser.role || 'No role selected';
    }

    if (userRoleDisplay) {
      userRoleDisplay.textContent = this.currentUser.role || 'No role selected';
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
          // Update practice materials visibility based on student type
          if (window.studentManager.updatePracticeMaterialsVisibility) {
            window.studentManager.updatePracticeMaterialsVisibility();
          }
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
        <li><a class="dropdown-item" href="#" onclick="logout()">Logout</a></li>
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
    const mainTabContent = document.getElementById('mainTabContent');
    const mainNavigationTabs = document.getElementById('mainNavigationTabs');
    
    // Hide all role-specific content first
    const studentDashboard = document.getElementById('studentDashboard');
    const teacherDashboard = document.getElementById('teacherDashboard');
    const parentDashboard = document.getElementById('parentDashboard');
    const adminDashboard = document.getElementById('adminDashboard');
    
    const studentTabs = document.getElementById('studentTabs');
    const teacherTabs = document.getElementById('teacherTabs');
    const parentTabs = document.getElementById('parentTabs');
    const adminTabs = document.getElementById('adminTabs');
    
    // Hide all dashboards and tabs
    [studentDashboard, teacherDashboard, parentDashboard, adminDashboard].forEach(el => {
      if (el) {
        el.style.display = 'none';
        el.classList.remove('show', 'd-block');
      }
    });
    
    [studentTabs, teacherTabs, parentTabs, adminTabs].forEach(el => {
      if (el) {
        el.style.display = 'none';
        el.classList.remove('show', 'd-block');
      }
    });
    
    // Hide main navigation tabs
    if (mainNavigationTabs) {
      mainNavigationTabs.style.display = 'none';
    }
    
    // Show role dashboard if user is logged in
    if (this.currentUser && this.currentUser.role && roleDashboard) {
      roleDashboard.style.display = 'block';
      roleDashboard.classList.add('show');
      
      // Show the selected role's dashboard content
      const roleDashboardContent = document.getElementById(`${this.currentUser.role}Dashboard`);
      if (roleDashboardContent) {
        roleDashboardContent.style.display = 'block';
        roleDashboardContent.classList.add('show', 'd-block');
      }
      
      // Show the selected role's navigation tabs
      const roleNavigation = document.getElementById(`${this.currentUser.role}Tabs`);
      if (roleNavigation) {
        roleNavigation.style.display = 'flex';
        roleNavigation.classList.add('show', 'd-block');
      }
      
      // Hide the main content and navigation when showing role dashboard
      if (mainTabContent) {
        mainTabContent.style.display = 'none';
      }
      
      // Hide main navigation tabs when user is logged in
      const mainNavTabs = document.querySelectorAll('.nav-pills:not([id*="Tabs"])');
      mainNavTabs.forEach(tab => {
        if (!tab.id.includes('studentTabs') && !tab.id.includes('teacherTabs') && 
            !tab.id.includes('parentTabs') && !tab.id.includes('adminTabs')) {
          tab.style.display = 'none';
        }
      });
      
      // Load role-specific data
      this.loadRoleSpecificData();
    } else {
      // Hide role dashboard if no user logged in
      if (roleDashboard) {
        roleDashboard.style.display = 'none';
        roleDashboard.classList.remove('show');
      }
      
      // Show main content when no user logged in
      if (mainTabContent) {
        mainTabContent.style.display = 'block';
      }
      
      // Show main navigation tabs when no user logged in
      if (mainNavigationTabs) {
        mainNavigationTabs.style.display = 'block';
      }
    }
    
    // Debug: Log what's being shown
    console.log('Current role:', this.currentUser?.role);
    console.log('Role dashboard visible:', roleDashboard?.style.display);
    console.log('Student dashboard visible:', studentDashboard?.style.display);
    console.log('Student tabs visible:', studentTabs?.style.display);
    console.log('Admin dashboard visible:', adminDashboard?.style.display);
    console.log('Admin tabs visible:', adminTabs?.style.display);
    
    // Additional debugging for admin role
    if (this.currentUser?.role === 'admin') {
      console.log('Admin user detected, checking elements...');
      console.log('Admin dashboard element:', adminDashboard);
      console.log('Admin tabs element:', adminTabs);
      console.log('Role dashboard element:', roleDashboard);
    }
  }

  // Load role-specific data from API
  async loadRoleSpecificData() {
    if (!this.currentUser || !this.currentUser.role) return;
    
    try {
      const role = this.currentUser.role;
      const userId = this.currentUser[`${role}Id`] || this.currentUser.id;
      
      if (role === 'student') {
        await this.loadStudentData(userId);
      } else if (role === 'teacher') {
        await this.loadTeacherData(userId);
      } else if (role === 'parent') {
        await this.loadParentData(userId);
      } else if (role === 'admin') {
        await this.loadAdminData(userId);
      }
    } catch (error) {
      console.error('Error loading role-specific data:', error);
    }
  }

  // Load student data
  async loadStudentData(studentId) {
    try {
      const response = await fetch(window.AQEConfig.getApiUrl(`student/${studentId}/dashboard`));
      const data = await response.json();
      
      if (response.ok) {
        // Update dashboard metrics
        this.updateElement('totalLessons', data.totalLessonsCompleted);
        this.updateElement('completedLessons', data.totalLessonsCompleted);
        this.updateElement('achievements', data.totalAssignedLessons);
        this.updateElement('studyStreak', data.totalCheckedOutLessons);
        
        // Load digital library
        await this.loadStudentDigitalLibrary(studentId);
        // Load my work
        await this.loadStudentMyWork(studentId);
        // Load practice materials
        await this.loadStudentPracticeMaterials(studentId);
      }
    } catch (error) {
      console.error('Error loading student data:', error);
    }
  }

  // Load student digital library
  async loadStudentDigitalLibrary(studentId) {
    try {
      const response = await fetch(window.AQEConfig.getApiUrl(`student/${studentId}/digital-library`));
      const data = await response.json();
      
      if (response.ok) {
        this.populateDigitalLibrary(data);
      }
    } catch (error) {
      console.error('Error loading digital library:', error);
    }
  }

  // Load student my work
  async loadStudentMyWork(studentId) {
    try {
      const response = await fetch(window.AQEConfig.getApiUrl(`student/${studentId}/my-work`));
      const data = await response.json();
      
      if (response.ok) {
        this.populateMyWork(data);
      }
    } catch (error) {
      console.error('Error loading my work:', error);
    }
  }

  // Populate digital library content
  populateDigitalLibrary(lessons) {
    const container = document.getElementById('student-digital-library-content');
    if (!container) return;
    
    if (lessons.length === 0) {
      container.innerHTML = '<div class="text-center py-5"><p class="text-muted">No lessons assigned yet.</p></div>';
      return;
    }
    
    container.innerHTML = lessons.map(lesson => `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${lesson.title}</h5>
            <p class="card-text">${lesson.description}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge bg-primary">${lesson.subject}</span>
              <span class="badge bg-secondary">${lesson.gradeLevel}</span>
            </div>
            <div class="mt-3">
              <button class="btn btn-primary btn-sm" onclick="checkoutLesson(${lesson.id})">
                <i class="bi bi-download me-1"></i>Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Populate my work content
  populateMyWork(work) {
    const container = document.getElementById('student-my-work-content');
    if (!container) return;
    
    if (work.length === 0) {
      container.innerHTML = '<div class="text-center py-5"><p class="text-muted">No work assigned yet.</p></div>';
      return;
    }
    
    container.innerHTML = work.map(item => `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text">${item.subject}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge bg-${item.status === 'completed' ? 'success' : item.status === 'in_progress' ? 'warning' : 'secondary'}">${item.status}</span>
              ${item.score ? `<span class="badge bg-info">Score: ${item.score}</span>` : ''}
            </div>
            <div class="mt-3">
              <button class="btn btn-${item.status === 'completed' ? 'outline-success' : 'primary'} btn-sm" onclick="viewWork(${item.id})">
                <i class="bi bi-eye me-1"></i>${item.status === 'completed' ? 'View' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Load student practice materials
  async loadStudentPracticeMaterials(studentId) {
    try {
      const response = await fetch(window.AQEConfig.getApiUrl(`student/${studentId}/practice-materials`));
      const data = await response.json();
      
      if (response.ok) {
        this.populateStudentPracticeMaterials(data);
        console.log('Student practice materials loaded:', data);
      }
    } catch (error) {
      console.error('Error loading student practice materials:', error);
    }
  }

  // Populate student practice materials
  populateStudentPracticeMaterials(materials) {
    const container = document.getElementById('studentPracticeMaterialsList');
    if (!container) return;

    if (materials.length === 0) {
      container.innerHTML = `
        <div class="text-center text-muted py-4">
          <i class="bi bi-clipboard-check" style="font-size: 3rem;"></i>
          <p class="mt-3 mb-0">No practice materials assigned</p>
          <p class="small">Your teacher will assign practice materials for you to complete.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = materials.map(material => `
      <div class="card mb-3">
        <div class="card-header d-flex justify-content-between align-items-center">
          <div>
            <h6 class="card-title mb-0">${material.title}</h6>
            <small class="text-muted">${material.subject} • ${material.totalQuestions} questions</small>
          </div>
          <div>
            <span class="badge ${material.status === 'completed' ? 'bg-success' : material.status === 'in_progress' ? 'bg-warning' : 'bg-secondary'}">
              ${material.status === 'completed' ? 'Completed' : material.status === 'in_progress' ? 'In Progress' : 'Not Started'}
            </span>
          </div>
        </div>
        <div class="card-body">
          <p class="card-text">${material.description || 'No description provided'}</p>
          <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">
              Assigned: ${new Date(material.assignedAt).toLocaleDateString()}
              ${material.score ? ` • Score: ${material.score}%` : ''}
            </small>
            <button class="btn btn-primary btn-sm" onclick="window.app.startPracticeMaterial(${material.materialId})">
              <i class="bi bi-play-circle me-1"></i>
              ${material.status === 'completed' ? 'Review' : material.status === 'in_progress' ? 'Continue' : 'Start'}
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Start practice material
  startPracticeMaterial(materialId) {
    // This would open a modal or navigate to the practice material interface
    alert(`Starting practice material ${materialId}. This would open the practice interface with questions.`);
  }

  // Load teacher data
  async loadTeacherData(teacherId) {
    try {
      // Load dashboard metrics
      const dashboardResponse = await fetch(window.AQEConfig.getApiUrl(`teacher/${teacherId}/dashboard`));
      const dashboardData = await dashboardResponse.json();
      
      if (dashboardResponse.ok) {
        // Update teacher dashboard metrics
        this.updateTeacherDashboardMetrics(dashboardData);
        console.log('Teacher dashboard data loaded:', dashboardData);
      }

      // Load practice materials
      await this.loadTeacherPracticeMaterials(teacherId);

      // Load digital library
      await this.loadTeacherDigitalLibrary(teacherId);

    } catch (error) {
      console.error('Error loading teacher data:', error);
    }
  }

  // Update teacher dashboard metrics
  updateTeacherDashboardMetrics(data) {
    // Update the metrics cards
    const totalStudents = document.getElementById('totalStudents');
    const totalPracticeMaterials = document.getElementById('totalPracticeMaterials');
    const avgScore = document.getElementById('avgScore');
    const completedAssignments = document.getElementById('completedAssignments');

    if (totalStudents) totalStudents.textContent = data.studentsCount || 0;
    if (totalPracticeMaterials) totalPracticeMaterials.textContent = data.practiceMaterialsCount || 0;
    if (avgScore) avgScore.textContent = `${Math.round(data.averageScore || 0)}%`;
    if (completedAssignments) completedAssignments.textContent = data.completedAssignments || 0;
  }

  // Load teacher practice materials
  async loadTeacherPracticeMaterials(teacherId) {
    try {
      const response = await fetch(window.AQEConfig.getApiUrl(`teacher/${teacherId}/practice-materials`));
      const data = await response.json();
      
      if (response.ok) {
        this.populateTeacherPracticeMaterials(data);
        console.log('Teacher practice materials loaded:', data);
      }
    } catch (error) {
      console.error('Error loading teacher practice materials:', error);
    }
  }

  // Populate teacher practice materials grid
  populateTeacherPracticeMaterials(materials) {
    const grid = document.getElementById('practiceMaterialsGrid');
    if (!grid) return;

    if (materials.length === 0) {
      grid.innerHTML = `
        <div class="col-12">
          <div class="text-center text-muted py-4">
            <i class="bi bi-clipboard-x" style="font-size: 3rem;"></i>
            <h5 class="mt-3">No Practice Materials Created</h5>
            <p>Create your first practice material using the "Create Practice Materials" tab.</p>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = materials.map(material => `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <h6 class="card-title">${material.title}</h6>
            <p class="card-text text-muted small">${material.description || 'No description'}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge bg-primary">${material.subject}</span>
              <small class="text-muted">${material.questionCount} questions</small>
            </div>
          </div>
          <div class="card-footer bg-transparent">
            <div class="btn-group w-100" role="group">
              <button class="btn btn-outline-primary btn-sm" onclick="window.app.editPracticeMaterial(${material.id})">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-outline-success btn-sm" onclick="window.app.assignPracticeMaterial(${material.id})">
                <i class="bi bi-send"></i> Assign
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Load teacher digital library
  async loadTeacherDigitalLibrary(teacherId) {
    try {
      const response = await fetch(window.AQEConfig.getApiUrl(`teacher/${teacherId}/digital-library`));
      const data = await response.json();
      
      if (response.ok) {
        this.populateTeacherDigitalLibrary(data);
        console.log('Teacher digital library loaded:', data);
      }
    } catch (error) {
      console.error('Error loading teacher digital library:', error);
    }
  }

  // Populate teacher digital library grid
  populateTeacherDigitalLibrary(libraryItems) {
    const grid = document.getElementById('digitalLibraryGrid');
    if (!grid) return;

    if (libraryItems.length === 0) {
      grid.innerHTML = `
        <div class="col-12">
          <div class="text-center text-muted py-4">
            <i class="bi bi-book" style="font-size: 3rem;"></i>
            <h5 class="mt-3">No Digital Library Items Available</h5>
            <p>Digital library items will appear here when administrators create content for your grade level.</p>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = libraryItems.map(item => `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <h6 class="card-title">${item.title}</h6>
            <p class="card-text text-muted small">${item.description || 'No description'}</p>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-secondary">${item.subject}</span>
              <span class="badge bg-info">Grade ${item.gradeLevel}</span>
            </div>
            <small class="text-muted">Created by: ${item.createdBy}</small>
          </div>
          <div class="card-footer bg-transparent">
            <div class="btn-group w-100" role="group">
              <button class="btn btn-outline-primary btn-sm" onclick="window.app.previewDigitalLibraryItem(${item.id})">
                <i class="bi bi-eye"></i> Preview
              </button>
              <button class="btn btn-outline-success btn-sm" onclick="window.app.assignDigitalLibraryItem(${item.id})">
                <i class="bi bi-send"></i> Assign
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Load parent data
  async loadParentData(parentId) {
    try {
      const response = await fetch(window.AQEConfig.getApiUrl(`parent/${parentId}/dashboard`));
      const data = await response.json();
      
      if (response.ok) {
        // Update parent dashboard metrics
        console.log('Parent data loaded:', data);
      }
    } catch (error) {
      console.error('Error loading parent data:', error);
    }
  }

  // Load admin data
  async loadAdminData(adminId) {
    try {
      const response = await fetch(window.AQEConfig.getApiUrl(`admin/${adminId}/dashboard`));
      const data = await response.json();
      
      if (response.ok) {
        // Update admin dashboard metrics
        this.updateAdminDashboardMetrics(data);
        console.log('Admin data loaded:', data);
      }

    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  }

  // Update admin dashboard metrics
  updateAdminDashboardMetrics(data) {
    // Update the metrics cards
    const totalUsers = document.getElementById('adminTotalUsers');
    const totalStudents = document.getElementById('adminTotalStudents');
    const systemHealth = document.getElementById('systemHealth');
    const revenue = document.getElementById('revenue');

    if (totalUsers) totalUsers.textContent = data.totalUsers || 0;
    if (totalStudents) totalStudents.textContent = data.totalStudents || 0;
    if (systemHealth) systemHealth.textContent = `${data.systemHealth || 99.8}%`;
    if (revenue) revenue.textContent = `$${data.revenue || 12.4}K`;
  }


  // Show ask question modal
  showAskQuestionModal() {
    if (!this.currentUser || this.currentUser.role !== 'teacher') {
      alert('Please login as a teacher to ask questions');
      return;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('askQuestionModal'));
    modal.show();
  }

  // Submit question
  async submitQuestion() {
    if (!this.currentUser || this.currentUser.role !== 'teacher') {
      alert('Please login as a teacher to ask questions');
      return;
    }

    const subject = document.getElementById('questionSubject').value.trim();
    const message = document.getElementById('questionMessage').value.trim();

    if (!subject || !message) {
      alert('Please fill in both subject and message fields');
      return;
    }

    const submitBtn = document.getElementById('submitQuestionBtn');
    const originalText = submitBtn.innerHTML;
    
    try {
      submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>Submitting...';
      submitBtn.disabled = true;

      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For now, just show a success message without storing in database
      alert('Your question has been submitted successfully! Our support team will respond within 24 hours.');
      
      // Clear the form
      document.getElementById('askQuestionForm').reset();
      
      // Close the modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('askQuestionModal'));
      modal.hide();
      
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('An error occurred while submitting your question. Please try again.');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  // Helper function to checkout a lesson
  async checkoutLesson(lessonId) {
    if (!this.currentUser || this.currentUser.role !== 'student') {
      alert('Please login as a student to checkout lessons');
      return;
    }
    
    try {
      const response = await fetch(window.AQEConfig.getApiUrl(`student/${this.currentUser.studentId}/checkout-lesson`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonId })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Lesson checked out successfully!');
        // Reload the digital library
        await this.loadStudentDigitalLibrary(this.currentUser.studentId);
        await this.loadStudentMyWork(this.currentUser.studentId);
      } else {
        alert(data.message || 'Error checking out lesson');
      }
    } catch (error) {
      console.error('Error checking out lesson:', error);
      alert('Error checking out lesson');
    }
  }

  // Helper function to view work
  viewWork(workId) {
    alert(`Viewing work item ${workId}. This would open the lesson/work interface.`);
  }

  // Add question to practice material form
  addQuestion() {
    const questionsContainer = document.getElementById('questionsContainer');
    if (!questionsContainer) return;

    const questionCount = questionsContainer.children.length + 1;
    const questionHtml = `
      <div class="question-form mb-3 p-3 border rounded" data-question-id="${questionCount}">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6 class="mb-0">Question ${questionCount}</h6>
          <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeQuestion(${questionCount})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <div class="mb-3">
          <label class="form-label">Question Text</label>
          <textarea class="form-control" name="questionText" rows="2" placeholder="Enter your question here..." required></textarea>
        </div>
        <div class="row g-2">
          <div class="col-md-6">
            <label class="form-label">Option A</label>
            <input type="text" class="form-control" name="optionA" placeholder="Option A" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Option B</label>
            <input type="text" class="form-control" name="optionB" placeholder="Option B" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Option C</label>
            <input type="text" class="form-control" name="optionC" placeholder="Option C" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Option D</label>
            <input type="text" class="form-control" name="optionD" placeholder="Option D" required>
          </div>
        </div>
        <div class="mt-3">
          <label class="form-label">Correct Answer</label>
          <select class="form-select" name="correctAnswer" required>
            <option value="">Select correct answer</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
      </div>
    `;
    
    questionsContainer.insertAdjacentHTML('beforeend', questionHtml);
  }

  // Remove question from practice material form
  removeQuestion(questionId) {
    const questionElement = document.querySelector(`[data-question-id="${questionId}"]`);
    if (questionElement) {
      questionElement.remove();
      // Renumber remaining questions
      this.renumberQuestions();
    }
  }

  // Renumber questions after removal
  renumberQuestions() {
    const questions = document.querySelectorAll('#questionsContainer .question-form');
    questions.forEach((question, index) => {
      const questionNumber = index + 1;
      question.setAttribute('data-question-id', questionNumber);
      question.querySelector('h6').textContent = `Question ${questionNumber}`;
      question.querySelector('button[onclick]').setAttribute('onclick', `removeQuestion(${questionNumber})`);
    });
  }

  // Create practice material
  async createPracticeMaterial() {
    if (!this.currentUser || this.currentUser.role !== 'teacher') {
      alert('Please login as a teacher to create practice materials');
      return;
    }

    const title = document.getElementById('materialTitle').value.trim();
    const subject = document.getElementById('materialSubject').value;
    const description = document.getElementById('materialDescription').value.trim();

    if (!title || !subject) {
      alert('Please fill in the title and subject fields');
      return;
    }

    // Collect questions
    const questions = this.collectQuestions();
    if (questions.length === 0) {
      alert('Please add at least one question to the practice material');
      return;
    }

    const submitBtn = document.querySelector('#createMaterialForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    try {
      submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>Creating...';
      submitBtn.disabled = true;

      const response = await fetch(window.AQEConfig.getApiUrl(`teacher/${this.currentUser.teacherId || this.currentUser.id}/practice-materials`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          subject: subject,
          description: description,
          questions: questions
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Practice material created successfully!');
        
        // Clear the form
        document.getElementById('createMaterialForm').reset();
        document.getElementById('questionsContainer').innerHTML = '';
        
        // Reload practice materials
        await this.loadTeacherPracticeMaterials(this.currentUser.teacherId || this.currentUser.id);
      } else {
        alert(`Error: ${data.message || 'Failed to create practice material'}`);
      }
    } catch (error) {
      console.error('Error creating practice material:', error);
      alert('An error occurred while creating the practice material. Please try again.');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  // Collect questions from the form
  collectQuestions() {
    const questions = [];
    const questionElements = document.querySelectorAll('#questionsContainer .question-form');
    
    questionElements.forEach((element, index) => {
      const questionText = element.querySelector('textarea[name="questionText"]').value.trim();
      const optionA = element.querySelector('input[name="optionA"]').value.trim();
      const optionB = element.querySelector('input[name="optionB"]').value.trim();
      const optionC = element.querySelector('input[name="optionC"]').value.trim();
      const optionD = element.querySelector('input[name="optionD"]').value.trim();
      const correctAnswer = element.querySelector('select[name="correctAnswer"]').value;

      if (questionText && optionA && optionB && optionC && optionD && correctAnswer) {
        questions.push({
          questionText: questionText,
          questionType: 'multiple-choice',
          options: [optionA, optionB, optionC, optionD],
          correctAnswer: correctAnswer
        });
      }
    });

    return questions;
  }

  // Ask teacher question (support system)
  askTeacherQuestion() {
    // Create a modal for asking questions
    const modalHtml = `
      <div class="modal fade" id="teacherQuestionModal" tabindex="-1" aria-labelledby="teacherQuestionModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="teacherQuestionModalLabel">
                <i class="bi bi-question-circle me-2"></i>Ask a Question
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="teacherQuestionForm">
                <div class="mb-3">
                  <label for="questionCategory" class="form-label">Category</label>
                  <select class="form-select" id="questionCategory" required>
                    <option value="">Select a category</option>
                    <option value="technical">Technical Support</option>
                    <option value="content">Content Creation</option>
                    <option value="student-management">Student Management</option>
                    <option value="assignments">Assignments & Grading</option>
                    <option value="platform">Platform Features</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="questionPriority" class="form-label">Priority</label>
                  <select class="form-select" id="questionPriority" required>
                    <option value="low">Low - General inquiry</option>
                    <option value="medium" selected>Medium - Need help with feature</option>
                    <option value="high">High - Urgent issue</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="questionSubject" class="form-label">Subject</label>
                  <input type="text" class="form-control" id="questionSubject" placeholder="Brief description of your question" required>
                </div>
                <div class="mb-3">
                  <label for="questionDescription" class="form-label">Detailed Description</label>
                  <textarea class="form-control" id="questionDescription" rows="4" placeholder="Please provide as much detail as possible about your question or issue..." required></textarea>
                </div>
                <div class="mb-3">
                  <label for="questionContact" class="form-label">Preferred Contact Method</label>
                  <select class="form-select" id="questionContact">
                    <option value="email" selected>Email (support@aqeducation.org)</option>
                    <option value="phone">Phone (+1-555-123-4567)</option>
                    <option value="platform">Platform Message</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" onclick="submitTeacherQuestion()">
                <i class="bi bi-send me-1"></i>Submit Question
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Remove existing modal if it exists
    const existingModal = document.getElementById('teacherQuestionModal');
    if (existingModal) {
      existingModal.remove();
    }

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('teacherQuestionModal'));
    modal.show();
  }

  // Submit teacher question
  submitTeacherQuestion() {
    const form = document.getElementById('teacherQuestionForm');
    const formData = new FormData(form);
    
    const questionData = {
      category: document.getElementById('questionCategory').value,
      priority: document.getElementById('questionPriority').value,
      subject: document.getElementById('questionSubject').value,
      description: document.getElementById('questionDescription').value,
      contactMethod: document.getElementById('questionContact').value,
      teacherId: this.currentUser?.teacherId || this.currentUser?.id,
      teacherName: this.currentUser?.name,
      teacherEmail: this.currentUser?.email,
      timestamp: new Date().toISOString()
    };

    // Validate form
    if (!questionData.category || !questionData.subject || !questionData.description) {
      alert('Please fill in all required fields.');
      return;
    }

    // Simulate question submission (in real app, this would go to API)
    console.log('Teacher question submitted:', questionData);
    
    // Show success message
    alert(`Thank you for your question! We'll get back to you via ${questionData.contactMethod === 'email' ? 'email' : questionData.contactMethod === 'phone' ? 'phone' : 'platform message'} within 24 hours.`);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('teacherQuestionModal'));
    modal.hide();
    
    // Reset form
    form.reset();
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
    // Lessons loaded from database via API
    this.lessons = [];
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

  // Edit practice material
  async editPracticeMaterial(materialId) {
    try {
      const teacherId = this.currentUser?.teacherId || this.currentUser?.id;
      if (!teacherId) {
        this.showNotification('Teacher ID not found', 'error');
        return;
      }

      // Fetch the practice material data
      const response = await fetch(`${this.apiBaseUrl}/teacher/${teacherId}/practice-materials/${materialId}`);
      const material = await response.json();

      if (!response.ok) {
        this.showNotification(material.message || 'Failed to load practice material', 'error');
        return;
      }

      // Populate the edit form
      this.populateEditPracticeMaterialForm(material);
      
      // Show the edit modal
      const editModal = new bootstrap.Modal(document.getElementById('editPracticeMaterialModal'));
      editModal.show();

    } catch (error) {
      console.error('Error loading practice material for edit:', error);
      this.showNotification('Error loading practice material', 'error');
    }
  }

  // Populate edit practice material form
  populateEditPracticeMaterialForm(material) {
    // Set basic information
    document.getElementById('editMaterialTitle').value = material.title;
    document.getElementById('editMaterialDescription').value = material.description;
    document.getElementById('editMaterialSubject').value = material.subject;

    // Store material ID for update
    document.getElementById('editPracticeMaterialModal').dataset.materialId = material.id;

    // Populate questions
    const questionsContainer = document.getElementById('editQuestionsContainer');
    questionsContainer.innerHTML = '';

    material.questions.forEach((question, index) => {
      const questionHtml = this.createEditQuestionHtml(question, index);
      questionsContainer.insertAdjacentHTML('beforeend', questionHtml);
    });

    // Update question count
    this.updateEditQuestionCount();
  }

  // Create HTML for editing a question
  createEditQuestionHtml(question, index) {
    return `
      <div class="question-item border rounded p-3 mb-3" data-question-index="${index}">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6 class="mb-0">Question ${index + 1}</h6>
          <button type="button" class="btn btn-outline-danger btn-sm" onclick="window.app.removeEditQuestion(${index})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
        
        <div class="mb-3">
          <label class="form-label">Question Text</label>
          <textarea class="form-control" name="editQuestionText" rows="2" required>${question.questionText}</textarea>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">Option A</label>
            <input type="text" class="form-control" name="editOptionA" value="${question.optionA || ''}" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Option B</label>
            <input type="text" class="form-control" name="editOptionB" value="${question.optionB || ''}" required>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">Option C</label>
            <input type="text" class="form-control" name="editOptionC" value="${question.optionC || ''}" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Option D</label>
            <input type="text" class="form-control" name="editOptionD" value="${question.optionD || ''}" required>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">Correct Answer</label>
            <select class="form-select" name="editCorrectAnswer" required>
              <option value="A" ${question.correctAnswer === 'A' ? 'selected' : ''}>A</option>
              <option value="B" ${question.correctAnswer === 'B' ? 'selected' : ''}>B</option>
              <option value="C" ${question.correctAnswer === 'C' ? 'selected' : ''}>C</option>
              <option value="D" ${question.correctAnswer === 'D' ? 'selected' : ''}>D</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Question Type</label>
            <select class="form-select" name="editQuestionType" required>
              <option value="0" ${question.type === 0 ? 'selected' : ''}>Multiple Choice</option>
              <option value="1" ${question.type === 1 ? 'selected' : ''}>Fill in the Blank</option>
              <option value="2" ${question.type === 2 ? 'selected' : ''}>True/False</option>
            </select>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Explanation</label>
          <textarea class="form-control" name="editExplanation" rows="2">${question.explanation || ''}</textarea>
        </div>
      </div>
    `;
  }

  // Remove question from edit form
  removeEditQuestion(index) {
    const questionItem = document.querySelector(`[data-question-index="${index}"]`);
    if (questionItem) {
      questionItem.remove();
      this.updateEditQuestionCount();
    }
  }

  // Update question count in edit form
  updateEditQuestionCount() {
    const questionCount = document.querySelectorAll('#editQuestionsContainer .question-item').length;
    document.getElementById('editQuestionCount').textContent = questionCount;
  }

  // Add new question to edit form
  addEditQuestion() {
    const questionsContainer = document.getElementById('editQuestionsContainer');
    const questionCount = document.querySelectorAll('#editQuestionsContainer .question-item').length;
    
    const newQuestion = {
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      type: 0,
      explanation: ''
    };

    const questionHtml = this.createEditQuestionHtml(newQuestion, questionCount);
    questionsContainer.insertAdjacentHTML('beforeend', questionHtml);
    this.updateEditQuestionCount();
  }

  // Update practice material
  async updatePracticeMaterial() {
    try {
      const teacherId = this.currentUser?.teacherId || this.currentUser?.id;
      const materialId = document.getElementById('editPracticeMaterialModal').dataset.materialId;

      if (!teacherId || !materialId) {
        this.showNotification('Missing teacher or material ID', 'error');
        return;
      }

      // Collect form data
      const title = document.getElementById('editMaterialTitle').value.trim();
      const description = document.getElementById('editMaterialDescription').value.trim();
      const subject = document.getElementById('editMaterialSubject').value.trim();

      if (!title || !description || !subject) {
        this.showNotification('Please fill in all required fields', 'error');
        return;
      }

      // Collect questions
      const questions = [];
      const questionItems = document.querySelectorAll('#editQuestionsContainer .question-item');
      
      if (questionItems.length === 0) {
        this.showNotification('Please add at least one question', 'error');
        return;
      }

      questionItems.forEach((item, index) => {
        const questionText = item.querySelector('[name="editQuestionText"]').value.trim();
        const optionA = item.querySelector('[name="editOptionA"]').value.trim();
        const optionB = item.querySelector('[name="editOptionB"]').value.trim();
        const optionC = item.querySelector('[name="editOptionC"]').value.trim();
        const optionD = item.querySelector('[name="editOptionD"]').value.trim();
        const correctAnswer = item.querySelector('[name="editCorrectAnswer"]').value;
        const type = item.querySelector('[name="editQuestionType"]').value;
        const explanation = item.querySelector('[name="editExplanation"]').value.trim();

        if (!questionText || !optionA || !optionB || !optionC || !optionD) {
          this.showNotification(`Please fill in all fields for question ${index + 1}`, 'error');
          return;
        }

        questions.push({
          questionText,
          optionA,
          optionB,
          optionC,
          optionD,
          correctAnswer,
          type: parseInt(type),
          explanation
        });
      });

      // Send update request
      const response = await fetch(`${this.apiBaseUrl}/teacher/${teacherId}/practice-materials/${materialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          subject,
          questions
        })
      });

      const result = await response.json();

      if (response.ok) {
        this.showNotification('Practice material updated successfully!', 'success');
        bootstrap.Modal.getInstance(document.getElementById('editPracticeMaterialModal')).hide();
        
        // Reload practice materials
        await this.loadTeacherPracticeMaterials(teacherId);
      } else {
        this.showNotification(result.message || 'Failed to update practice material', 'error');
      }

    } catch (error) {
      console.error('Error updating practice material:', error);
      this.showNotification('Error updating practice material', 'error');
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

  // Admin Course Management Methods
  async loadAdminCourseManagement() {
    try {
      // Load subjects and grades for filters
      await this.loadSubjectsAndGrades();
      
      // Load generated lessons
      await this.loadGeneratedLessons();
      
      // Load analytics
      await this.loadAdminAnalytics();
      
    } catch (error) {
      console.error('Error loading admin course management:', error);
      this.showNotification('Error loading course management data', 'error');
    }
  }

  async loadSubjectsAndGrades() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/admin/curriculum/subjects`);
      if (!response.ok) throw new Error('Failed to load subjects');
      const subjects = await response.json();

      const gradeResponse = await fetch(`${this.apiBaseUrl}/admin/curriculum/grades`);
      if (!gradeResponse.ok) throw new Error('Failed to load grades');
      const grades = await gradeResponse.json();

      // Populate subject filter
      const subjectFilter = document.getElementById('generateSubjectFilter');
      if (subjectFilter) {
        subjectFilter.innerHTML = '<option value="">All Subjects</option>';
        subjects.forEach(subject => {
          const option = document.createElement('option');
          option.value = subject.id;
          option.textContent = subject.name;
          subjectFilter.appendChild(option);
        });
      }

      // Populate grade filter
      const gradeFilter = document.getElementById('generateGradeFilter');
      if (gradeFilter) {
        gradeFilter.innerHTML = '<option value="">All Grades</option>';
        grades.forEach(grade => {
          const option = document.createElement('option');
          option.value = grade.id;
          option.textContent = grade.displayName;
          gradeFilter.appendChild(option);
        });
      }

    } catch (error) {
      console.error('Error loading subjects and grades:', error);
    }
  }

  async loadGeneratedLessons() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/admin/curriculum/lessons`);
      if (!response.ok) throw new Error('Failed to load lessons');
      const lessons = await response.json();

      const tbody = document.getElementById('generatedLessonsTableBody');
      if (!tbody) return;

      if (lessons.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No lessons generated yet</td></tr>';
        return;
      }

      tbody.innerHTML = '';
      lessons.forEach(lesson => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>
            <input type="checkbox" class="form-check-input lesson-checkbox" value="${lesson.id}" 
                   onchange="window.app.updatePublishButton()">
          </td>
          <td>${lesson.title}</td>
          <td>${lesson.subject?.name || 'N/A'}</td>
          <td>${lesson.grade?.displayName || 'N/A'}</td>
          <td><span class="badge ${lesson.difficultyTag === 'A' ? 'bg-success' : 'bg-warning'}">${lesson.difficultyTag}</span></td>
          <td><span class="badge ${lesson.status === 'published' ? 'bg-success' : 'bg-secondary'}">${lesson.status}</span></td>
          <td>${lesson.questions?.length || 0}</td>
          <td>${new Date(lesson.createdAt).toLocaleDateString()}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary" onclick="window.app.viewLesson(${lesson.id})">
              <i class="bi bi-eye"></i>
            </button>
          </td>
        `;
        tbody.appendChild(row);
      });

    } catch (error) {
      console.error('Error loading generated lessons:', error);
      const tbody = document.getElementById('generatedLessonsTableBody');
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-danger">Error loading lessons</td></tr>';
      }
    }
  }

  async loadAdminAnalytics() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/admin/curriculum/analytics`);
      if (!response.ok) throw new Error('Failed to load analytics');
      const analytics = await response.json();

      // Update metric cards
      document.getElementById('adminLessonsGenerated').textContent = analytics.lessonsGenerated || 0;
      document.getElementById('adminLessonsPublishedParent').textContent = analytics.lessonsPublishedParent || 0;
      document.getElementById('adminLessonsPublishedTeacher').textContent = analytics.lessonsPublishedTeacher || 0;
      document.getElementById('adminAssignmentsCreated').textContent = analytics.assignmentsCreated || 0;

    } catch (error) {
      console.error('Error loading admin analytics:', error);
    }
  }

  async generateLessons() {
    try {
      const subjectFilter = document.getElementById('generateSubjectFilter');
      const gradeFilter = document.getElementById('generateGradeFilter');
      const dryRunCheck = document.getElementById('dryRunCheck');

      const subjectIds = Array.from(subjectFilter.selectedOptions)
        .map(option => parseInt(option.value))
        .filter(id => !isNaN(id));

      const gradeIds = Array.from(gradeFilter.selectedOptions)
        .map(option => parseInt(option.value))
        .filter(id => !isNaN(id));

      const dryRun = dryRunCheck.checked;

      const requestBody = {
        subjectIds: subjectIds.length > 0 ? subjectIds : null,
        gradeIds: gradeIds.length > 0 ? gradeIds : null,
        dryRun: dryRun
      };

      this.showNotification('Generating lessons...', 'info');

      const response = await fetch(`${this.apiBaseUrl}/admin/curriculum/generate`, 
        window.auth.withAuthHeaders({
          method: 'POST',
          body: JSON.stringify(requestBody)
        })
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate lessons');
      }

      const result = await response.json();
      
      // Close modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('generateLessonsModal'));
      if (modal) modal.hide();

      // Show success message
      const message = dryRun 
        ? `Dry run completed: ${result.generatedLessons.length} lessons would be generated`
        : `Successfully generated ${result.generatedLessons.length} lessons`;
      
      this.showNotification(message, 'success');

      // Reload lessons table
      await this.loadGeneratedLessons();
      await this.loadAdminAnalytics();

    } catch (error) {
      console.error('Error generating lessons:', error);
      this.showNotification(`Error generating lessons: ${error.message}`, 'error');
    }
  }

  async publishLessons() {
    try {
      const selectedLessons = Array.from(document.querySelectorAll('.lesson-checkbox:checked'))
        .map(checkbox => parseInt(checkbox.value));

      if (selectedLessons.length === 0) {
        this.showNotification('Please select at least one lesson to publish', 'warning');
        return;
      }

      const targetLibrary = document.getElementById('publishTargetLibrary').value;
      if (!targetLibrary) {
        this.showNotification('Please select a target library', 'warning');
        return;
      }

      const requestBody = {
        lessonIds: selectedLessons,
        targetLibrary: targetLibrary,
        ownerIds: [], // For now, publish to all users of that role
        adminId: 1 // Assuming admin ID 1
      };

      this.showNotification('Publishing lessons...', 'info');

      const response = await fetch(`${this.apiBaseUrl}/admin/curriculum/publish`, 
        window.auth.withAuthHeaders({
          method: 'POST',
          body: JSON.stringify(requestBody)
        })
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to publish lessons');
      }

      const result = await response.json();
      
      // Close modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('publishLessonsModal'));
      if (modal) modal.hide();

      // Show success message
      this.showNotification(`Successfully published ${result.lessonsPublished} lessons`, 'success');

      // Reload data
      await this.loadGeneratedLessons();
      await this.loadAdminAnalytics();

    } catch (error) {
      console.error('Error publishing lessons:', error);
      this.showNotification(`Error publishing lessons: ${error.message}`, 'error');
    }
  }

  updatePublishButton() {
    const selectedLessons = document.querySelectorAll('.lesson-checkbox:checked').length;
    const publishBtn = document.getElementById('publishLessonsBtn');
    
    if (publishBtn) {
      publishBtn.disabled = selectedLessons === 0;
    }

    // Update selected lessons list in publish modal
    const selectedLessonsList = document.getElementById('selectedLessonsList');
    if (selectedLessonsList) {
      if (selectedLessons === 0) {
        selectedLessonsList.innerHTML = '<p class="text-muted mb-0">No lessons selected</p>';
      } else {
        selectedLessonsList.innerHTML = `<p class="text-primary mb-0">${selectedLessons} lesson(s) selected</p>`;
      }
    }
  }

  async viewLesson(lessonId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/admin/curriculum/lessons/${lessonId}`);
      if (!response.ok) throw new Error('Failed to load lesson details');
      
      const lesson = await response.json();
      
      // Create a simple modal to display lesson details
      const modalHtml = `
        <div class="modal fade" id="viewLessonModal" tabindex="-1">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">${lesson.title}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <div class="row mb-3">
                  <div class="col-md-6">
                    <strong>Subject:</strong> ${lesson.subject?.name || 'N/A'}
                  </div>
                  <div class="col-md-6">
                    <strong>Grade:</strong> ${lesson.grade?.displayName || 'N/A'}
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-md-6">
                    <strong>Difficulty:</strong> <span class="badge ${lesson.difficultyTag === 'A' ? 'bg-success' : 'bg-warning'}">${lesson.difficultyTag}</span>
                  </div>
                  <div class="col-md-6">
                    <strong>Status:</strong> <span class="badge ${lesson.status === 'published' ? 'bg-success' : 'bg-secondary'}">${lesson.status}</span>
                  </div>
                </div>
                <div class="mb-3">
                  <strong>Description:</strong><br>
                  ${lesson.description || 'No description available'}
                </div>
                <div class="mb-3">
                  <strong>Questions (${lesson.questions?.length || 0}):</strong>
                  <div class="mt-2">
                    ${lesson.questions?.map((q, index) => `
                      <div class="card mb-2">
                        <div class="card-body">
                          <h6>Question ${index + 1}</h6>
                          <p>${q.prompt}</p>
                          <div class="row">
                            ${JSON.parse(q.choicesJson).map((choice, i) => `
                              <div class="col-md-6 mb-1">
                                <span class="badge ${i === q.answerIndex ? 'bg-success' : 'bg-secondary'}">${String.fromCharCode(65 + i)}. ${choice}</span>
                              </div>
                            `).join('')}
                          </div>
                        </div>
                      </div>
                    `).join('') || '<p class="text-muted">No questions available</p>'}
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Remove existing modal if any
      const existingModal = document.getElementById('viewLessonModal');
      if (existingModal) existingModal.remove();

      // Add modal to DOM
      document.body.insertAdjacentHTML('beforeend', modalHtml);

      // Show modal
      const modal = new bootstrap.Modal(document.getElementById('viewLessonModal'));
      modal.show();

    } catch (error) {
      console.error('Error viewing lesson:', error);
      this.showNotification('Error loading lesson details', 'error');
    }
  }

  filterLessons(status) {
    const rows = document.querySelectorAll('#generatedLessonsTableBody tr');
    rows.forEach(row => {
      if (status === 'all') {
        row.style.display = '';
      } else {
        const statusBadge = row.querySelector('.badge');
        const isMatch = statusBadge && statusBadge.textContent.toLowerCase() === status.toLowerCase();
        row.style.display = isMatch ? '' : 'none';
      }
    });
  }

  toggleAllLessons(checkbox) {
    const lessonCheckboxes = document.querySelectorAll('.lesson-checkbox');
    lessonCheckboxes.forEach(cb => {
      cb.checked = checkbox.checked;
    });
    this.updatePublishButton();
  }

  // Teacher/Parent Library Methods
  async loadTeacherLibrary() {
    try {
      const teacherId = this.currentUser?.id;
      if (!teacherId) {
        console.error('No teacher ID available');
        return;
      }

      const response = await fetch(`${this.apiBaseUrl}/library/teacher/${teacherId}`);
      if (!response.ok) throw new Error('Failed to load teacher library');
      const lessons = await response.json();

      this.populateLibraryGrid('teacherLibraryGrid', lessons, 'teacher');
      this.populateLibraryFilters('teacherSubjectFilter', 'teacherGradeFilter', lessons);

    } catch (error) {
      console.error('Error loading teacher library:', error);
      this.showNotification('Error loading library', 'error');
    }
  }

  async loadParentLibrary() {
    try {
      const parentId = this.currentUser?.id;
      if (!parentId) {
        console.error('No parent ID available');
        return;
      }

      const response = await fetch(`${this.apiBaseUrl}/library/parent/${parentId}`);
      if (!response.ok) throw new Error('Failed to load parent library');
      const lessons = await response.json();

      this.populateLibraryGrid('parentLibraryGrid', lessons, 'parent');
      this.populateLibraryFilters('parentSubjectFilter', 'parentGradeFilter', lessons);

    } catch (error) {
      console.error('Error loading parent library:', error);
      this.showNotification('Error loading library', 'error');
    }
  }

  populateLibraryGrid(gridId, lessons, role) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    if (lessons.length === 0) {
      grid.innerHTML = `
        <div class="col-12 text-center">
          <div class="card">
            <div class="card-body">
              <i class="bi bi-book text-muted" style="font-size: 3rem;"></i>
              <h5 class="mt-3 text-muted">No lessons available</h5>
              <p class="text-muted">Lessons will appear here once they are published by administrators.</p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = '';
    lessons.forEach(lesson => {
      const card = document.createElement('div');
      card.className = 'col-md-6 col-lg-4';
      card.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h6 class="card-title">${lesson.title}</h6>
              <span class="badge ${lesson.difficultyTag === 'A' ? 'bg-success' : 'bg-warning'}">${lesson.difficultyTag}</span>
            </div>
            <p class="card-text text-muted small">${lesson.description || 'No description available'}</p>
            <div class="row small text-muted mb-3">
              <div class="col-6">
                <strong>Subject:</strong><br>${lesson.subject?.name || 'N/A'}
              </div>
              <div class="col-6">
                <strong>Grade:</strong><br>${lesson.grade?.displayName || 'N/A'}
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">${lesson.questions?.length || 0} questions</small>
              <button class="btn btn-primary btn-sm" onclick="window.app.showAssignLessonModal(${lesson.id}, '${role}')">
                <i class="bi bi-person-plus me-1"></i>Assign
              </button>
            </div>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  populateLibraryFilters(subjectFilterId, gradeFilterId, lessons) {
    // Populate subject filter
    const subjectFilter = document.getElementById(subjectFilterId);
    if (subjectFilter) {
      const subjects = [...new Set(lessons.map(l => l.subject?.name).filter(Boolean))];
      subjectFilter.innerHTML = '<option value="">All Subjects</option>';
      subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectFilter.appendChild(option);
      });
    }

    // Populate grade filter
    const gradeFilter = document.getElementById(gradeFilterId);
    if (gradeFilter) {
      const grades = [...new Set(lessons.map(l => l.grade?.displayName).filter(Boolean))];
      gradeFilter.innerHTML = '<option value="">All Grades</option>';
      grades.forEach(grade => {
        const option = document.createElement('option');
        option.value = grade;
        option.textContent = grade;
        gradeFilter.appendChild(option);
      });
    }
  }

  filterTeacherLibrary() {
    this.filterLibrary('teacherLibraryGrid', 'teacherSubjectFilter', 'teacherGradeFilter', 'teacherDifficultyFilter', 'teacherSearchFilter');
  }

  filterParentLibrary() {
    this.filterLibrary('parentLibraryGrid', 'parentSubjectFilter', 'parentGradeFilter', 'parentDifficultyFilter', 'parentSearchFilter');
  }

  filterLibrary(gridId, subjectFilterId, gradeFilterId, difficultyFilterId, searchFilterId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    const subjectFilter = document.getElementById(subjectFilterId)?.value || '';
    const gradeFilter = document.getElementById(gradeFilterId)?.value || '';
    const difficultyFilter = document.getElementById(difficultyFilterId)?.value || '';
    const searchFilter = document.getElementById(searchFilterId)?.value.toLowerCase() || '';

    const cards = grid.querySelectorAll('.col-md-6, .col-lg-4');
    cards.forEach(card => {
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const description = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
      const subject = card.querySelector('.row .col-6:first-child')?.textContent.toLowerCase() || '';
      const grade = card.querySelector('.row .col-6:last-child')?.textContent.toLowerCase() || '';
      const difficulty = card.querySelector('.badge')?.textContent || '';

      const matchesSubject = !subjectFilter || subject.includes(subjectFilter.toLowerCase());
      const matchesGrade = !gradeFilter || grade.includes(gradeFilter.toLowerCase());
      const matchesDifficulty = !difficultyFilter || difficulty === difficultyFilter;
      const matchesSearch = !searchFilter || title.includes(searchFilter) || description.includes(searchFilter);

      if (matchesSubject && matchesGrade && matchesDifficulty && matchesSearch) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  async showAssignLessonModal(lessonId, role) {
    try {
      // Load lesson details
      const response = await fetch(`${this.apiBaseUrl}/curriculum/lessons/${lessonId}`);
      if (!response.ok) throw new Error('Failed to load lesson details');
      const lesson = await response.json();

      // Populate lesson details in modal
      document.getElementById('assignLessonTitle').textContent = lesson.title;
      document.getElementById('assignLessonDescription').textContent = lesson.description || 'No description available';
      document.getElementById('assignLessonSubject').textContent = lesson.subject?.name || 'N/A';
      document.getElementById('assignLessonGrade').textContent = lesson.grade?.displayName || 'N/A';
      document.getElementById('assignLessonDifficulty').textContent = lesson.difficultyTag;

      // Set minimum date to today
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('dueDate').min = today;

      // Load assignees based on role
      await this.loadAssignees(role, lessonId);

      // Store current lesson and role for assignment
      this.currentAssignmentLesson = lesson;
      this.currentAssignmentRole = role;

      // Show modal
      const modal = new bootstrap.Modal(document.getElementById('assignLessonModal'));
      modal.show();

    } catch (error) {
      console.error('Error showing assign lesson modal:', error);
      this.showNotification('Error loading lesson details', 'error');
    }
  }

  async loadAssignees(role, lessonId) {
    try {
      const assigneeList = document.getElementById('assigneeList');
      if (!assigneeList) return;

      const userId = this.currentUser?.id;
      if (!userId) {
        console.error('No user ID available');
        return;
      }

      let response;
      if (role === 'teacher') {
        response = await fetch(`${this.apiBaseUrl}/library/teacher/${userId}/students`);
      } else if (role === 'parent') {
        response = await fetch(`${this.apiBaseUrl}/library/parent/${userId}/children`);
      } else {
        throw new Error('Invalid role for assignment');
      }

      if (!response.ok) throw new Error('Failed to load assignees');
      const assignees = await response.json();

      if (assignees.length === 0) {
        assigneeList.innerHTML = `
          <div class="text-center text-muted">
            <i class="bi bi-person-x" style="font-size: 2rem;"></i>
            <p class="mt-2">No ${role === 'teacher' ? 'students' : 'children'} available for assignment</p>
          </div>
        `;
        return;
      }

      assigneeList.innerHTML = '';
      assignees.forEach(assignee => {
        const checkbox = document.createElement('div');
        checkbox.className = 'form-check mb-2';
        checkbox.innerHTML = `
          <input class="form-check-input assignee-checkbox" type="checkbox" value="${assignee.id}" id="assignee_${assignee.id}">
          <label class="form-check-label" for="assignee_${assignee.id}">
            <strong>${assignee.name}</strong>
            <small class="text-muted d-block">Grade: ${assignee.gradeLevel || 'N/A'}</small>
          </label>
        `;
        assigneeList.appendChild(checkbox);
      });

    } catch (error) {
      console.error('Error loading assignees:', error);
      const assigneeList = document.getElementById('assigneeList');
      if (assigneeList) {
        assigneeList.innerHTML = `
          <div class="text-center text-danger">
            <i class="bi bi-exclamation-triangle" style="font-size: 2rem;"></i>
            <p class="mt-2">Error loading ${this.currentAssignmentRole === 'teacher' ? 'students' : 'children'}</p>
          </div>
        `;
      }
    }
  }

  async assignLesson() {
    try {
      const selectedAssignees = Array.from(document.querySelectorAll('.assignee-checkbox:checked'))
        .map(checkbox => parseInt(checkbox.value));

      if (selectedAssignees.length === 0) {
        this.showNotification('Please select at least one student/child to assign the lesson to', 'warning');
        return;
      }

      const dueDate = document.getElementById('dueDate').value;

      const requestBody = {
        lessonId: this.currentAssignmentLesson.id,
        assigneeType: this.currentAssignmentRole === 'teacher' ? 'class' : 'student',
        assigneeIds: selectedAssignees,
        assignedByRole: this.currentAssignmentRole === 'teacher' ? 'teacher' : 'parent',
        assignedById: this.currentUser?.id,
        dueAt: dueDate ? new Date(dueDate).toISOString() : null
      };

      this.showNotification('Assigning lesson...', 'info');

      const response = await fetch(`${this.apiBaseUrl}/assignments`, 
        window.auth.withAuthHeaders({
          method: 'POST',
          body: JSON.stringify(requestBody)
        })
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to assign lesson');
      }

      const result = await response.json();
      
      // Close modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('assignLessonModal'));
      if (modal) modal.hide();

      // Show success message
      this.showNotification(`Successfully assigned lesson to ${selectedAssignees.length} ${this.currentAssignmentRole === 'teacher' ? 'students' : 'children'}`, 'success');

      // Clear stored data
      this.currentAssignmentLesson = null;
      this.currentAssignmentRole = null;

    } catch (error) {
      console.error('Error assigning lesson:', error);
      this.showNotification(`Error assigning lesson: ${error.message}`, 'error');
    }
  }

  // Student Lesson Player Methods
  async loadStudentAssignments() {
    try {
      const studentId = this.currentUser?.id;
      if (!studentId) {
        console.error('No student ID available');
        return;
      }

      const response = await fetch(`${this.apiBaseUrl}/assignment/student/${studentId}`);
      if (!response.ok) throw new Error('Failed to load student assignments');
      const assignments = await response.json();

      this.populateStudentAssignments(assignments);
      this.populateStudentFilters(assignments);

    } catch (error) {
      console.error('Error loading student assignments:', error);
      this.showNotification('Error loading assignments', 'error');
    }
  }

  populateStudentAssignments(assignments) {
    const grid = document.getElementById('studentDigitalLibraryGrid');
    if (!grid) return;

    if (assignments.length === 0) {
      grid.innerHTML = `
        <div class="col-12 text-center">
          <div class="card">
            <div class="card-body">
              <i class="bi bi-book text-muted" style="font-size: 3rem;"></i>
              <h5 class="mt-3 text-muted">No assignments yet</h5>
              <p class="text-muted">Your teacher or parent will assign lessons for you to complete.</p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = '';
    assignments.forEach(assignment => {
      const card = document.createElement('div');
      card.className = 'col-md-6 col-lg-4';
      
      const status = this.getAssignmentStatus(assignment);
      const statusClass = this.getStatusClass(status);
      
      card.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h6 class="card-title">${assignment.generatedLesson?.title || 'Unknown Lesson'}</h6>
              <span class="badge ${statusClass}">${status}</span>
            </div>
            <p class="card-text text-muted small">${assignment.generatedLesson?.description || 'No description available'}</p>
            <div class="row small text-muted mb-3">
              <div class="col-6">
                <strong>Subject:</strong><br>${assignment.generatedLesson?.subject?.name || 'N/A'}
              </div>
              <div class="col-6">
                <strong>Grade:</strong><br>${assignment.generatedLesson?.grade?.displayName || 'N/A'}
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">
                ${assignment.dueAt ? `Due: ${new Date(assignment.dueAt).toLocaleDateString()}` : 'No due date'}
              </small>
              <button class="btn btn-primary btn-sm" onclick="window.app.startLesson(${assignment.id})" ${status === 'Completed' ? 'disabled' : ''}>
                <i class="bi bi-play-circle me-1"></i>${status === 'Completed' ? 'Completed' : 'Start'}
              </button>
            </div>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  populateStudentFilters(assignments) {
    // Populate subject filter
    const subjectFilter = document.getElementById('studentSubjectFilter');
    if (subjectFilter) {
      const subjects = [...new Set(assignments.map(a => a.generatedLesson?.subject?.name).filter(Boolean))];
      subjectFilter.innerHTML = '<option value="">All Subjects</option>';
      subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectFilter.appendChild(option);
      });
    }
  }

  getAssignmentStatus(assignment) {
    if (assignment.attempts && assignment.attempts.length > 0) {
      const latestAttempt = assignment.attempts[assignment.attempts.length - 1];
      if (latestAttempt.submittedAt) {
        return 'Completed';
      } else {
        return 'In Progress';
      }
    }
    return 'Not Started';
  }

  getStatusClass(status) {
    switch (status) {
      case 'Completed': return 'bg-success';
      case 'In Progress': return 'bg-warning';
      case 'Not Started': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  filterStudentLibrary() {
    const grid = document.getElementById('studentDigitalLibraryGrid');
    if (!grid) return;

    const subjectFilter = document.getElementById('studentSubjectFilter')?.value || '';
    const assignerFilter = document.getElementById('studentAssignerFilter')?.value || '';
    const statusFilter = document.getElementById('studentStatusFilter')?.value || '';
    const searchFilter = document.getElementById('studentSearchFilter')?.value.toLowerCase() || '';

    const cards = grid.querySelectorAll('.col-md-6, .col-lg-4');
    cards.forEach(card => {
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const description = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
      const subject = card.querySelector('.row .col-6:first-child')?.textContent.toLowerCase() || '';
      const status = card.querySelector('.badge')?.textContent.toLowerCase() || '';

      const matchesSubject = !subjectFilter || subject.includes(subjectFilter.toLowerCase());
      const matchesStatus = !statusFilter || status.includes(statusFilter.toLowerCase());
      const matchesSearch = !searchFilter || title.includes(searchFilter) || description.includes(searchFilter);

      if (matchesSubject && matchesStatus && matchesSearch) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  async startLesson(assignmentId) {
    try {
      const studentId = this.currentUser?.id;
      if (!studentId) {
        console.error('No student ID available');
        return;
      }

      // Start attempt
      const startResponse = await fetch(`${this.apiBaseUrl}/attempt/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assignmentId: assignmentId,
          studentId: studentId
        })
      });

      if (!startResponse.ok) throw new Error('Failed to start lesson attempt');
      const attemptData = await startResponse.json();

      // Load lesson details
      const lessonResponse = await fetch(`${this.apiBaseUrl}/library/lesson/${attemptData.lessonId}`);
      if (!lessonResponse.ok) throw new Error('Failed to load lesson details');
      const lesson = await lessonResponse.json();

      // Initialize lesson player
      this.currentLesson = {
        attemptId: attemptData.attemptId,
        assignmentId: assignmentId,
        lessonId: attemptData.lessonId,
        questions: lesson.questions || [],
        currentQuestionIndex: 0,
        answers: new Array(lesson.questionsCount || 0).fill(null),
        startTime: new Date()
      };

      // Show lesson player modal
      const modal = new bootstrap.Modal(document.getElementById('lessonPlayerModal'));
      modal.show();

      // Load first question
      this.loadQuestion();

    } catch (error) {
      console.error('Error starting lesson:', error);
      this.showNotification('Error loading lesson', 'error');
    }
  }

  loadQuestion() {
    if (!this.currentLesson || !this.currentLesson.questions.length) return;

    const question = this.currentLesson.questions[this.currentLesson.currentQuestionIndex];
    const questionContent = document.getElementById('lessonQuestionContent');
    
    if (!questionContent) return;

    const choices = JSON.parse(question.choicesJson);
    const currentAnswer = this.currentLesson.answers[this.currentLesson.currentQuestionIndex];

    questionContent.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Question ${this.currentLesson.currentQuestionIndex + 1}</h5>
          <p class="card-text mb-4">${question.prompt}</p>
          
          <div class="row g-3">
            ${choices.map((choice, index) => `
              <div class="col-md-6">
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="questionAnswer" 
                         id="choice_${index}" value="${index}" 
                         ${currentAnswer === index ? 'checked' : ''}
                         onchange="window.app.selectAnswer(${index})">
                  <label class="form-check-label" for="choice_${index}">
                    <strong>${String.fromCharCode(65 + index)}.</strong> ${choice}
                  </label>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Update progress
    this.updateProgress();
    this.updateNavigationButtons();
  }

  selectAnswer(answerIndex) {
    if (!this.currentLesson) return;
    this.currentLesson.answers[this.currentLesson.currentQuestionIndex] = answerIndex;
  }

  updateProgress() {
    const progress = ((this.currentLesson.currentQuestionIndex + 1) / this.currentLesson.questions.length) * 100;
    document.getElementById('lessonProgressBar').style.width = `${progress}%`;
    document.getElementById('lessonProgress').textContent = `Question ${this.currentLesson.currentQuestionIndex + 1} of ${this.currentLesson.questions.length}`;
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById('prevQuestionBtn');
    const nextBtn = document.getElementById('nextQuestionBtn');
    const submitBtn = document.getElementById('submitLessonBtn');

    if (!prevBtn || !nextBtn || !submitBtn) return;

    // Previous button
    prevBtn.disabled = this.currentLesson.currentQuestionIndex === 0;

    // Next/Submit button
    const isLastQuestion = this.currentLesson.currentQuestionIndex === this.currentLesson.questions.length - 1;
    nextBtn.classList.toggle('d-none', isLastQuestion);
    submitBtn.classList.toggle('d-none', !isLastQuestion);
  }

  previousQuestion() {
    if (!this.currentLesson || this.currentLesson.currentQuestionIndex === 0) return;
    this.currentLesson.currentQuestionIndex--;
    this.loadQuestion();
  }

  nextQuestion() {
    if (!this.currentLesson || this.currentLesson.currentQuestionIndex >= this.currentLesson.questions.length - 1) return;
    this.currentLesson.currentQuestionIndex++;
    this.loadQuestion();
  }

  async submitLesson() {
    try {
      const studentId = this.currentUser?.id;
      if (!studentId) {
        console.error('No student ID available');
        return;
      }

      // Check if all questions are answered
      const unansweredQuestions = this.currentLesson.answers.filter(answer => answer === null);
      if (unansweredQuestions.length > 0) {
        this.showNotification('Please answer all questions before submitting', 'warning');
        return;
      }

      // Submit attempt
      const requestBody = {
        attemptId: this.currentLesson.attemptId,
        studentId: studentId,
        answers: this.currentLesson.answers
      };

      this.showNotification('Submitting lesson...', 'info');

      const response = await fetch(`${this.apiBaseUrl}/attempt/submit`, 
        window.auth.withAuthHeaders({
          method: 'POST',
          body: JSON.stringify(requestBody)
        })
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit lesson');
      }

      const result = await response.json();

      // Close lesson player
      const lessonModal = bootstrap.Modal.getInstance(document.getElementById('lessonPlayerModal'));
      if (lessonModal) lessonModal.hide();

      // Show results
      this.showLessonResults(result);

      // Reload assignments
      await this.loadStudentAssignments();

    } catch (error) {
      console.error('Error submitting lesson:', error);
      this.showNotification(`Error submitting lesson: ${error.message}`, 'error');
    }
  }

  showLessonResults(result) {
    // Update results modal
    document.getElementById('correctAnswers').textContent = result.correctCount;
    document.getElementById('wrongAnswers').textContent = result.wrongCount;
    document.getElementById('scorePercentage').textContent = `${result.scorePercent}%`;

    // Show results modal
    const modal = new bootstrap.Modal(document.getElementById('lessonResultsModal'));
    modal.show();
  }

  exitLessonPlayer() {
    if (confirm('Are you sure you want to exit the lesson? Your progress will be saved.')) {
      const modal = bootstrap.Modal.getInstance(document.getElementById('lessonPlayerModal'));
      if (modal) modal.hide();
      this.currentLesson = null;
    }
  }

  // Analytics Loading Methods
  async loadTeacherAnalytics() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/teacher/analytics`);
      if (!response.ok) throw new Error('Failed to load teacher analytics');
      const analytics = await response.json();

      // Update teacher analytics cards
      document.getElementById('teacherLessonsInLibrary').textContent = analytics.lessonsInLibrary || 0;
      document.getElementById('teacherAssignmentsCreated').textContent = analytics.assignmentsCreated || 0;
      document.getElementById('teacherStudentsAssigned').textContent = analytics.studentsAssigned || 0;
      document.getElementById('teacherAvgClassScore').textContent = `${analytics.avgClassScore || 0}%`;

    } catch (error) {
      console.error('Error loading teacher analytics:', error);
    }
  }

  async loadParentAnalytics() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/parent/analytics`);
      if (!response.ok) throw new Error('Failed to load parent analytics');
      const analytics = await response.json();

      // Update parent analytics cards
      document.getElementById('parentLessonsAvailable').textContent = analytics.lessonsAvailable || 0;
      document.getElementById('parentAssignmentsCreated').textContent = analytics.assignmentsCreated || 0;
      document.getElementById('parentChildAttempts').textContent = analytics.childAttempts || 0;
      document.getElementById('parentAvgScore').textContent = `${analytics.avgScore || 0}%`;

    } catch (error) {
      console.error('Error loading parent analytics:', error);
    }
  }

  async loadStudentAnalytics() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/student/analytics`);
      if (!response.ok) throw new Error('Failed to load student analytics');
      const analytics = await response.json();

      // Update student analytics cards
      document.getElementById('studentTotalLessonsAssigned').textContent = analytics.totalLessonsAssigned || 0;
      document.getElementById('studentLessonsCompleted').textContent = analytics.lessonsCompleted || 0;
      document.getElementById('studentCurrentStreak').textContent = analytics.currentStreak || 0;
      document.getElementById('studentAverageScore').textContent = `${analytics.averageScore || 0}%`;

    } catch (error) {
      console.error('Error loading student analytics:', error);
    }
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

// Admin Course Management Global Functions
function showGenerateLessonsModal() {
  const modal = new bootstrap.Modal(document.getElementById('generateLessonsModal'));
  modal.show();
}

function showPublishLessonsModal() {
  const modal = new bootstrap.Modal(document.getElementById('publishLessonsModal'));
  modal.show();
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Auth system is initialized in auth.js, so we can initialize immediately
  window.app = new AQEPlatform();
  
  // Listen for authentication changes
  window.addEventListener('userLogin', () => {
    if (window.app) {
      window.app.loadUserData();
      window.app.updateUserInterface();
      window.app.updateRoleBasedVisibility();
    }
  });

  // Listen for user logout
  window.addEventListener('userLogout', () => {
    if (window.app) {
      window.app.logout();
    }
  });
    
  // Make helper functions globally available
  window.checkoutLesson = (lessonId) => window.app.checkoutLesson(lessonId);
  window.viewWork = (workId) => window.app.viewWork(workId);
  window.addQuestion = () => window.app.addQuestion();
  window.askTeacherQuestion = () => window.app.askTeacherQuestion();
  window.showAskQuestionModal = () => window.app.showAskQuestionModal();
  window.startPracticeMaterial = (materialId) => window.app.startPracticeMaterial(materialId);
  
  // Add event listener for submit question button
  const submitQuestionBtn = document.getElementById('submitQuestionBtn');
  if (submitQuestionBtn) {
    submitQuestionBtn.addEventListener('click', () => window.app.submitQuestion());
  }

  // Add event listener for create material form
  const createMaterialForm = document.getElementById('createMaterialForm');
  if (createMaterialForm) {
    createMaterialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.app.createPracticeMaterial();
    });
  }
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AQEPlatform;
}
