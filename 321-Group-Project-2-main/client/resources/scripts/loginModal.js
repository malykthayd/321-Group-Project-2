// Login Modal Handler for Unified Auth System
// Handles the login modal interactions and form submissions

class LoginModalHandler {
    constructor() {
        this.selectedRole = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Role selection handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.role-option-card-small')) {
                const roleCard = e.target.closest('.role-option-card-small');
                const role = roleCard.id.replace('role-', '');
                this.selectLoginRole(role);
            }
        });

        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Demo account buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('demo-login-btn')) {
                const role = e.target.dataset.role;
                this.handleDemoLogin(role);
            }
        });
    }

    selectLoginRole(role) {
        this.selectedRole = role;
        
        // Update UI
        document.querySelectorAll('.role-option-card-small').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.getElementById(`role-${role}`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        // Show appropriate form fields
        this.updateFormFields(role);
    }

    updateFormFields(role) {
        const emailField = document.getElementById('loginEmail');
        const passwordField = document.getElementById('loginPassword');
        const nameField = document.getElementById('loginName');
        const accessCodeField = document.getElementById('loginAccessCode');
        const nameGroup = document.getElementById('loginNameGroup');
        const accessCodeGroup = document.getElementById('loginAccessCodeGroup');

        if (role === 'student') {
            // Show name and access code fields for students
            if (nameGroup) nameGroup.style.display = 'block';
            if (accessCodeGroup) accessCodeGroup.style.display = 'block';
            if (emailField) emailField.style.display = 'none';
            if (passwordField) passwordField.style.display = 'none';
        } else {
            // Show email and password fields for other roles
            if (nameGroup) nameGroup.style.display = 'none';
            if (accessCodeGroup) accessCodeGroup.style.display = 'none';
            if (emailField) emailField.style.display = 'block';
            if (passwordField) passwordField.style.display = 'block';
        }
    }

    async handleLogin() {
        if (!this.selectedRole) {
            this.showError('Please select a role first.');
            return;
        }

        try {
            let credentials = {};
            
            if (this.selectedRole === 'student') {
                const name = document.getElementById('loginName')?.value;
                const accessCode = document.getElementById('loginAccessCode')?.value;
                
                if (!name || !accessCode) {
                    this.showError('Please enter your name and access code.');
                    return;
                }
                
                credentials = { name, accessCode };
            } else {
                const email = document.getElementById('loginEmail')?.value;
                const password = document.getElementById('loginPassword')?.value;
                
                if (!email || !password) {
                    this.showError('Please enter your email and password.');
                    return;
                }
                
                credentials = { email, password };
            }

            this.showLoading(true);
            
            const result = await window.auth.login(this.selectedRole, credentials);
            
            if (result.success) {
                this.showSuccess('Login successful!');
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                if (modal) {
                    modal.hide();
                }
                
                // Dispatch login event
                window.dispatchEvent(new CustomEvent('userLogin', { detail: result.user }));
            } else {
                this.showError(result.error || 'Login failed. Please try again.');
            }
            
        } catch (error) {
            this.showError('An error occurred during login. Please try again.');
            console.error('Login error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    async handleDemoLogin(role) {
        try {
            this.showLoading(true);
            
            const result = await window.auth.loginDemo(role);
            
            if (result.success) {
                this.showSuccess('Demo login successful!');
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                if (modal) {
                    modal.hide();
                }
                
                // Dispatch login event
                window.dispatchEvent(new CustomEvent('userLogin', { detail: result.user }));
            } else {
                this.showError(result.error || 'Demo login failed.');
            }
            
        } catch (error) {
            this.showError('An error occurred during demo login.');
            console.error('Demo login error:', error);
        } finally {
            this.showLoading(false);
        }
    }

    showLoading(show) {
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        if (submitBtn) {
            if (show) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Logging in...';
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>Login';
            }
        }
    }

    showError(message) {
        this.showMessage(message, 'danger');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        // Remove existing alerts
        const existingAlert = document.querySelector('#loginModal .alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // Create new alert
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Insert at top of modal body
        const modalBody = document.querySelector('#loginModal .modal-body');
        if (modalBody) {
            modalBody.insertBefore(alert, modalBody.firstChild);
        }

        // Auto-dismiss success messages
        if (type === 'success') {
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 3000);
        }
    }
}

// Global functions for backward compatibility
function selectLoginRole(role) {
    if (window.loginModalHandler) {
        window.loginModalHandler.selectLoginRole(role);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.loginModalHandler = new LoginModalHandler();
});
