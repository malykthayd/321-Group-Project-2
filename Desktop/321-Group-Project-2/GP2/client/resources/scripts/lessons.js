/**
 * EduConnect - Lessons Module
 * Interactive lesson viewer and resource hub
 */

class LessonManager {
  constructor(app) {
    this.app = app;
    this.currentLesson = null;
    this.lessonProgress = {};
    this.adaptiveEngine = window.AdaptiveLearning || null;
  }

  /**
   * Render lessons page
   */
  renderLessonsPage() {
    const mainContent = document.getElementById('main-content');
    const lessons = window.SampleData?.lessons || [];
    const userProgress = this.getUserProgress();
    
    mainContent.innerHTML = `
      <div class="row">
        <!-- Header -->
        <div class="col-12 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h2 class="mb-1">
                    <i class="bi bi-book text-primary me-2"></i>
                    Learning Hub
                  </h2>
                  <p class="text-muted mb-0">Explore interactive lessons and educational content</p>
                </div>
                <div class="col-md-4">
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="Search lessons..." id="lessonSearch">
                    <button class="btn btn-outline-secondary" type="button">
                      <i class="bi bi-search"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="col-12 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-3">
                  <label class="form-label">Subject</label>
                  <select class="form-select" id="subjectFilter">
                    <option value="">All Subjects</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English Language Arts">English Language Arts</option>
                    <option value="Social Studies">Social Studies</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Difficulty</label>
                  <select class="form-select" id="difficultyFilter">
                    <option value="">All Levels</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Duration</label>
                  <select class="form-select" id="durationFilter">
                    <option value="">Any Duration</option>
                    <option value="short">Under 15 min</option>
                    <option value="medium">15-30 min</option>
                    <option value="long">Over 30 min</option>
                  </select>
                </div>
                <div class="col-md-3 d-flex align-items-end">
                  <button class="btn btn-primary w-100" onclick="lessonManager.applyFilters()">
                    <i class="bi bi-funnel me-2"></i>Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lessons Grid -->
        <div class="col-12">
          <div class="row" id="lessonsGrid">
            ${this.renderLessonsGrid(lessons, userProgress)}
          </div>
        </div>

        <!-- Recommended Section -->
        <div class="col-12 mt-5">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0">
              <h5 class="mb-0">
                <i class="bi bi-stars text-warning me-2"></i>
                Recommended for You
              </h5>
            </div>
            <div class="card-body">
              <div class="row" id="recommendedLessons">
                ${this.renderRecommendedLessons()}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Set up event listeners
    this.setupLessonEventListeners();
  }

  /**
   * Render lessons grid
   */
  renderLessonsGrid(lessons, userProgress) {
    return lessons.map(lesson => {
      const progress = userProgress[lesson.id] || { completed: false, score: 0 };
      const isCompleted = progress.completed;
      const progressPercentage = progress.score || 0;
      
      return `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="card lesson-card card-hover h-100" onclick="lessonManager.openLesson('${lesson.id}')">
            <div class="position-relative">
              <div class="card-img-top d-flex align-items-center justify-content-center text-white" 
                   style="height: 200px; background: linear-gradient(135deg, ${lesson.color} 0%, ${lesson.color}80 100%);">
                <i class="${lesson.icon}" style="font-size: 3rem;"></i>
              </div>
              
              <!-- Progress indicator -->
              ${isCompleted ? `
                <div class="position-absolute top-0 start-0 p-2">
                  <span class="badge bg-success">
                    <i class="bi bi-check-circle me-1"></i>Completed
                  </span>
                </div>
              ` : progressPercentage > 0 ? `
                <div class="position-absolute top-0 start-0 p-2">
                  <span class="badge bg-warning">
                    <i class="bi bi-clock me-1"></i>In Progress
                  </span>
                </div>
              ` : ''}
              
              <!-- Difficulty badge -->
              <div class="difficulty-badge">
                <span class="badge bg-${lesson.difficulty === 'Easy' ? 'success' : lesson.difficulty === 'Medium' ? 'warning' : 'danger'}">
                  ${lesson.difficulty}
                </span>
              </div>
            </div>
            
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title mb-0">${lesson.title}</h5>
                <span class="badge bg-light text-dark">
                  <i class="bi bi-star-fill text-warning me-1"></i>
                  ${lesson.points}
                </span>
              </div>
              
              <p class="card-text text-muted small mb-3">${lesson.description}</p>
              
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge bg-secondary">${lesson.subject}</span>
                <small class="text-muted">
                  <i class="bi bi-clock me-1"></i>
                  ${lesson.duration} min
                </small>
              </div>
              
              <!-- Progress bar for in-progress lessons -->
              ${progressPercentage > 0 && !isCompleted ? `
                <div class="progress mb-2" style="height: 6px;">
                  <div class="progress-bar" style="width: ${progressPercentage}%"></div>
                </div>
                <small class="text-muted">${progressPercentage}% completed</small>
              ` : ''}
              
              <!-- Learning objectives preview -->
              <div class="mt-3">
                <h6 class="small text-muted mb-1">Learning Objectives:</h6>
                <ul class="list-unstyled small">
                  ${lesson.learningObjectives.slice(0, 2).map(objective => `
                    <li class="mb-1">
                      <i class="bi bi-check-circle-fill text-success me-1" style="font-size: 0.75rem;"></i>
                      ${objective}
                    </li>
                  `).join('')}
                  ${lesson.learningObjectives.length > 2 ? `
                    <li class="text-muted">
                      <small>+${lesson.learningObjectives.length - 2} more objectives</small>
                    </li>
                  ` : ''}
                </ul>
              </div>
            </div>
            
            <div class="card-footer bg-transparent border-0">
              <button class="btn btn-primary w-100">
                ${isCompleted ? 'Review Lesson' : progressPercentage > 0 ? 'Continue Lesson' : 'Start Lesson'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render recommended lessons
   */
  renderRecommendedLessons() {
    const recommendations = this.getRecommendedLessons();
    
    return recommendations.map(lesson => `
      <div class="col-md-4 mb-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="me-3">
                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                     style="width: 50px; height: 50px;">
                  <i class="${lesson.icon}"></i>
                </div>
              </div>
              <div class="flex-grow-1">
                <h6 class="mb-1">${lesson.title}</h6>
                <small class="text-muted">${lesson.reason}</small>
              </div>
              <button class="btn btn-outline-primary btn-sm" onclick="lessonManager.openLesson('${lesson.id}')">
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Open lesson viewer
   */
  openLesson(lessonId) {
    const lesson = window.SampleData?.lessons?.find(l => l.id === lessonId);
    if (!lesson) return;

    this.currentLesson = lesson;
    this.renderLessonViewer();
  }

  /**
   * Render lesson viewer
   */
  renderLessonViewer() {
    const mainContent = document.getElementById('main-content');
    const progress = this.getLessonProgress(this.currentLesson.id);
    
    mainContent.innerHTML = `
      <div class="row">
        <!-- Lesson Header -->
        <div class="col-12 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <button class="btn btn-outline-secondary mb-3" onclick="app.navigateTo('lessons')">
                    <i class="bi bi-arrow-left me-2"></i>Back to Lessons
                  </button>
                  <h2 class="mb-1">${this.currentLesson.title}</h2>
                  <p class="text-muted mb-0">${this.currentLesson.description}</p>
                </div>
                <div class="text-end">
                  <div class="d-flex align-items-center mb-2">
                    <span class="badge bg-${this.currentLesson.difficulty === 'Easy' ? 'success' : this.currentLesson.difficulty === 'Medium' ? 'warning' : 'danger'} me-2">
                      ${this.currentLesson.difficulty}
                    </span>
                    <small class="text-muted">
                      <i class="bi bi-clock me-1"></i>
                      ${this.currentLesson.duration} min
                    </small>
                  </div>
                  <div class="d-flex align-items-center">
                    <span class="badge bg-primary me-2">
                      <i class="bi bi-star-fill me-1"></i>
                      ${this.currentLesson.points} points
                    </span>
                    <button class="btn btn-primary" onclick="lessonManager.startLesson()">
                      <i class="bi bi-play-circle me-2"></i>Start Lesson
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lesson Content -->
        <div class="col-lg-8 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Lesson Content</h5>
                <div class="d-flex align-items-center">
                  <span class="badge bg-info me-2">Section 1 of ${this.currentLesson.content.sections.length}</span>
                  <div class="progress me-2" style="width: 100px; height: 6px;">
                    <div class="progress-bar" style="width: 33%"></div>
                  </div>
                  <small class="text-muted">33%</small>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="text-center py-5">
                <i class="bi bi-play-circle text-primary" style="font-size: 4rem;"></i>
                <h4 class="mt-3 mb-2">Ready to Start Learning?</h4>
                <p class="text-muted mb-4">Click the start button to begin this interactive lesson</p>
                <button class="btn btn-primary btn-lg" onclick="lessonManager.startLesson()">
                  <i class="bi bi-play-fill me-2"></i>Start Lesson
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Lesson Info Sidebar -->
        <div class="col-lg-4 mb-4">
          <!-- Learning Objectives -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-transparent border-0">
              <h6 class="mb-0">
                <i class="bi bi-target text-success me-2"></i>
                Learning Objectives
              </h6>
            </div>
            <div class="card-body">
              <ul class="list-unstyled">
                ${this.currentLesson.learningObjectives.map(objective => `
                  <li class="mb-2">
                    <i class="bi bi-check-circle text-success me-2"></i>
                    ${objective}
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <!-- Lesson Structure -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-transparent border-0">
              <h6 class="mb-0">
                <i class="bi bi-list-ol text-info me-2"></i>
                Lesson Structure
              </h6>
            </div>
            <div class="card-body">
              ${this.currentLesson.content.sections.map((section, index) => `
                <div class="d-flex align-items-center mb-2">
                  <div class="me-3">
                    <div class="bg-${index === 0 ? 'primary' : 'light'} text-${index === 0 ? 'white' : 'dark'} rounded-circle d-flex align-items-center justify-content-center" 
                         style="width: 30px; height: 30px; font-size: 0.875rem;">
                      ${index + 1}
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-0 small">${section.title}</h6>
                    <small class="text-muted">${section.duration} min • ${section.type}</small>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Adaptive Settings -->
          ${this.app.currentRole === 'student' ? `
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-transparent border-0">
                <h6 class="mb-0">
                  <i class="bi bi-gear text-warning me-2"></i>
                  Adaptive Settings
                </h6>
              </div>
              <div class="card-body">
                <div class="mb-2">
                  <label class="form-label small">Difficulty Adjustment</label>
                  <div class="progress" style="height: 4px;">
                    <div class="progress-bar bg-warning" style="width: ${this.currentLesson.adaptiveSettings.difficultyAdjustment * 100}%"></div>
                  </div>
                </div>
                <div class="mb-2">
                  <label class="form-label small">Time Multiplier</label>
                  <div class="progress" style="height: 4px;">
                    <div class="progress-bar bg-info" style="width: ${this.currentLesson.adaptiveSettings.timeMultiplier * 50}%"></div>
                  </div>
                </div>
                <div class="mb-0">
                  <label class="form-label small">Hint Frequency</label>
                  <div class="progress" style="height: 4px;">
                    <div class="progress-bar bg-success" style="width: ${this.currentLesson.adaptiveSettings.hintFrequency * 100}%"></div>
                  </div>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Start lesson
   */
  startLesson() {
    if (!this.currentLesson) return;

    // Initialize adaptive learning
    if (this.adaptiveEngine) {
      this.adaptiveEngine.startLesson(this.currentLesson);
    }

    // Track lesson start
    this.trackLessonEvent('started');
    
    // Show lesson content (simplified for demo)
    this.showLessonContent();
  }

  /**
   * Show lesson content
   */
  showLessonContent() {
    const cardBody = document.querySelector('.card-body');
    if (!cardBody) return;

    cardBody.innerHTML = `
      <div class="lesson-content">
        <div class="text-center mb-4">
          <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
               style="width: 80px; height: 80px;">
            <i class="${this.currentLesson.icon}" style="font-size: 2rem;"></i>
          </div>
          <h4>${this.currentLesson.content.sections[0].title}</h4>
        </div>
        
        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="card border-0 bg-light">
              <div class="card-body">
                <h6 class="card-title">Interactive Exercise</h6>
                <p class="card-text">Complete the following exercise to test your understanding.</p>
                <div class="form-group">
                  <label class="form-label">What is the main concept being taught?</label>
                  <select class="form-select" id="lessonQuiz">
                    <option value="">Select an answer...</option>
                    <option value="correct">The correct concept</option>
                    <option value="wrong1">Incorrect option 1</option>
                    <option value="wrong2">Incorrect option 2</option>
                  </select>
                </div>
                <button class="btn btn-primary mt-3" onclick="lessonManager.checkAnswer()">
                  Check Answer
                </button>
              </div>
            </div>
          </div>
          
          <div class="col-md-6 mb-4">
            <div class="card border-0 bg-light">
              <div class="card-body">
                <h6 class="card-title">Progress Tracking</h6>
                <div class="mb-3">
                  <div class="d-flex justify-content-between">
                    <span>Section Progress</span>
                    <span>1/3</span>
                  </div>
                  <div class="progress" style="height: 8px;">
                    <div class="progress-bar" style="width: 33%"></div>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="d-flex justify-content-between">
                    <span>Time Spent</span>
                    <span id="timeSpent">2:30</span>
                  </div>
                </div>
                <div class="mb-0">
                  <div class="d-flex justify-content-between">
                    <span>Accuracy</span>
                    <span id="accuracy">--</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center">
          <button class="btn btn-success btn-lg" onclick="lessonManager.completeLesson()">
            <i class="bi bi-check-circle me-2"></i>Complete Lesson
          </button>
        </div>
      </div>
    `;

    // Start timer
    this.startLessonTimer();
  }

  /**
   * Check answer
   */
  checkAnswer() {
    const selectedAnswer = document.getElementById('lessonQuiz').value;
    const accuracyElement = document.getElementById('accuracy');
    
    if (selectedAnswer === 'correct') {
      accuracyElement.textContent = '100%';
      accuracyElement.className = 'text-success fw-bold';
      this.showSuccess('Correct! Well done! 🎉');
    } else if (selectedAnswer) {
      accuracyElement.textContent = '0%';
      accuracyElement.className = 'text-danger fw-bold';
      this.showError('Not quite right. Try again!');
    } else {
      this.showError('Please select an answer first.');
    }
  }

  /**
   * Complete lesson
   */
  completeLesson() {
    if (!this.currentLesson) return;

    // Calculate score and points
    const score = 85; // Demo score
    const pointsEarned = Math.floor(this.currentLesson.points * (score / 100));
    
    // Update user progress
    this.updateLessonProgress(this.currentLesson.id, {
      completed: true,
      score: score,
      timeSpent: this.getTimeSpent(),
      attempts: 1,
      completedAt: new Date().toISOString()
    });

    // Award points
    this.awardPoints(pointsEarned);

    // Track completion
    this.trackLessonEvent('completed', { score, pointsEarned });

    // Show completion modal
    this.showCompletionModal(score, pointsEarned);
  }

  /**
   * Show completion modal
   */
  showCompletionModal(score, pointsEarned) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center py-5">
            <div class="mb-4">
              <i class="bi bi-trophy-fill text-warning" style="font-size: 4rem;"></i>
            </div>
            <h3 class="mb-3">Lesson Completed! 🎉</h3>
            <div class="row mb-4">
              <div class="col-6">
                <h4 class="text-primary mb-0">${score}%</h4>
                <small class="text-muted">Accuracy</small>
              </div>
              <div class="col-6">
                <h4 class="text-success mb-0">${pointsEarned}</h4>
                <small class="text-muted">Points Earned</small>
              </div>
            </div>
            <p class="text-muted mb-4">Great job! You've successfully completed "${this.currentLesson.title}"</p>
            <div class="d-flex gap-2 justify-content-center">
              <button class="btn btn-primary" onclick="lessonManager.continueLearning()">
                Continue Learning
              </button>
              <button class="btn btn-outline-secondary" onclick="app.navigateTo('dashboard')">
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    new bootstrap.Modal(modal).show();

    // Remove modal after hiding
    modal.addEventListener('hidden.bs.modal', () => modal.remove());
  }

  /**
   * Continue learning
   */
  continueLearning() {
    // Close modal
    const modal = document.querySelector('.modal');
    if (modal) {
      bootstrap.Modal.getInstance(modal).hide();
    }

    // Navigate back to lessons
    this.app.navigateTo('lessons');
  }

  /**
   * Set up event listeners
   */
  setupLessonEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('lessonSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchLessons(e.target.value);
      });
    }

    // Filter functionality
    const filters = ['subjectFilter', 'difficultyFilter', 'durationFilter'];
    filters.forEach(filterId => {
      const element = document.getElementById(filterId);
      if (element) {
        element.addEventListener('change', () => {
          this.applyFilters();
        });
      }
    });
  }

  /**
   * Search lessons
   */
  searchLessons(query) {
    const lessons = window.SampleData?.lessons || [];
    const filteredLessons = lessons.filter(lesson => 
      lesson.title.toLowerCase().includes(query.toLowerCase()) ||
      lesson.description.toLowerCase().includes(query.toLowerCase()) ||
      lesson.subject.toLowerCase().includes(query.toLowerCase())
    );

    const grid = document.getElementById('lessonsGrid');
    if (grid) {
      const userProgress = this.getUserProgress();
      grid.innerHTML = this.renderLessonsGrid(filteredLessons, userProgress);
    }
  }

  /**
   * Apply filters
   */
  applyFilters() {
    const subject = document.getElementById('subjectFilter')?.value || '';
    const difficulty = document.getElementById('difficultyFilter')?.value || '';
    const duration = document.getElementById('durationFilter')?.value || '';

    let lessons = window.SampleData?.lessons || [];

    if (subject) {
      lessons = lessons.filter(lesson => lesson.subject === subject);
    }

    if (difficulty) {
      lessons = lessons.filter(lesson => lesson.difficulty === difficulty);
    }

    if (duration) {
      lessons = lessons.filter(lesson => {
        switch (duration) {
          case 'short': return lesson.duration < 15;
          case 'medium': return lesson.duration >= 15 && lesson.duration <= 30;
          case 'long': return lesson.duration > 30;
          default: return true;
        }
      });
    }

    const grid = document.getElementById('lessonsGrid');
    if (grid) {
      const userProgress = this.getUserProgress();
      grid.innerHTML = this.renderLessonsGrid(lessons, userProgress);
    }
  }

  /**
   * Get recommended lessons
   */
  getRecommendedLessons() {
    const lessons = window.SampleData?.lessons || [];
    const userProgress = this.getUserProgress();
    
    return lessons
      .filter(lesson => !userProgress[lesson.id]?.completed)
      .slice(0, 3)
      .map(lesson => ({
        ...lesson,
        reason: this.getRecommendationReason(lesson)
      }));
  }

  /**
   * Get recommendation reason
   */
  getRecommendationReason(lesson) {
    const reasons = [
      'Based on your learning history',
      'Popular in your grade level',
      'Completes your current topic',
      'Builds on previous lessons',
      'Matches your interests'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  /**
   * Get user progress
   */
  getUserProgress() {
    if (!this.app.currentUser) return {};
    return window.SampleData?.progressData?.[this.app.currentUser.id]?.lessonProgress || {};
  }

  /**
   * Get lesson progress
   */
  getLessonProgress(lessonId) {
    const userProgress = this.getUserProgress();
    return userProgress[lessonId] || { completed: false, score: 0 };
  }

  /**
   * Update lesson progress
   */
  updateLessonProgress(lessonId, progress) {
    if (!this.app.currentUser) return;

    const userProgress = this.getUserProgress();
    userProgress[lessonId] = progress;

    // Save to localStorage (in real app, this would sync with server)
    localStorage.setItem('educonnect_lesson_progress', JSON.stringify(userProgress));
  }

  /**
   * Award points
   */
  awardPoints(points) {
    if (!this.app.currentUser) return;

    const currentPoints = this.app.currentUser.points || 0;
    this.app.currentUser.points = currentPoints + points;

    // Update in localStorage
    localStorage.setItem('educonnect_user', JSON.stringify(this.app.currentUser));

    // Show points notification
    this.showSuccess(`+${points} points earned! 🎉`);
  }

  /**
   * Track lesson event
   */
  trackLessonEvent(event, data = {}) {
    console.log('Lesson event:', event, data);
    // In a real app, this would send analytics data to the server
  }

  /**
   * Start lesson timer
   */
  startLessonTimer() {
    this.lessonStartTime = Date.now();
    this.timerInterval = setInterval(() => {
      const timeSpent = this.getTimeSpent();
      const timeElement = document.getElementById('timeSpent');
      if (timeElement) {
        timeElement.textContent = timeSpent;
      }
    }, 1000);
  }

  /**
   * Get time spent
   */
  getTimeSpent() {
    if (!this.lessonStartTime) return '0:00';
    
    const seconds = Math.floor((Date.now() - this.lessonStartTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    this.app.showSuccess(message);
  }

  /**
   * Show error message
   */
  showError(message) {
    this.app.showError(message);
  }
}

// Initialize lesson manager
window.lessonManager = new LessonManager(window.app);
