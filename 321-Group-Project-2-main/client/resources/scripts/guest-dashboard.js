// Guest Dashboard System with Gamified Lessons
class GuestDashboard {
    constructor() {
        this.lessons = this.initializeLessons();
        this.currentView = 'library';
        this.selectedGrade = 'all';
    }

    initializeLessons() {
        const allLessons = {};
        
        // Generate lessons for each grade (40 per grade: 10 Math, 10 Science, 10 English, 10 Technology)
        for (let grade = 0; grade <= 8; grade++) {
            const gradeKey = grade.toString();
            allLessons[gradeKey] = [
                // Math Lessons (10)
                ...this.generateSubjectLessons('Math', '📐', grade, 10),
                // Science Lessons (10)
                ...this.generateSubjectLessons('Science', '🔬', grade, 10),
                // English Lessons (10)
                ...this.generateSubjectLessons('English', '📚', grade, 10),
                // Technology Lessons (10)
                ...this.generateSubjectLessons('Technology', '💻', grade, 10)
            ];
        }

        // Add Geography lessons (15 lessons for all grades)
        allLessons['geography'] = this.generateSubjectLessons('Geography', '🗺️', null, 15);

        return allLessons;
    }

    generateSubjectLessons(subject, icon, grade, count) {
        const lessons = [];
        const gradeTitle = grade !== null ? `Grade ${grade}` : 'All Grades';
        
        // Create lesson templates based on subject
        const subjects = {
            'Math': [
                'Counting & Numbers', 'Addition Basics', 'Subtraction Skills', 'Multiplication Tables',
                'Division Concepts', 'Understanding Fractions', 'Decimals & Percentages', 'Geometry Fundamentals',
                'Problem Solving', 'Data & Graphs'
            ],
            'Science': [
                'Scientific Method', 'Living Things', 'The Human Body', 'Plants & Animals',
                'Weather & Climate', 'States of Matter', 'Forces & Motion', 'Earth & Space',
                'Energy & Electricity', 'Environmental Science'
            ],
            'English': [
                'Letter Recognition', 'Phonics & Sounds', 'Reading Comprehension', 'Vocabulary Building',
                'Grammar Basics', 'Creative Writing', 'Story Elements', 'Poetry & Prose',
                'Research Skills', 'Communication'
            ],
            'Technology': [
                'Computer Basics', 'Keyboard Skills', 'Internet Safety', 'Word Processing',
                'Presentations', 'Spreadsheets', 'Coding Basics', 'Digital Design',
                'Online Research', 'Digital Citizenship'
            ],
            'Geography': [
                'World Continents', 'Countries & Capitals', 'Maps & Globes', 'Oceans & Seas',
                'Mountain Ranges', 'Rivers & Lakes', 'Climate Zones', 'Natural Resources',
                'Cultural Geography', 'Physical Geography', 'Time Zones', 'Biomes',
                'National Parks', 'World Wonders', 'Geography Trivia'
            ]
        };

        const titles = subjects[subject] || Array.from({ length: count }, (_, i) => `${subject} Lesson ${i + 1}`);

        for (let i = 0; i < count; i++) {
            const level = grade !== null ? 
                (grade <= 2 ? 'Beginner' : grade <= 5 ? 'Intermediate' : 'Advanced') 
                : 'All Levels';

            lessons.push({
                id: `${subject.toLowerCase()}-${grade !== null ? grade : 'geo'}-${i + 1}`,
                title: titles[i] || `${subject} Module ${i + 1}`,
                subject: subject,
                icon: icon,
                level: level,
                grade: gradeTitle,
                description: this.generateDescription(subject, grade, titles[i] || `${subject} Lesson ${i + 1}`),
                content: this.generateGenericContent(subject, titles[i] || `${subject} Lesson ${i + 1}`, grade)
            });
        }

        return lessons;
    }

    generateDescription(subject, grade, title) {
        const descriptions = {
            'Math': `Master mathematical concepts and problem-solving skills for ${grade}`,
            'Science': `Explore scientific principles and natural phenomena for ${grade}`,
            'English': `Develop reading, writing, and communication skills for ${grade}`,
            'Technology': `Learn digital literacy and technical skills for ${grade}`,
            'Geography': `${title} - Discover the world around you`
        };

        return descriptions[subject] || `Learn ${title} for ${grade}`;
    }

