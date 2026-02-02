// Teacher functionality for AQE Platform
// Handles teacher dashboard, students, practice materials, and digital library

class TeacherManager {
  constructor() {
    this.apiBaseUrl = window.AQEConfig.getApiBaseUrl();
    this.currentTeacher = null;
    this.students = [];
    this.practiceMaterials = [];
    this.digitalLibrary = [];
    this.questionCounter = 0;
    this.currentMaterialId = null;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadTeacherData();
  }

  setupEventListeners() {
    // Create material form
    const createMaterialForm = document.getElementById('createMaterialForm');
    if (createMaterialForm) {
      createMaterialForm.addEventListener('submit', this.handleCreateMaterial.bind(this));
    }

    // Tab change listeners
    document.addEventListener('shown.bs.tab', (event) => {
      console.log('Tab changed to:', event.target.getAttribute('data-bs-target'));
      
      // Ensure teacher data is loaded before loading tab content
      if (!this.currentTeacher) {
        console.log('No current teacher, waiting for teacher data to load...');
        // Wait a bit and try again
        setTimeout(() => {
          this.handleTabChange(event.target.getAttribute('data-bs-target'));
        }, 500);
        return;
      }
      
      this.handleTabChange(event.target.getAttribute('data-bs-target'));
    });
  }

  handleTabChange(tabTarget) {
    console.log('handleTabChange called with:', tabTarget);
    if (tabTarget === '#students-content') {
      console.log('Loading students tab content');
      this.loadStudents();
    } else if (tabTarget === '#view-materials-content') {
      console.log('Loading practice materials tab content');
      this.loadPracticeMaterials();
    } else if (tabTarget === '#digital-library-content') {
      console.log('Loading digital library tab content');
      this.loadDigitalLibrary();
    }
  }

  async loadTeacherData() {
    // Use the new multi-role auth system
    if (!window.multiRoleAuth || !window.multiRoleAuth.currentUser) {
      console.log('No current user found in multiRoleAuth');
      return;
    }

    this.currentTeacher = window.multiRoleAuth.currentUser;
    console.log('Teacher data loaded:', this.currentTeacher);
    
    // Load dashboard data
    await this.loadDashboard();
    
    // Always load students when teacher data is available
    console.log('Teacher data loaded, loading students...');
    
    // Add a small delay to ensure the DOM is ready
    setTimeout(() => {
      this.loadStudents();
    }, 100);
  }

