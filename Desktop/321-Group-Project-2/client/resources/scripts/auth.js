// Authentication module for AQE Platform
// Handles login, logout, and session management

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.selectedRole = null;
    this.apiBaseUrl = 'http://localhost:5000/api'; // Update this to match your API URL
    
    this.init();
  }

  init() {
    this.loadStoredSession();
    this.setupEventListeners();
  }

  // Setup event listeners
  setupEventListeners() {
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', this.handleLogin.bind(this));
    }

    // Auto-fill credentials when role is selected
    document.addEventListener('roleSelected', this.handleRoleSelected.bind(this));
  }

  // Load stored session from localStorage
  loadStoredSession() {
    const storedUser = localStorage.getItem('aqe_user');
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
        this.updateUIAfterLogin();
        console.log('Session restored for user:', this.currentUser.name);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('aqe_user');
      }
    }
  }

  // Handle login form submission
  async handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    // Clear previous errors
    this.clearFormErrors();
    
    // Validate form
    if (!this.validateLoginForm(email, password)) {
      return;
    }

    // Show loading state
    this.setLoginLoading(true);

    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        this.currentUser = data.user;
        this.storeSession();
        this.updateUIAfterLogin();
        this.closeLoginModal();
        this.showNotification('Login successful! Welcome, ' + this.currentUser.name, 'success');
      } else {
        // Login failed
        this.showFormError('loginError', data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showFormError('loginError', 'Network error. Please check your connection and try again.');
    } finally {
      this.setLoginLoading(false);
    }
  }

  // Validate login form
  validateLoginForm(email, password) {
    let isValid = true;

    // Validate email
    if (!email) {
      this.showFieldError('loginEmail', 'Email is required');
      isValid = false;
    } else if (!this.isValidEmail(email)) {
      this.showFieldError('loginEmail', 'Please enter a valid email address');
      isValid = false;
    }

    // Validate password
    if (!password) {
      this.showFieldError('loginPassword', 'Password is required');
      isValid = false;
    } else if (password.length < 8) {
      this.showFieldError('loginPassword', 'Password must be at least 8 characters long');
      isValid = false;
    }

    return isValid;
  }

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Handle role selection in login modal
  handleRoleSelected(event) {
    this.selectedRole = event.detail.role;
    this.autoFillCredentials();
  }

  // Auto-fill credentials based on selected role
  autoFillCredentials() {
    const credentials = {
      student: { email: 'student@demo.com', password: 'student123' },
      teacher: { email: 'teacher@demo.com', password: 'teacher123' },
      parent: { email: 'parent@demo.com', password: 'parent123' },
      admin: { email: 'admin@demo.com', password: 'admin123' }
    };

    if (this.selectedRole && credentials[this.selectedRole]) {
      const creds = credentials[this.selectedRole];
      document.getElementById('loginEmail').value = creds.email;
      document.getElementById('loginPassword').value = creds.password;
      
      // Mark fields as valid
      document.getElementById('loginEmail').classList.add('is-valid');
      document.getElementById('loginPassword').classList.add('is-valid');
    }
  }

  // Store session in localStorage
  storeSession() {
    localStorage.setItem('aqe_user', JSON.stringify(this.currentUser));
  }

  // Update UI after successful login
  updateUIAfterLogin() {
    if (!this.currentUser) return;

    // Update user interface
    if (window.app) {
      window.app.currentUser = this.currentUser;
      window.app.updateUserInterface();
      window.app.updateRoleBasedVisibility();
    }

    // Update step completion
    this.updateStepCompletion();
  }

  // Update step completion in getting started
  updateStepCompletion() {
    const stepContent = document.querySelector('.step-item .step-content');
    if (stepContent && this.currentUser) {
      stepContent.innerHTML = `
        <h6>Choose Your Role & Login <i class="bi bi-check-circle-fill text-success ms-2"></i></h6>
        <p class="small text-success mb-2">Logged in as: <strong>${this.currentUser.name}</strong> (${this.currentUser.role})</p>
        <button class="btn btn-outline-primary btn-sm me-2" onclick="showLoginModal()">
          <i class="bi bi-pencil me-1"></i>Change Account
        </button>
        <button class="btn btn-outline-danger btn-sm" onclick="authManager.logout()">
          <i class="bi bi-box-arrow-right me-1"></i>Logout
        </button>
      `;
    }
  }

  // Logout user
  logout() {
    this.currentUser = null;
    this.selectedRole = null;
    localStorage.removeItem('aqe_user');
    
    // Update UI
    if (window.app) {
      window.app.currentUser = { role: null };
      window.app.updateUserInterface();
      window.app.updateRoleBasedVisibility();
    }

    // Reset step
    const stepContent = document.querySelector('.step-item .step-content');
    if (stepContent) {
      stepContent.innerHTML = `
        <h6>Choose Your Role & Login</h6>
        <p class="small text-muted mb-2">Select your role and login with demo credentials to access your personalized dashboard</p>
        <button class="btn btn-primary btn-sm" onclick="showLoginModal()">
          <i class="bi bi-person-plus me-1"></i>Login
        </button>
      `;
    }

    this.showNotification('You have been logged out successfully', 'info');
  }

  // Show login modal
  showLoginModal() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
  }

  // Close login modal
  closeLoginModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (modal) {
      modal.hide();
    }
  }

  // Show demo accounts modal
  async showDemoAccounts() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/demo-accounts`);
      const accounts = await response.json();

      const tableBody = document.getElementById('demoAccountsTable');
      if (tableBody) {
        tableBody.innerHTML = accounts.map(account => `
          <tr>
            <td><span class="badge bg-primary">${account.role}</span></td>
            <td>${account.name}</td>
            <td><code>${account.email}</code></td>
            <td><code>${this.getPasswordForRole(account.role)}</code></td>
            <td>${this.getAdditionalInfo(account)}</td>
          </tr>
        `).join('');
      }

      const modal = new bootstrap.Modal(document.getElementById('demoAccountsModal'));
      modal.show();
    } catch (error) {
      console.error('Error loading demo accounts:', error);
      this.showNotification('Error loading demo accounts', 'danger');
    }
  }

  // Get password for role (for demo purposes)
  getPasswordForRole(role) {
    const passwords = {
      student: 'student123',
      teacher: 'teacher123',
      parent: 'parent123',
      admin: 'admin123'
    };
    return passwords[role] || 'password123';
  }

  // Get additional info for account
  getAdditionalInfo(account) {
    if (account.gradeLevel) {
      return `Grade: ${account.gradeLevel}`;
    } else if (account.subjectTaught && account.gradeLevelTaught) {
      return `${account.subjectTaught} (${account.gradeLevelTaught})`;
    } else if (account.childrenEmails) {
      const children = JSON.parse(account.childrenEmails);
      return `Children: ${children.join(', ')}`;
    }
    return 'Full system access';
  }

  // Form error handling
  clearFormErrors() {
    document.querySelectorAll('.is-invalid').forEach(el => {
      el.classList.remove('is-invalid');
    });
    document.querySelectorAll('.invalid-feedback').forEach(el => {
      el.textContent = '';
    });
  }

  showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId.replace('login', '') + 'Error');
    
    if (field) field.classList.add('is-invalid');
    if (errorDiv) errorDiv.textContent = message;
  }

  showFormError(errorId, message) {
    const errorDiv = document.getElementById(errorId);
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  }

  // Set loading state for login button
  setLoginLoading(loading) {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      if (loading) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Logging in...';
      } else {
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>Login';
      }
    }
  }

  // Show notification
  showNotification(message, type = 'info') {
    if (window.app) {
      window.app.showNotification(message, type);
    }
  }
}

// Global functions for HTML onclick handlers
function showLoginModal() {
  if (window.authManager) {
    window.authManager.showLoginModal();
  }
}

function showDemoAccounts() {
  if (window.authManager) {
    window.authManager.showDemoAccounts();
  }
}

function selectLoginRole(role) {
  // Remove selected class from all role cards
  document.querySelectorAll('.role-option-card-small').forEach(card => {
    card.classList.remove('selected');
  });

  // Add selected class to clicked role card
  const selectedCard = document.getElementById(`role-${role}`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }

  // Dispatch event for role selection
  document.dispatchEvent(new CustomEvent('roleSelected', { 
    detail: { role: role } 
  }));
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.authManager = new AuthManager();
});