    generateGenericContent(subject, title, grade) {
        return `
            <div class="lesson-content">
                <h4><span class="badge bg-primary me-2">${subject}</span>${title}</h4>
                ${grade !== null ? `<p class="text-muted mb-4">Designed for ${grade} students</p>` : ''}
                
                <div class="card mb-3">
                    <div class="card-body">
                        <h6><i class="bi bi-play-circle me-2"></i>Introduction</h6>
                        <p>Welcome to ${title}! In this lesson, you will learn fundamental concepts and skills.</p>
                    </div>
                </div>

                <div class="card mb-3">
                    <div class="card-body">
                        <h6><i class="bi bi-book me-2"></i>Key Concepts</h6>
                        <ul class="list-unstyled">
                            <li><i class="bi bi-check-circle-fill text-success me-2"></i>Understanding core concepts</li>
                            <li><i class="bi bi-check-circle-fill text-success me-2"></i>Practical applications</li>
                            <li><i class="bi bi-check-circle-fill text-success me-2"></i>Interactive exercises</li>
                        </ul>
                    </div>
                </div>

                <div class="card mb-3">
                    <div class="card-body">
                        <h6><i class="bi bi-lightbulb me-2"></i>Practice Activities</h6>
                        <p>Complete engaging exercises to reinforce your learning.</p>
                        <button class="btn btn-primary btn-sm" disabled>
                            Start Practice <i class="bi bi-lock-fill"></i>
                        </button>
                    </div>
                </div>

                <div class="card">
                    <div class="card-body">
                        <h6><i class="bi bi-trophy me-2"></i>Assessment</h6>
                        <p class="text-muted small mb-2">Test your understanding with interactive quizzes.</p>
                        <button class="btn btn-primary btn-sm" disabled>
                            Take Quiz <i class="bi bi-lock-fill"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showDashboard() {
        // Hide hero section and main sections
        document.querySelectorAll('.hero-section, main > section:not(.role-dashboard)').forEach(el => {
            el.style.display = 'none';
        });

        // Hide Getting Started page if it's visible
        const gettingStartedPage = document.getElementById('gettingStartedPage');
        if (gettingStartedPage) {
            gettingStartedPage.style.display = 'none';
        }

        // Show or create guest dashboard
        let dashboard = document.getElementById('guestDashboard');
        if (!dashboard) {
            this.createDashboard();
            dashboard = document.getElementById('guestDashboard');
        }
        
        dashboard.style.display = 'block';
        
        // Scroll to top immediately
        window.scrollTo({ top: 0, behavior: 'auto' });
        
        this.showTab('library');
    }

    createDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'guestDashboard';
        dashboard.className = 'guest-dashboard';
        
        // Insert at the beginning of body or after header
        const header = document.querySelector('header');
        if (header && header.nextSibling) {
            document.body.insertBefore(dashboard, header.nextSibling);
        } else {
            document.body.prepend(dashboard);
        }
        
        dashboard.innerHTML = `
            <div class="container-fluid py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 class="mb-1" style="font-weight: 800;">Lesson Library</h2>
                        <p class="text-muted">Browse lessons by grade level and subject</p>
                    </div>
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary" onclick="guestDashboard.showTab('progress')">
                            <i class="bi bi-graph-up-arrow me-2"></i>View Progress
                        </button>
                        <button class="btn btn-outline-secondary" onclick="guestDashboard.closeGuestDashboard()">
                            <i class="bi bi-arrow-left me-2"></i>Back to Home
                        </button>
                    </div>
                </div>

                <!-- Navigation Tabs -->
                <ul class="nav nav-pills mb-4" role="tablist">
                    <li class="nav-item">
                        <button class="nav-link active" onclick="guestDashboard.showTab('library')">
                            <i class="bi bi-book me-2"></i>Browse Library
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" onclick="guestDashboard.showTab('assigned')">
                            <i class="bi bi-check-square me-2"></i>My Assignments
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" onclick="guestDashboard.showTab('progress')">
                            <i class="bi bi-graph-up-arrow me-2"></i>My Progress
                        </button>
                    </li>
                </ul>

                <!-- Library Tab -->
                <div id="libraryTab" class="tab-content">
                    <!-- Grade Level Tabs -->
                    <ul class="nav nav-pills mb-4" role="tablist">
                        <li class="nav-item">
                            <button class="nav-link active" data-grade="all">All Grades</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link" data-grade="k-2">K-2</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link" data-grade="3-5">3-5</button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link" data-grade="6-8">6-8</button>
                        </li>
                    </ul>

                    <!-- Lesson Grid -->
                    <div id="lessonGrid" class="lesson-grid"></div>
                </div>

                <!-- Assigned Tab -->
                <div id="assignedTab" class="tab-content" style="display: none;">
                    <div class="alert alert-info mb-4">
                        <i class="bi bi-info-circle me-2"></i>
                        <strong>Guest Mode:</strong> Login to receive lesson assignments from your teacher or parent!
                    </div>
                    <div id="assignedLessonsList" class="text-center">
                        <p class="text-muted">No assignments yet. Login to connect with your teacher or parent!</p>
                    </div>
                </div>

                <!-- Progress Tab -->
                <div id="progressTab" class="tab-content" style="display: none;">
                    <div class="alert alert-warning mb-4">
                        <i class="bi bi-info-circle me-2"></i>
                        <strong>Guest Mode:</strong> Create an account to save your progress and track detailed analytics!
                    </div>
                    <div id="progressCharts"></div>
                </div>
            </div>
        `;

        // Add event listeners
        dashboard.querySelectorAll('[data-grade]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const grade = e.target.getAttribute('data-grade');
                this.selectGrade(grade);
            });
        });

        document.body.appendChild(dashboard);
    }

    showTab(tabName) {
        // Hide all tabs
        document.getElementById('libraryTab').style.display = tabName === 'library' ? 'block' : 'none';
        document.getElementById('assignedTab').style.display = tabName === 'assigned' ? 'block' : 'none';
        document.getElementById('progressTab').style.display = tabName === 'progress' ? 'block' : 'none';

        // Update nav pills
        document.querySelectorAll('#guestDashboard .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        if (event?.target) event.target.classList.add('active');

        // Render content
        if (tabName === 'library') {
            this.renderLibrary();
        } else if (tabName === 'assigned') {
            this.renderAssignedLessons();
        } else if (tabName === 'progress') {
            this.renderProgress();
        }
    }

    renderAssignedLessons() {
        const list = document.getElementById('assignedLessonsList');
        if (!list) return;
        
        // In real app, this would fetch from API
        list.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-inbox" style="font-size: 4rem; color: #ddd;"></i>
                <h5 class="mt-3">No assignments yet</h5>
                <p class="text-muted">Login to connect with your teacher or parent to receive assignments!</p>
                <button class="btn btn-primary mt-3" onclick="openAuthModal()">
                    Login Now
                </button>
            </div>
        `;
    }

