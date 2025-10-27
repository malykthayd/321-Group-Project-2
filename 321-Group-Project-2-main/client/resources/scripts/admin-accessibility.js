// Admin Accessibility (SMS/USSD) Management
class AdminAccessibility {
  constructor() {
    this.apiBaseUrl = window.AQEConfig.getApiUrl('admin/accessibility');
    this.currentView = 'overview';
  }

  async init() {
    console.log('AdminAccessibility: Initializing...');
    try {
      await this.loadOverview();
      this.setupEventListeners();
      console.log('AdminAccessibility: Initialized successfully');
    } catch (error) {
      console.error('AdminAccessibility: Initialization failed:', error);
      this.showError('Failed to initialize SMS/USSD module');
    }
  }

  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('[data-accessibility-tab]').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const view = e.target.dataset.accessibilityTab;
        this.switchView(view);
      });
    });

    // Test send button
    const testSendBtn = document.getElementById('testSendSmsBtn');
    if (testSendBtn) {
      testSendBtn.addEventListener('click', () => this.showTestSendModal());
    }

    // Refresh button
    const refreshBtn = document.getElementById('refreshAccessibilityBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refresh());
    }
  }

  async switchView(view) {
    this.currentView = view;
    
    // Update active tab
    document.querySelectorAll('[data-accessibility-tab]').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-accessibility-tab="${view}"]`)?.classList.add('active');

    // Load content
    const contentArea = document.getElementById('accessibilityContent');
    if (!contentArea) return;

    contentArea.innerHTML = '<div class="text-center p-5"><div class="spinner-border"></div><p class="mt-2">Loading...</p></div>';

    try {
      switch (view) {
        case 'overview':
          await this.loadOverview();
          break;
        case 'messages':
          await this.loadMessages();
          break;
        case 'keywords':
          await this.loadKeywords();
          break;
        case 'flows':
          await this.loadFlows();
          break;
        case 'routing':
          await this.loadRoutingRules();
          break;
        case 'content-targeting':
          await this.loadContentTargeting();
          break;
        case 'opt-ins':
          await this.loadOptIns();
          break;
        default:
          contentArea.innerHTML = '<p>View not found</p>';
      }
    } catch (error) {
      console.error('Failed to load view:', error);
      contentArea.innerHTML = '<div class="alert alert-danger">Failed to load content. Please try again.</div>';
    }
  }

  async loadOverview() {
    try {
      console.log('AdminAccessibility: Loading overview...');
      const response = await fetch(`${this.apiBaseUrl}/overview`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('AdminAccessibility: Overview data received:', data);

      const content = `
        <div class="row g-4">
          <div class="col-12">
            <h3>SMS/USSD Overview</h3>
          </div>

          <!-- Gateway Info -->
          <div class="col-md-4">
            <div class="card">
              <div class="card-body">
                <h6 class="card-subtitle mb-2 text-muted">Gateway Provider</h6>
                <h4 class="card-title">${data.provider.toUpperCase()}</h4>
                <p class="mb-1"><strong>SMS Number:</strong> ${data.gatewayNumber}</p>
                <p class="mb-0"><strong>USSD Code:</strong> ${data.ussdCode}</p>
              </div>
            </div>
          </div>

          <!-- Today's Stats -->
          <div class="col-md-8">
            <div class="card">
              <div class="card-body">
                <h6 class="card-subtitle mb-3 text-muted">Today's Activity</h6>
                <div class="row g-3">
                  <div class="col-3">
                    <div class="text-center">
                      <h3 class="text-primary mb-0">${data.todayStats.inbound}</h3>
                      <small class="text-muted">Inbound</small>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="text-center">
                      <h3 class="text-info mb-0">${data.todayStats.outbound}</h3>
                      <small class="text-muted">Outbound</small>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="text-center">
                      <h3 class="text-success mb-0">${data.todayStats.delivered}</h3>
                      <small class="text-muted">Delivered</small>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="text-center">
                      <h3 class="text-danger mb-0">${data.todayStats.failed}</h3>
                      <small class="text-muted">Failed</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Sessions & Flows -->
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <h6 class="card-subtitle mb-2 text-muted">Active Sessions</h6>
                <h2 class="card-title">${data.activeSessions}</h2>
                <p class="text-muted mb-0">Ongoing conversations</p>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <h6 class="card-subtitle mb-2 text-muted">Active Flows</h6>
                <h2 class="card-title">${data.activeFlows}</h2>
                <p class="text-muted mb-0">Live conversation flows</p>
              </div>
            </div>
          </div>

          <!-- Top Keywords -->
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <h6 class="card-subtitle mb-3 text-muted">Top Keywords</h6>
                <div class="d-flex gap-2 flex-wrap">
                  ${data.topKeywords.map(k => `<span class="badge bg-primary">${k}</span>`).join('')}
                  ${data.topKeywords.length === 0 ? '<span class="text-muted">No keywords configured</span>' : ''}
                </div>
              </div>
            </div>
          </div>

          <!-- Test SMS Section -->
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <h6 class="card-subtitle mb-3 text-muted">Test SMS Functionality</h6>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Phone Number</label>
                    <input type="tel" class="form-control" id="testPhoneNumber" placeholder="+1234567890" value="+1234567890">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Message</label>
                    <input type="text" class="form-control" id="testMessage" placeholder="Test message" value="START">
                  </div>
                  <div class="col-12">
                    <div class="btn-group" role="group">
                      <button type="button" class="btn btn-success" onclick="adminAccessibility.testSendSms()">
                        <i class="bi bi-send"></i> Send Test SMS
                      </button>
                      <button type="button" class="btn btn-info" onclick="adminAccessibility.testReceiveSms()">
                        <i class="bi bi-arrow-down-circle"></i> Simulate Incoming SMS
                      </button>
                      <button type="button" class="btn btn-warning" onclick="adminAccessibility.testFullFlow()">
                        <i class="bi bi-arrow-repeat"></i> Test Full Flow
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <h6 class="card-subtitle mb-3 text-muted">Quick Actions</h6>
                <div class="btn-group" role="group">
                  <button type="button" class="btn btn-primary" onclick="adminAccessibility.showTestSendModal()">
                    <i class="bi bi-send"></i> Send Test SMS
                  </button>
                  <button type="button" class="btn btn-outline-primary" onclick="adminAccessibility.switchView('messages')">
                    <i class="bi bi-chat-dots"></i> View Messages
                  </button>
                  <button type="button" class="btn btn-outline-primary" onclick="adminAccessibility.switchView('keywords')">
                    <i class="bi bi-key"></i> Manage Keywords
                  </button>
                  <button type="button" class="btn btn-outline-primary" onclick="adminAccessibility.switchView('flows')">
                    <i class="bi bi-diagram-3"></i> Manage Flows
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      const contentArea = document.getElementById('accessibilityContent');
      if (contentArea) {
        contentArea.innerHTML = content;
        console.log('AdminAccessibility: Overview content loaded');
      } else {
        console.error('AdminAccessibility: Content area not found');
      }
    } catch (error) {
      console.error('Failed to load overview:', error);
      this.showError('Failed to load SMS/USSD overview: ' + error.message);
      throw error;
    }
  }

  async loadMessages() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/messages?pageSize=50`);
      const data = await response.json();

      const content = `
        <div class="row">
          <div class="col-12 mb-3">
            <h3>Message Log</h3>
            <p class="text-muted">All SMS/USSD messages (inbound & outbound)</p>
          </div>
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Direction</th>
                        <th>Channel</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${data.data.map(msg => {
                        const payload = JSON.parse(msg.payloadJson || '{}');
                        const text = payload.Text || payload.body || payload.text || 'N/A';
                        const badgeClass = msg.direction === 'in' ? 'bg-info' : 'bg-primary';
                        const statusClass = msg.status === 'delivered' ? 'text-success' : 
                                           msg.status === 'failed' ? 'text-danger' : 'text-warning';
                        return `
                          <tr>
                            <td>${new Date(msg.createdAt).toLocaleString()}</td>
                            <td><span class="badge ${badgeClass}">${msg.direction.toUpperCase()}</span></td>
                            <td>${msg.channel.toUpperCase()}</td>
                            <td>${msg.phoneE164}</td>
                            <td class="${statusClass}">${msg.status}</td>
                            <td>${text.substring(0, 50)}${text.length > 50 ? '...' : ''}</td>
                          </tr>
                        `;
                      }).join('')}
                      ${data.data.length === 0 ? '<tr><td colspan="6" class="text-center text-muted">No messages yet</td></tr>' : ''}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('accessibilityContent').innerHTML = content;
    } catch (error) {
      console.error('Failed to load messages:', error);
      throw error;
    }
  }

  async loadKeywords() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/keywords`);
      const keywords = await response.json();

      const flowsResponse = await fetch(`${this.apiBaseUrl}/flows`);
      const flows = await flowsResponse.json();

      const content = `
        <div class="row">
          <div class="col-12 mb-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h3>SMS Keywords</h3>
                <p class="text-muted mb-0">Manage trigger keywords for SMS flows</p>
              </div>
              <button class="btn btn-primary" onclick="adminAccessibility.showAddKeywordModal()">
                <i class="bi bi-plus-lg"></i> Add Keyword
              </button>
            </div>
          </div>
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Keyword</th>
                        <th>Locale</th>
                        <th>Flow</th>
                        <th>Status</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${keywords.map(kw => {
                        const flow = flows.find(f => f.id === kw.flowId);
                        return `
                          <tr>
                            <td><strong>${kw.keyword}</strong></td>
                            <td>${kw.locale.toUpperCase()}</td>
                            <td>${flow ? flow.name : 'No flow'}</td>
                            <td>
                              <span class="badge ${kw.active ? 'bg-success' : 'bg-secondary'}">
                                ${kw.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>${kw.description || 'N/A'}</td>
                            <td>
                              <button class="btn btn-sm btn-outline-danger" onclick="adminAccessibility.deleteKeyword(${kw.id})">
                                <i class="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        `;
                      }).join('')}
                      ${keywords.length === 0 ? '<tr><td colspan="6" class="text-center text-muted">No keywords configured</td></tr>' : ''}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('accessibilityContent').innerHTML = content;
    } catch (error) {
      console.error('Failed to load keywords:', error);
      throw error;
    }
  }

  async loadFlows() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/flows`);
      const flows = await response.json();

      const content = `
        <div class="row">
          <div class="col-12 mb-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h3>Conversation Flows</h3>
                <p class="text-muted mb-0">Manage SMS/USSD conversation flows</p>
              </div>
              <button class="btn btn-primary" onclick="adminAccessibility.showAddFlowModal()">
                <i class="bi bi-plus-lg"></i> Create Flow
              </button>
            </div>
          </div>
          <div class="col-12">
            <div class="row g-3">
              ${flows.map(flow => `
                <div class="col-md-6 col-lg-4">
                  <div class="card h-100">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${flow.name}</h5>
                        <span class="badge ${flow.active ? 'bg-success' : 'bg-secondary'}">
                          ${flow.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p class="text-muted mb-2">
                        <small><i class="bi bi-tag"></i> ${flow.type.toUpperCase()} | ${flow.locale.toUpperCase()} | v${flow.version}</small>
                      </p>
                      <p class="text-muted small">Created: ${new Date(flow.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="card-footer bg-transparent">
                      <button class="btn btn-sm btn-outline-danger" onclick="adminAccessibility.deleteFlow(${flow.id})">
                        <i class="bi bi-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              `).join('')}
              ${flows.length === 0 ? '<div class="col-12"><p class="text-center text-muted">No flows configured</p></div>' : ''}
            </div>
          </div>
        </div>
      `;

      document.getElementById('accessibilityContent').innerHTML = content;
    } catch (error) {
      console.error('Failed to load flows:', error);
      throw error;
    }
  }

  async loadRoutingRules() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/routing-rules`);
      const rules = await response.json();

      const content = `
        <div class="row">
          <div class="col-12 mb-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h3>Routing Rules</h3>
                <p class="text-muted mb-0">Define how incoming messages are routed to flows</p>
              </div>
              <button class="btn btn-primary" onclick="adminAccessibility.showAddRoutingRuleModal()">
                <i class="bi bi-plus-lg"></i> Add Rule
              </button>
            </div>
          </div>
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Priority</th>
                        <th>Channel</th>
                        <th>Matcher Type</th>
                        <th>Matcher Value</th>
                        <th>Flow</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${rules.map(rule => `
                        <tr>
                          <td><span class="badge bg-primary">${rule.priority}</span></td>
                          <td>${rule.channel.toUpperCase()}</td>
                          <td>${rule.matcherType}</td>
                          <td><code>${rule.matcherValue}</code></td>
                          <td>${rule.flow ? rule.flow.name : 'N/A'}</td>
                          <td>
                            <span class="badge ${rule.active ? 'bg-success' : 'bg-secondary'}">
                              ${rule.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <button class="btn btn-sm btn-outline-danger" onclick="adminAccessibility.deleteRoutingRule(${rule.id})">
                              <i class="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      `).join('')}
                      ${rules.length === 0 ? '<tr><td colspan="7" class="text-center text-muted">No routing rules configured</td></tr>' : ''}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('accessibilityContent').innerHTML = content;
    } catch (error) {
      console.error('Failed to load routing rules:', error);
      throw error;
    }
  }

  async loadContentTargeting() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/content-targeting`);
      const rules = await response.json();

      const content = `
        <div class="row">
          <div class="col-12 mb-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h3>Content Targeting</h3>
                <p class="text-muted mb-0">Map grade/subject/language to lessons</p>
              </div>
              <button class="btn btn-primary" onclick="adminAccessibility.showAddContentTargetingModal()">
                <i class="bi bi-plus-lg"></i> Add Rule
              </button>
            </div>
          </div>
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Rule Name</th>
                        <th>Grade Band</th>
                        <th>Subject</th>
                        <th>Language</th>
                        <th>Content IDs</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${rules.map(rule => `
                        <tr>
                          <td><strong>${rule.ruleName}</strong></td>
                          <td>${rule.gradeBand || 'Any'}</td>
                          <td>${rule.subject || 'Any'}</td>
                          <td>${rule.language || 'Any'}</td>
                          <td>
                            <small>
                              ${rule.bookId ? `Book: ${rule.bookId}` : ''}
                              ${rule.lessonId ? `Lesson: ${rule.lessonId}` : ''}
                              ${rule.practicePackId ? `Practice: ${rule.practicePackId}` : ''}
                            </small>
                          </td>
                          <td>
                            <span class="badge ${rule.active ? 'bg-success' : 'bg-secondary'}">
                              ${rule.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      `).join('')}
                      ${rules.length === 0 ? '<tr><td colspan="6" class="text-center text-muted">No content targeting rules configured</td></tr>' : ''}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('accessibilityContent').innerHTML = content;
    } catch (error) {
      console.error('Failed to load content targeting:', error);
      throw error;
    }
  }

  async loadOptIns() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/opt-ins`);
      const optIns = await response.json();

      const content = `
        <div class="row">
          <div class="col-12 mb-3">
            <h3>Opt-In/Opt-Out Status</h3>
            <p class="text-muted">Manage user consent for SMS/USSD communications</p>
          </div>
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Phone Number</th>
                        <th>Channel</th>
                        <th>Status</th>
                        <th>Consent Source</th>
                        <th>Consent Date</th>
                        <th>Locale</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${optIns.map(opt => `
                        <tr>
                          <td>${opt.phoneE164}</td>
                          <td>${opt.channel.toUpperCase()}</td>
                          <td>
                            <span class="badge ${opt.optedIn ? 'bg-success' : 'bg-danger'}">
                              ${opt.optedIn ? 'Opted In' : 'Opted Out'}
                            </span>
                          </td>
                          <td>${opt.consentSource || 'N/A'}</td>
                          <td>${opt.consentAt ? new Date(opt.consentAt).toLocaleDateString() : 'N/A'}</td>
                          <td>${opt.locale.toUpperCase()}</td>
                        </tr>
                      `).join('')}
                      ${optIns.length === 0 ? '<tr><td colspan="6" class="text-center text-muted">No opt-in records</td></tr>' : ''}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.getElementById('accessibilityContent').innerHTML = content;
    } catch (error) {
      console.error('Failed to load opt-ins:', error);
      throw error;
    }
  }

  showTestSendModal() {
    const modal = `
      <div class="modal fade" id="testSendModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Send Test SMS</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">To (Phone Number)</label>
                <input type="text" class="form-control" id="testSmsTo" placeholder="+1234567890">
              </div>
              <div class="mb-3">
                <label class="form-label">Message</label>
                <textarea class="form-control" id="testSmsMessage" rows="3" placeholder="Enter your test message"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" onclick="adminAccessibility.sendTestSms()">Send</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('testSendModal');
    if (existingModal) existingModal.remove();

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modal);

    // Show modal
    const bsModal = new bootstrap.Modal(document.getElementById('testSendModal'));
    bsModal.show();
  }

  async sendTestSms() {
    const to = document.getElementById('testSmsTo').value;
    const message = document.getElementById('testSmsMessage').value;

    if (!to || !message) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/test-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, message })
      });

      const result = await response.json();

      if (result.success) {
        alert('Test SMS sent successfully!');
        bootstrap.Modal.getInstance(document.getElementById('testSendModal')).hide();
      } else {
        alert(`Failed to send: ${result.error}`);
      }
    } catch (error) {
      alert('Error sending test SMS: ' + error.message);
    }
  }

  async deleteKeyword(id) {
    if (!confirm('Are you sure you want to delete this keyword?')) return;

    try {
      const response = await fetch(`${this.apiBaseUrl}/keywords/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Keyword deleted successfully');
        this.loadKeywords();
      } else {
        alert('Failed to delete keyword');
      }
    } catch (error) {
      alert('Error deleting keyword: ' + error.message);
    }
  }

  async deleteFlow(id) {
    if (!confirm('Are you sure you want to delete this flow?')) return;

    try {
      const response = await fetch(`${this.apiBaseUrl}/flows/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Flow deleted successfully');
        this.loadFlows();
      } else {
        alert('Failed to delete flow');
      }
    } catch (error) {
      alert('Error deleting flow: ' + error.message);
    }
  }

  async deleteRoutingRule(id) {
    if (!confirm('Are you sure you want to delete this routing rule?')) return;

    try {
      const response = await fetch(`${this.apiBaseUrl}/routing-rules/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Routing rule deleted successfully');
        this.loadRoutingRules();
      } else {
        alert('Failed to delete routing rule');
      }
    } catch (error) {
      alert('Error deleting routing rule: ' + error.message);
    }
  }

  async refresh() {
    await this.switchView(this.currentView);
  }

  // Placeholder methods for modal dialogs
  showAddKeywordModal() {
    alert('Keyword creation modal - implementation pending');
  }

  showAddFlowModal() {
    alert('Flow creation modal - implementation pending');
  }

  showAddRoutingRuleModal() {
    alert('Routing rule creation modal - implementation pending');
  }

  showAddContentTargetingModal() {
    alert('Content targeting creation modal - implementation pending');
  }

  showError(message) {
    const contentArea = document.getElementById('accessibilityContent');
    if (contentArea) {
      contentArea.innerHTML = `
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">Error</h4>
          <p>${message}</p>
          <hr>
          <button class="btn btn-outline-danger" onclick="adminAccessibility.init()">
            <i class="bi bi-arrow-clockwise me-1"></i>Retry
          </button>
        </div>
      `;
    }
  }

  // Test SMS functionality
  async testSendSms() {
    const phoneNumber = document.getElementById('testPhoneNumber').value;
    const message = document.getElementById('testMessage').value;

    if (!phoneNumber || !message) {
      alert('Please enter both phone number and message');
      return;
    }

    try {
      const response = await fetch(window.AQEConfig.getApiUrl('gateway/test/send'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: phoneNumber,
          text: message
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Test SMS sent successfully! Check the Messages tab to see the outbound message.');
        // Refresh messages view
        await this.loadMessages();
      } else {
        alert(`Error: ${data.message || 'Failed to send test SMS'}`);
      }
    } catch (error) {
      console.error('Test send SMS error:', error);
      alert('Error sending test SMS: ' + error.message);
    }
  }

  async testReceiveSms() {
    const phoneNumber = document.getElementById('testPhoneNumber').value;
    const message = document.getElementById('testMessage').value;

    if (!phoneNumber || !message) {
      alert('Please enter both phone number and message');
      return;
    }

    try {
      const response = await fetch('window.AQEConfig.getApiUrl('gateway/test/sms')', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: phoneNumber,
          text: message
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Test SMS received and processed! Check the Messages tab to see the conversation.');
        // Refresh messages view
        await this.loadMessages();
      } else {
        alert(`Error: ${data.message || 'Failed to process test SMS'}`);
      }
    } catch (error) {
      console.error('Test receive SMS error:', error);
      alert('Error processing test SMS: ' + error.message);
    }
  }

  async testFullFlow() {
    const phoneNumber = document.getElementById('testPhoneNumber').value;
    
    if (!phoneNumber) {
      alert('Please enter a phone number');
      return;
    }

    try {
      // Test the full flow: START -> MATH -> 5-6
      const steps = [
        { text: 'START', description: 'Opt-in and start learning' },
        { text: 'MATH', description: 'Select Math subject' },
        { text: '5-6', description: 'Select grade level' }
      ];

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        console.log(`Testing step ${i + 1}: ${step.description}`);
        
        const response = await fetch('window.AQEConfig.getApiUrl('gateway/test/sms')', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: phoneNumber,
            text: step.text
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          alert(`Error at step ${i + 1}: ${data.message}`);
          return;
        }

        // Wait a bit between steps
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      alert('Full flow test completed! Check the Messages tab to see the complete conversation.');
      // Refresh messages view
      await this.loadMessages();
    } catch (error) {
      console.error('Test full flow error:', error);
      alert('Error testing full flow: ' + error.message);
    }
  }
}

// Initialize global instance
console.log('AdminAccessibility: Creating global instance...');
window.adminAccessibility = new AdminAccessibility();
console.log('AdminAccessibility: Global instance created:', window.adminAccessibility);

