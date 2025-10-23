// Student Manager for handling student-specific functionality
class StudentManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5000/api';
        this.currentStudent = null;
        this.lessons = [];
        this.checkedOutLessons = [];
        this.practiceMaterials = [];
        
        this.initializeEventListeners();
        this.loadStudentData();
    }

    async loadStudentData() {
        if (!window.multiRoleAuth || !window.multiRoleAuth.currentUser) {
            console.error('No authenticated user found');
            return;
        }

        this.currentStudent = window.multiRoleAuth.currentUser;
        console.log('Student data loaded:', this.currentStudent);

        // Load dashboard data
        await this.loadDashboard();
    }

    initializeEventListeners() {
        // Tab change listeners
        document.addEventListener('shown.bs.tab', (event) => {
            const tabTarget = event.target.getAttribute('data-bs-target');
            if (tabTarget === '#student-dashboard-content') {
                this.loadDashboard();
            } else if (tabTarget === '#student-digital-library-content') {
                this.loadDigitalLibrary();
            } else if (tabTarget === '#student-my-work-content') {
                this.loadMyWork();
            } else if (tabTarget === '#student-practice-materials-content') {
                this.loadPracticeMaterials();
            }
        });
    }

    async loadDashboard() {
        if (!this.currentStudent) {
            console.error('No current student found');
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/student/${this.currentStudent.studentId}/dashboard`);
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
        // Update new dashboard metrics
        this.updateElement('studentTotalLessonsAssigned', dashboardData.totalLessonsAssigned || 0);
        this.updateElement('studentLessonsCompleted', dashboardData.lessonsCompleted || 0);
        this.updateElement('studentCurrentStreak', dashboardData.currentStreak || 0);
        this.updateElement('studentAverageScore', `${Math.round(dashboardData.averageScore || 0)}%`);

        // Load charts
        this.loadProgressChart(dashboardData);
        this.loadSubjectChart(dashboardData);
        this.loadRecentActivity(dashboardData.recentActivity || []);
    }

    loadProgressChart(dashboardData) {
        const canvas = document.getElementById('studentProgressChart');
        if (!canvas) return;

        // Simple progress chart implementation
        const ctx = canvas.getContext('2d');
        const data = dashboardData.progressData || [];
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw simple progress visualization
        ctx.fillStyle = '#007bff';
        ctx.fillRect(10, 10, (dashboardData.lessonsCompleted || 0) * 10, 20);
        
        ctx.fillStyle = '#6c757d';
        ctx.fillRect(10, 40, (dashboardData.totalLessonsAssigned || 0) * 10, 20);
    }

    loadSubjectChart(dashboardData) {
        const canvas = document.getElementById('studentSubjectChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const subjectData = dashboardData.subjectBreakdown || {
            'Science': 0,
            'Math': 0,
            'English': 0,
            'Technology': 0,
            'Geography': 0
        };

        // Simple pie chart implementation
        const total = Object.values(subjectData).reduce((sum, val) => sum + val, 0);
        if (total === 0) return;

        let currentAngle = 0;
        const colors = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'];
        let colorIndex = 0;

        Object.entries(subjectData).forEach(([subject, count]) => {
            if (count > 0) {
                const sliceAngle = (count / total) * 2 * Math.PI;
                ctx.beginPath();
                ctx.arc(100, 100, 80, currentAngle, currentAngle + sliceAngle);
                ctx.lineTo(100, 100);
                ctx.fillStyle = colors[colorIndex % colors.length];
                ctx.fill();
                currentAngle += sliceAngle;
                colorIndex++;
            }
        });
    }

    loadRecentActivity(activities) {
        const activityContainer = document.getElementById('studentRecentActivity');
        if (!activityContainer) return;

        if (activities.length === 0) {
            activityContainer.innerHTML = `
                <div class="text-center text-muted py-3">
                    <i class="bi bi-clock-history" style="font-size: 2rem;"></i>
                    <p class="mt-2 mb-0">No recent activity</p>
                    <small>Start learning to see your activity here!</small>
                </div>
            `;
            return;
        }

        activityContainer.innerHTML = activities.map(activity => `
            <div class="activity-item d-flex align-items-center p-3 border-bottom">
                <div class="activity-icon me-3">
                    <i class="bi bi-${activity.type === 'lesson_completed' ? 'book-fill' : 'clipboard-check-fill'} text-success"></i>
                </div>
                <div class="activity-content flex-grow-1">
                    <h6 class="mb-1">${activity.title}</h6>
                    <p class="mb-0 text-muted small">
                        Completed ${this.formatDate(activity.completedAt)} 
                        ${activity.score ? `• Score: ${activity.score}%` : ''}
                    </p>
                </div>
            </div>
        `).join('');
    }

    async loadDigitalLibrary() {
        if (!this.currentStudent) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/student/${this.currentStudent.studentId}/digital-library`);
            const data = await response.json();

            if (response.ok) {
                this.lessons = data;
                this.updateDigitalLibrary(data);
            } else {
                console.error('Error loading digital library:', data.message);
            }
        } catch (error) {
            console.error('Error loading digital library:', error);
        }
    }

    updateDigitalLibrary(lessons) {
        const container = document.getElementById('studentDigitalLibraryGrid');
        if (!container) return;

        if (lessons.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center text-muted py-5">
                    <i class="bi bi-book" style="font-size: 3rem;"></i>
                    <h5 class="mt-3">No lessons assigned yet</h5>
                    <p class="mb-0">Your teacher or parent will assign lessons for you to complete.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = lessons.map(lesson => `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-primary">${lesson.subject}</span>
                            <span class="badge ${lesson.assignedBy === 'teacher' ? 'bg-success' : 'bg-info'}">
                                ${lesson.assignedBy === 'teacher' ? 'Teacher' : 'Parent'}
                            </span>
                        </div>
                        <h6 class="card-title">${lesson.title}</h6>
                        <p class="card-text text-muted small">${lesson.description || 'No description available'}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">${lesson.gradeLevel}</small>
                            <button class="btn btn-primary btn-sm" onclick="window.studentManager.checkoutLesson(${lesson.id})">
                                <i class="bi bi-download me-1"></i>Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async checkoutLesson(lessonId) {
        if (!this.currentStudent) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/student/${this.currentStudent.studentId}/checkout-lesson`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ lessonId })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Lesson checked out successfully! You can now find it in "My Work".');
                this.loadDigitalLibrary(); // Refresh the library
                this.loadMyWork(); // Refresh my work
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error checking out lesson:', error);
            alert('An error occurred while checking out the lesson');
        }
    }

    async loadMyWork() {
        if (!this.currentStudent) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/student/${this.currentStudent.studentId}/my-work`);
            const data = await response.json();

            if (response.ok) {
                this.checkedOutLessons = data;
                this.updateMyWork(data);
            } else {
                console.error('Error loading my work:', data.message);
            }
        } catch (error) {
            console.error('Error loading my work:', error);
        }
    }

    updateMyWork(lessons) {
        const container = document.getElementById('studentMyWorkGrid');
        if (!container) return;

        if (lessons.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center text-muted py-5">
                    <i class="bi bi-briefcase" style="font-size: 3rem;"></i>
                    <h5 class="mt-3">No lessons checked out yet</h5>
                    <p class="mb-0">Check out lessons from the Digital Library to start working on them.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = lessons.map(lesson => `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-primary">${lesson.subject}</span>
                            <span class="badge ${lesson.status === 'completed' ? 'bg-success' : lesson.status === 'in_progress' ? 'bg-warning' : 'bg-secondary'}">
                                ${lesson.status === 'completed' ? 'Completed' : lesson.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                            </span>
                        </div>
                        <h6 class="card-title">${lesson.title}</h6>
                        <p class="card-text text-muted small">${lesson.description || 'No description available'}</p>
                        
                        ${lesson.status === 'in_progress' ? `
                            <div class="progress mb-2">
                                <div class="progress-bar" style="width: ${lesson.progress || 0}%"></div>
                            </div>
                            <small class="text-muted">Progress: ${lesson.progress || 0}%</small>
                        ` : ''}
                        
                        ${lesson.status === 'completed' && lesson.score ? `
                            <div class="mt-2">
                                <small class="text-success"><i class="bi bi-star-fill me-1"></i>Score: ${lesson.score}%</small>
                            </div>
                        ` : ''}
                        
                        <div class="mt-3">
                            <button class="btn btn-${lesson.status === 'completed' ? 'outline-success' : 'primary'} btn-sm w-100" 
                                    onclick="window.studentManager.startLesson(${lesson.id})">
                                <i class="bi bi-${lesson.status === 'completed' ? 'eye' : 'play-circle'} me-1"></i>
                                ${lesson.status === 'completed' ? 'Review' : lesson.status === 'in_progress' ? 'Continue' : 'Start'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Filtering functions
    filterDigitalLibrary() {
        const subjectFilter = document.getElementById('subjectFilter')?.value || '';
        const assignerFilter = document.getElementById('assignerFilter')?.value || '';
        const gradeFilter = document.getElementById('gradeFilter')?.value || '';
        const searchTerm = document.getElementById('searchLessons')?.value.toLowerCase() || '';

        const filteredLessons = this.lessons.filter(lesson => {
            const matchesSubject = !subjectFilter || lesson.subject === subjectFilter;
            const matchesAssigner = !assignerFilter || lesson.assignedBy === assignerFilter;
            const matchesGrade = !gradeFilter || lesson.gradeLevel === gradeFilter;
            const matchesSearch = !searchTerm || lesson.title.toLowerCase().includes(searchTerm);

            return matchesSubject && matchesAssigner && matchesGrade && matchesSearch;
        });

        this.updateDigitalLibrary(filteredLessons);
    }

    filterMyWork() {
        const subjectFilter = document.getElementById('myWorkSubjectFilter')?.value || '';
        const statusFilter = document.getElementById('myWorkStatusFilter')?.value || '';
        const searchTerm = document.getElementById('searchMyWork')?.value.toLowerCase() || '';

        const filteredLessons = this.checkedOutLessons.filter(lesson => {
            const matchesSubject = !subjectFilter || lesson.subject === subjectFilter;
            const matchesStatus = !statusFilter || lesson.status === statusFilter;
            const matchesSearch = !searchTerm || lesson.title.toLowerCase().includes(searchTerm);

            return matchesSubject && matchesStatus && matchesSearch;
        });

        this.updateMyWork(filteredLessons);
    }

    filterPracticeMaterials() {
        const subjectFilter = document.getElementById('practiceSubjectFilter')?.value || '';
        const statusFilter = document.getElementById('practiceStatusFilter')?.value || '';
        const searchTerm = document.getElementById('searchPracticeMaterials')?.value.toLowerCase() || '';

        const filteredMaterials = this.practiceMaterials.filter(material => {
            const matchesSubject = !subjectFilter || material.subject === subjectFilter;
            const matchesStatus = !statusFilter || material.status === statusFilter;
            const matchesSearch = !searchTerm || material.title.toLowerCase().includes(searchTerm);

            return matchesSubject && matchesStatus && matchesSearch;
        });

        this.updatePracticeMaterials(filteredMaterials);
    }

    // Show/hide Practice Materials tab based on student type
    updatePracticeMaterialsVisibility() {
        const practiceMaterialsNav = document.getElementById('student-practice-materials-nav');
        if (!practiceMaterialsNav) return;

        // Show practice materials tab only for class students (those with a teacher)
        if (this.currentStudent && this.currentStudent.teacherId) {
            practiceMaterialsNav.style.display = 'inline-block';
        } else {
            practiceMaterialsNav.style.display = 'none';
        }
    }

        container.innerHTML = lessons.map(lesson => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h5 class="card-title">${lesson.title}</h5>
                            <p class="card-text text-muted">${lesson.subject}</p>
                            <div class="lesson-status">
                                <span class="badge ${this.getStatusBadgeClass(lesson.status)}">${this.getStatusText(lesson.status)}</span>
                                ${lesson.score ? `<span class="badge bg-success ms-2">Score: ${lesson.score}%</span>` : ''}
                            </div>
                            <div class="lesson-meta mt-2">
                                <small class="text-muted">
                                    Checked out: ${this.formatDate(lesson.checkedOutAt)}
                                    ${lesson.startedAt ? `• Started: ${this.formatDate(lesson.startedAt)}` : ''}
                                    ${lesson.completedAt ? `• Completed: ${this.formatDate(lesson.completedAt)}` : ''}
                                </small>
                            </div>
                        </div>
                        <div class="lesson-actions">
                            ${lesson.status === 'not_started' ? 
                                `<button class="btn btn-primary btn-sm" onclick="window.studentManager.startLesson(${lesson.id})">
                                    <i class="bi bi-play me-1"></i>Start
                                </button>` :
                                lesson.status === 'in_progress' ?
                                `<button class="btn btn-success btn-sm" onclick="window.studentManager.showLessonContent(${lesson.id})">
                                    <i class="bi bi-eye me-1"></i>Continue
                                </button>` :
                                `<button class="btn btn-outline-primary btn-sm" onclick="window.studentManager.showLessonContent(${lesson.id})">
                                    <i class="bi bi-eye me-1"></i>Review
                                </button>`
                            }
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async startLesson(checkoutId) {
        if (!this.currentStudent) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/student/${this.currentStudent.studentId}/start-lesson`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ checkoutId })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Lesson started! Good luck!');
                this.loadMyWork(); // Refresh my work
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error starting lesson:', error);
            alert('An error occurred while starting the lesson');
        }
    }

    showLessonContent(checkoutId) {
        // Find the lesson data
        const lesson = this.checkedOutLessons.find(l => l.id === checkoutId);
        if (!lesson) {
            alert('Lesson not found');
            return;
        }

        // Show lesson content modal
        this.showLessonModal(lesson);
    }

    showLessonModal(lesson) {
        // Create and show lesson content modal
        const modalHtml = `
            <div class="modal fade" id="lessonModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${lesson.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="lesson-content">
                                <h6>Lesson Content</h6>
                                <div class="lesson-text p-3 border rounded mb-3">
                                    <p>This is where the actual lesson content would be displayed. In a real implementation, this would contain:</p>
                                    <ul>
                                        <li>Interactive lesson materials</li>
                                        <li>Video content</li>
                                        <li>Practice exercises</li>
                                        <li>Quizzes and assessments</li>
                                    </ul>
                                    <p><strong>Subject:</strong> ${lesson.subject}</p>
                                    <p><strong>Status:</strong> ${this.getStatusText(lesson.status)}</p>
                                </div>
                                ${lesson.status === 'in_progress' ? `
                                    <div class="lesson-actions text-center">
                                        <button class="btn btn-success btn-lg" onclick="window.studentManager.completeLesson(${lesson.id})">
                                            <i class="bi bi-check-circle me-2"></i>Complete Lesson
                                        </button>
                                    </div>
                                ` : ''}
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
        const existingModal = document.getElementById('lessonModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('lessonModal'));
        modal.show();
    }

    async completeLesson(checkoutId) {
        if (!this.currentStudent) return;

        // Simulate lesson completion with a score
        const score = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
        const totalQuestions = 10;
        const correctAnswers = Math.round((score / 100) * totalQuestions);

        try {
            const response = await fetch(`${this.apiBaseUrl}/student/${this.currentStudent.studentId}/complete-lesson`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    checkoutId, 
                    score, 
                    correctAnswers, 
                    notes: 'Lesson completed successfully' 
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Lesson completed! Your score: ${score}%`);
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('lessonModal'));
                if (modal) {
                    modal.hide();
                }
                this.loadMyWork(); // Refresh my work
                this.loadDashboard(); // Refresh dashboard
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error completing lesson:', error);
            alert('An error occurred while completing the lesson');
        }
    }

    async loadPracticeMaterials() {
        if (!this.currentStudent) return;

        try {
            const response = await fetch(`${this.apiBaseUrl}/student/${this.currentStudent.studentId}/practice-materials`);
            const data = await response.json();

            if (response.ok) {
                this.practiceMaterials = data;
                this.updatePracticeMaterials(data);
            } else {
                console.error('Error loading practice materials:', data.message);
            }
        } catch (error) {
            console.error('Error loading practice materials:', error);
        }
    }

    updatePracticeMaterials(materials) {
        const container = document.getElementById('studentPracticeMaterialsContent');
        if (!container) return;

        if (materials.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">No practice materials assigned yet</p>';
            return;
        }

        container.innerHTML = materials.map(material => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h5 class="card-title">${material.title}</h5>
                            <p class="card-text text-muted">${material.description}</p>
                            <div class="material-meta">
                                <span class="badge bg-primary me-2">${material.subject}</span>
                                <span class="badge bg-secondary">${material.totalQuestions} questions</span>
                            </div>
                            <div class="material-status mt-2">
                                <span class="badge ${this.getStatusBadgeClass(material.status)}">${this.getStatusText(material.status)}</span>
                                ${material.score ? `<span class="badge bg-success ms-2">Score: ${material.score}%</span>` : ''}
                            </div>
                        </div>
                        <div class="material-actions">
                            ${material.status === 'not_started' ? 
                                `<button class="btn btn-primary btn-sm" onclick="window.studentManager.startPracticeMaterial(${material.id})">
                                    <i class="bi bi-play me-1"></i>Start
                                </button>` :
                                material.status === 'in_progress' ?
                                `<button class="btn btn-success btn-sm" onclick="window.studentManager.continuePracticeMaterial(${material.id})">
                                    <i class="bi bi-arrow-right me-1"></i>Continue
                                </button>` :
                                `<button class="btn btn-outline-primary btn-sm" onclick="window.studentManager.reviewPracticeMaterial(${material.id})">
                                    <i class="bi bi-eye me-1"></i>Review
                                </button>`
                            }
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    startPracticeMaterial(materialId) {
        alert('Starting practice material...');
        // In a real implementation, this would start the practice material
    }

    continuePracticeMaterial(materialId) {
        alert('Continuing practice material...');
        // In a real implementation, this would continue the practice material
    }

    reviewPracticeMaterial(materialId) {
        alert('Reviewing practice material...');
        // In a real implementation, this would show the review
    }

    // Helper methods
    getStatusBadgeClass(status) {
        switch (status) {
            case 'completed': return 'bg-success';
            case 'in_progress': return 'bg-warning';
            case 'not_started': return 'bg-secondary';
            default: return 'bg-secondary';
        }
    }

    getStatusText(status) {
        switch (status) {
            case 'completed': return 'Completed';
            case 'in_progress': return 'In Progress';
            case 'not_started': return 'Not Started';
            default: return 'Unknown';
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
}

// Global function for HTML onclick events
function startLesson(checkoutId) {
    if (window.studentManager) {
        window.studentManager.startLesson(checkoutId);
    }
}

function completeLesson(checkoutId) {
    if (window.studentManager) {
        window.studentManager.completeLesson(checkoutId);
    }
}

function showLessonContent(checkoutId) {
    if (window.studentManager) {
        window.studentManager.showLessonContent(checkoutId);
    }
}

function checkoutLesson(lessonId) {
    if (window.studentManager) {
        window.studentManager.checkoutLesson(lessonId);
    }
}

// Global filter functions
function filterDigitalLibrary() {
    if (window.studentManager) {
        window.studentManager.filterDigitalLibrary();
    }
}

function filterMyWork() {
    if (window.studentManager) {
        window.studentManager.filterMyWork();
    }
}

function filterPracticeMaterials() {
    if (window.studentManager) {
        window.studentManager.filterPracticeMaterials();
    }
}
