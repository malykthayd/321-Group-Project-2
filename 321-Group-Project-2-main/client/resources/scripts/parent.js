// Parent Manager for handling parent-specific functionality
class ParentManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5000/api';
        this.currentParent = null;
        this.children = [];
        this.digitalLibrary = [];
        
        this.initializeEventListeners();
        this.loadParentData();
    }

    async loadParentData() {
        if (!window.multiRoleAuth || !window.multiRoleAuth.currentUser) {
            console.error('No authenticated user found');
            return;
        }

        this.currentParent = window.multiRoleAuth.currentUser;
        console.log('Parent data loaded:', this.currentParent);

        // Load dashboard data
        await this.loadDashboard();
    }

    initializeEventListeners() {
        // Tab change listeners
        document.addEventListener('shown.bs.tab', (event) => {
            const tabTarget = event.target.getAttribute('data-bs-target');
            if (tabTarget === '#parent-dashboard-content') {
                this.loadDashboard();
            } else if (tabTarget === '#parent-children-content') {
                this.loadChildren();
            } else if (tabTarget === '#parent-digital-library-content') {
                this.loadDigitalLibrary();
            }
        });
    }

    async loadDashboard() {
        if (!this.currentParent) {
            console.error('No current parent found');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/parent/${this.currentParent.parentId}/dashboard`);
            const data = await response.json();

            if (response.ok) {
                this.updateDashboard(data);
            } else {
                console.error('Error loading dashboard:', data.message);
            }

            // Load curriculum analytics
            if (window.app && window.app.loadParentAnalytics) {
                await window.app.loadParentAnalytics();
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    updateDashboard(dashboardData) {
        // Update stat cards
        const statCards = {
            'totalChildren': dashboardData.totalChildren || 0,
            'totalLessonsCompleted': dashboardData.totalLessonsCompleted || 0,
            'totalPracticeMaterialsCompleted': dashboardData.totalPracticeMaterialsCompleted || 0,
            'averageScore': Math.round(dashboardData.averageScore || 0)
        };

        Object.keys(statCards).forEach(key => {
            const element = document.getElementById(`parent-${key}`);
            if (element) {
                element.textContent = statCards[key];
            }
        });

        // Update recent activity
        this.updateRecentActivity(dashboardData.recentActivity || []);
    }

    updateRecentActivity(activities) {
        const activityContainer = document.getElementById('parentRecentActivity');
        if (!activityContainer) return;

        if (activities.length === 0) {
            activityContainer.innerHTML = '<p class="text-muted">No recent activity</p>';
            return;
        }

        activityContainer.innerHTML = activities.map(activity => `
            <div class="activity-item d-flex align-items-center p-2 border-bottom">
                <div class="activity-icon me-3">
                    <i class="bi bi-${activity.type === 'lesson_completed' ? 'book-fill' : 'clipboard-check-fill'} text-success"></i>
                </div>
                <div class="activity-content flex-grow-1">
                    <h6 class="mb-1">${activity.studentName} - ${activity.lessonTitle || activity.materialTitle}</h6>
                    <p class="mb-0 text-muted small">
                        Completed ${this.formatDate(activity.completedAt)} 
                        ${activity.score ? `• Score: ${activity.score}%` : ''}
                    </p>
                </div>
            </div>
        `).join('');
    }

    async loadChildren() {
        if (!this.currentParent) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/parent/${this.currentParent.parentId}/children`);
            const data = await response.json();

            if (response.ok) {
                this.children = data;
                this.updateChildren(data);
            } else {
                console.error('Error loading children:', data.message);
            }
        } catch (error) {
            console.error('Error loading children:', error);
        }
    }

    updateChildren(children) {
        const container = document.getElementById('parentChildrenContent');
        if (!container) return;

        if (children.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">No children linked to your account yet</p>';
            return;
        }

        container.innerHTML = children.map(child => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <h5 class="card-title">${child.name}</h5>
                            <div class="child-info">
                                <p class="mb-1"><strong>Grade Level:</strong> ${child.gradeLevel}</p>
                                ${child.teacherName ? `<p class="mb-1"><strong>Teacher:</strong> ${child.teacherName}</p>` : ''}
                                <p class="mb-1"><strong>Last Login:</strong> ${child.lastLogin ? this.formatDate(child.lastLogin) : 'Never'}</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="child-stats">
                                <div class="stat-item">
                                    <span class="stat-label">Lessons Completed:</span>
                                    <span class="stat-value">${child.totalLessonsCompleted}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">Practice Materials:</span>
                                    <span class="stat-value">${child.totalPracticeMaterialsCompleted}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">Average Score:</span>
                                    <span class="stat-value">${Math.round(child.averageScore)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadDigitalLibrary() {
        if (!this.currentParent) return;

        try {
            // Use the new curriculum library system
            if (window.app && window.app.loadParentLibrary) {
                await window.app.loadParentLibrary();
            } else {
                console.error('AQEPlatform library methods not available');
            }
        } catch (error) {
            console.error('Error loading digital library:', error);
        }
    }

    updateDigitalLibrary(lessons) {
        const container = document.getElementById('parentDigitalLibraryContent');
        if (!container) return;

        if (lessons.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">No lessons available for your children\'s grade levels</p>';
            return;
        }

        // Group lessons by subject
        const groupedLessons = this.groupLessonsBySubject(lessons);

        container.innerHTML = Object.keys(groupedLessons).map(subject => `
            <div class="subject-section mb-4">
                <h5 class="subject-header">${subject}</h5>
                <div class="row">
                    ${groupedLessons[subject].map(lesson => `
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h6 class="card-title">${lesson.title}</h6>
                                    <p class="card-text text-muted small">${lesson.description}</p>
                                    <div class="lesson-meta">
                                        <span class="badge bg-primary me-2">${lesson.gradeLevel}</span>
                                        <small class="text-muted">Created by: ${lesson.createdBy}</small>
                                    </div>
                                    <div class="lesson-tags mt-2">
                                        ${lesson.tags ? lesson.tags.split(',').map(tag => `<span class="badge bg-light text-dark me-1">${tag.trim()}</span>`).join('') : ''}
                                    </div>
                                    <div class="lesson-actions mt-3">
                                        <button class="btn btn-outline-primary btn-sm" onclick="window.parentManager.showAssignLessonModal(${lesson.id}, '${lesson.title}')">
                                            <i class="bi bi-person-plus me-1"></i>Assign to Child
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    groupLessonsBySubject(lessons) {
        return lessons.reduce((groups, lesson) => {
            const subject = lesson.subject;
            if (!groups[subject]) {
                groups[subject] = [];
            }
            groups[subject].push(lesson);
            return groups;
        }, {});
    }

    showAssignLessonModal(lessonId, lessonTitle) {
        if (this.children.length === 0) {
            alert('No children linked to your account');
            return;
        }

        // Create modal HTML
        const modalHtml = `
            <div class="modal fade" id="assignLessonModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Assign Lesson: ${lessonTitle}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="assignLessonForm">
                                <div class="mb-3">
                                    <label for="assignChildSelect" class="form-label">Select Child</label>
                                    <select class="form-select" id="assignChildSelect" required>
                                        <option value="">Choose a child...</option>
                                        ${this.children.map(child => `
                                            <option value="${child.id}">${child.name} (${child.gradeLevel})</option>
                                        `).join('')}
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="assignmentNotes" class="form-label">Notes (Optional)</label>
                                    <textarea class="form-control" id="assignmentNotes" rows="3" placeholder="Add any notes for this assignment..."></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" onclick="window.parentManager.assignLesson(${lessonId})">Assign Lesson</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('assignLessonModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('assignLessonModal'));
        modal.show();
    }

    async assignLesson(lessonId) {
        const childId = document.getElementById('assignChildSelect').value;
        const notes = document.getElementById('assignmentNotes').value;

        if (!childId) {
            alert('Please select a child');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/parent/${this.currentParent.parentId}/assign-lesson`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    studentId: parseInt(childId), 
                    lessonId, 
                    notes 
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Lesson assigned successfully!');
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('assignLessonModal'));
                if (modal) {
                    modal.hide();
                }
                // Refresh children data to show updated stats
                this.loadChildren();
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error assigning lesson:', error);
            alert('An error occurred while assigning the lesson');
        }
    }

    // Helper methods
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
}

// Global functions for HTML onclick events
function showAssignLessonModal(lessonId, lessonTitle) {
    if (window.parentManager) {
        window.parentManager.showAssignLessonModal(lessonId, lessonTitle);
    }
}

function assignLesson(lessonId) {
    if (window.parentManager) {
        window.parentManager.assignLesson(lessonId);
    }
}
