// Admin Manager for handling admin-specific functionality
class AdminManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5000/api';
        this.currentAdmin = null;
        this.digitalLibrary = [];
        this.users = [];
        
        this.initializeEventListeners();
        this.loadAdminData();
    }

    async loadAdminData() {
        if (!window.multiRoleAuth || !window.multiRoleAuth.currentUser) {
            console.error('No authenticated user found');
            return;
        }

        this.currentAdmin = window.multiRoleAuth.currentUser;
        console.log('Admin data loaded:', this.currentAdmin);

        // Load dashboard data
        await this.loadDashboard();
    }

    initializeEventListeners() {
        // Tab change listeners
        document.addEventListener('shown.bs.tab', (event) => {
            const tabTarget = event.target.getAttribute('data-bs-target');
            if (tabTarget === '#admin-dashboard-content') {
                this.loadDashboard();
            } else if (tabTarget === '#admin-digital-library-content') {
                this.loadDigitalLibrary();
            } else if (tabTarget === '#admin-user-management-content') {
                this.loadUserManagement();
            }
        });
    }

    async loadDashboard() {
        if (!this.currentAdmin) {
            console.error('No current admin found');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/admin/${this.currentAdmin.adminId}/dashboard`);
            const data = await response.json();

            if (response.ok) {
                this.updateDashboard(data);
            } else {
                console.error('Error loading dashboard:', data.message);
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    updateDashboard(dashboardData) {
        // Update stat cards
        const statCards = {
            'totalUsers': dashboardData.totalUsers || 0,
            'totalTeachers': dashboardData.totalTeachers || 0,
            'totalStudents': dashboardData.totalStudents || 0,
            'totalParents': dashboardData.totalParents || 0,
            'totalLessons': dashboardData.totalLessons || 0,
            'totalPracticeMaterials': dashboardData.totalPracticeMaterials || 0,
            'totalLessonsCompleted': dashboardData.totalLessonsCompleted || 0,
            'averageScore': Math.round(dashboardData.averageScore || 0)
        };

        Object.keys(statCards).forEach(key => {
            const element = document.getElementById(`admin-${key}`);
            if (element) {
                element.textContent = statCards[key];
            }
        });

        // Update recent activity
        this.updateRecentActivity(dashboardData.recentActivity || []);
    }

    updateRecentActivity(activities) {
        const activityContainer = document.getElementById('adminRecentActivity');
        if (!activityContainer) return;

        if (activities.length === 0) {
            activityContainer.innerHTML = '<p class="text-muted">No recent activity</p>';
            return;
        }

        activityContainer.innerHTML = activities.map(activity => `
            <div class="activity-item d-flex align-items-center p-2 border-bottom">
                <div class="activity-icon me-3">
                    <i class="bi bi-${activity.type === 'user_registered' ? 'person-plus-fill' : 'book-fill'} text-info"></i>
                </div>
                <div class="activity-content flex-grow-1">
                    <h6 class="mb-1">
                        ${activity.type === 'user_registered' ? 
                            `New ${activity.role} registered: ${activity.userName}` : 
                            `${activity.studentName} completed: ${activity.lessonTitle}`
                        }
                    </h6>
                    <p class="mb-0 text-muted small">
                        ${this.formatDate(activity.createdAt || activity.completedAt)}
                        ${activity.score ? `• Score: ${activity.score}%` : ''}
                    </p>
                </div>
            </div>
        `).join('');
    }

    async loadDigitalLibrary() {
        if (!this.currentAdmin) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/admin/${this.currentAdmin.adminId}/digital-library`);
            const data = await response.json();

            if (response.ok) {
                this.digitalLibrary = data;
                this.updateDigitalLibrary(data);
            } else {
                console.error('Error loading digital library:', data.message);
            }
        } catch (error) {
            console.error('Error loading digital library:', error);
        }
    }

    updateDigitalLibrary(lessons) {
        const container = document.getElementById('adminDigitalLibraryContent');
        if (!container) return;

        // Add create lesson button
        container.innerHTML = `
            <div class="mb-3">
                <button class="btn btn-primary" onclick="window.adminManager.showCreateLessonModal()">
                    <i class="bi bi-plus-circle me-2"></i>Create New Lesson
                </button>
            </div>
        `;

        if (lessons.length === 0) {
            container.innerHTML += '<p class="text-muted text-center">No lessons created yet</p>';
            return;
        }

        container.innerHTML += lessons.map(lesson => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h5 class="card-title">${lesson.title}</h5>
                            <p class="card-text text-muted">${lesson.description}</p>
                            <div class="lesson-meta">
                                <span class="badge bg-primary me-2">${lesson.subject}</span>
                                <span class="badge bg-secondary me-2">${lesson.gradeLevel}</span>
                                <span class="badge ${lesson.isActive ? 'bg-success' : 'bg-danger'} me-2">${lesson.isActive ? 'Active' : 'Inactive'}</span>
                                <span class="badge ${lesson.isAvailable ? 'bg-info' : 'bg-warning'}">${lesson.isAvailable ? 'Available' : 'Unavailable'}</span>
                            </div>
                            <div class="lesson-stats mt-2">
                                <small class="text-muted">
                                    Assignments: ${lesson.totalAssignments} • Completions: ${lesson.totalCompletions} • 
                                    Created: ${this.formatDate(lesson.createdAt)}
                                </small>
                            </div>
                        </div>
                        <div class="lesson-actions">
                            <button class="btn btn-outline-primary btn-sm me-2" onclick="window.adminManager.showEditLessonModal(${lesson.id})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="window.adminManager.deleteLesson(${lesson.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showCreateLessonModal() {
        const modalHtml = `
            <div class="modal fade" id="createLessonModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Create New Lesson</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="createLessonForm">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="lessonTitle" class="form-label">Title</label>
                                            <input type="text" class="form-control" id="lessonTitle" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="lessonSubject" class="form-label">Subject</label>
                                            <select class="form-select" id="lessonSubject" required>
                                                <option value="">Select Subject</option>
                                                <option value="Science">Science</option>
                                                <option value="Technology">Technology</option>
                                                <option value="English">English</option>
                                                <option value="Math">Math</option>
                                                <option value="Geography">Geography</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="lessonGradeLevel" class="form-label">Grade Level</label>
                                            <select class="form-select" id="lessonGradeLevel" required>
                                                <option value="">Select Grade Level</option>
                                                <option value="Kindergarten">Kindergarten</option>
                                                <option value="1st Grade">1st Grade</option>
                                                <option value="2nd Grade">2nd Grade</option>
                                                <option value="3rd Grade">3rd Grade</option>
                                                <option value="4th Grade">4th Grade</option>
                                                <option value="5th Grade">5th Grade</option>
                                                <option value="6th Grade">6th Grade</option>
                                                <option value="7th Grade">7th Grade</option>
                                                <option value="8th Grade">8th Grade</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="lessonTags" class="form-label">Tags (comma-separated)</label>
                                            <input type="text" class="form-control" id="lessonTags" placeholder="e.g., interactive, quiz, video">
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="lessonDescription" class="form-label">Description</label>
                                    <textarea class="form-control" id="lessonDescription" rows="3" required></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="lessonContent" class="form-label">Content</label>
                                    <textarea class="form-control" id="lessonContent" rows="8" required placeholder="Enter the lesson content here..."></textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="lessonResourceUrl" class="form-label">Resource URL (Optional)</label>
                                    <input type="url" class="form-control" id="lessonResourceUrl" placeholder="https://example.com">
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="lessonIsActive" checked>
                                            <label class="form-check-label" for="lessonIsActive">Active</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="lessonIsAvailable" checked>
                                            <label class="form-check-label" for="lessonIsAvailable">Available to Users</label>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" onclick="window.adminManager.createLesson()">Create Lesson</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('createLessonModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('createLessonModal'));
        modal.show();
    }

    async createLesson() {
        const title = document.getElementById('lessonTitle').value;
        const description = document.getElementById('lessonDescription').value;
        const subject = document.getElementById('lessonSubject').value;
        const gradeLevel = document.getElementById('lessonGradeLevel').value;
        const content = document.getElementById('lessonContent').value;
        const resourceUrl = document.getElementById('lessonResourceUrl').value;
        const tags = document.getElementById('lessonTags').value;
        const isActive = document.getElementById('lessonIsActive').checked;
        const isAvailable = document.getElementById('lessonIsAvailable').checked;

        if (!title || !description || !subject || !gradeLevel || !content) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/admin/${this.currentAdmin.adminId}/create-lesson`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    subject,
                    gradeLevel,
                    content,
                    resourceUrl: resourceUrl || null,
                    tags: tags || null,
                    isAvailable
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Lesson created successfully!');
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('createLessonModal'));
                if (modal) {
                    modal.hide();
                }
                // Refresh digital library
                this.loadDigitalLibrary();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error creating lesson:', error);
            alert('An error occurred while creating the lesson');
        }
    }

    showEditLessonModal(lessonId) {
        // Find the lesson data
        const lesson = this.digitalLibrary.find(l => l.id === lessonId);
        if (!lesson) {
            alert('Lesson not found');
            return;
        }

        const modalHtml = `
            <div class="modal fade" id="editLessonModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Lesson: ${lesson.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editLessonForm">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editLessonTitle" class="form-label">Title</label>
                                            <input type="text" class="form-control" id="editLessonTitle" value="${lesson.title}" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editLessonSubject" class="form-label">Subject</label>
                                            <select class="form-select" id="editLessonSubject" required>
                                                <option value="Science" ${lesson.subject === 'Science' ? 'selected' : ''}>Science</option>
                                                <option value="Technology" ${lesson.subject === 'Technology' ? 'selected' : ''}>Technology</option>
                                                <option value="English" ${lesson.subject === 'English' ? 'selected' : ''}>English</option>
                                                <option value="Math" ${lesson.subject === 'Math' ? 'selected' : ''}>Math</option>
                                                <option value="Geography" ${lesson.subject === 'Geography' ? 'selected' : ''}>Geography</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editLessonGradeLevel" class="form-label">Grade Level</label>
                                            <select class="form-select" id="editLessonGradeLevel" required>
                                                <option value="Kindergarten" ${lesson.gradeLevel === 'Kindergarten' ? 'selected' : ''}>Kindergarten</option>
                                                <option value="1st Grade" ${lesson.gradeLevel === '1st Grade' ? 'selected' : ''}>1st Grade</option>
                                                <option value="2nd Grade" ${lesson.gradeLevel === '2nd Grade' ? 'selected' : ''}>2nd Grade</option>
                                                <option value="3rd Grade" ${lesson.gradeLevel === '3rd Grade' ? 'selected' : ''}>3rd Grade</option>
                                                <option value="4th Grade" ${lesson.gradeLevel === '4th Grade' ? 'selected' : ''}>4th Grade</option>
                                                <option value="5th Grade" ${lesson.gradeLevel === '5th Grade' ? 'selected' : ''}>5th Grade</option>
                                                <option value="6th Grade" ${lesson.gradeLevel === '6th Grade' ? 'selected' : ''}>6th Grade</option>
                                                <option value="7th Grade" ${lesson.gradeLevel === '7th Grade' ? 'selected' : ''}>7th Grade</option>
                                                <option value="8th Grade" ${lesson.gradeLevel === '8th Grade' ? 'selected' : ''}>8th Grade</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="mb-3">
                                            <label for="editLessonTags" class="form-label">Tags (comma-separated)</label>
                                            <input type="text" class="form-control" id="editLessonTags" value="${lesson.tags || ''}">
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="editLessonDescription" class="form-label">Description</label>
                                    <textarea class="form-control" id="editLessonDescription" rows="3" required>${lesson.description}</textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="editLessonContent" class="form-label">Content</label>
                                    <textarea class="form-control" id="editLessonContent" rows="8" required>${lesson.content || ''}</textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="editLessonResourceUrl" class="form-label">Resource URL (Optional)</label>
                                    <input type="url" class="form-control" id="editLessonResourceUrl" value="${lesson.resourceUrl || ''}">
                                </div>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="editLessonIsActive" ${lesson.isActive ? 'checked' : ''}>
                                            <label class="form-check-label" for="editLessonIsActive">Active</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="editLessonIsAvailable" ${lesson.isAvailable ? 'checked' : ''}>
                                            <label class="form-check-label" for="editLessonIsAvailable">Available to Users</label>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" onclick="window.adminManager.updateLesson(${lessonId})">Update Lesson</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('editLessonModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editLessonModal'));
        modal.show();
    }

    async updateLesson(lessonId) {
        const title = document.getElementById('editLessonTitle').value;
        const description = document.getElementById('editLessonDescription').value;
        const subject = document.getElementById('editLessonSubject').value;
        const gradeLevel = document.getElementById('editLessonGradeLevel').value;
        const content = document.getElementById('editLessonContent').value;
        const resourceUrl = document.getElementById('editLessonResourceUrl').value;
        const tags = document.getElementById('editLessonTags').value;
        const isActive = document.getElementById('editLessonIsActive').checked;
        const isAvailable = document.getElementById('editLessonIsAvailable').checked;

        if (!title || !description || !subject || !gradeLevel || !content) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/admin/${this.currentAdmin.adminId}/lesson/${lessonId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    subject,
                    gradeLevel,
                    content,
                    resourceUrl: resourceUrl || null,
                    tags: tags || null,
                    isActive,
                    isAvailable
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Lesson updated successfully!');
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('editLessonModal'));
                if (modal) {
                    modal.hide();
                }
                // Refresh digital library
                this.loadDigitalLibrary();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error updating lesson:', error);
            alert('An error occurred while updating the lesson');
        }
    }

    async deleteLesson(lessonId) {
        if (!confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/admin/${this.currentAdmin.adminId}/lesson/${lessonId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                alert('Lesson deleted successfully!');
                this.loadDigitalLibrary();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error deleting lesson:', error);
            alert('An error occurred while deleting the lesson');
        }
    }

    async loadUserManagement() {
        if (!this.currentAdmin) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/admin/${this.currentAdmin.adminId}/user-management`);
            const data = await response.json();

            if (response.ok) {
                this.users = data;
                this.updateUserManagement(data);
            } else {
                console.error('Error loading users:', data.message);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    updateUserManagement(users) {
        const container = document.getElementById('adminUserManagementContent');
        if (!container) return;

        if (users.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">No users found</p>';
            return;
        }

        container.innerHTML = `
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created</th>
                            <th>Last Login</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr>
                                <td>${user.name}</td>
                                <td>${user.email}</td>
                                <td><span class="badge bg-primary">${user.role}</span></td>
                                <td>${this.formatDate(user.createdAt)}</td>
                                <td>${user.lastLogin ? this.formatDate(user.lastLogin) : 'Never'}</td>
                                <td><span class="badge ${user.isActive ? 'bg-success' : 'bg-danger'}">${user.isActive ? 'Active' : 'Inactive'}</span></td>
                                <td>
                                    <div class="btn-group btn-group-sm">
                                        <button class="btn btn-outline-primary" onclick="window.adminManager.showEditUserModal(${user.id})">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button class="btn btn-outline-danger" onclick="window.adminManager.deleteUser(${user.id})">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    showEditUserModal(userId) {
        // Find the user data
        const user = this.users.find(u => u.id === userId);
        if (!user) {
            alert('User not found');
            return;
        }

        alert('Edit user functionality would be implemented here. User: ' + user.name);
        // In a real implementation, this would show a modal with user editing capabilities
    }

    async deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/admin/${this.currentAdmin.adminId}/user/${userId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                alert('User deleted successfully!');
                this.loadUserManagement();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('An error occurred while deleting the user');
        }
    }

    // Helper methods
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
}

// Global functions for HTML onclick events
function showCreateLessonModal() {
    if (window.adminManager) {
        window.adminManager.showCreateLessonModal();
    }
}

function createLesson() {
    if (window.adminManager) {
        window.adminManager.createLesson();
    }
}

function showEditLessonModal(lessonId) {
    if (window.adminManager) {
        window.adminManager.showEditLessonModal(lessonId);
    }
}

function updateLesson(lessonId) {
    if (window.adminManager) {
        window.adminManager.updateLesson(lessonId);
    }
}

function deleteLesson(lessonId) {
    if (window.adminManager) {
        window.adminManager.deleteLesson(lessonId);
    }
}