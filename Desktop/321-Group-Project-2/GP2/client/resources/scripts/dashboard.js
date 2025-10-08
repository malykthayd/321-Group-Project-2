/**
 * EduConnect - Dashboard Components
 * Role-specific dashboard rendering and management
 */

class DashboardManager {
  constructor(app) {
    this.app = app;
    this.sampleData = window.SampleData || {};
  }

  /**
   * Render dashboard content based on user role
   */
  renderDashboardContent() {
    const mainContent = document.getElementById('main-content');
    
    switch (this.app.currentRole) {
      case 'student':
        mainContent.innerHTML = this.renderStudentDashboard();
        break;
      case 'teacher':
        mainContent.innerHTML = this.renderTeacherDashboard();
        break;
      case 'parent':
        mainContent.innerHTML = this.renderParentDashboard();
        break;
      case 'admin':
        mainContent.innerHTML = this.renderAdminDashboard();
        break;
      default:
        mainContent.innerHTML = this.renderDefaultDashboard();
    }
    
    // Initialize dashboard components
    this.initializeDashboardComponents();
  }

  /**
   * Render student dashboard
   */
  renderStudentDashboard() {
    const progress = this.calculateStudentProgress();
    const recentLessons = this.getRecentLessons(3);
    const achievements = this.getRecentAchievements(3);
    
    return `
      <div class="row">
        <!-- Welcome Section -->
        <div class="col-12 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h2 class="mb-1">Welcome back, ${this.app.currentUser.name}! 👋</h2>
                  <p class="text-muted mb-0">Ready to continue your learning journey?</p>
                </div>
                <div class="col-md-4 text-end">
                  <div class="d-flex align-items-center justify-content-end">
                    <div class="me-3">
                      <h4 class="mb-0 text-primary">${this.app.currentUser.points || 1250}</h4>
                      <small class="text-muted">Total Points</small>
                    </div>
                    <div class="me-3">
                      <h4 class="mb-0 text-success">${this.app.currentUser.streak || 7}</h4>
                      <small class="text-muted">Day Streak</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Progress Overview -->
        <div class="col-lg-4 mb-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-transparent border-0">
              <h5 class="mb-0"><i class="bi bi-graph-up text-primary me-2"></i>Learning Progress</h5>
            </div>
            <div class="card-body text-center">
              <div class="progress-ring mx-auto mb-3">
                <svg class="progress-ring" width="80" height="80">
                  <circle class="progress-ring-circle" stroke-dashoffset="${251.2 - (progress.percentage * 2.512)}" 
                          cx="40" cy="40" r="36"></circle>
                </svg>
                <div class="position-absolute top-50 start-50 translate-middle">
                  <strong class="text-primary">${progress.percentage}%</strong>
                </div>
              </div>
              <h6 class="mb-1">${progress.completedLessons} of ${progress.totalLessons} lessons completed</h6>
              <p class="text-muted small mb-0">${progress.nextGoal}</p>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="col-lg-4 mb-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-transparent border-0">
              <h5 class="mb-0"><i class="bi bi-lightning text-warning me-2"></i>Quick Actions</h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-primary" onclick="app.navigateTo('lessons')">
                  <i class="bi bi-play-circle me-2"></i>Continue Learning
                </button>
                <button class="btn btn-outline-primary" onclick="app.navigateTo('lessons')">
                  <i class="bi bi-search me-2"></i>Explore Lessons
                </button>
                <button class="btn btn-outline-secondary" onclick="app.navigateTo('leaderboard')">
                  <i class="bi bi-trophy me-2"></i>View Leaderboard
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Recent Achievements -->
        <div class="col-lg-4 mb-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-transparent border-0">
              <h5 class="mb-0"><i class="bi bi-award text-success me-2"></i>Recent Achievements</h5>
            </div>
            <div class="card-body">
              ${achievements.map(badge => `
                <div class="d-flex align-items-center mb-3">
                  <div class="badge-earned bg-success text-white rounded-circle me-3" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                    ${badge.icon}
                  </div>
                  <div>
                    <h6 class="mb-0">${badge.name}</h6>
                    <small class="text-muted">${badge.description}</small>
                  </div>
                </div>
              `).join('')}
              <div class="text-center">
                <button class="btn btn-outline-success btn-sm" onclick="app.showAllAchievements()">
                  View All Achievements
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Recent Lessons -->
        <div class="col-12 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
              <h5 class="mb-0"><i class="bi bi-clock-history text-info me-2"></i>Recent Lessons</h5>
              <button class="btn btn-outline-primary btn-sm" onclick="app.navigateTo('lessons')">
                View All
              </button>
            </div>
            <div class="card-body">
              <div class="row">
                ${recentLessons.map(lesson => `
                  <div class="col-md-4 mb-3">
                    <div class="card lesson-card card-hover h-100">
                      <div class="card-img-top bg-gradient d-flex align-items-center justify-content-center text-white" 
                           style="background: ${lesson.color}; height: 120px;">
                        <i class="${lesson.icon}" style="font-size: 2rem;"></i>
                      </div>
                      <div class="card-body">
                        <h6 class="card-title">${lesson.title}</h6>
                        <p class="card-text small text-muted">${lesson.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                          <span class="badge bg-${lesson.difficulty === 'Easy' ? 'success' : lesson.difficulty === 'Medium' ? 'warning' : 'danger'}">
                            ${lesson.difficulty}
                          </span>
                          <small class="text-muted">${lesson.duration}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Learning Stats -->
        <div class="col-12">
          <div class="row">
            <div class="col-md-3 mb-3">
              <div class="card border-0 shadow-sm text-center">
                <div class="card-body">
                  <i class="bi bi-book text-primary mb-2" style="font-size: 2rem;"></i>
                  <h4 class="mb-0">${progress.completedLessons}</h4>
                  <small class="text-muted">Lessons Completed</small>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card border-0 shadow-sm text-center">
                <div class="card-body">
                  <i class="bi bi-clock text-info mb-2" style="font-size: 2rem;"></i>
                  <h4 class="mb-0">${this.app.currentUser.studyTime || '12h 30m'}</h4>
                  <small class="text-muted">Study Time</small>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card border-0 shadow-sm text-center">
                <div class="card-body">
                  <i class="bi bi-star text-warning mb-2" style="font-size: 2rem;"></i>
                  <h4 class="mb-0">${this.app.currentUser.accuracy || 87}%</h4>
                  <small class="text-muted">Accuracy</small>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card border-0 shadow-sm text-center">
                <div class="card-body">
                  <i class="bi bi-trophy text-success mb-2" style="font-size: 2rem;"></i>
                  <h4 class="mb-0">${achievements.length}</h4>
                  <small class="text-muted">Badges Earned</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render teacher dashboard
   */
  renderTeacherDashboard() {
    const classStats = this.getClassStats();
    const recentActivity = this.getRecentActivity(5);
    
    return `
      <div class="row">
        <!-- Header -->
        <div class="col-12 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h2 class="mb-1">Welcome, ${this.app.currentUser.name}! 👩‍🏫</h2>
                  <p class="text-muted mb-0">Monitor your students' progress and manage lessons</p>
                </div>
                <div class="col-md-4 text-end">
                  <button class="btn btn-primary" onclick="app.createNewLesson()">
                    <i class="bi bi-plus-circle me-2"></i>Create Lesson
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Class Overview -->
        <div class="col-lg-8 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0">
              <h5 class="mb-0"><i class="bi bi-people text-primary me-2"></i>Class Overview</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 text-center mb-3">
                  <h3 class="text-primary mb-0">${classStats.totalStudents}</h3>
                  <small class="text-muted">Total Students</small>
                </div>
                <div class="col-md-3 text-center mb-3">
                  <h3 class="text-success mb-0">${classStats.activeStudents}</h3>
                  <small class="text-muted">Active This Week</small>
                </div>
                <div class="col-md-3 text-center mb-3">
                  <h3 class="text-info mb-0">${classStats.avgProgress}%</h3>
                  <small class="text-muted">Avg Progress</small>
                </div>
                <div class="col-md-3 text-center mb-3">
                  <h3 class="text-warning mb-0">${classStats.completedLessons}</h3>
                  <small class="text-muted">Lessons Completed</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="col-lg-4 mb-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-transparent border-0">
              <h5 class="mb-0"><i class="bi bi-lightning text-warning me-2"></i>Quick Actions</h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-primary" onclick="app.navigateTo('analytics')">
                  <i class="bi bi-graph-up me-2"></i>View Analytics
                </button>
                <button class="btn btn-outline-primary" onclick="app.createAssignment()">
                  <i class="bi bi-plus-square me-2"></i>Create Assignment
                </button>
                <button class="btn btn-outline-secondary" onclick="app.viewStudents()">
                  <i class="bi bi-people me-2"></i>Manage Students
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Recent Activity -->
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0">
              <h5 class="mb-0"><i class="bi bi-clock-history text-info me-2"></i>Recent Activity</h5>
            </div>
            <div class="card-body">
              <div class="list-group list-group-flush">
                ${recentActivity.map(activity => `
                  <div class="list-group-item border-0 px-0">
                    <div class="d-flex align-items-center">
                      <div class="me-3">
                        <div class="bg-${activity.type === 'completion' ? 'success' : activity.type === 'assignment' ? 'primary' : 'info'} text-white rounded-circle d-flex align-items-center justify-content-center" 
                             style="width: 40px; height: 40px;">
                          <i class="bi bi-${activity.icon}"></i>
                        </div>
                      </div>
                      <div class="flex-grow-1">
                        <h6 class="mb-0">${activity.title}</h6>
                        <small class="text-muted">${activity.description}</small>
                      </div>
                      <div class="text-muted">
                        <small>${activity.time}</small>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render parent dashboard
   */
  renderParentDashboard() {
    const children = this.getChildrenData();
    
    return `
      <div class="row">
        <!-- Header -->
        <div class="col-12 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h2 class="mb-1">Welcome, ${this.app.currentUser.name}! 👨‍👩‍👧‍👦</h2>
                  <p class="text-muted mb-0">Track your children's learning progress</p>
                </div>
                <div class="col-md-4 text-end">
                  <button class="btn btn-primary" onclick="app.setupNotifications()">
                    <i class="bi bi-bell me-2"></i>Setup Notifications
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Children Overview -->
        <div class="col-12">
          ${children.map(child => `
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-transparent border-0">
                <div class="d-flex justify-content-between align-items-center">
                  <h5 class="mb-0">
                    <i class="bi bi-person-circle text-primary me-2"></i>
                    ${child.name} (${child.grade})
                  </h5>
                  <span class="badge bg-${child.status === 'active' ? 'success' : 'secondary'}">
                    ${child.status}
                  </span>
                </div>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-3 text-center mb-3">
                    <h4 class="text-primary mb-0">${child.progress}%</h4>
                    <small class="text-muted">Overall Progress</small>
                  </div>
                  <div class="col-md-3 text-center mb-3">
                    <h4 class="text-success mb-0">${child.completedLessons}</h4>
                    <small class="text-muted">Lessons Completed</small>
                  </div>
                  <div class="col-md-3 text-center mb-3">
                    <h4 class="text-info mb-0">${child.studyTime}</h4>
                    <small class="text-muted">Study Time</small>
                  </div>
                  <div class="col-md-3 text-center mb-3">
                    <h4 class="text-warning mb-0">${child.streak}</h4>
                    <small class="text-muted">Day Streak</small>
                  </div>
                </div>
                
                <!-- Progress Bar -->
                <div class="progress mb-3" style="height: 8px;">
                  <div class="progress-bar" style="width: ${child.progress}%"></div>
                </div>
                
                <!-- Recent Activity -->
                <div class="row">
                  <div class="col-md-8">
                    <h6>Recent Activity</h6>
                    <ul class="list-unstyled">
                      ${child.recentActivity.map(activity => `
                        <li class="mb-1">
                          <i class="bi bi-${activity.icon} text-${activity.color} me-2"></i>
                          <small>${activity.description}</small>
                          <span class="text-muted">- ${activity.time}</span>
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                  <div class="col-md-4 text-end">
                    <button class="btn btn-outline-primary btn-sm" onclick="app.viewChildDetails('${child.id}')">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render admin dashboard
   */
  renderAdminDashboard() {
    const systemStats = this.getSystemStats();
    
    return `
      <div class="row">
        <!-- Header -->
        <div class="col-12 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h2 class="mb-1">Admin Dashboard, ${this.app.currentUser.name}! 👩‍💼</h2>
                  <p class="text-muted mb-0">Manage the learning platform and monitor system health</p>
                </div>
                <div class="col-md-4 text-end">
                  <button class="btn btn-primary" onclick="app.manageUsers()">
                    <i class="bi bi-people me-2"></i>Manage Users
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- System Overview -->
        <div class="col-12 mb-4">
          <div class="row">
            <div class="col-md-3 mb-3">
              <div class="card border-0 shadow-sm text-center">
                <div class="card-body">
                  <i class="bi bi-people text-primary mb-2" style="font-size: 2rem;"></i>
                  <h4 class="mb-0">${systemStats.totalUsers}</h4>
                  <small class="text-muted">Total Users</small>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card border-0 shadow-sm text-center">
                <div class="card-body">
                  <i class="bi bi-book text-success mb-2" style="font-size: 2rem;"></i>
                  <h4 class="mb-0">${systemStats.totalLessons}</h4>
                  <small class="text-muted">Total Lessons</small>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card border-0 shadow-sm text-center">
                <div class="card-body">
                  <i class="bi bi-graph-up text-info mb-2" style="font-size: 2rem;"></i>
                  <h4 class="mb-0">${systemStats.avgEngagement}%</h4>
                  <small class="text-muted">Avg Engagement</small>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-3">
              <div class="card border-0 shadow-sm text-center">
                <div class="card-body">
                  <i class="bi bi-server text-warning mb-2" style="font-size: 2rem;"></i>
                  <h4 class="mb-0">${systemStats.systemHealth}%</h4>
                  <small class="text-muted">System Health</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="col-lg-6 mb-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-transparent border-0">
              <h5 class="mb-0"><i class="bi bi-gear text-primary me-2"></i>System Management</h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-primary" onclick="app.manageUsers()">
                  <i class="bi bi-people me-2"></i>User Management
                </button>
                <button class="btn btn-outline-primary" onclick="app.manageContent()">
                  <i class="bi bi-file-text me-2"></i>Content Management
                </button>
                <button class="btn btn-outline-secondary" onclick="app.systemSettings()">
                  <i class="bi bi-sliders me-2"></i>System Settings
                </button>
                <button class="btn btn-outline-info" onclick="app.viewReports()">
                  <i class="bi bi-graph-up me-2"></i>Analytics & Reports
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- System Status -->
        <div class="col-lg-6 mb-4">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-transparent border-0">
              <h5 class="mb-0"><i class="bi bi-activity text-success me-2"></i>System Status</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span>Database</span>
                  <span class="badge bg-success">Online</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span>API Server</span>
                  <span class="badge bg-success">Online</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span>File Storage</span>
                  <span class="badge bg-success">Online</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span>Email Service</span>
                  <span class="badge bg-warning">Limited</span>
                </div>
              </div>
              <div class="text-center">
                <button class="btn btn-outline-success btn-sm" onclick="app.viewSystemLogs()">
                  View System Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Initialize dashboard components
   */
  initializeDashboardComponents() {
    // Add any interactive functionality here
    console.log('Dashboard components initialized');
  }

  /**
   * Calculate student progress
   */
  calculateStudentProgress() {
    return {
      percentage: 68,
      completedLessons: 17,
      totalLessons: 25,
      nextGoal: 'Complete 3 more lessons to unlock advanced topics'
    };
  }

  /**
   * Get recent lessons
   */
  getRecentLessons(limit = 3) {
    return [
      {
        title: 'Introduction to Algebra',
        description: 'Basic algebraic concepts and operations',
        difficulty: 'Easy',
        duration: '15 min',
        icon: 'bi-calculator',
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      {
        title: 'World Geography',
        description: 'Explore continents, countries, and capitals',
        difficulty: 'Medium',
        duration: '20 min',
        icon: 'bi-globe',
        color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      },
      {
        title: 'Creative Writing',
        description: 'Storytelling techniques and character development',
        difficulty: 'Hard',
        duration: '25 min',
        icon: 'bi-pencil-square',
        color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      }
    ].slice(0, limit);
  }

  /**
   * Get recent achievements
   */
  getRecentAchievements(limit = 3) {
    return [
      {
        name: 'Math Master',
        description: 'Completed 10 math lessons',
        icon: '🧮',
        earned: true
      },
      {
        name: 'Streak Keeper',
        description: '7-day learning streak',
        icon: '🔥',
        earned: true
      },
      {
        name: 'Quick Learner',
        description: 'Completed lesson in under 10 minutes',
        icon: '⚡',
        earned: true
      }
    ].slice(0, limit);
  }

  /**
   * Get class statistics for teachers
   */
  getClassStats() {
    return {
      totalStudents: 32,
      activeStudents: 28,
      avgProgress: 74,
      completedLessons: 156
    };
  }

  /**
   * Get recent activity for teachers
   */
  getRecentActivity(limit = 5) {
    return [
      {
        title: 'Sarah completed "Introduction to Algebra"',
        description: 'Achieved 95% accuracy',
        type: 'completion',
        icon: 'check-circle',
        time: '2 hours ago'
      },
      {
        title: 'New assignment created',
        description: 'Math Practice Set #3',
        type: 'assignment',
        icon: 'plus-square',
        time: '4 hours ago'
      },
      {
        title: 'Mike asked a question',
        description: 'About quadratic equations',
        type: 'question',
        icon: 'question-circle',
        time: '6 hours ago'
      }
    ].slice(0, limit);
  }

  /**
   * Get children data for parents
   */
  getChildrenData() {
    return [
      {
        id: 'child1',
        name: 'Emma Johnson',
        grade: '5th Grade',
        status: 'active',
        progress: 78,
        completedLessons: 23,
        studyTime: '8h 45m',
        streak: 5,
        recentActivity: [
          { icon: 'check-circle', color: 'success', description: 'Completed Science lesson', time: '1 hour ago' },
          { icon: 'star', color: 'warning', description: 'Earned "Quick Learner" badge', time: '2 hours ago' },
          { icon: 'clock', color: 'info', description: 'Studied for 30 minutes', time: '3 hours ago' }
        ]
      },
      {
        id: 'child2',
        name: 'Liam Johnson',
        grade: '3rd Grade',
        status: 'active',
        progress: 65,
        completedLessons: 18,
        studyTime: '6h 20m',
        streak: 3,
        recentActivity: [
          { icon: 'book', color: 'primary', description: 'Started Reading lesson', time: '30 min ago' },
          { icon: 'trophy', color: 'warning', description: 'Moved up on leaderboard', time: '1 day ago' }
        ]
      }
    ];
  }

  /**
   * Get system statistics for admins
   */
  getSystemStats() {
    return {
      totalUsers: 1247,
      totalLessons: 89,
      avgEngagement: 82,
      systemHealth: 98
    };
  }
}

// Export for use in main app
window.DashboardManager = DashboardManager;
