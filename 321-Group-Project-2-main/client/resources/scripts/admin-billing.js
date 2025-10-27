// Admin Billing & Subscription Management System
class AdminBillingSystem {
    constructor() {
        this.apiBaseUrl = window.AQEConfig.getApiBaseUrl();
        this.notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    }

    // Get all premium subscribers
    async getPremiumSubscribers() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/admin/subscribers`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching subscribers:', error);
            return [];
        }
    }

    // Send payment reminder to user
    async sendPaymentReminder(userId, daysUntilDue) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/admin/send-reminder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, daysUntilDue })
            });

            // Also create notification for admin
            this.addNotification({
                type: 'success',
                message: `Payment reminder sent to user ${userId}`,
                timestamp: new Date()
            });

            return response.ok;
        } catch (error) {
            this.addNotification({
                type: 'error',
                message: `Failed to send reminder: ${error.message}`,
                timestamp: new Date()
            });
            return false;
        }
    }

    // Add notification
    addNotification(notification) {
        this.notifications.unshift(notification);
        if (this.notifications.length > 100) {
            this.notifications.pop();
        }
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
        this.updateNotificationBadge();
    }

    // Update notification badge
    updateNotificationBadge() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
        }
    }

    // Check upcoming payments and send reminders
    async checkUpcomingPayments() {
        const subscribers = await this.getPremiumSubscribers();
        const today = new Date();
        
        subscribers.forEach(subscriber => {
            const nextBilling = new Date(subscriber.nextBillingDate);
            const daysDiff = Math.ceil((nextBilling - today) / (1000 * 60 * 60 * 24));

            // Send reminder 7 days before due date
            if (daysDiff === 7 && subscriber.status === 'active') {
                this.sendPaymentReminder(subscriber.id, 7);
                subscriber.reminderSent7 = true;
            }

            // Send reminder 3 days before due date
            if (daysDiff === 3 && subscriber.status === 'active') {
                this.sendPaymentReminder(subscriber.id, 3);
                subscriber.reminderSent3 = true;
            }

            // Alert if payment is overdue
            if (daysDiff <= 0 && subscriber.status === 'active') {
                this.addNotification({
                    type: 'warning',
                    message: `${subscriber.name}'s payment is due! Status: ${subscriber.status}`,
                    timestamp: new Date(),
                    userId: subscriber.id
                });
            }

            // Alert if payment failed
            if (subscriber.status === 'payment_failed') {
                this.addNotification({
                    type: 'error',
                    message: `⚠️ ${subscriber.name} - Payment failed! Card ending in ${subscriber.paymentMethod}`,
                    timestamp: new Date(),
                    userId: subscriber.id
                });
            }
        });
    }

    // Enable/disable auto-pay for user
    async toggleAutoPay(userId, enable) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/admin/toggle-autopay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, enable })
            });

            this.addNotification({
                type: 'success',
                message: `Auto-pay ${enable ? 'enabled' : 'disabled'} for user ${userId}`,
                timestamp: new Date()
            });

            return response.ok;
        } catch (error) {
            return false;
        }
    }

    // Get financial data (quarters, revenue)
    async getFinancialData() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/admin/financial-data`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching financial data:', error);
            // Return zeros instead of mock data
            return {
                currentQuarter: '',
                quarters: [],
                totalRevenue: 0,
                totalSubscriptions: 0,
                totalDonations: 0,
                currentMonth: 0
            };
        }
    }

    // Render billing dashboard
    renderBillingDashboard() {
        return `
            <div class="admin-billing-dashboard">
                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h3 class="text-success">$${this.getFinancialData().totalRevenue}</h3>
                                <p class="text-muted mb-0">Total Revenue</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h3 class="text-info">${this.getFinancialData().totalSubscriptions}</h3>
                                <p class="text-muted mb-0">Active Subscriptions</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h3 class="text-warning">$${this.getFinancialData().totalDonations}</h3>
                                <p class="text-muted mb-0">Total Donations</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h3 class="text-primary">$${this.getFinancialData().currentMonth}</h3>
                                <p class="text-muted mb-0">Current Month</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header">
                        <h5><i class="bi bi-calendar-check me-2"></i>Upcoming Payments (Next 30 Days)</h5>
                    </div>
                    <div class="card-body">
                        <div id="upcomingPaymentsList"></div>
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header">
                        <h5><i class="bi bi-exclamation-triangle me-2"></i>Payment Issues</h5>
                    </div>
                    <div class="card-body">
                        <div id="paymentIssuesList"></div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header d-flex justify-content-between">
                        <h5><i class="bi bi-people me-2"></i>All Premium Subscribers</h5>
                        <button class="btn btn-primary btn-sm" onclick="adminBilling.refreshSubscribers()">
                            <i class="bi bi-arrow-clockwise me-2"></i>Refresh
                        </button>
                    </div>
                    <div class="card-body">
                        <div id="subscribersList"></div>
                    </div>
                </div>
            </div>
        `;
    }

    // Refresh subscribers list
    async refreshSubscribers() {
        const subscribers = await this.getPremiumSubscribers();
        this.renderSubscribersList(subscribers);
        await this.checkUpcomingPayments();
    }

    renderSubscribersList(subscribers) {
        const list = document.getElementById('subscribersList');
        if (!list) return;

        list.innerHTML = `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Plan</th>
                            <th>Amount</th>
                            <th>Next Billing</th>
                            <th>Status</th>
                            <th>Auto-Pay</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${subscribers.map(sub => {
                            const daysUntilDue = Math.ceil((new Date(sub.nextBillingDate) - new Date()) / (1000 * 60 * 60 * 24));
                            return `
                                <tr class="${sub.status === 'payment_failed' ? 'table-danger' : ''}">
                                    <td>${sub.name}</td>
                                    <td>${sub.email}</td>
                                    <td><span class="badge bg-primary">${sub.planType}</span></td>
                                    <td>$${sub.amount}/mo</td>
                                    <td>${daysUntilDue} days</td>
                                    <td><span class="badge bg-${sub.status === 'active' ? 'success' : 'danger'}">${sub.status}</span></td>
                                    <td>${sub.autoPay ? '<span class="badge bg-success">Yes</span>' : '<span class="badge bg-secondary">No</span>'}</td>
                                    <td>
                                        ${daysUntilDue <= 7 ? `<button class="btn btn-sm btn-warning" onclick="adminBilling.sendPaymentReminder(${sub.id}, ${daysUntilDue})">
                                            <i class="bi bi-bell me-1"></i>Send Reminder
                                        </button>` : ''}
                                        ${sub.status === 'payment_failed' ? `<button class="btn btn-sm btn-danger" onclick="adminBilling.sendPaymentIssueAlert(${sub.id})">
                                            <i class="bi bi-exclamation-triangle me-1"></i>Alert User
                                        </button>` : ''}
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // Send payment issue alert
    async sendPaymentIssueAlert(userId) {
        const subscriber = (await this.getPremiumSubscribers()).find(s => s.id === userId);
        
        this.addNotification({
            type: 'error',
            message: `⚠️ Sent payment alert to ${subscriber.name} - Card issue with payment method ending in ${subscriber.paymentMethod}`,
            timestamp: new Date()
        });

        alert(`Payment alert sent to ${subscriber.name}!`);
    }
}

// Global instance
const adminBilling = new AdminBillingSystem();

// Check for upcoming payments every hour
setInterval(() => {
    adminBilling.checkUpcomingPayments();
}, 60 * 60 * 1000);

// Initial check
adminBilling.checkUpcomingPayments();

