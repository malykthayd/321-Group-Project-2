// Admin Portal & Dashboard System
class AdminPortal {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5001/api';
        this.currentTab = 'overview';
    }

    // Show admin portal
    showPortal() {
        const portal = document.getElementById('adminPortal') || this.createPortal();
        portal.style.display = 'block';
        this.showTab('overview');
    }

    createPortal() {
        const portal = document.createElement('div');
        portal.id = 'adminPortal';
        portal.className = 'admin-portal';
        portal.innerHTML = `
            <div class="container-fluid py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2><i class="bi bi-shield-check me-2"></i>Admin Portal</h2>
                    <button class="btn btn-secondary" onclick="adminPortal.closePortal()">
                        <i class="bi bi-x me-2"></i>Close
                    </button>
                </div>

                <!-- Admin Tabs -->
                <ul class="nav nav-tabs mb-4">
                    <li class="nav-item">
                        <button class="nav-link active" onclick="adminPortal.showTab('overview')">
                            <i class="bi bi-speedometer2 me-2"></i>Overview
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" onclick="adminPortal.showTab('billing')">
                            <i class="bi bi-credit-card me-2"></i>Billing Management
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" onclick="adminPortal.showTab('users')">
                            <i class="bi bi-people me-2"></i>User Management
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" onclick="adminPortal.showTab('financial')">
                            <i class="bi bi-graph-up me-2"></i>Financial Dashboard
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" onclick="adminPortal.showTab('certifications')">
                            <i class="bi bi-award me-2"></i>Certifications
                        </button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link" onclick="adminPortal.showTab('licensing')">
                            <i class="bi bi-building me-2"></i>Licensing
                        </button>
                    </li>
                </ul>

                <!-- Tab Content -->
                <div id="adminTabContent"></div>
            </div>
        `;

        document.body.appendChild(portal);
        return portal;
    }

    showTab(tabName) {
        this.currentTab = tabName;
        
        // Update active nav
        document.querySelectorAll('#adminPortal .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        event?.target?.classList.add('active');

        // Render tab content
        const content = document.getElementById('adminTabContent');
        if (!content) return;

        switch(tabName) {
            case 'overview':
                content.innerHTML = this.renderOverviewTab();
                break;
            case 'billing':
                content.innerHTML = adminBilling.renderBillingDashboard();
                adminBilling.refreshSubscribers();
                break;
            case 'users':
                content.innerHTML = this.renderUserManagementTab();
                break;
            case 'financial':
                content.innerHTML = this.renderFinancialDashboard();
                break;
            case 'certifications':
                content.innerHTML = this.renderCertificationsTab();
                break;
            case 'licensing':
                content.innerHTML = this.renderLicensingTab();
                break;
        }
    }

    renderOverviewTab() {
        return `
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card text-center border-primary">
                        <div class="card-body">
                            <h1 class="text-primary">${this.getTotalUsers()}</h1>
                            <p class="text-muted mb-0">Total Users</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card text-center border-success">
                        <div class="card-body">
                            <h1 class="text-success">${this.getPremiumSubscribersCount()}</h1>
                            <p class="text-muted mb-0">Premium Subscribers</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card text-center border-warning">
                        <div class="card-body">
                            <h1 class="text-warning">$${this.getMonthlyRevenue()}</h1>
                            <p class="text-muted mb-0">Monthly Revenue</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card text-center border-info">
                        <div class="card-body">
                            <h1 class="text-info">${this.getActiveLessons()}</h1>
                            <p class="text-muted mb-0">Active Lessons</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mb-4">
                <div class="card-header">
                    <h5><i class="bi bi-exclamation-circle me-2"></i>Recent Alerts</h5>
                </div>
                <div class="card-body">
                    <div id="adminAlerts"></div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5><i class="bi bi-clock-history me-2"></i>Recent Activity</h5>
                        </div>
                        <div class="card-body">
                            <p class="text-muted">No recent activity</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5><i class="bi bi-trophy me-2"></i>Top Performers</h5>
                        </div>
                        <div class="card-body">
                            <p class="text-muted">No data available</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderUserManagementTab() {
        return `
            <div class="card mb-4">
                <div class="card-header d-flex justify-content-between">
                    <h5><i class="bi bi-people me-2"></i>All Users</h5>
                    <button class="btn btn-primary btn-sm" onclick="adminPortal.showAddUserModal()">
                        <i class="bi bi-person-plus me-2"></i>Add User
                    </button>
                </div>
                <div class="card-body">
                    <div id="usersList"></div>
                </div>
            </div>
        `;
    }

    renderFinancialDashboard() {
        return `
            <div class="card mb-4">
                <div class="card-header">
                    <h5><i class="bi bi-graph-up me-2"></i>Quarterly Revenue</h5>
                </div>
                <div class="card-body">
                    <canvas id="quarterlyChart" height="100"></canvas>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5><i class="bi bi-cash-stack me-2"></i>Revenue Breakdown</h5>
                        </div>
                        <div class="card-body">
                            <ul class="list-group">
                                <li class="list-group-item d-flex justify-content-between">
                                    <span>Subscriptions</span>
                                    <strong>$${adminBilling.getFinancialData().totalRevenue}</strong>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    <span>Donations</span>
                                    <strong>$${adminBilling.getFinancialData().totalDonations}</strong>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    <span>Licensing</span>
                                    <strong>$0</strong>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5><i class="bi bi-calendar3 me-2"></i>Current Month Stats</h5>
                        </div>
                        <div class="card-body">
                            <ul class="list-group">
                                <li class="list-group-item d-flex justify-content-between">
                                    <span>New Subscriptions</span>
                                    <strong>12</strong>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    <span>Revenue</span>
                                    <strong>$${adminBilling.getFinancialData().currentMonth}</strong>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    <span>Donations</span>
                                    <strong>$45</strong>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderCertificationsTab() {
        return `
            <div class="card mb-4">
                <div class="card-header">
                    <h5><i class="bi bi-award me-2"></i>Certification Management</h5>
                </div>
                <div class="card-body">
                    <p class="text-muted">Manage and distribute teacher certifications</p>
                    <button class="btn btn-primary" onclick="adminPortal.showCertificationModal()">
                        <i class="bi bi-plus-circle me-2"></i>Issue New Certification
                    </button>
                </div>
            </div>
        `;
    }

    renderLicensingTab() {
        return `
            <div class="card">
                <div class="card-header">
                    <h5><i class="bi bi-building me-2"></i>School/District Licensing</h5>
                </div>
                <div class="card-body">
                    <p class="text-muted">Manage institutional licenses</p>
                    <button class="btn btn-primary" onclick="adminPortal.showLicensingModal()">
                        <i class="bi bi-plus-circle me-2"></i>Create New License
                    </button>
                </div>
            </div>
        `;
    }

    // Helper methods
    getTotalUsers() { return 1234; }
    getPremiumSubscribersCount() { return 156; }
    getMonthlyRevenue() { return 1250; }
    getActiveLessons() { return 375; }

    closePortal() {
        document.getElementById('adminPortal').style.display = 'none';
    }
}

const adminPortal = new AdminPortal();

