// Login Modal Handler for Unified Auth System
// Handles the login modal interactions and form submissions

class LoginModalHandler {
    constructor() {
        this.selectedLoginRole = null;
        this.selectedRegisterRole = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login role selection handlers
        document.addEventListener('click', (e) => {
            if (e.target.closest('.role-option-card-small') && e.target.closest('[id^="role-"]')) {
                const roleCard = e.target.closest('.role-option-card-small');
                const role = roleCard.id.replace('role-', '');
                this.selectLoginRole(role);
            }
        });

        // Registration role selection handlers  
        document.addEventListener('click', (e) => {
            if (e.target.closest('.role-option-card-small') && e.target.closest('[id^="register-role-"]')) {
                const roleCard = e.target.closest('.role-option-card-small');
                const role = roleCard.id.replace('register-role-', '');
                this.selectRegisterRole(role);
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

        // Registration form submission
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration();
            });
        }

        // Demo account buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('demo-login-btn')) {
                const role = e.target.dataset.role;
                this.handleDemoLogin(role);
            }
        });

        // Manual close button handler
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-close') || e.target.closest('.btn-close')) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        console.log('Manual close modal called');
        try {
            const modalElement = document.getElementById('loginModal');
            if (modalElement) {
                // Force close with multiple methods
                modalElement.style.display = 'none';
                modalElement.classList.remove('show');
                modalElement.setAttribute('aria-hidden', 'true');
                modalElement.removeAttribute('aria-modal');
                
                // Remove body classes
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                
                // Remove all backdrops
                const backdrops = document.querySelectorAll('.modal-backdrop');
                backdrops.forEach(backdrop => backdrop.remove());
                
                console.log('Modal manually closed');
            }
        } catch (error) {
            console.error('Error manually closing modal:', error);
        }
    }

    selectLoginRole(role) {
        this.selectedLoginRole = role;
        console.log('Selected login role:', role);
        
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
        const loginBtn = document.getElementById('loginBtn');
        const emailLabel = document.getElementById('loginEmailLabel');
        const passwordHelpText = document.getElementById('passwordHelpText');
        const studentTypeSelection = document.getElementById('studentTypeSelection');

        if (role === 'student') {
            // Show student type selection
            if (studentTypeSelection) {
                studentTypeSelection.style.display = 'block';
            }
            
            // Initially show independent student fields (email/password)
            if (nameGroup) nameGroup.style.display = 'none';
            if (accessCodeGroup) accessCodeGroup.style.display = 'none';
            if (nameField) nameField.disabled = true;
            if (accessCodeField) accessCodeField.disabled = true;
            
            if (emailField) {
                emailField.style.display = 'block';
                emailField.disabled = false;
                emailField.placeholder = 'Enter your email';
            }
            if (passwordField) {
                passwordField.style.display = 'block';
                passwordField.disabled = false;
                passwordField.placeholder = 'Enter your password';
            }
            
            // Update label
            if (emailLabel) {
                emailLabel.textContent = 'Email';
            }
            
            // Update help text
            if (passwordHelpText) {
                passwordHelpText.textContent = 'Password must be at least 8 characters';
            }
            
            // Add event listeners for student type selection
            this.setupStudentTypeListeners();
            
        } else {
            // Hide student type selection for other roles
            if (studentTypeSelection) {
                studentTypeSelection.style.display = 'none';
            }
            // Show email and password fields for other roles
            if (nameGroup) nameGroup.style.display = 'none';
            if (accessCodeGroup) accessCodeGroup.style.display = 'none';
            if (nameField) nameField.disabled = true;
            if (accessCodeField) accessCodeField.disabled = true;
            
            if (emailField) {
                emailField.style.display = 'block';
                emailField.disabled = false;
                emailField.placeholder = 'Enter your email';
            }
            if (passwordField) {
                passwordField.style.display = 'block';
                passwordField.disabled = false;
                passwordField.placeholder = 'Enter your password';
            }
            
            // Update label
            if (emailLabel) {
                emailLabel.textContent = 'Email';
            }
            
            // Update help text
            if (passwordHelpText) {
                passwordHelpText.textContent = 'Password must be at least 8 characters';
            }
        }
        
        // Enable login button
        if (loginBtn) {
            loginBtn.disabled = false;
        }
    }

    setupStudentTypeListeners() {
        const independentRadio = document.getElementById('independentStudent');
        const classRadio = document.getElementById('classStudent');
        
        if (independentRadio) {
            independentRadio.addEventListener('change', () => {
                if (independentRadio.checked) {
                    this.showIndependentStudentFields();
                }
            });
        }
        
        if (classRadio) {
            classRadio.addEventListener('change', () => {
                if (classRadio.checked) {
                    this.showClassStudentFields();
                }
            });
        }
    }

    showIndependentStudentFields() {
        const emailField = document.getElementById('loginEmail');
        const passwordField = document.getElementById('loginPassword');
        const nameField = document.getElementById('loginName');
        const accessCodeField = document.getElementById('loginAccessCode');
        const nameGroup = document.getElementById('loginNameGroup');
        const accessCodeGroup = document.getElementById('loginAccessCodeGroup');
        const emailLabel = document.getElementById('loginEmailLabel');
        const passwordHelpText = document.getElementById('passwordHelpText');

        // Show email/password fields
        if (emailField) {
            emailField.style.display = 'block';
            emailField.disabled = false;
            emailField.placeholder = 'Enter your email';
        }
        if (passwordField) {
            passwordField.style.display = 'block';
            passwordField.disabled = false;
            passwordField.placeholder = 'Enter your password';
        }

        // Hide name/access code fields
        if (nameGroup) nameGroup.style.display = 'none';
        if (accessCodeGroup) accessCodeGroup.style.display = 'none';
        if (nameField) nameField.disabled = true;
        if (accessCodeField) accessCodeField.disabled = true;

        // Update labels
        if (emailLabel) emailLabel.textContent = 'Email';
        if (passwordHelpText) passwordHelpText.textContent = 'Password must be at least 8 characters';
    }

    showClassStudentFields() {
        const emailField = document.getElementById('loginEmail');
        const passwordField = document.getElementById('loginPassword');
        const nameField = document.getElementById('loginName');
        const accessCodeField = document.getElementById('loginAccessCode');
        const nameGroup = document.getElementById('loginNameGroup');
        const accessCodeGroup = document.getElementById('loginAccessCodeGroup');
        const emailLabel = document.getElementById('loginEmailLabel');
        const passwordHelpText = document.getElementById('passwordHelpText');

        // Hide email/password fields
        if (emailField) {
            emailField.style.display = 'none';
            emailField.disabled = true;
        }
        if (passwordField) {
            passwordField.style.display = 'none';
            passwordField.disabled = true;
        }

        // Show name/access code fields
        if (nameGroup) nameGroup.style.display = 'block';
        if (accessCodeGroup) accessCodeGroup.style.display = 'block';
        if (nameField) {
            nameField.disabled = false;
            nameField.placeholder = 'Enter your name';
        }
        if (accessCodeField) {
            accessCodeField.disabled = false;
            accessCodeField.placeholder = 'Enter your access code';
        }

        // Update labels
        if (emailLabel) emailLabel.textContent = 'Name';
        if (passwordHelpText) passwordHelpText.textContent = 'Access code provided by your teacher';
    }

    async handleLogin() {
        if (!this.selectedLoginRole) {
            this.showError('Please select a role first.');
            return;
        }

        let credentials = {};
        
        if (this.selectedLoginRole === 'student') {
            // Check student type
            const independentRadio = document.getElementById('independentStudent');
            const classRadio = document.getElementById('classStudent');
            
            if (independentRadio && independentRadio.checked) {
                // Independent student login
                const email = document.getElementById('loginEmail')?.value;
                const password = document.getElementById('loginPassword')?.value;
                
                if (!email || !password) {
                    this.showError('Please enter your email and password.');
                    return;
                }
                
                credentials = { email, password };
            } else if (classRadio && classRadio.checked) {
                // Class student login
                const name = document.getElementById('loginName')?.value;
                const accessCode = document.getElementById('loginAccessCode')?.value;
                
                if (!name || !accessCode) {
                    this.showError('Please enter your name and access code.');
                    return;
                }
                
                credentials = { name, accessCode };
            } else {
                this.showError('Please select a student type.');
                return;
            }
        } else {
            // Other roles use email/password
            const email = document.getElementById('loginEmail')?.value;
            const password = document.getElementById('loginPassword')?.value;
            
            if (!email || !password) {
                this.showError('Please enter your email and password.');
                return;
            }
            
            credentials = { email, password };
        }

        this.showLoading(true);
        
        try {
            const result = await window.auth.login(this.selectedLoginRole, credentials);
            
            if (result.success) {
                console.log('Login successful, attempting to close modal...');
                
                // Close modal immediately
                setTimeout(() => {
                    this.closeModal();
                }, 100);
                
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
                console.log('Demo login successful, attempting to close modal...');
                
                // Close modal immediately
                setTimeout(() => {
                    this.closeModal();
                }, 100);
                
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

    // Registration methods
    selectRegisterRole(role) {
        console.log('selectRegisterRole called with role:', role);
        this.selectedRegisterRole = role;
        console.log('selectedRegisterRole set to:', this.selectedRegisterRole);
        
        // Update UI - highlight selected role
        document.querySelectorAll('.role-option-card-small').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.getElementById(`register-role-${role}`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
            console.log('Selected card found and highlighted:', selectedCard.id);
        } else {
            console.error('Selected card not found for role:', role);
        }

        // Show appropriate registration form and enable fields
        this.updateRegistrationFields(role);
    }

    updateRegistrationFields(role) {
        // First, remove required attributes from ALL forms to prevent validation issues
        const allForms = document.querySelectorAll('.registration-form');
        allForms.forEach(form => {
            const allRequiredFields = form.querySelectorAll('input[required], select[required]');
            allRequiredFields.forEach(field => {
                field.removeAttribute('required');
            });
        });

        // Hide all registration forms
        allForms.forEach(form => {
            form.style.display = 'none';
        });

        // Show selected role's registration form
        const registrationForm = document.getElementById(`${role}-registration`);
        if (registrationForm) {
            registrationForm.style.display = 'block';
            
            // Enable all input fields in the form
            const inputs = registrationForm.querySelectorAll('input');
            inputs.forEach(input => {
                input.disabled = false;
                input.setAttribute('required', 'required'); // Re-add required for visible form
                // Update placeholder if it says "Select a role first"
                if (input.placeholder === 'Select a role first') {
                    input.placeholder = `Enter ${input.type === 'password' ? 'password' : input.type === 'email' ? 'email' : input.id}`;
                }
            });

            // Enable all select fields in the form
            const selects = registrationForm.querySelectorAll('select');
            selects.forEach(select => {
                select.disabled = false;
                select.setAttribute('required', 'required'); // Re-add required for visible form
                // Update placeholder option if it says "Select a role first"
                const firstOption = select.querySelector('option:first-child');
                if (firstOption && firstOption.textContent === 'Select a role first') {
                    firstOption.textContent = `Select ${select.id.replace(role, '').replace('GradeLevel', 'grade level')}`;
                }
            });
        }
    }

    async handleRegistration() {
        console.log('handleRegistration called, selectedRegisterRole:', this.selectedRegisterRole);
        if (!this.selectedRegisterRole) {
            this.showError('Please select a role first.');
            return;
        }

        try {
            const registrationForm = document.getElementById(`${this.selectedRegisterRole}-registration`);
            console.log('Looking for registration form with ID:', `${this.selectedRegisterRole}-registration`);
            console.log('Found registration form:', registrationForm);
            if (!registrationForm) {
                this.showError('Registration form not found for selected role.');
                return;
            }

            // Collect form data based on role
            let data = {};
            const inputs = registrationForm.querySelectorAll('input');
            const selects = registrationForm.querySelectorAll('select');
            
            inputs.forEach(input => {
                if (input.value) {
                    data[input.id] = input.value;
                }
            });

            selects.forEach(select => {
                if (select.value) {
                    data[select.id] = select.value;
                }
            });

            // Validate required fields
            if (!data[`${this.selectedRegisterRole}Name`] || !data[`${this.selectedRegisterRole}Email`] || !data[`${this.selectedRegisterRole}Password`]) {
                this.showError('Please fill in all required fields.');
                return;
            }

            // Prepare registration payload
            const payload = {
                name: data[`${this.selectedRegisterRole}Name`],
                email: data[`${this.selectedRegisterRole}Email`],
                password: data[`${this.selectedRegisterRole}Password`],
                role: this.selectedRegisterRole
            };

            // Add role-specific fields
            if (this.selectedRegisterRole === 'admin' && data.adminSecretPassword) {
                payload.secretPassword = data.adminSecretPassword;
            }

            this.showLoading(true);

            // Call registration API
            const apiBaseUrl = window.AQEConfig?.getApiBaseUrl() || 'http://localhost:5001';
            let endpoint = '';
            let requestPayload = { ...payload };

            // Determine the correct endpoint and payload based on role
            switch (this.selectedRegisterRole) {
                case 'student':
                    endpoint = '/api/auth/register-student';
                    requestPayload = {
                        name: payload.name,
                        email: payload.email,
                        password: payload.password,
                        gradeLevel: data['studentGradeLevel'] || '8th Grade' // Default grade level
                    };
                    break;
                case 'teacher':
                    endpoint = '/api/auth/register-teacher';
                    requestPayload = {
                        name: payload.name,
                        email: payload.email,
                        password: payload.password,
                        subjectTaught: data['teacherSubjectTaught'] || 'Mathematics',
                        gradeLevelTaught: data['teacherGradeLevelTaught'] || '6th Grade'
                    };
                    break;
                case 'parent':
                    endpoint = '/api/auth/register-parent';
                    requestPayload = {
                        name: payload.name,
                        email: payload.email,
                        password: payload.password,
                        children: [] // Empty for now - parents need to provide child access codes
                    };
                    break;
                case 'admin':
                    endpoint = '/api/auth/register-admin';
                    requestPayload = {
                        name: payload.name,
                        email: payload.email,
                        password: payload.password,
                        adminPassword: data['adminSecretPassword'] || 'admin'
                    };
                    break;
                default:
                    this.showError('Invalid role selected.');
                    return;
            }

            const response = await fetch(`${apiBaseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestPayload)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.showSuccess('Registration successful! Logging you in...');
                
                // Auto-login after successful registration
                try {
                    // Temporarily disable auto-login to test registration
                    console.log('Registration successful! Auto-login disabled for testing.');
                    this.showSuccess('Registration successful! Please login manually.');
                    const loginTab = document.getElementById('login-tab');
                    if (loginTab) {
                        loginTab.click();
                    }
                    return;
                    
                    const loginResult = await window.auth.login(this.selectedRegisterRole, {
                        email: requestPayload.email,
                        password: requestPayload.password
                    });
                    
                    if (loginResult.success) {
                        // Close modal and dispatch login event
                        setTimeout(() => {
                            this.closeModal();
                            window.dispatchEvent(new CustomEvent('userLogin', { detail: loginResult.user }));
                        }, 1000);
                    } else {
                        // Registration succeeded but auto-login failed
                        this.showSuccess('Registration successful! Please login manually.');
                        const loginTab = document.getElementById('login-tab');
                        if (loginTab) {
                            loginTab.click();
                        }
                    }
                } catch (loginError) {
                    console.error('Auto-login failed:', loginError);
                    this.showSuccess('Registration successful! Please login manually.');
                    const loginTab = document.getElementById('login-tab');
                    if (loginTab) {
                        loginTab.click();
                    }
                }
                
                // Clear registration form
                inputs.forEach(input => {
                    input.value = '';
                });
            } else {
                this.showError(result.message || 'Registration failed. Please try again.');
            }

        } catch (error) {
            this.showError('An error occurred during registration. Please try again.');
            console.error('Registration error:', error);
        } finally {
            this.showLoading(false);
        }
    }
}

// Global functions for backward compatibility
function selectLoginRole(role) {
    if (window.loginModalHandler) {
        window.loginModalHandler.selectLoginRole(role);
    }
}

function selectRegisterRole(role) {
    console.log('Global selectRegisterRole called with role:', role);
    if (window.loginModalHandler) {
        console.log('loginModalHandler exists, calling method');
        window.loginModalHandler.selectRegisterRole(role);
    } else {
        console.error('loginModalHandler not found!');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.loginModalHandler = new LoginModalHandler();
});
