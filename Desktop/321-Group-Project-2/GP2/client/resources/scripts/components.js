/**
 * EduConnect - Reusable Components
 * Common UI components used throughout the application
 */

class ComponentLibrary {
  constructor() {
    this.components = new Map();
    this.init();
  }

  /**
   * Initialize component library
   */
  init() {
    this.registerComponents();
  }

  /**
   * Register all available components
   */
  registerComponents() {
    // Progress Ring Component
    this.components.set('progress-ring', this.createProgressRing);
    
    // Lesson Card Component
    this.components.set('lesson-card', this.createLessonCard);
    
    // Achievement Badge Component
    this.components.set('achievement-badge', this.createAchievementBadge);
    
    // User Avatar Component
    this.components.set('user-avatar', this.createUserAvatar);
    
    // Stats Card Component
    this.components.set('stats-card', this.createStatsCard);
    
    // Notification Toast Component
    this.components.set('notification-toast', this.createNotificationToast);
    
    // Loading Spinner Component
    this.components.set('loading-spinner', this.createLoadingSpinner);
    
    // Modal Component
    this.components.set('modal', this.createModal);
    
    // Navigation Component
    this.components.set('navigation', this.createNavigation);
    
    // Search Bar Component
    this.components.set('search-bar', this.createSearchBar);
  }

  /**
   * Create progress ring component
   */
  createProgressRing(options = {}) {
    const {
      percentage = 0,
      size = 80,
      strokeWidth = 4,
      color = '#3b82f6',
      text = null,
      animated = true
    } = options;

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const progressRing = document.createElement('div');
    progressRing.className = 'progress-ring-container';
    progressRing.innerHTML = `
      <div class="position-relative d-inline-block">
        <svg class="progress-ring" width="${size}" height="${size}">
          <circle
            class="progress-ring-circle ${animated ? 'animated' : ''}"
            stroke="${color}"
            stroke-width="${strokeWidth}"
            fill="transparent"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${strokeDashoffset}"
            cx="${size / 2}"
            cy="${size / 2}"
            r="${radius}"
          />
        </svg>
        ${text ? `
          <div class="position-absolute top-50 start-50 translate-middle text-center">
            <div class="fw-bold text-${color.replace('#', '')}">${text}</div>
          </div>
        ` : ''}
      </div>
    `;

    return progressRing;
  }

  /**
   * Create lesson card component
   */
  createLessonCard(options = {}) {
    const {
      title = 'Lesson Title',
      description = 'Lesson description',
      difficulty = 'Medium',
      duration = 20,
      points = 100,
      progress = 0,
      completed = false,
      icon = 'bi-book',
      color = '#3b82f6',
      onClick = null
    } = options;

    const card = document.createElement('div');
    card.className = 'card lesson-card card-hover h-100';
    if (onClick) card.onclick = onClick;

    card.innerHTML = `
      <div class="position-relative">
        <div class="card-img-top d-flex align-items-center justify-content-center text-white" 
             style="height: 200px; background: linear-gradient(135deg, ${color} 0%, ${color}80 100%);">
          <i class="${icon}" style="font-size: 3rem;"></i>
        </div>
        
        ${completed ? `
          <div class="position-absolute top-0 start-0 p-2">
            <span class="badge bg-success">
              <i class="bi bi-check-circle me-1"></i>Completed
            </span>
          </div>
        ` : progress > 0 ? `
          <div class="position-absolute top-0 start-0 p-2">
            <span class="badge bg-warning">
              <i class="bi bi-clock me-1"></i>In Progress
            </span>
          </div>
        ` : ''}
        
        <div class="difficulty-badge">
          <span class="badge bg-${difficulty === 'Easy' ? 'success' : difficulty === 'Medium' ? 'warning' : 'danger'}">
            ${difficulty}
          </span>
        </div>
      </div>
      
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h5 class="card-title mb-0">${title}</h5>
          <span class="badge bg-light text-dark">
            <i class="bi bi-star-fill text-warning me-1"></i>
            ${points}
          </span>
        </div>
        
        <p class="card-text text-muted small mb-3">${description}</p>
        
        <div class="d-flex justify-content-between align-items-center mb-3">
          <small class="text-muted">
            <i class="bi bi-clock me-1"></i>
            ${duration} min
          </small>
        </div>
        
        ${progress > 0 && !completed ? `
          <div class="progress mb-2" style="height: 6px;">
            <div class="progress-bar" style="width: ${progress}%"></div>
          </div>
          <small class="text-muted">${progress}% completed</small>
        ` : ''}
      </div>
      
      <div class="card-footer bg-transparent border-0">
        <button class="btn btn-primary w-100">
          ${completed ? 'Review Lesson' : progress > 0 ? 'Continue Lesson' : 'Start Lesson'}
        </button>
      </div>
    `;

    return card;
  }