    renderProgress() {
        const progressCharts = document.getElementById('progressCharts');
        if (!progressCharts) return;

        // Guest users have no progress data - show empty state
        progressCharts.innerHTML = `
            <div class="row mb-4">
                <div class="col-md-6 mb-3">
                    <div class="content-card">
                        <h5 class="mb-3"><i class="bi bi-trophy me-2"></i>Overall Progress</h5>
                        <p class="text-center text-muted py-4">No progress data available for guest users. Sign up to track your learning!</p>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="content-card">
                        <h5 class="mb-3"><i class="bi bi-graph-up me-2"></i>Weekly Activity</h5>
                        <canvas id="activityChart" height="200"></canvas>
                        <p class="text-muted small mt-3 text-center">Hours spent learning this week</p>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="content-card">
                        <h5 class="mb-3"><i class="bi bi-bar-chart me-2"></i>Subject Progress</h5>
                        <p class="text-center text-muted py-4">Sign up to start tracking your learning progress!</p>
                    </div>
                </div>
            </div>

            <div class="row mt-4">
                <div class="col-12 text-center">
                    <button class="btn btn-primary btn-lg" onclick="openAuthModal()">
                        <i class="bi bi-person-plus me-2"></i>Sign Up to Save Progress
                    </button>
                </div>
            </div>
        `;
    }

