// Lessons module for AQE Platform
// Handles lesson-related functionality

class LessonsManager {
  constructor() {
    this.lessons = [];
    this.currentLesson = null;
    this.progress = {};
    
    this.init();
  }

  init() {
    this.loadLessons();
    this.setupEventListeners();
  }

  // Load lessons from API (mock data for now)
  async loadLessons() {
    try {
      // In a real app, this would fetch from the API
      this.lessons = [
        {
          id: 1,
          title: 'Introduction to Mathematics',
          description: 'Learn the fundamentals of mathematics including basic operations, number systems, and problem-solving techniques.',
          category: 'Mathematics',
          difficulty: 'Beginner',
          duration: 120, // minutes
          content: {
            sections: [
              {
                id: 1,
                title: 'Basic Arithmetic',
                content: 'Introduction to addition, subtraction, multiplication, and division.',
                exercises: [
                  { id: 1, question: 'What is 2 + 2?', answer: '4', type: 'multiple-choice' },
                  { id: 2, question: 'Solve: 5 × 3', answer: '15', type: 'text' }
                ]
              },
              {
                id: 2,
                title: 'Number Systems',
                content: 'Understanding different number systems and their properties.',
                exercises: [
                  { id: 3, question: 'Which number is larger: 0.5 or 0.05?', answer: '0.5', type: 'multiple-choice' }
                ]
              }
            ]
          },
          prerequisites: [],
          tags: ['math', 'beginner', 'arithmetic'],
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20')
        },
        {
          id: 2,
          title: 'Basic Algebra',
          description: 'Master the fundamentals of algebraic expressions, equations, and problem-solving.',
          category: 'Mathematics',
          difficulty: 'Intermediate',
          duration: 180,
          content: {
            sections: [
              {
                id: 1,
                title: 'Variables and Expressions',
                content: 'Understanding variables and how to work with algebraic expressions.',
                exercises: [
                  { id: 1, question: 'Simplify: 2x + 3x', answer: '5x', type: 'text' },
                  { id: 2, question: 'Evaluate 3x + 2 when x = 4', answer: '14', type: 'text' }
                ]
              },
              {
                id: 2,
                title: 'Linear Equations',
                content: 'Solving linear equations with one variable.',
                exercises: [
                  { id: 3, question: 'Solve for x: 2x + 5 = 13', answer: '4', type: 'text' }
                ]
              }
            ]
          },
          prerequisites: [1], // Requires lesson 1
          tags: ['math', 'intermediate', 'algebra'],
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-25')
        },
        {
          id: 3,
          title: 'World History: Ancient Civilizations',
          description: 'Explore the rise and fall of ancient civilizations and their impact on modern society.',
          category: 'History',
          difficulty: 'Beginner',
          duration: 240,
          content: {
            sections: [
              {
                id: 1,
                title: 'Mesopotamia',
                content: 'The cradle of civilization and its contributions to human development.',
                exercises: [
                  { id: 1, question: 'Which river system was central to Mesopotamian civilization?', answer: 'Tigris and Euphrates', type: 'multiple-choice' }
                ]
              },
              {
                id: 2,
                title: 'Ancient Egypt',
                content: 'The pharaohs, pyramids, and the Nile civilization.',
                exercises: [
                  { id: 2, question: 'What was the primary purpose of the pyramids?', answer: 'Tombs for pharaohs', type: 'multiple-choice' }
                ]
              }
            ]
          },
          prerequisites: [],
          tags: ['history', 'beginner', 'ancient', 'civilizations'],
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-18')
        }
      ];

      this.renderLessons();
    } catch (error) {
      console.error('Error loading lessons:', error);
      this.showError('Failed to load lessons. Please try again.');
    }
  }

