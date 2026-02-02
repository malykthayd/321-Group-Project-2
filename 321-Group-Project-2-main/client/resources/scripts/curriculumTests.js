// Curriculum System Tests
// Basic functionality tests for the curriculum auto-generation system

class CurriculumSystemTests {
  constructor() {
    this.testResults = [];
    this.apiBaseUrl = window.AQEConfig ? window.AQEConfig.getApiBaseUrl() : 'http://localhost:5001/api';
  }

  async runAllTests() {
    console.log('Starting Curriculum System Tests...');
    
    try {
      await this.testSubjectGeneration();
      await this.testGradeGeneration();
      await this.testLessonGeneration();
      await this.testAssignmentWorkflow();
      await this.testAnalytics();
      
      this.displayResults();
    } catch (error) {
      console.error('Test suite failed:', error);
    }
  }

  async testSubjectGeneration() {
    console.log('Testing Subject Generation...');
    
    try {
      const response = await fetch(`${this.apiBaseUrl}/admin/curriculum/subjects`);
      const subjects = await response.json();
      
      this.addTestResult('Subject Generation', 
        Array.isArray(subjects) && subjects.length > 0,
        `Found ${subjects.length} subjects: ${subjects.map(s => s.name).join(', ')}`
      );
    } catch (error) {
      this.addTestResult('Subject Generation', false, `Error: ${error.message}`);
    }
  }

  async testGradeGeneration() {
    console.log('Testing Grade Generation...');
    
    try {
      const response = await fetch(`${this.apiBaseUrl}/admin/curriculum/grades`);
      const grades = await response.json();
      
      this.addTestResult('Grade Generation', 
        Array.isArray(grades) && grades.length > 0,
        `Found ${grades.length} grades: ${grades.map(g => g.displayName).join(', ')}`
      );
    } catch (error) {
      this.addTestResult('Grade Generation', false, `Error: ${error.message}`);
    }
  }

  async testLessonGeneration() {
    console.log('Testing Lesson Generation...');
    
    try {
      // Test dry run generation
      const response = await fetch(`${this.apiBaseUrl}/admin/curriculum/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun: true })
      });
      
      const result = await response.json();
      
      this.addTestResult('Lesson Generation (Dry Run)', 
        response.ok && result.generatedLessons && result.generatedLessons.length > 0,
        `Generated ${result.generatedLessons?.length || 0} lessons in dry run`
      );
    } catch (error) {
      this.addTestResult('Lesson Generation (Dry Run)', false, `Error: ${error.message}`);
    }
  }

  async testAssignmentWorkflow() {
    console.log('Testing Assignment Workflow...');
    
    try {
      // Test getting assignments (this will work even if no assignments exist)
      const response = await fetch(`${this.apiBaseUrl}/student/assignments`);
      
      this.addTestResult('Assignment API', 
        response.ok,
        `Assignment API responded with status ${response.status}`
      );
    } catch (error) {
      this.addTestResult('Assignment API', false, `Error: ${error.message}`);
    }
  }

  async testAnalytics() {
    console.log('Testing Analytics...');
    
    try {
      const endpoints = [
        '/admin/curriculum/analytics',
        '/teacher/analytics',
        '/parent/analytics',
        '/student/analytics'
      ];
      
      let successCount = 0;
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${this.apiBaseUrl}${endpoint}`);
          if (response.ok) {
            successCount++;
          }
        } catch (error) {
          // Individual endpoint failures are expected if not logged in
        }
      }
      
      this.addTestResult('Analytics Endpoints', 
        successCount > 0,
        `${successCount}/${endpoints.length} analytics endpoints accessible`
      );
    } catch (error) {
      this.addTestResult('Analytics Endpoints', false, `Error: ${error.message}`);
    }
  }

  addTestResult(testName, passed, message) {
    this.testResults.push({
      name: testName,
      passed: passed,
      message: message,
      timestamp: new Date().toISOString()
    });
    
    console.log(`${passed ? '✅' : '❌'} ${testName}: ${message}`);
  }

  displayResults() {
    const passed = this.testResults.filter(t => t.passed).length;
    const total = this.testResults.length;
    
    console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All curriculum system tests passed!');
    } else {
      console.log('⚠️ Some tests failed. Check the results above.');
    }
    
    // Display results in UI if possible
    this.displayResultsInUI();
  }

  displayResultsInUI() {
    // Try to display results in a modal or console
    const resultsHtml = `
      <div class="modal fade" id="curriculumTestResults" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Curriculum System Test Results</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                ${this.testResults.map(test => `
                  <div class="col-12">
                    <div class="card ${test.passed ? 'border-success' : 'border-danger'}">
                      <div class="card-body">
                        <div class="d-flex align-items-center">
                          <i class="bi ${test.passed ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'} me-2"></i>
                          <h6 class="mb-0">${test.name}</h6>
                        </div>
                        <p class="text-muted mb-0 mt-2">${test.message}</p>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add to DOM and show
    document.body.insertAdjacentHTML('beforeend', resultsHtml);
    const modal = new bootstrap.Modal(document.getElementById('curriculumTestResults'));
    modal.show();
  }
}

// Global function to run tests
function runCurriculumTests() {
  const tester = new CurriculumSystemTests();
  tester.runAllTests();
}

// Auto-run tests in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  document.addEventListener('DOMContentLoaded', () => {
    // Add test button to admin dashboard if available
    const adminDashboard = document.getElementById('admin-dashboard-content');
    if (adminDashboard) {
      const testButton = document.createElement('button');
      testButton.className = 'btn btn-outline-info btn-sm';
      testButton.innerHTML = '<i class="bi bi-bug me-1"></i>Run Curriculum Tests';
      testButton.onclick = runCurriculumTests;
      
      const header = adminDashboard.querySelector('.card-header-modern');
      if (header) {
        header.appendChild(testButton);
      }
    }
  });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CurriculumSystemTests;
}