    selectGrade(grade) {
        this.selectedGrade = grade;
        
        // Update active tab
        document.querySelectorAll('[data-grade]').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-grade') === grade);
        });

        this.renderLibrary();
    }

    renderLibrary() {
        const grid = document.getElementById('lessonGrid');
        if (!grid) return;

        let lessonsToShow = [];
        
        // GUEST ACCESS - Show only 3 sample lessons per grade as preview
        if (!window.currentUser) {
            if (this.selectedGrade === 'all') {
                // Show only 3 sample lessons total
                lessonsToShow = [
                    ...(this.lessons['0'] || []).slice(0, 3),
                    ...(this.lessons['3'] || []).slice(0, 2),
                    ...(this.lessons['6'] || []).slice(0, 2)
                ];
            } else if (this.selectedGrade === 'k-2') {
                lessonsToShow = [
                    ...(this.lessons['0'] || []).slice(0, 3),
                    ...(this.lessons['1'] || []).slice(0, 2),
                    ...(this.lessons['2'] || []).slice(0, 2)
                ];
            } else if (this.selectedGrade === '3-5') {
                lessonsToShow = [
                    ...(this.lessons['3'] || []).slice(0, 3),
                    ...(this.lessons['4'] || []).slice(0, 2),
                    ...(this.lessons['5'] || []).slice(0, 2)
                ];
            } else if (this.selectedGrade === '6-8') {
                lessonsToShow = [
                    ...(this.lessons['6'] || []).slice(0, 3),
                    ...(this.lessons['7'] || []).slice(0, 2),
                    ...(this.lessons['8'] || []).slice(0, 2)
                ];
            } else {
                lessonsToShow = (this.lessons[this.selectedGrade] || []).slice(0, 7);
            }
        } else {
            // LOGGED IN USER - Show all lessons based on subscription tier
            const userRole = window.currentUser?.role;
            const isPremium = this.checkPremiumAccess();
            
            if (this.selectedGrade === 'all') {
                // Show a sample from each grade + geography
                Object.keys(this.lessons).forEach(grade => {
                    const gradeLessons = this.lessons[grade];
                    if (grade === 'geography') {
                        lessonsToShow.push(...gradeLessons);
                    } else {
                        lessonsToShow.push(...gradeLessons);
                    }
                });
            } else if (this.selectedGrade === 'k-2') {
                lessonsToShow = [
                    ...(this.lessons['0'] || []),
                    ...(this.lessons['1'] || []),
                    ...(this.lessons['2'] || [])
                ];
            } else if (this.selectedGrade === '3-5') {
                lessonsToShow = [
                    ...(this.lessons['3'] || []),
                    ...(this.lessons['4'] || []),
                    ...(this.lessons['5'] || [])
                ];
            } else if (this.selectedGrade === '6-8') {
                lessonsToShow = [
                    ...(this.lessons['6'] || []),
                    ...(this.lessons['7'] || []),
                    ...(this.lessons['8'] || [])
                ];
            } else {
                lessonsToShow = this.lessons[this.selectedGrade] || [];
            }
        }

        // Group by subject for better organization
        const groupedLessons = {};
        lessonsToShow.forEach(lesson => {
            if (!groupedLessons[lesson.subject]) {
                groupedLessons[lesson.subject] = [];
            }
            groupedLessons[lesson.subject].push(lesson);
        });

        const isGuest = !window.currentUser;
        const isPremium = this.checkPremiumAccess();

        grid.innerHTML = `
            ${isGuest ? `
                <div class="col-12 mb-4">
                    <div class="alert alert-warning">
                        <h5><i class="bi bi-lock me-2"></i>Limited Preview Access</h5>
                        <p class="mb-3">You're viewing a limited preview. Sign up for free to access all ${Object.keys(this.lessons).reduce((total, grade) => total + (this.lessons[grade]?.length || 0), 0)} lessons!</p>
                        <button class="btn btn-primary" onclick="openAuthModal()">
                            <i class="bi bi-person-plus me-2"></i>Sign Up Free
                        </button>
                    </div>
                </div>
            ` : ''}
            
            ${Object.keys(groupedLessons).map(subject => `
                <div class="col-12 mb-4">
                    <h4 class="mb-3">
                        <i class="bi bi-bookmark-fill me-2"></i>${subject}
                        ${isPremium && (subject === 'Math' || subject === 'Science') ? '<span class="badge bg-success ms-2">Premium</span>' : ''}
                    </h4>
                    <div class="lesson-grid">
                        ${groupedLessons[subject].map(lesson => `
                            <div class="lesson-card" onclick="guestDashboard.openLesson('${lesson.id}')">
                                <div class="lesson-level-badge">${lesson.grade}</div>
                                <div class="lesson-icon">${lesson.icon}</div>
                                <h6 class="mb-2" style="font-weight: 700;">${lesson.title}</h6>
                                <p class="text-muted small mb-2">${lesson.description}</p>
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="badge bg-light text-dark">${lesson.subject}</span>
                                    <span class="badge bg-primary">${lesson.level}</span>
                                </div>
                                <div class="progress-bar-container">
                                    <div class="progress-bar-fill" style="width: 0%"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
            
            ${isGuest ? `
                <div class="col-12 mt-4">
                    <div class="content-card text-center">
                        <h4 class="mb-3">Unlock Full Access</h4>
                        <p class="text-muted mb-4">Sign up to access hundreds of lessons, track your progress, and earn badges!</p>
                        <div class="row g-3">
                            <div class="col-md-4">
                                <div class="alert alert-info">
                                    <h6>Free Account</h6>
                                    <ul class="text-start small">
                                        <li>✓ All core lessons</li>
                                        <li>✓ Basic progress tracking</li>
                                        <li>✓ Online content library</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="alert alert-warning">
                                    <h6>Family Premium $4.99/mo</h6>
                                    <ul class="text-start small">
                                        <li>✓ Everything in Free</li>
                                        <li>✓ Advanced analytics</li>
                                        <li>✓ Offline access</li>
                                        <li>✓ Download & print</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="alert alert-success">
                                    <h6>Teacher Premium $9.99/mo</h6>
                                    <ul class="text-start small">
                                        <li>✓ Everything in Family</li>
                                        <li>✓ AI lesson plans</li>
                                        <li>✓ Student analytics</li>
                                        <li>✓ Classroom tools</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-lg mt-3" onclick="openAuthModal()">
                            Get Started Free →
                        </button>
                    </div>
                </div>
            ` : ''}
        `;
    }

    checkPremiumAccess() {
        if (!window.currentUser) return false;
        const subscription = JSON.parse(localStorage.getItem('userSubscription') || '{}');
        return subscription.planType === 'teacher' || subscription.planType === 'family';
    }

    openLesson(lessonId) {
        // Find lesson across all grades
        let lesson = null;
        for (const gradeLessons of Object.values(this.lessons)) {
            lesson = gradeLessons.find(l => l.id === lessonId);
            if (lesson) break;
        }

        if (!lesson) return;

        // Create lesson modal
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'lessonModal';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header bg-gradient text-white" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">
                        <h5 class="modal-title">${lesson.icon} ${lesson.title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <i class="bi bi-info-circle me-2"></i>
                            <strong>Guest Mode:</strong> This is a preview. Sign up to track progress and unlock all lessons!
                        </div>
                        ${lesson.content}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="openAuthModal(); bootstrap.Modal.getInstance(document.getElementById('lessonModal')).hide();">
                            Sign Up to Continue
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    closeGuestDashboard() {
        document.getElementById('guestDashboard').style.display = 'none';
        document.querySelectorAll('.hero-section').forEach(el => {
            el.style.display = '';
        });
        
        // Show hero section again
        document.querySelector('.hero-section').style.display = 'block';
        
        // Scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Content generators
    generateMathBasicsContent() {
        return `
            <div class="lesson-content">
                <h4>Counting & Numbers - Module 1</h4>
                <div class="card mb-3">
                    <div class="card-body">
                        <h6>Lesson 1: Numbers 1-20</h6>
                        <p>Let's learn to count from 1 to 20!</p>
                        <div class="d-flex gap-2 flex-wrap">
                            <span class="badge bg-primary">1</span>
                            <span class="badge bg-primary">2</span>
                            <span class="badge bg-primary">3</span>
                            <span class="badge bg-primary">...</span>
                            <span class="badge bg-primary">20</span>
                        </div>
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-body">
                        <h6>Lesson 2: Counting Objects</h6>
                        <p>Practice counting: 🍎🍎🍎 How many apples? <strong>3!</strong></p>
                        <p>Let's practice with fruits and toys!</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h6>Interactive Activity</h6>
                        <p class="text-muted">Complete 5 counting exercises to earn your badge!</p>
                        <button class="btn btn-primary btn-sm" disabled>Start Activity <i class="bi bi-lock-fill"></i></button>
                    </div>
                </div>
            </div>
        `;
    }

    generateReadingStartContent() {
        return `
            <div class="lesson-content">
                <h4>Learning to Read - Module 1</h4>
                <div class="card mb-3">
                    <div class="card-body">
                        <h6>Lesson 1: Letter Sounds</h6>
                        <p>Learn A, B, C! Each letter has a special sound.</p>
                        <div class="d-flex gap-2">
                            <span style="font-size: 2rem;">A says "ah"</span>
                        </div>
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-body">
                        <h6>Lesson 2: First Words</h6>
                        <p>Let's read: Cat, Dog, Sun, Moon</p>
                        <p>Use your letter sounds to read these words!</p>
                    </div>
                </div>
            </div>
        `;
    }

    generateShapesColorsContent() {
        return `<div class="lesson-content"><h4>Shapes & Colors</h4><p>Explore circles, squares, red, blue, yellow and more!</p></div>`;
    }

    generateAnimalsNatureContent() {
        return `<div class="lesson-content"><h4>Animals & Nature</h4><p>Discover lions, elephants, trees, and oceans!</p></div>`;
    }

    generateMusicBasicsContent() {
        return `<div class="lesson-content"><h4>Music Fun</h4><p>Learn rhythm, beats, and musical instruments!</p></div>`;
    }

    generateMultiplicationContent() {
        return `<div class="lesson-content"><h4>Multiplication Master</h4><p>Practice multiplication tables 1-12 with fun games!</p></div>`;
    }

    generateFractionsContent() {
        return `<div class="lesson-content"><h4>Understanding Fractions</h4><p>Learn to work with fractions, decimals, and percentages!</p></div>`;
    }

    generateReadingCompContent() {
        return `<div class="lesson-content"><h4>Reading Comprehension</h4><p>Improve your understanding by reading stories and answering questions!</p></div>`;
    }

    generateCreativeWritingContent() {
        return `<div class="lesson-content"><h4>Creative Writing</h4><p>Express yourself through stories, poems, and essays!</p></div>`;
    }

    generateGeographyContent() {
        return `<div class="lesson-content"><h4>World Geography</h4><p>Explore countries, capitals, flags, and cultures!</p></div>`;
    }

    generateScienceExpContent() {
        return `<div class="lesson-content"><h4>Science Experiments</h4><p>Hands-on experiments and discoveries!</p></div>`;
    }

    generateAlgebraContent() {
        return `<div class="lesson-content"><h4>Algebra Foundations</h4><p>Solve equations with variables and learn algebraic expressions!</p></div>`;
    }

    generateGeometryContent() {
        return `<div class="lesson-content"><h4>Geometry & Shapes</h4><p>Explore angles, triangles, circles, area, and perimeter!</p></div>`;
    }

    generateLiteratureContent() {
        return `<div class="lesson-content"><h4>Classic Literature</h4><p>Read and analyze famous books and authors!</p></div>`;
    }

    generateEssayWritingContent() {
        return `<div class="lesson-content"><h4>Essay Writing Skills</h4><p>Learn to structure and write compelling essays!</p></div>`;
    }

    generateBiologyContent() {
        return `<div class="lesson-content"><h4>Biology Basics</h4><p>Explore cells, organs, and living systems!</p></div>`;
    }

    generateChemistryContent() {
        return `<div class="lesson-content"><h4>Chemistry Fundamentals</h4><p>Learn about atoms, molecules, and chemical reactions!</p></div>`;
    }

    generateHistoryContent() {
        return `<div class="lesson-content"><h4>World History</h4><p>Study key events and historical periods!</p></div>`;
    }

    generateForeignLanguagesContent() {
        return `<div class="lesson-content"><h4>Foreign Languages</h4><p>Learn Spanish, French, or other languages with interactive lessons!</p></div>`;
    }
}

// Global functions
let guestDashboard;

function showGuestDashboard() {
    if (!guestDashboard) {
        guestDashboard = new GuestDashboard();
    }
    guestDashboard.showDashboard();
}

function openAuthModal() {
    if (window.authManager) {
        window.authManager.showLoginModal();
    } else {
        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('loginModal'));
        modal.show();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize instance in showGuestDashboard() function
    console.log('Guest Dashboard system loaded');
});