  /**
   * Create achievement badge component
   */
  createAchievementBadge(options = {}) {
    const {
      name = 'Achievement',
      description = 'Achievement description',
      icon = '🏆',
      points = 100,
      rarity = 'common',
      earned = false,
      onClick = null
    } = options;

    const badge = document.createElement('div');
    badge.className = `card border-0 shadow-sm h-100 ${earned ? 'border-success' : 'border-secondary'}`;
    if (onClick) badge.onclick = onClick;

    badge.innerHTML = `
      <div class="card-body text-center">
        <div class="mb-3">
          <div class="badge-earned ${earned ? 'bg-success' : 'bg-light'} text-${earned ? 'white' : 'muted'} rounded-circle d-inline-flex align-items-center justify-content-center" 
               style="width: 60px; height: 60px; font-size: 1.5rem;">
            ${icon}
          </div>
        </div>
        <h6 class="card-title">${name}</h6>
        <p class="card-text small text-muted mb-3">${description}</p>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="badge bg-${this.getRarityColor(rarity)}">${rarity}</span>
          <span class="badge bg-light text-dark">
            <i class="bi bi-star-fill text-warning me-1"></i>
            ${points}
          </span>
        </div>
        ${earned ? `
          <span class="badge bg-success">
            <i class="bi bi-check-circle me-1"></i>Earned
          </span>
        ` : `
          <span class="badge bg-secondary">
            <i class="bi bi-lock me-1"></i>Locked
          </span>
        `}
      </div>
    `;

    return badge;
  }

  /**
   * Create user avatar component
   */
  createUserAvatar(options = {}) {
    const {
      name = 'User',
      avatar = '👤',
      size = 'md',
      showName = true,
      role = null,
      online = true
    } = options;

    const sizeClasses = {
      sm: '25px',
      md: '40px',
      lg: '60px',
      xl: '80px'
    };

    const avatarElement = document.createElement('div');
    avatarElement.className = 'user-avatar d-flex align-items-center';
    
    avatarElement.innerHTML = `
      <div class="position-relative me-2">
        <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
             style="width: ${sizeClasses[size]}; height: ${sizeClasses[size]}; font-size: ${size === 'sm' ? '0.875rem' : size === 'lg' ? '1.5rem' : '1.25rem'};">
          ${avatar}
        </div>
        ${online ? `
          <div class="position-absolute bottom-0 end-0 bg-success rounded-circle border border-white" 
               style="width: 12px; height: 12px;"></div>
        ` : ''}
      </div>
      ${showName ? `
        <div>
          <div class="fw-bold">${name}</div>
          ${role ? `<small class="text-muted">${role}</small>` : ''}
        </div>
      ` : ''}
    `;

    return avatarElement;
  }

  /**
   * Create stats card component
   */
  createStatsCard(options = {}) {
    const {
      title = 'Stat Title',
      value = '0',
      icon = 'bi-graph-up',
      color = 'primary',
      trend = null,
      subtitle = null
    } = options;

    const card = document.createElement('div');
    card.className = 'card border-0 shadow-sm text-center';

    card.innerHTML = `
      <div class="card-body">
        <div class="mb-3">
          <i class="bi ${icon} text-${color} mb-2" style="font-size: 2rem;"></i>
        </div>
        <h4 class="mb-1">${value}</h4>
        <h6 class="card-title text-muted mb-0">${title}</h6>
        ${subtitle ? `<small class="text-muted">${subtitle}</small>` : ''}
        ${trend ? `
          <div class="mt-2">
            <span class="badge bg-${trend.direction === 'up' ? 'success' : 'danger'}">
              <i class="bi bi-arrow-${trend.direction === 'up' ? 'up' : 'down'} me-1"></i>
              ${trend.value}
            </span>
          </div>
        ` : ''}
      </div>
    `;

    return card;
  }

  /**
   * Create notification toast component
   */
  createNotificationToast(options = {}) {
    const {
      title = 'Notification',
      message = 'Notification message',
      type = 'info',
      duration = 5000,
      actions = []
    } = options;

    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-${type} border-0';
    toast.setAttribute('role', 'alert');

    const typeClasses = {
      success: 'bg-success',
      error: 'bg-danger',
      warning: 'bg-warning',
      info: 'bg-info'
    };

    toast.className = `toast align-items-center text-white ${typeClasses[type]} border-0`;

    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <strong>${title}</strong><br>
          <small>${message}</small>
          ${actions.length > 0 ? `
            <div class="mt-2">
              ${actions.map(action => `
                <button class="btn btn-sm btn-outline-light me-2" onclick="${action.onClick}">
                  ${action.label}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;

    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, { delay: duration });
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => {
      toast.remove();
    });