  async loadDashboard() {
    if (!this.currentTeacher) return;

    // For demo teacher, the teacher ID is 1, not the user ID
    const teacherId = this.currentTeacher.email === 'teacher@demo.com' ? 1 : this.currentTeacher.id;

    try {
      // Add cache-busting timestamp to prevent stale data
      const timestamp = new Date().getTime();
      const response = await fetch(`${this.apiBaseUrl}/teacher/${teacherId}/dashboard?t=${timestamp}`);
      const data = await response.json();

      if (response.ok) {
        this.updateDashboardStats(data.stats);
        this.updateRecentActivity(data.recentActivity);
        // Store the correct teacher ID for other API calls
        this.currentTeacher.teacherId = teacherId;
      }

      // Load curriculum analytics
      if (window.app && window.app.loadTeacherAnalytics) {
        await window.app.loadTeacherAnalytics();
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  }

  updateDashboardStats(stats) {
    document.getElementById('totalStudents').textContent = stats.totalStudents || 0;
    document.getElementById('totalPracticeMaterials').textContent = stats.totalPracticeMaterials || 0;
    document.getElementById('avgScore').textContent = `${stats.averageScore || 0}%`;
    document.getElementById('completedAssignments').textContent = stats.completedAssignments || 0;
  }

  updateRecentActivity(activities) {
    const container = document.getElementById('recentActivityList');
    if (!container) return;

    if (activities.length === 0) {
      container.innerHTML = '<p class="text-muted text-center">No recent activity</p>';
      return;
    }

    container.innerHTML = activities.map(activity => `
      <div class="d-flex align-items-center mb-3">
        <div class="activity-icon me-3">
          <i class="bi bi-clipboard-check text-primary"></i>
        </div>
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between">
            <span class="fw-medium">${activity.studentName}</span>
            <small class="text-muted">${this.formatDate(activity.assignedAt)}</small>
          </div>
          <p class="mb-1 small text-muted">${activity.materialTitle}</p>
          ${activity.completedAt ? 
            `<span class="badge bg-success">Completed ${activity.score ? `(${activity.score}%)` : ''}</span>` : 
            `<span class="badge bg-warning">In Progress</span>`
          }
        </div>
      </div>
    `).join('');
  }

  async loadStudents() {
    if (!this.currentTeacher) {
      console.log('No current teacher, skipping loadStudents');
      return;
    }

    try {
      console.log('Loading students for teacher ID:', this.getTeacherId());
      // Add cache-busting timestamp to prevent stale data
      const timestamp = new Date().getTime();
      const response = await fetch(`${this.apiBaseUrl}/teacher/${this.getTeacherId()}/students?t=${timestamp}`);
      const students = await response.json();

      console.log('Students API response:', response.status, students);
      if (response.ok) {
        this.students = students;
        this.updateStudentsTable(students);
      } else {
        console.error('Error response from students API:', students);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    }
  }

  updateStudentsTable(students) {
    console.log('updateStudentsTable called with:', students);
    console.log('students type:', typeof students);
    console.log('students is array:', Array.isArray(students));
    console.log('students length:', students?.length);
    
    const tbody = document.getElementById('studentsTableBody');
    console.log('tbody element:', tbody);
    if (!tbody) {
      console.error('studentsTableBody element not found!');
      return;
    }
    
    console.log('About to update table with students:', students);

    if (!students || !Array.isArray(students) || students.length === 0) {
      console.log('No students found, showing empty message. Students:', students);
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted">No students added yet</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = students.map(student => `
      <tr>
        <td>${student.name}</td>
        <td>${student.gradeLevel}</td>
        <td>
          <code class="bg-light px-2 py-1 rounded">${student.accessCode || 'Not generated'}</code>
        </td>
        <td>${student.lastLogin ? this.formatDate(student.lastLogin) : 'Never'}</td>
        <td>
          <div class="btn-group" role="group">
            <button class="btn btn-outline-primary btn-sm" onclick="regenerateAccessCode(${student.id})" title="Regenerate Access Code">
              <i class="bi bi-arrow-clockwise"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="deleteStudent(${student.id})" title="Delete Student">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
    
    console.log('Table updated successfully. New innerHTML length:', tbody.innerHTML.length);
    console.log('Table rows count:', tbody.querySelectorAll('tr').length);
    
    // Force the students tab to be visible if it's not already
    const studentsTab = document.querySelector('[data-bs-target="#students-content"]');
    const studentsContent = document.getElementById('students-content');
    
    if (studentsTab && studentsContent) {
      console.log('Students tab found, ensuring it\'s visible');
      // If the tab is not active, make it active
      if (!studentsTab.classList.contains('active')) {
        console.log('Students tab not active, activating it');
        studentsTab.click();
      }
    }
  }

  async loadPracticeMaterials() {
    if (!this.currentTeacher) {
      console.log('No current teacher available for loading practice materials');
      return;
    }

    console.log('Loading practice materials for teacher:', this.currentTeacher.id);

    try {
      const response = await fetch(`${this.apiBaseUrl}/teacher/${this.getTeacherId()}/practice-materials`);
      const materials = await response.json();

      console.log('Practice materials response:', materials);

      if (response.ok) {
        this.practiceMaterials = materials;
        this.updatePracticeMaterialsGrid(materials);
      } else {
        console.error('Error response:', materials);
      }
    } catch (error) {
      console.error('Error loading practice materials:', error);
    }
  }

  updatePracticeMaterialsGrid(materials) {
    const container = document.getElementById('practiceMaterialsGrid');
    if (!container) return;

    if (materials.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center text-muted">
          <i class="bi bi-clipboard fs-1 mb-3"></i>
          <p>No practice materials created yet</p>
        </div>
      `;
      return;
    }

    container.innerHTML = materials.map(material => `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <h6 class="card-title">${material.title}</h6>
            <p class="card-text small text-muted">${material.description}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge bg-primary">${material.subject}</span>
              <span class="small text-muted">${material.questionCount} questions</span>
            </div>
          </div>
          <div class="card-footer bg-transparent">
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary btn-sm flex-fill" onclick="assignMaterialToStudents(${material.id})">
                <i class="bi bi-send me-1"></i>Assign
              </button>
              <button class="btn btn-outline-secondary btn-sm" onclick="viewMaterialDetails(${material.id})">
                <i class="bi bi-eye"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  async loadDigitalLibrary() {
    if (!this.currentTeacher) return;

    try {
      // Use the new curriculum library system
      if (window.app && window.app.loadTeacherLibrary) {
        await window.app.loadTeacherLibrary();
      } else {
        console.error('AQEPlatform library methods not available');
      }
    } catch (error) {
      console.error('Error loading digital library:', error);
    }
  }

  updateDigitalLibraryGrid(library) {
    const container = document.getElementById('digitalLibraryGrid');
    if (!container) return;

    if (library.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center text-muted">
          <i class="bi bi-book fs-1 mb-3"></i>
          <p>No digital library lessons available</p>
        </div>
      `;
      return;
    }

    container.innerHTML = library.map(lesson => `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <h6 class="card-title">${lesson.title}</h6>
            <p class="card-text small text-muted">${lesson.description}</p>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-success">${lesson.subject}</span>
              <span class="badge bg-info">${lesson.gradeLevel}</span>
            </div>
            <p class="small text-muted mb-0">By ${lesson.createdBy}</p>
          </div>
          <div class="card-footer bg-transparent">
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary btn-sm flex-fill" onclick="assignLibraryLesson(${lesson.id})">
                <i class="bi bi-send me-1"></i>Assign
              </button>
              <button class="btn btn-outline-secondary btn-sm" onclick="previewLibraryLesson(${lesson.id})">
                <i class="bi bi-eye"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  async handleCreateMaterial(event) {
    event.preventDefault();

    const title = document.getElementById('materialTitle').value;
    const subject = document.getElementById('materialSubject').value;
    const description = document.getElementById('materialDescription').value;

    console.log('Creating material:', { title, subject, description });

    const questions = this.collectQuestions();
    console.log('Collected questions:', questions);

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/teacher/${this.getTeacherId()}/practice-materials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          subject,
          description,
          questions
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Practice material created successfully!');
        document.getElementById('createMaterialForm').reset();
        document.getElementById('questionsContainer').innerHTML = '';
        this.questionCounter = 0;
        this.loadPracticeMaterials();
      } else {
        alert('Error creating material: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating material:', error);
      alert('Error creating material');
    }
  }

  collectQuestions() {
    const questions = [];
    const questionElements = document.querySelectorAll('.question-item');

    questionElements.forEach((element, index) => {
      const questionText = element.querySelector('.question-text').value;
      const questionType = element.querySelector('.question-type').value;
      const correctAnswer = element.querySelector('.correct-answer').value;
      const explanation = element.querySelector('.explanation').value;

      const question = {
        questionText,
        type: parseInt(questionType),
        correctAnswer,
        explanation
      };

      // Add options for multiple choice
      if (questionType === '0') {
        question.optionA = element.querySelector('.option-a').value;
        question.optionB = element.querySelector('.option-b').value;
        question.optionC = element.querySelector('.option-c').value;
        question.optionD = element.querySelector('.option-d').value;
      }

      questions.push(question);
    });

    return questions;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  getTeacherId() {
    // Return the correct teacher ID for API calls
    return this.currentTeacher?.teacherId || (this.currentTeacher?.email === 'teacher@demo.com' ? 1 : this.currentTeacher?.id);
  }
}

// Global functions for HTML onclick handlers
function showAddStudentModal() {
  const modal = new bootstrap.Modal(document.getElementById('addStudentModal'));
  modal.show();
}

function addStudent() {
  const nameElement = document.getElementById('addStudentName');
  const gradeElement = document.getElementById('addStudentGradeLevel');
  
  if (!nameElement) {
    console.error('addStudentName element not found');
    alert('Form error: Student name field not found');
    return;
  }
  
  if (!gradeElement) {
    console.error('addStudentGradeLevel element not found');
    alert('Form error: Grade level field not found');
    return;
  }
  
  const name = nameElement.value.trim();
  const gradeLevel = gradeElement.value;
  
  if (!name) {
    alert('Please enter a student name');
    return;
  }

  if (!gradeLevel) {
    alert('Please select a grade level');
    return;
  }

  if (!window.teacherManager || !window.teacherManager.currentTeacher) {
    console.error('Teacher manager or current teacher not available:', {
      teacherManager: window.teacherManager,
      currentTeacher: window.teacherManager?.currentTeacher,
      currentUser: window.multiRoleAuth?.currentUser
    });
    
    // Try to initialize teacher manager if it doesn't exist
    if (!window.teacherManager && window.TeacherManager) {
      console.log('Attempting to initialize teacher manager...');
      window.teacherManager = new TeacherManager();
      
      // Set current teacher from auth system
      if (window.multiRoleAuth?.currentUser) {
        window.teacherManager.currentTeacher = window.multiRoleAuth.currentUser;
        console.log('Teacher manager initialized with user:', window.multiRoleAuth.currentUser);
      }
    }
    
    // If still no teacher manager, try to restore session
    if (!window.teacherManager || !window.teacherManager.currentTeacher) {
      console.log('Attempting to restore session...');
      
      // Try to restore session from localStorage
      const storedSession = localStorage.getItem('aqe_user');
      if (storedSession) {
        try {
          const userData = JSON.parse(storedSession);
          if (userData.role === 'teacher') {
            if (!window.teacherManager) {
              window.teacherManager = new TeacherManager();
            }
            window.teacherManager.currentTeacher = userData;
            console.log('Session restored, teacher manager initialized with:', userData);
          }
        } catch (error) {
          console.error('Failed to restore session:', error);
        }
      }
    }
    
    // Check again after all initialization attempts
    if (!window.teacherManager || !window.teacherManager.currentTeacher) {
      alert('Teacher not logged in or teacher manager not initialized. Please try logging in again.');
      return;
    }
  }

  console.log('Adding student:', name, 'Grade:', gradeLevel, 'for teacher:', window.teacherManager.currentTeacher);

  fetch(`${window.teacherManager.apiBaseUrl}/teacher/${window.teacherManager.getTeacherId()}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, gradeLevel })
  })
  .then(response => response.json())
  .then(data => {
    if (data.id) {
      alert(`Student added successfully! Access code: ${data.accessCode}`);
      bootstrap.Modal.getInstance(document.getElementById('addStudentModal')).hide();
      document.getElementById('addStudentName').value = '';
      document.getElementById('addStudentGradeLevel').value = '';
      window.teacherManager.loadStudents();
      window.teacherManager.loadDashboard();
    } else {
      alert('Error adding student: ' + data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error adding student');
  });
}

function regenerateAccessCode(studentId) {
  if (!window.teacherManager.currentTeacher) {
    alert('Teacher not logged in');
    return;
  }

  fetch(`${window.teacherManager.apiBaseUrl}/teacher/${window.teacherManager.getTeacherId()}/students/${studentId}/regenerate-access-code`, {
    method: 'POST'
  })
  .then(response => response.json())
  .then(data => {
    if (data.accessCode) {
      alert(`New access code: ${data.accessCode}`);
      window.teacherManager.loadStudents();
    } else {
      alert('Error regenerating access code: ' + data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error regenerating access code');
  });
}

function deleteStudent(studentId) {
  if (!window.teacherManager.currentTeacher) {
    alert('Teacher not logged in');
    return;
  }

  if (!confirm('Are you sure you want to delete this student? This will permanently remove their account and all associated data.')) {
    return;
  }

  fetch(`${window.teacherManager.apiBaseUrl}/teacher/${window.teacherManager.getTeacherId()}/students/${studentId}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (response.ok) {
      return response.json().then(data => {
        alert('Student deleted successfully');
        
        // Force refresh all teacher data
        console.log('Refreshing teacher data after student deletion...');
        window.teacherManager.loadStudents();
        window.teacherManager.loadDashboard();
        
        // Also refresh the main platform data if available
        if (window.aqePlatform) {
          window.aqePlatform.loadTeacherData();
        }
        
        // Force a small delay to ensure API calls complete
        setTimeout(() => {
          console.log('Student deletion completed, data refreshed');
        }, 500);
      });
    } else {
      return response.json().then(data => {
        alert('Error deleting student: ' + data.message);
      });
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error deleting student');
  });
}

function addQuestion() {
  const container = document.getElementById('questionsContainer');
  const questionNumber = ++window.teacherManager.questionCounter;

  const questionHtml = `
    <div class="question-item border rounded p-3 mb-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6>Question ${questionNumber}</h6>
        <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeQuestion(this)">
          <i class="bi bi-trash"></i>
        </button>
      </div>
      
      <div class="mb-3">
        <label class="form-label">Question Text</label>
        <textarea class="form-control question-text" rows="2" required></textarea>
      </div>
      
      <div class="mb-3">
        <label class="form-label">Question Type</label>
        <select class="form-select question-type" onchange="toggleQuestionOptions(this)" required>
          <option value="0">Multiple Choice</option>
          <option value="1">Fill in the Blank</option>
          <option value="2">True/False</option>
        </select>
      </div>
      
      <div class="multiple-choice-options">
        <div class="row g-2 mb-3">
          <div class="col-md-6">
            <label class="form-label">Option A</label>
            <input type="text" class="form-control option-a">
          </div>
          <div class="col-md-6">
            <label class="form-label">Option B</label>
            <input type="text" class="form-control option-b">
          </div>
          <div class="col-md-6">
            <label class="form-label">Option C</label>
            <input type="text" class="form-control option-c">
          </div>
          <div class="col-md-6">
            <label class="form-label">Option D</label>
            <input type="text" class="form-control option-d">
          </div>
        </div>
      </div>
      
      <div class="mb-3">
        <label class="form-label">Correct Answer</label>
        <input type="text" class="form-control correct-answer" required>
      </div>
      
      <div class="mb-3">
        <label class="form-label">Explanation (Optional)</label>
        <textarea class="form-control explanation" rows="2"></textarea>
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', questionHtml);
}

function removeQuestion(button) {
  button.closest('.question-item').remove();
}

function toggleQuestionOptions(select) {
  const optionsContainer = select.closest('.question-item').querySelector('.multiple-choice-options');
  const correctAnswerInput = select.closest('.question-item').querySelector('.correct-answer');
  
  if (select.value === '0') {
    optionsContainer.style.display = 'block';
    correctAnswerInput.placeholder = 'Enter the correct option (A, B, C, or D)';
  } else if (select.value === '1') {
    optionsContainer.style.display = 'none';
    correctAnswerInput.placeholder = 'Enter the correct answer';
  } else if (select.value === '2') {
    optionsContainer.style.display = 'none';
    correctAnswerInput.placeholder = 'Enter True or False';
  }
}

function assignMaterialToStudents(materialId) {
  window.teacherManager.currentMaterialId = materialId;
  window.teacherManager.currentMaterialType = 'practice';
  
  // Populate student checkboxes
  const container = document.getElementById('studentCheckboxes');
  container.innerHTML = window.teacherManager.students.map(student => `
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="${student.id}" id="student-${student.id}">
      <label class="form-check-label" for="student-${student.id}">
        ${student.name} (${student.gradeLevel})
      </label>
    </div>
  `).join('');
  
  const modal = new bootstrap.Modal(document.getElementById('assignMaterialModal'));
  modal.show();
}

function assignLibraryLesson(lessonId) {
  window.teacherManager.currentMaterialId = lessonId;
  window.teacherManager.currentMaterialType = 'library';
  
  // Populate student checkboxes
  const container = document.getElementById('studentCheckboxes');
  container.innerHTML = window.teacherManager.students.map(student => `
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="${student.id}" id="student-${student.id}">
      <label class="form-check-label" for="student-${student.id}">
        ${student.name} (${student.gradeLevel})
      </label>
    </div>
  `).join('');
  
  const modal = new bootstrap.Modal(document.getElementById('assignMaterialModal'));
  modal.show();
}

function toggleStudentSelection() {
  const assignToAll = document.getElementById('assignToAllStudents').checked;
  const container = document.getElementById('studentSelectionContainer');
  
  container.style.display = assignToAll ? 'none' : 'block';
  
  if (!assignToAll) {
    document.querySelectorAll('#studentCheckboxes input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
    });
  }
}

function assignMaterial() {
  const assignToAll = document.getElementById('assignToAllStudents').checked;
  const selectedStudents = Array.from(document.querySelectorAll('#studentCheckboxes input[type="checkbox"]:checked'))
    .map(checkbox => parseInt(checkbox.value));
  
  if (!assignToAll && selectedStudents.length === 0) {
    alert('Please select at least one student or choose "Assign to all students"');
    return;
  }
  
  const endpoint = window.teacherManager.currentMaterialType === 'practice' 
    ? `${window.teacherManager.apiBaseUrl}/teacher/${window.teacherManager.getTeacherId()}/practice-materials/${window.teacherManager.currentMaterialId}/assign`
    : `${window.teacherManager.apiBaseUrl}/teacher/${window.teacherManager.getTeacherId()}/digital-library/${window.teacherManager.currentMaterialId}/assign`;
  
  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      assignToAllStudents: assignToAll,
      studentIds: selectedStudents
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      alert('Material assigned successfully!');
      bootstrap.Modal.getInstance(document.getElementById('assignMaterialModal')).hide();
    } else {
      alert('Error assigning material: ' + data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error assigning material');
  });
}

function viewMaterialDetails(materialId) {
  const material = window.teacherManager.practiceMaterials.find(m => m.id === materialId);
  if (material) {
    alert(`Material: ${material.title}\nSubject: ${material.subject}\nQuestions: ${material.questionCount}\nCreated: ${window.teacherManager.formatDate(material.createdAt)}`);
  }
}

function previewLibraryLesson(lessonId) {
  const lesson = window.teacherManager.digitalLibrary.find(l => l.id === lessonId);
  if (lesson) {
    alert(`Lesson: ${lesson.title}\nSubject: ${lesson.subject}\nGrade: ${lesson.gradeLevel}\nBy: ${lesson.createdBy}\n\nDescription: ${lesson.description}`);
  }
}

// Initialize teacher manager when DOM is loaded (only if not already initialized)
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize if not already initialized by auth-multi-role.js
  if (window.TeacherManager && !window.teacherManager) {
    console.log('Teacher manager not initialized by auth system, initializing manually');
    window.teacherManager = new TeacherManager();
  }
});
