// Connection Code System for Teachers/Parents/Students
class ConnectionSystem {
    constructor() {
        this.apiBaseUrl = window.AQEConfig.getApiBaseUrl();
        this.studentConnections = JSON.parse(localStorage.getItem('studentConnections') || '[]');
    }

    // Generate connection code for teachers and parents
    async generateConnectionCode(userId, userRole) {
        const code = this.generateRandomCode();
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/connection/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, userRole, code })
            });

            if (response.ok) {
                return { success: true, code };
            }
            return { success: false, message: 'Failed to generate code' };
        } catch (error) {
            console.error('Connection error:', error);
            return { success: false, message: 'Network error' };
        }
    }

    generateRandomCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    // Students enter connection code
    async enterConnectionCode(code) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/connection/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });

            const data = await response.json();
            
            if (data.success) {
                const connection = {
                    code,
                    type: data.type, // 'teacher' or 'parent'
                    name: data.name,
                    userId: data.userId,
                    connectedAt: new Date().toISOString()
                };
                
                this.studentConnections.push(connection);
                localStorage.setItem('studentConnections', JSON.stringify(this.studentConnections));
                
                return { success: true, connection };
            }
            
            return { success: false, message: data.message || 'Invalid code' };
        } catch (error) {
            console.error('Connection error:', error);
            return { success: false, message: 'Network error' };
        }
    }

    // Get connections for current user
    getConnections(userRole) {
        if (userRole === 'student') {
            return this.studentConnections;
        }
        // For teachers/parents, get their students
        return this.getConnectedStudents();
    }

    // Get connected students
    getConnectedStudents() {
        // This would fetch from API
        return [];
    }

    // Display connection modal
    showConnectionModal(userRole) {
        if (userRole === 'student') {
            this.showStudentConnectionModal();
        } else if (userRole === 'teacher' || userRole === 'parent') {
            this.showTeacherParentConnectionModal();
        }
    }

    showStudentConnectionModal() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'connectionModal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="bi bi-link-45deg me-2"></i>Connect to Teacher/Parent</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p class="mb-3">Enter the connection code from your teacher or parent to connect with them.</p>
                        <div class="mb-3">
                            <label class="form-label">Connection Code</label>
                            <input type="text" class="form-control" id="connectionCode" placeholder="Enter 6-digit code" maxlength="6">
                            <div class="invalid-feedback"></div>
                        </div>
                        
                        <div id="currentConnections">
                            <h6 class="mb-2">Your Connections:</h6>
                            ${this.studentConnections.map(conn => `
                                <div class="alert alert-info">
                                    <strong>${conn.name}</strong> (${conn.type})
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="connectionSystem.connect()">Connect</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => modal.remove());
    }

    showTeacherParentConnectionModal() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'connectionCodeModal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title"><i class="bi bi-people me-2"></i>Your Connection Code</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="display-1 my-4" id="connectionCodeDisplay"></div>
                        <p class="text-muted">Share this code with your students to connect</p>
                        <button class="btn btn-outline-primary btn-sm" onclick="connectionSystem.copyCode()">
                            <i class="bi bi-clipboard me-2"></i>Copy Code
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Generate code
        this.generateConnectionCode(null, null).then(result => {
            if (result.success) {
                document.getElementById('connectionCodeDisplay').textContent = result.code;
            }
        });

        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => modal.remove());
    }

    async connect() {
        const code = document.getElementById('connectionCode')?.value.toUpperCase();
        
        if (!code || code.length !== 6) {
            alert('Please enter a valid 6-digit code');
            return;
        }

        const result = await this.enterConnectionCode(code);
        
        if (result.success) {
            alert(`Successfully connected to ${result.connection.name}!`);
            bootstrap.Modal.getInstance(document.getElementById('connectionModal'))?.hide();
            location.reload();
        } else {
            alert(result.message || 'Connection failed');
        }
    }

    copyCode() {
        const code = document.getElementById('connectionCodeDisplay')?.textContent;
        navigator.clipboard.writeText(code);
        alert('Code copied to clipboard!');
    }
}

const connectionSystem = new ConnectionSystem();

