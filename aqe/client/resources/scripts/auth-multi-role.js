// Multi-Role Authentication System
class MultiRoleAuthManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5000/api';
        this.currentUser = null;
        this.selectedRole = null;
        this.selectedRegisterRole = null;
        this.children = []; // For parent registration
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Registration form submission
        const registerForm = document.getElementById('registerForm');
        console.log('Register form found:', !!registerForm);
        registerForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Register form submitted!');
            this.handleRegistration();
        });

        // Student access code form submission
        document.getElementById('studentAccessForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleStudentAccessLogin();
        });

        // Tab change listeners
        document.addEventListener('shown.bs.tab', (e) => {
            if (e.target.getAttribute('data-bs-target') === '#login-pane') {
                this.resetLoginForm();
            } else if (e.target.getAttribute('data-bs-target') === '#register-pane') {
                this.resetRegistrationForm();
            }
        });

        // Student type radio button listeners
        document.addEventListener('change', (e) => {
            if (e.target.name === 'studentType') {
                this.updateStudentLoginFields();
            }
        });

        // Direct button click listener for debugging
        document.addEventListener('click', (e) => {
            if (e.target.id === 'registerBtn') {
                console.log('Register button clicked directly!');
                alert('Register button clicked!'); // Temporary debug
                e.preventDefault();
                this.handleRegistration();
            }
        });
    }

    // Login Role Selection
    selectLoginRole(role) {
        this.selectedRole = role;
        this.updateRoleSelection('login');
        
        // Show/hide student type selection
        const studentTypeSelection = document.getElementById('studentTypeSelection');
        if (role === 'student') {
            studentTypeSelection.style.display = 'block';
            this.updateStudentLoginFields();
        } else {
            studentTypeSelection.style.display = 'none';
            this.resetLoginFields();
        }
    }

    // Registration Role Selection
    selectRegisterRole(role) {
        console.log('Register role selected:', role);
        this.selectedRegisterRole = role;
        this.updateRoleSelection('register');
        this.showRegistrationForm(role);
    }

    updateRoleSelection(type) {
        const prefix = type === 'login' ? '' : 'register-';
        const roles = ['student', 'teacher', 'parent', 'admin'];
        
        roles.forEach(role => {
            const element = document.getElementById(`${prefix}role-${role}`);
            if (element) {
                element.classList.remove('selected');
            }
        });

        const selectedElement = document.getElementById(`${prefix}role-${type === 'login' ? this.selectedRole : this.selectedRegisterRole}`);
        if (selectedElement) {
            selectedElement.classList.add('selected');
        }
    }

    showRegistrationForm(role) {
        // Hide all registration forms
        const forms = ['student-registration', 'teacher-registration', 'parent-registration', 'admin-registration'];
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                form.style.display = 'none';
            }
        });

        // Show selected registration form
        const selectedForm = document.getElementById(`${role}-registration`);
        if (selectedForm) {
            selectedForm.style.display = 'block';
        }

        // Initialize children list for parent registration
        if (role === 'parent') {
            this.children = [];
            this.updateChildrenList();
        }
    }

    // Update student login fields based on type
    updateStudentLoginFields() {
        const studentType = document.querySelector('input[name="studentType"]:checked').value;
        const emailLabel = document.getElementById('loginEmailLabel');
        const passwordLabel = document.getElementById('loginPasswordLabel');
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        const passwordHelpText = document.getElementById('passwordHelpText');
        
        if (studentType === 'independent') {
            emailLabel.textContent = 'Email';
            emailInput.type = 'email';
            emailInput.placeholder = 'Enter your email';
            passwordLabel.textContent = 'Password';
            passwordInput.type = 'password';
            passwordInput.placeholder = 'Enter your password';
            passwordInput.minLength = '8';
            passwordInput.maxLength = '';
            passwordHelpText.textContent = 'Password must be at least 8 characters long';
        } else {
            emailLabel.textContent = 'Student Name';
            emailInput.type = 'text';
            emailInput.placeholder = 'Enter your full name';
            passwordLabel.textContent = 'Access Code';
            passwordInput.type = 'text';
            passwordInput.placeholder = 'Enter 6-digit access code';
            passwordInput.maxLength = '6';
            passwordInput.minLength = '';
            passwordHelpText.textContent = 'Enter the 6-digit access code provided by your teacher';
        }
    }

    // Reset login fields to default
    resetLoginFields() {
        const emailLabel = document.getElementById('loginEmailLabel');
        const passwordLabel = document.getElementById('loginPasswordLabel');
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        const passwordHelpText = document.getElementById('passwordHelpText');
        
        emailLabel.textContent = 'Email';
        emailInput.type = 'email';
        emailInput.placeholder = 'Enter your email';
        passwordLabel.textContent = 'Password';
        passwordInput.type = 'password';
        passwordInput.placeholder = 'Enter your password';
        passwordInput.minLength = '8';
        passwordInput.maxLength = '';
        passwordHelpText.textContent = 'Password must be at least 8 characters long';
    }

    // Handle regular login
    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showError('Please fill in all fields');
            return;
        }

        // Check if this is a student login and determine the type
        if (this.selectedRole === 'student') {
            const studentType = document.querySelector('input[name="studentType"]:checked').value;
            
            if (studentType === 'class') {
                // Handle class student login (name + access code)
                await this.handleStudentAccessLogin(email, password);
                return;
            }
            // Independent student continues with regular login below
        }

        // Regular login validation
        if (password.length < 8) {
            this.showError('Password must be at least 8 characters long');
            return;
        }

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
                this.currentUser = data.user;
                this.storeSession(data.user);
                this.redirectToRoleDashboard();
            } else {
                this.showError(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('An error occurred during login');
        }
    }

    // Handle student access code login
    async handleStudentAccessLogin(name, accessCode) {
        // If parameters are not provided, get from form fields (for backward compatibility)
        if (!name || !accessCode) {
            name = document.getElementById('studentAccessName')?.value;
            accessCode = document.getElementById('studentAccessCode')?.value;
        }

        if (!name || !accessCode) {
            this.showError('Please fill in all fields');
            return;
        }

        if (accessCode.length !== 6) {
            this.showError('Access code must be exactly 6 digits');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/login-student-access-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, accessCode })
            });

            const data = await response.json();

            if (response.ok) {
                this.currentUser = data.user;
                this.storeSession(data.user);
                this.redirectToRoleDashboard();
            } else {
                this.showError(data.message || 'Invalid name or access code');
            }
        } catch (error) {
            console.error('Student access login error:', error);
            this.showError('An error occurred during login');
        }
    }

    // Handle registration
    async handleRegistration() {
        console.log('handleRegistration called');
        console.log('Selected register role:', this.selectedRegisterRole);
        
        if (!this.selectedRegisterRole) {
            this.showError('Please select a role to register');
            return;
        }

        const registrationData = this.getRegistrationData();
        console.log('Registration data:', registrationData);
        
        if (!registrationData) {
            return; // Error already shown
        }

        try {
            const endpoint = this.getRegistrationEndpoint();
            console.log('Registration endpoint:', endpoint);
            console.log('Sending request to:', `${this.apiBaseUrl}/auth/${endpoint}`);
            
            const response = await fetch(`${this.apiBaseUrl}/auth/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData)
            });

            const data = await response.json();
            console.log('Registration response:', data);

            if (response.ok) {
                this.showSuccess(data.message || 'Registration successful! Logging you in...');
                this.resetRegistrationForm();
                
                // Automatically log in the user after successful registration
                await this.autoLoginAfterRegistration(data);
            } else {
                this.showError(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showError('An error occurred during registration');
        }
    }

    // Auto-login after successful registration
    async autoLoginAfterRegistration(registrationData) {
        try {
            console.log('Auto-logging in user after registration:', registrationData);
            
            // Store the user data from registration response
            this.currentUser = {
                id: registrationData.id,
                name: registrationData.name,
                email: registrationData.email,
                role: registrationData.role,
                studentId: registrationData.studentId,
                teacherId: registrationData.teacherId,
                parentId: registrationData.parentId,
                adminId: registrationData.adminId,
                gradeLevel: registrationData.gradeLevel,
                isIndependent: registrationData.isIndependent
            };

            // Store session data
            localStorage.setItem('aqe_user', JSON.stringify(this.currentUser));
            localStorage.setItem('aqe_session_time', Date.now().toString());

            // Update the UI to show the logged-in state
            this.updateUserInterface();
            
            // Initialize the appropriate role manager
            this.initializeRoleManager();
            
            // Close the login modal
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (loginModal) {
                loginModal.hide();
            }
            
            console.log('Auto-login successful, user is now logged in');
            
        } catch (error) {
            console.error('Auto-login error:', error);
            this.showError('Registration successful, but automatic login failed. Please log in manually.');
        }
    }

    getRegistrationData() {
        switch (this.selectedRegisterRole) {
            case 'student':
                return this.getStudentRegistrationData();
            case 'teacher':
                return this.getTeacherRegistrationData();
            case 'parent':
                return this.getParentRegistrationData();
            case 'admin':
                return this.getAdminRegistrationData();
            default:
                return null;
        }
    }

    getStudentRegistrationData() {
        const name = document.getElementById('studentName').value;
        const email = document.getElementById('studentEmail').value;
        const password = document.getElementById('studentPassword').value;
        const gradeLevel = document.getElementById('studentGradeLevel').value;

        if (!name || !email || !password || !gradeLevel) {
            this.showError('Please fill in all fields');
            return null;
        }

        if (password.length < 8) {
            this.showError('Password must be at least 8 characters long');
            return null;
        }

        return { name, email, password, gradeLevel };
    }

    getTeacherRegistrationData() {
        const name = document.getElementById('teacherName').value;
        const email = document.getElementById('teacherEmail').value;
        const password = document.getElementById('teacherPassword').value;
        const gradeLevelTaught = document.getElementById('teacherGradeLevel').value;

        if (!name || !email || !password || !gradeLevelTaught) {
            this.showError('Please fill in all fields');
            return null;
        }

        if (password.length < 8) {
            this.showError('Password must be at least 8 characters long');
            return null;
        }

        return { name, email, password, gradeLevelTaught, subjectTaught: "Multiple Subjects" };
    }

    getParentRegistrationData() {
        const name = document.getElementById('parentName').value;
        const email = document.getElementById('parentEmail').value;
        const password = document.getElementById('parentPassword').value;

        if (!name || !email || !password) {
            this.showError('Please fill in all fields');
            return null;
        }

        if (password.length < 8) {
            this.showError('Password must be at least 8 characters long');
            return null;
        }

        if (this.children.length === 0) {
            this.showError('Please add at least one child');
            return null;
        }

        return { name, email, password, children: this.children };
    }

    getAdminRegistrationData() {
        const name = document.getElementById('adminName').value;
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        const adminPassword = document.getElementById('adminSecretPassword').value;

        if (!name || !email || !password || !adminPassword) {
            this.showError('Please fill in all fields');
            return null;
        }

        if (password.length < 8) {
            this.showError('Password must be at least 8 characters long');
            return null;
        }

        return { name, email, password, adminPassword };
    }

    getRegistrationEndpoint() {
        switch (this.selectedRegisterRole) {
            case 'student':
                return 'register-student';
            case 'teacher':
                return 'register-teacher';
            case 'parent':
                return 'register-parent';
            case 'admin':
                return 'register-admin';
            default:
                return 'register-student';
        }
    }

    // Parent registration - Add child field
    addChildField() {
        const childId = Date.now(); // Simple unique ID
        const child = { id: childId, name: '', accessCode: '' };
        this.children.push(child);
        this.updateChildrenList();
    }

    // Parent registration - Update children list
    updateChildrenList() {
        const container = document.getElementById('children-list');
        if (!container) return;

        container.innerHTML = '';

        this.children.forEach((child, index) => {
            const childDiv = document.createElement('div');
            childDiv.className = 'child-field mb-3 p-3 border rounded';
            childDiv.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">Child ${index + 1}</h6>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="window.multiRoleAuth.removeChild(${child.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <label class="form-label">Child's Name</label>
                        <input type="text" class="form-control" placeholder="Enter child's full name" 
                               value="${child.name}" onchange="window.multiRoleAuth.updateChild(${child.id}, 'name', this.value)">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Access Code</label>
                        <input type="text" class="form-control" placeholder="6-digit access code" maxlength="6"
                               value="${child.accessCode}" onchange="window.multiRoleAuth.updateChild(${child.id}, 'accessCode', this.value)">
                    </div>
                </div>
            `;
            container.appendChild(childDiv);
        });
    }

    // Parent registration - Update child data
    updateChild(childId, field, value) {
        const child = this.children.find(c => c.id === childId);
        if (child) {
            child[field] = value;
        }
    }

    // Parent registration - Remove child
    removeChild(childId) {
        this.children = this.children.filter(c => c.id !== childId);
        this.updateChildrenList();
    }

    // Validate access code
    async validateAccessCode(accessCode) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/validate-access-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accessCode })
            });

            const data = await response.json();
            return data.isValid ? data : null;
        } catch (error) {
            console.error('Access code validation error:', error);
            return null;
        }
    }

    // Store session
    storeSession(user) {
        localStorage.setItem('aqe_user', JSON.stringify(user));
        localStorage.setItem('aqe_session_time', Date.now().toString());
    }

    // Load stored session
    loadStoredSession() {
        const userData = localStorage.getItem('aqe_user');
        const sessionTime = localStorage.getItem('aqe_session_time');
        
        if (userData && sessionTime) {
            const sessionAge = Date.now() - parseInt(sessionTime);
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            
            if (sessionAge < maxAge) {
                this.currentUser = JSON.parse(userData);
                return true;
            } else {
                // Session expired
                this.clearSession();
            }
        }
        return false;
    }

    // Clear session
    clearSession() {
        localStorage.removeItem('aqe_user');
        localStorage.removeItem('aqe_session_time');
        this.currentUser = null;
    }

    // Redirect to role dashboard
    redirectToRoleDashboard() {
        if (this.currentUser) {
            // Hide login modal
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (loginModal) {
                loginModal.hide();
            }

            // Update UI for logged in user
            this.updateUserInterface();

            // Initialize role-specific manager
            this.initializeRoleManager();

            // Redirect to appropriate dashboard
            this.navigateToRoleDashboard();
        }
    }

    // Update user interface
    updateUserInterface() {
        const userNameElement = document.getElementById('userFullName');
        const userRoleElement = document.getElementById('userRole');
        const userRoleDisplayElement = document.getElementById('userRoleDisplay');

        if (this.currentUser) {
            if (userNameElement) userNameElement.textContent = this.currentUser.name;
            if (userRoleElement) userRoleElement.textContent = this.currentUser.role;
            if (userRoleDisplayElement) userRoleDisplayElement.textContent = this.currentUser.role;

            // Show role-specific content
            this.showRoleContent(this.currentUser.role);
        }
    }

    // Show role-specific content
    showRoleContent(role) {
        // Hide all role content
        const roleContents = document.querySelectorAll('.role-content');
        roleContents.forEach(content => {
            content.classList.add('d-none');
        });

        // Show specific role content
        const specificRoleContent = document.querySelector(`.role-content.${role}-only`);
        if (specificRoleContent) {
            specificRoleContent.classList.remove('d-none');
        }
    }

    // Initialize role-specific manager
    initializeRoleManager() {
        if (!this.currentUser) return;

        switch (this.currentUser.role) {
            case 'teacher':
                if (window.TeacherManager) {
                    window.teacherManager = new TeacherManager();
                }
                break;
            case 'student':
                if (window.StudentManager) {
                    window.studentManager = new StudentManager();
                }
                break;
            case 'parent':
                if (window.ParentManager) {
                    window.parentManager = new ParentManager();
                }
                break;
            case 'admin':
                if (window.AdminManager) {
                    window.adminManager = new AdminManager();
                }
                break;
        }
    }

    // Navigate to role dashboard
    navigateToRoleDashboard() {
        if (!this.currentUser) return;

        switch (this.currentUser.role) {
            case 'teacher':
                this.goToTab('teacher-dashboard');
                break;
            case 'student':
                this.goToTab('student-dashboard');
                break;
            case 'parent':
                this.goToTab('parent-dashboard');
                break;
            case 'admin':
                this.goToTab('admin-dashboard');
                break;
        }
    }

    // Go to tab (placeholder - should be implemented by main navigation)
    goToTab(tabName) {
        // This should be implemented by the main navigation system
        console.log(`Navigating to ${tabName}`);
    }

    // Reset forms
    resetLoginForm() {
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        this.selectedRole = null;
        this.updateRoleSelection('login');
        
        // Hide student type selection and reset fields
        const studentTypeSelection = document.getElementById('studentTypeSelection');
        if (studentTypeSelection) {
            studentTypeSelection.style.display = 'none';
        }
        this.resetLoginFields();
        this.clearErrors();
    }

    resetRegistrationForm() {
        // Clear all form fields
        const forms = ['student-registration', 'teacher-registration', 'parent-registration', 'admin-registration'];
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                const inputs = form.querySelectorAll('input, select');
                inputs.forEach(input => {
                    input.value = '';
                });
            }
        });

        this.selectedRegisterRole = null;
        this.children = [];
        this.updateChildrenList();
        this.updateRoleSelection('register');
        this.clearErrors();
    }

    // Error handling
    showError(message) {
        this.clearErrors();
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger alert-dismissible fade show';
        errorDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const modalBody = document.querySelector('#loginModal .modal-body');
        if (modalBody) {
            modalBody.insertBefore(errorDiv, modalBody.firstChild);
        }
    }

    showSuccess(message) {
        this.clearErrors();
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success alert-dismissible fade show';
        successDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const modalBody = document.querySelector('#loginModal .modal-body');
        if (modalBody) {
            modalBody.insertBefore(successDiv, modalBody.firstChild);
        }
    }

    clearErrors() {
        const alerts = document.querySelectorAll('#loginModal .alert');
        alerts.forEach(alert => alert.remove());
    }

    // Logout
    logout() {
        this.clearSession();
        location.reload(); // Refresh to show login state
    }
}

// Global functions for HTML onclick events
function selectLoginRole(role) {
    window.multiRoleAuth.selectLoginRole(role);
}

function selectRegisterRole(role) {
    window.multiRoleAuth.selectRegisterRole(role);
}

function addChildField() {
    window.multiRoleAuth.addChildField();
}

function logout() {
    window.multiRoleAuth.logout();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.multiRoleAuth = new MultiRoleAuthManager();
    
    // Load stored session
    if (window.multiRoleAuth.loadStoredSession()) {
        window.multiRoleAuth.updateUserInterface();
        window.multiRoleAuth.initializeRoleManager();
    }
});

// Initialize on window load as well (for session restoration)
window.addEventListener('load', function() {
    if (window.multiRoleAuth && window.multiRoleAuth.loadStoredSession()) {
        window.multiRoleAuth.updateUserInterface();
        window.multiRoleAuth.initializeRoleManager();
    }
});
