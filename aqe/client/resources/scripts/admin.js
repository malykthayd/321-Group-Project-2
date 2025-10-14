// Admin module for AQE Platform
// Handles administrative functionality

class AdminManager {
  constructor() {
    this.users = [];
    this.lessons = [];
    this.books = [];
    this.analytics = {};
    
    this.init();
  }

  init() {
    this.loadAdminData();
    this.setupEventListeners();
  }

  // Load admin data
  async loadAdminData() {
    try {
      // In a real app, this would fetch from the API
      await Promise.all([
        this.loadUsers(),
        this.loadLessons(),
        this.loadBooks(),
        this.loadAnalytics()
      ]);
      
      this.renderAdminDashboard();
    } catch (error) {
      console.error('Error loading admin data:', error);
      this.showError('Failed to load admin data. Please try again.');
    }
  }

  // Load users data
  async loadUsers() {
    this.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'student',
        status: 'active',
        joinDate: new Date('2024-01-15'),
        lastLogin: new Date('2024-01-25'),
        lessonsCompleted: 5,
        booksRead: 2,
        totalStudyTime: 1200 // minutes
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'teacher',
        status: 'active',
        joinDate: new Date('2024-01-10'),
        lastLogin: new Date('2024-01-24'),
        lessonsCompleted: 0,
        booksRead: 0,
        totalStudyTime: 0
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        role: 'student',
        status: 'inactive',
        joinDate: new Date('2024-01-05'),
        lastLogin: new Date('2024-01-20'),
        lessonsCompleted: 3,
        booksRead: 1,
        totalStudyTime: 800
      },
      {
        id: 4,
        name: 'Alice Brown',
        email: 'alice.brown@example.com',
        role: 'admin',
        status: 'active',
        joinDate: new Date('2024-01-01'),
        lastLogin: new Date('2024-01-25'),
        lessonsCompleted: 0,
        booksRead: 0,
        totalStudyTime: 0
      }
    ];
  }

  // Load lessons data
  async loadLessons() {
    this.lessons = [
      {
        id: 1,
        title: 'Introduction to Mathematics',
        category: 'Mathematics',
        difficulty: 'Beginner',
        status: 'published',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        enrolledStudents: 25,
        completionRate: 80,
        averageRating: 4.5
      },
      {
        id: 2,
        title: 'Basic Algebra',
        category: 'Mathematics',
        difficulty: 'Intermediate',
        status: 'published',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-25'),
        enrolledStudents: 18,
        completionRate: 65,
        averageRating: 4.2
      },
      {
        id: 3,
        title: 'World History',
        category: 'History',
        difficulty: 'Beginner',
        status: 'draft',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18'),
        enrolledStudents: 0,
        completionRate: 0,
        averageRating: 0
      }
    ];
  }

  // Load books data
  async loadBooks() {
    this.books = [
      {
        id: 1,
        title: 'Mathematics Fundamentals',
        author: 'Dr. Sarah Johnson',
        category: 'Mathematics',
        status: 'available',
        totalReads: 15,
        averageRating: 4.5,
        createdAt: new Date('2024-01-15')
      },
      {
        id: 2,
        title: 'History of the World',
        author: 'Prof. Michael Chen',
        category: 'History',
        status: 'available',
        totalReads: 8,
        averageRating: 4.2,
        createdAt: new Date('2024-01-10')
      },
      {
        id: 3,
        title: 'Science Experiments for Kids',
        author: 'Dr. Emily Rodriguez',
        category: 'Science',
        status: 'maintenance',
        totalReads: 12,
        averageRating: 4.8,
        createdAt: new Date('2024-01-20')
      }
    ];
  }

  // Load analytics data
  async loadAnalytics() {
    this.analytics = {
      totalUsers: this.users.length,
      activeUsers: this.users.filter(u => u.status === 'active').length,
      totalLessons: this.lessons.length,
      publishedLessons: this.lessons.filter(l => l.status === 'published').length,
      totalBooks: this.books.length,
      availableBooks: this.books.filter(b => b.status === 'available').length,
      totalStudyTime: this.users.reduce((total, user) => total + user.totalStudyTime, 0),
      averageCompletionRate: this.lessons.reduce((total, lesson) => total + lesson.completionRate, 0) / this.lessons.length,
      monthlyGrowth: 15.5, // percentage
      topCategories: [
        { name: 'Mathematics', count: 2 },
        { name: 'History', count: 1 },
        { name: 'Science', count: 1 }
      ]
    };
  }

  // Setup event listeners
  setupEventListeners() {
    // Admin tab switching
    const adminTabs = document.querySelectorAll('#adminTabs button[data-bs-toggle="tab"]');
    adminTabs.forEach(tab => {
      tab.addEventListener('shown.bs.tab', this.handleAdminTabSwitch.bind(this));
    });
  }

  // Render admin dashboard
  renderAdminDashboard() {
    this.renderAnalyticsCards();
    this.renderUsersTable();
    this.renderLessonsTable();
    this.renderBooksTable();
  }

  // Render analytics cards
  renderAnalyticsCards() {
    const analyticsContainer = document.getElementById('adminAnalytics');
    if (!analyticsContainer) return;

    analyticsContainer.innerHTML = `
      <div class="row g-4">
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <i class="bi bi-people-fill text-primary fs-1 mb-2"></i>
              <h3 class="card-title">${this.analytics.totalUsers}</h3>
              <p class="card-text text-muted">Total Users</p>
              <small class="text-success">${this.analytics.activeUsers} active</small>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <i class="bi bi-book-fill text-success fs-1 mb-2"></i>
              <h3 class="card-title">${this.analytics.totalLessons}</h3>
              <p class="card-text text-muted">Total Lessons</p>
              <small class="text-success">${this.analytics.publishedLessons} published</small>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <i class="bi bi-collection-fill text-info fs-1 mb-2"></i>
              <h3 class="card-title">${this.analytics.totalBooks}</h3>
              <p class="card-text text-muted">Total Books</p>
              <small class="text-success">${this.analytics.availableBooks} available</small>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card text-center">
            <div class="card-body">
              <i class="bi bi-graph-up text-warning fs-1 mb-2"></i>
              <h3 class="card-title">${this.analytics.monthlyGrowth}%</h3>
              <p class="card-text text-muted">Monthly Growth</p>
              <small class="text-success">+${this.analytics.monthlyGrowth}% this month</small>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Render users table
  renderUsersTable() {
    const usersContainer = document.getElementById('adminUsers');
    if (!usersContainer) return;

    usersContainer.innerHTML = `
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">User Management</h6>
          <button class="btn btn-primary btn-sm" onclick="app.adminManager.showAddUserModal()">
            <i class="bi bi-plus-circle me-1"></i>Add User
          </button>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Last Login</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.users.map(user => `
                  <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                      <span class="badge bg-${this.getRoleBadgeColor(user.role)}">${user.role}</span>
                    </td>
                    <td>
                      <span class="badge bg-${user.status === 'active' ? 'success' : 'secondary'}">${user.status}</span>
                    </td>
                    <td>${this.formatDate(user.joinDate)}</td>
                    <td>${this.formatDate(user.lastLogin)}</td>
                    <td>
                      <small>${user.lessonsCompleted} lessons, ${user.booksRead} books</small>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="app.adminManager.editUser(${user.id})">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="app.adminManager.deleteUser(${user.id})">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // Render lessons table
  renderLessonsTable() {
    const lessonsContainer = document.getElementById('adminLessons');
    if (!lessonsContainer) return;

    lessonsContainer.innerHTML = `
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">Lesson Management</h6>
          <button class="btn btn-primary btn-sm" onclick="app.adminManager.showAddLessonModal()">
            <i class="bi bi-plus-circle me-1"></i>Add Lesson
          </button>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Status</th>
                  <th>Students</th>
                  <th>Completion Rate</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.lessons.map(lesson => `
                  <tr>
                    <td>${lesson.title}</td>
                    <td>${lesson.category}</td>
                    <td>
                      <span class="badge bg-${this.getDifficultyBadgeColor(lesson.difficulty)}">${lesson.difficulty}</span>
                    </td>
                    <td>
                      <span class="badge bg-${lesson.status === 'published' ? 'success' : 'warning'}">${lesson.status}</span>
                    </td>
                    <td>${lesson.enrolledStudents}</td>
                    <td>${lesson.completionRate}%</td>
                    <td>
                      <div class="d-flex align-items-center">
                        <i class="bi bi-star-fill text-warning me-1"></i>
                        ${lesson.averageRating.toFixed(1)}
                      </div>
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="app.adminManager.editLesson(${lesson.id})">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="app.adminManager.deleteLesson(${lesson.id})">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // Render books table
  renderBooksTable() {
    const booksContainer = document.getElementById('adminBooks');
    if (!booksContainer) return;

    booksContainer.innerHTML = `
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">Book Management</h6>
          <button class="btn btn-primary btn-sm" onclick="app.adminManager.showAddBookModal()">
            <i class="bi bi-plus-circle me-1"></i>Add Book
          </button>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Total Reads</th>
                  <th>Rating</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${this.books.map(book => `
                  <tr>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.category}</td>
                    <td>
                      <span class="badge bg-${this.getBookStatusBadgeColor(book.status)}">${book.status}</span>
                    </td>
                    <td>${book.totalReads}</td>
                    <td>
                      <div class="d-flex align-items-center">
                        <i class="bi bi-star-fill text-warning me-1"></i>
                        ${book.averageRating.toFixed(1)}
                      </div>
                    </td>
                    <td>${this.formatDate(book.createdAt)}</td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="app.adminManager.editBook(${book.id})">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="app.adminManager.deleteBook(${book.id})">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // Handle admin tab switching
  handleAdminTabSwitch(event) {
    const tabId = event.target.getAttribute('data-bs-target');
    console.log('Switched to admin tab:', tabId);
  }

  // Show add user modal
  showAddUserModal() {
    this.showNotification('Add user functionality coming soon!', 'info');
  }

  // Show add lesson modal
  showAddLessonModal() {
    this.showNotification('Add lesson functionality coming soon!', 'info');
  }

  // Show add book modal
  showAddBookModal() {
    this.showNotification('Add book functionality coming soon!', 'info');
  }

  // Edit user
  editUser(userId) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      this.showNotification(`Edit user: ${user.name}`, 'info');
    }
  }

  // Delete user
  deleteUser(userId) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      if (confirm(`Are you sure you want to delete user: ${user.name}?`)) {
        this.users = this.users.filter(u => u.id !== userId);
        this.renderUsersTable();
        this.showNotification(`User ${user.name} deleted successfully`, 'success');
      }
    }
  }

  // Edit lesson
  editLesson(lessonId) {
    const lesson = this.lessons.find(l => l.id === lessonId);
    if (lesson) {
      this.showNotification(`Edit lesson: ${lesson.title}`, 'info');
    }
  }

  // Delete lesson
  deleteLesson(lessonId) {
    const lesson = this.lessons.find(l => l.id === lessonId);
    if (lesson) {
      if (confirm(`Are you sure you want to delete lesson: ${lesson.title}?`)) {
        this.lessons = this.lessons.filter(l => l.id !== lessonId);
        this.renderLessonsTable();
        this.showNotification(`Lesson ${lesson.title} deleted successfully`, 'success');
      }
    }
  }

  // Edit book
  editBook(bookId) {
    const book = this.books.find(b => b.id === bookId);
    if (book) {
      this.showNotification(`Edit book: ${book.title}`, 'info');
    }
  }

  // Delete book
  deleteBook(bookId) {
    const book = this.books.find(b => b.id === bookId);
    if (book) {
      if (confirm(`Are you sure you want to delete book: ${book.title}?`)) {
        this.books = this.books.filter(b => b.id !== bookId);
        this.renderBooksTable();
        this.showNotification(`Book ${book.title} deleted successfully`, 'success');
      }
    }
  }

  // Get role badge color
  getRoleBadgeColor(role) {
    const colors = {
      'admin': 'danger',
      'teacher': 'warning',
      'student': 'primary'
    };
    return colors[role] || 'secondary';
  }

  // Get difficulty badge color
  getDifficultyBadgeColor(difficulty) {
    const colors = {
      'Beginner': 'success',
      'Intermediate': 'warning',
      'Advanced': 'danger'
    };
    return colors[difficulty] || 'secondary';
  }

  // Get book status badge color
  getBookStatusBadgeColor(status) {
    const colors = {
      'available': 'success',
      'maintenance': 'warning',
      'unavailable': 'danger'
    };
    return colors[status] || 'secondary';
  }

  // Format date
  formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  // Show error
  showError(message) {
    if (window.app) {
      window.app.showNotification(message, 'danger');
    }
  }

  // Show notification
  showNotification(message, type = 'info') {
    if (window.app) {
      window.app.showNotification(message, type);
    }
  }
}

// Initialize admin manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.app) {
    window.app.adminManager = new AdminManager();
  }
});