    return toast;
  }

  /**
   * Create loading spinner component
   */
  createLoadingSpinner(options = {}) {
    const {
      size = 'md',
      color = 'primary',
      text = null
    } = options;

    const sizeClasses = {
      sm: 'spinner-border-sm',
      md: '',
      lg: 'spinner-border-lg'
    };

    const spinner = document.createElement('div');
    spinner.className = `d-flex flex-column align-items-center justify-content-center p-4`;

    spinner.innerHTML = `
      <div class="spinner-border text-${color} ${sizeClasses[size]}" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      ${text ? `<div class="mt-3 text-muted">${text}</div>` : ''}
    `;

    return spinner;
  }

  /**
   * Create modal component
   */
  createModal(options = {}) {
    const {
      title = 'Modal Title',
      body = 'Modal body content',
      footer = null,
      size = 'md',
      closable = true
    } = options;

    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.setAttribute('tabindex', '-1');

    const sizeClasses = {
      sm: 'modal-sm',
      md: '',
      lg: 'modal-lg',
      xl: 'modal-xl'
    };

    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered ${sizeClasses[size]}">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            ${closable ? `
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            ` : ''}
          </div>
          <div class="modal-body">
            ${body}
          </div>
          ${footer ? `
            <div class="modal-footer">
              ${footer}
            </div>
          ` : ''}
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    return modal;
  }

  /**
   * Create navigation component
   */
  createNavigation(options = {}) {
    const {
      brand = 'EduConnect',
      items = [],
      user = null,
      onItemClick = null
    } = options;

    const nav = document.createElement('nav');
    nav.className = 'navbar navbar-expand-lg navbar-dark gradient-bg shadow-sm';

    nav.innerHTML = `
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="#">
          <i class="bi bi-mortarboard-fill me-2"></i>
          ${brand}
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            ${items.map(item => `
              <li class="nav-item">
                <a class="nav-link ${item.active ? 'active' : ''}" href="#" onclick="${onItemClick ? onItemClick(item.id) : ''}">
                  <i class="bi ${item.icon} me-1"></i>${item.label}
                </a>
              </li>
            `).join('')}
          </ul>
          
          ${user ? `
            <div class="d-flex align-items-center">
              <div class="me-3">
                <span class="text-light me-2">${user.avatar}</span>
                <span class="text-light">${user.name}</span>
              </div>
              <button class="btn btn-outline-light btn-sm">
                <i class="bi bi-box-arrow-right me-1"></i>Logout
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    return nav;
  }

  /**
   * Create search bar component
   */
  createSearchBar(options = {}) {
    const {
      placeholder = 'Search...',
      onSearch = null,
      onClear = null
    } = options;

    const searchBar = document.createElement('div');
    searchBar.className = 'search-bar';

    searchBar.innerHTML = `
      <div class="input-group">
        <input type="text" class="form-control" placeholder="${placeholder}" id="searchInput">
        <button class="btn btn-outline-secondary" type="button" onclick="clearSearch()">
          <i class="bi bi-x"></i>
        </button>
        <button class="btn btn-primary" type="button" onclick="performSearch()">
          <i class="bi bi-search"></i>
        </button>
      </div>
    `;

    // Add event listeners
    const searchInput = searchBar.querySelector('#searchInput');
    
    searchInput.addEventListener('input', (e) => {
      if (onSearch) {
        onSearch(e.target.value);
      }
    });

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(e.target.value);
      }
    });

    // Add global functions
    window.performSearch = () => {
      if (onSearch) {
        onSearch(searchInput.value);
      }
    };

    window.clearSearch = () => {
      searchInput.value = '';
      if (onClear) {
        onClear();
      }
    };

    return searchBar;
  }

  /**
   * Get rarity color class
   */
  getRarityColor(rarity) {
    const colors = {
      common: 'secondary',
      uncommon: 'primary',
      rare: 'warning',
      epic: 'danger',
      legendary: 'dark'
    };
    return colors[rarity] || 'secondary';
  }

  /**
   * Render component
   */
  render(componentName, container, options = {}) {
    const componentCreator = this.components.get(componentName);
    if (!componentCreator) {
      console.error(`Component '${componentName}' not found`);
      return null;
    }

    const component = componentCreator(options);
    
    if (container) {
      container.appendChild(component);
    }

    return component;
  }

  /**
   * Get all available components
   */
  getAvailableComponents() {
    return Array.from(this.components.keys());
  }
}

// Initialize component library
window.ComponentLibrary = new ComponentLibrary();