  // Setup event listeners
  setupEventListeners() {
    // Lesson search
    const searchInput = document.getElementById('lessonSearch');
    if (searchInput) {
      searchInput.addEventListener('input', this.debounce(this.handleLessonSearch.bind(this), 300));
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.lesson-filter');
    filterButtons.forEach(button => {
      button.addEventListener('click', this.handleFilterClick.bind(this));
    });
  }

  // Render lessons grid
  renderLessons(filteredLessons = null) {
    const lessonsGrid = document.getElementById('lessonsGrid');
    if (!lessonsGrid) return;

    const lessonsToRender = filteredLessons || this.lessons;
    
    if (lessonsToRender.length === 0) {
      lessonsGrid.innerHTML = `
        <div class="col-12">
          <div class="text-center py-5">
            <i class="bi bi-book display-1 text-muted"></i>
            <h4 class="mt-3 text-muted">No lessons found</h4>
            <p class="text-muted">Try adjusting your search or filters.</p>
          </div>
        </div>
      `;
      return;
    }

    lessonsGrid.innerHTML = lessonsToRender.map(lesson => this.createLessonCard(lesson)).join('');
  }

  // Create lesson card HTML
  createLessonCard(lesson) {
    const progress = this.getLessonProgress(lesson.id);
    const isCompleted = progress === 100;
    const isLocked = this.isLessonLocked(lesson.id);

    return `
      <div class="col-md-6 col-lg-4">
        <div class="card lesson-card h-100 ${isLocked ? 'opacity-50' : ''}" 
             onclick="${isLocked ? '' : `app.lessonsManager.startLesson(${lesson.id})`}">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-primary">${lesson.category}</span>
              <div class="d-flex gap-1">
                <span class="badge bg-secondary">${lesson.difficulty}</span>
                ${isCompleted ? '<span class="badge bg-success">Completed</span>' : ''}
                ${isLocked ? '<span class="badge bg-warning">Locked</span>' : ''}
              </div>
            </div>
            
            <h6 class="card-title">${lesson.title}</h6>
            <p class="card-text small text-muted">${lesson.description}</p>
            
            <div class="d-flex justify-content-between align-items-center mb-2">
              <small class="text-muted">
                <i class="bi bi-clock me-1"></i>
                ${this.formatDuration(lesson.duration)}
              </small>
              <small class="text-muted">
                <i class="bi bi-person me-1"></i>
                ${lesson.difficulty}
              </small>
            </div>
            
            ${!isLocked ? `
              <div class="mb-2">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <small class="text-muted">Progress</small>
                  <small class="text-muted">${progress}%</small>
                </div>
                <div class="progress" style="height: 4px;">
                  <div class="progress-bar" role="progressbar" style="width: ${progress}%"></div>
                </div>
              </div>
            ` : ''}
            
            <div class="d-flex gap-2">
              ${!isLocked ? `
                <button class="btn btn-primary btn-sm flex-grow-1" onclick="event.stopPropagation(); app.lessonsManager.startLesson(${lesson.id})">
                  ${progress > 0 ? 'Continue' : 'Start'} Lesson
                </button>
              ` : `
                <button class="btn btn-secondary btn-sm flex-grow-1" disabled>
                  Complete Prerequisites
                </button>
              `}
              <button class="btn btn-outline-secondary btn-sm" onclick="event.stopPropagation(); app.lessonsManager.showLessonDetails(${lesson.id})">
                <i class="bi bi-info-circle"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Start a lesson
  startLesson(lessonId) {
    const lesson = this.lessons.find(l => l.id === lessonId);
    if (!lesson) {
      this.showError('Lesson not found.');
      return;
    }

    if (this.isLessonLocked(lessonId)) {
      this.showError('Please complete the prerequisites first.');
      return;
    }

    this.currentLesson = lesson;
    this.showLessonViewer();
  }

  // Show lesson viewer
  showLessonViewer() {
    if (!this.currentLesson) return;

    // Create lesson viewer modal
    const modal = this.createLessonModal();
    document.body.appendChild(modal);
    
    // Show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    // Load first section
    this.loadLessonSection(0);
  }

  // Create lesson modal
  createLessonModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'lessonModal';
    modal.setAttribute('tabindex', '-1');
    modal.innerHTML = `
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="lessonTitle">${this.currentLesson.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-3">
                <div class="card">
                  <div class="card-header">
                    <h6 class="mb-0">Lesson Sections</h6>
                  </div>
                  <div class="card-body p-0">
                    <div id="lessonSections" class="list-group list-group-flush">
                      <!-- Sections will be populated here -->
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-9">
                <div id="lessonContent">
                  <!-- Lesson content will be displayed here -->
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="nextSectionBtn" onclick="app.lessonsManager.nextSection()">Next Section</button>
          </div>
        </div>
      </div>
    `;

    return modal;
  }

  // Load lesson section
  loadLessonSection(sectionIndex) {
    if (!this.currentLesson || !this.currentLesson.content.sections[sectionIndex]) return;

    const section = this.currentLesson.content.sections[sectionIndex];
    const lessonContent = document.getElementById('lessonContent');
    const lessonSections = document.getElementById('lessonSections');

    if (!lessonContent || !lessonSections) return;

    // Update sections navigation
    lessonSections.innerHTML = this.currentLesson.content.sections.map((sec, index) => `
      <button class="list-group-item list-group-item-action ${index === sectionIndex ? 'active' : ''}" 
              onclick="app.lessonsManager.loadLessonSection(${index})">
        ${sec.title}
      </button>
    `).join('');

    // Update content
    lessonContent.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h6 class="mb-0">${section.title}</h6>
        </div>
        <div class="card-body">
          <div class="mb-4">
            <p>${section.content}</p>
          </div>
          
          ${section.exercises && section.exercises.length > 0 ? `
            <div class="border-top pt-4">
              <h6>Exercises</h6>
              <div id="lessonExercises">
                ${section.exercises.map((exercise, index) => this.createExerciseHTML(exercise, index)).join('')}
              </div>
              <button class="btn btn-success mt-3" onclick="app.lessonsManager.checkExercises(${sectionIndex})">
                Check Answers
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Update navigation buttons
    const nextBtn = document.getElementById('nextSectionBtn');
    if (nextBtn) {
      const isLastSection = sectionIndex === this.currentLesson.content.sections.length - 1;
      nextBtn.textContent = isLastSection ? 'Complete Lesson' : 'Next Section';
      nextBtn.onclick = isLastSection ? 
        () => this.completeLesson() : 
        () => this.nextSection();
    }
  }

  // Create exercise HTML
  createExerciseHTML(exercise, index) {
    if (exercise.type === 'multiple-choice') {
      return `
        <div class="mb-3">
          <p class="fw-bold">${exercise.question}</p>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="exercise-${index}" value="A">
            <label class="form-check-label">Option A</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="exercise-${index}" value="B">
            <label class="form-check-label">Option B</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="exercise-${index}" value="C">
            <label class="form-check-label">Option C</label>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="mb-3">
          <label class="form-label fw-bold">${exercise.question}</label>
          <input type="text" class="form-control" name="exercise-${index}" placeholder="Your answer">
        </div>
      `;
    }
  }

  // Check exercises
  checkExercises(sectionIndex) {
    const section = this.currentLesson.content.sections[sectionIndex];
    const exercises = document.querySelectorAll(`#lessonExercises input`);
    
    let correct = 0;
    let total = section.exercises.length;

    section.exercises.forEach((exercise, index) => {
      const userAnswer = exercises[index]?.value?.trim().toLowerCase();
      const correctAnswer = exercise.answer.toLowerCase();
      
      if (userAnswer === correctAnswer) {
        correct++;
        exercises[index].classList.add('is-valid');
      } else {
        exercises[index].classList.add('is-invalid');
      }
    });

    const score = Math.round((correct / total) * 100);
    this.showNotification(`Exercise completed! Score: ${score}% (${correct}/${total})`, 
                         score >= 70 ? 'success' : 'warning');
  }

  // Next section
  nextSection() {
    const currentIndex = this.getCurrentSectionIndex();
    if (currentIndex < this.currentLesson.content.sections.length - 1) {
      this.loadLessonSection(currentIndex + 1);
    }
  }

  // Complete lesson
  completeLesson() {
    if (!this.currentLesson) return;

    // Update progress
    this.updateLessonProgress(this.currentLesson.id, 100);
    
    // Show completion message
    this.showNotification(`Congratulations! You completed "${this.currentLesson.title}"`, 'success');
    
    // Close modal
    const modal = document.getElementById('lessonModal');
    if (modal) {
      const bsModal = bootstrap.Modal.getInstance(modal);
      bsModal.hide();
    }

    // Refresh lessons grid
    this.renderLessons();
  }

  // Get current section index
  getCurrentSectionIndex() {
    const activeSection = document.querySelector('#lessonSections .active');
    return Array.from(document.querySelectorAll('#lessonSections button')).indexOf(activeSection);
  }

  // Show lesson details
  showLessonDetails(lessonId) {
    const lesson = this.lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    // Create details modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${lesson.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p><strong>Category:</strong> ${lesson.category}</p>
            <p><strong>Difficulty:</strong> ${lesson.difficulty}</p>
            <p><strong>Duration:</strong> ${this.formatDuration(lesson.duration)}</p>
            <p><strong>Description:</strong></p>
            <p>${lesson.description}</p>
            ${lesson.prerequisites.length > 0 ? `
              <p><strong>Prerequisites:</strong></p>
              <ul>
                ${lesson.prerequisites.map(prereqId => {
                  const prereq = this.lessons.find(l => l.id === prereqId);
                  return `<li>${prereq ? prereq.title : 'Unknown lesson'}</li>`;
                }).join('')}
              </ul>
            ` : ''}
            <p><strong>Tags:</strong> ${lesson.tags.join(', ')}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            ${!this.isLessonLocked(lessonId) ? `
              <button type="button" class="btn btn-primary" onclick="app.lessonsManager.startLesson(${lessonId})">Start Lesson</button>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  }

  // Handle lesson search
  handleLessonSearch(event) {
    const query = event.target.value.toLowerCase().trim();
    const filteredLessons = this.lessons.filter(lesson => 
      lesson.title.toLowerCase().includes(query) ||
      lesson.description.toLowerCase().includes(query) ||
      lesson.category.toLowerCase().includes(query) ||
      lesson.tags.some(tag => tag.toLowerCase().includes(query))
    );
    
    this.renderLessons(filteredLessons);
  }

  // Handle filter click
  handleFilterClick(event) {
    const filter = event.target.dataset.filter;
    let filteredLessons = this.lessons;

    if (filter && filter !== 'all') {
      filteredLessons = this.lessons.filter(lesson => 
        lesson.category.toLowerCase() === filter.toLowerCase() ||
        lesson.difficulty.toLowerCase() === filter.toLowerCase()
      );
    }

    this.renderLessons(filteredLessons);
  }

  // Get lesson progress
  getLessonProgress(lessonId) {
    return this.progress[lessonId] || 0;
  }

  // Update lesson progress
  updateLessonProgress(lessonId, progress) {
    this.progress[lessonId] = Math.max(this.progress[lessonId] || 0, progress);
    // In a real app, this would save to the API
    localStorage.setItem('lessonProgress', JSON.stringify(this.progress));
  }

  // Check if lesson is locked
  isLessonLocked(lessonId) {
    const lesson = this.lessons.find(l => l.id === lessonId);
    if (!lesson || !lesson.prerequisites) return false;

    return lesson.prerequisites.some(prereqId => 
      this.getLessonProgress(prereqId) < 100
    );
  }

  // Format duration
  formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  // Show error
  showError(message) {
    if (window.app) {
      window.app.showNotification(message, 'danger');
    }
  }

  // Show notification
  showNotification(message, type = 'info') {
    if (window.app) {
      window.app.showNotification(message, type);
    }
  }

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize lessons manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.app) {
    window.app.lessonsManager = new LessonsManager();
  }
});
