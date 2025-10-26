// Support/Donation and Premium Features Manager

class SupportManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5001/api';
        this.donationAmount = 0;
    }

    // Show support modal
    showSupportModal() {
        const modal = new bootstrap.Modal(document.getElementById('supportModal'));
        modal.show();
    }

    // Set donation amount
    donateAmount(amount) {
        this.donationAmount = amount;
        document.getElementById('donationAmount').value = amount;
        
        // Update button styles
        document.querySelectorAll('.btn-outline-primary').forEach(btn => {
            btn.classList.remove('active');
        });
        event?.target.classList.add('active');
    }

    // Process donation
    async processDonation() {
        const amountInput = document.getElementById('donationAmount');
        const amount = parseFloat(amountInput.value);
        
        if (!amount || amount < 1) {
            alert('Please enter a valid donation amount (minimum $1)');
            return;
        }

        // Close support modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('supportModal'));
        if (modal) {
            modal.hide();
        }

        // Show payment modal
        if (window.paymentManager) {
            window.paymentManager.showPaymentModal('Donation', 'donation', amount);
        } else {
            alert('Payment system not loaded. Please refresh the page.');
        }
    }

    // Show premium subscription modal
    showPremiumModal(planType) {
        const planInfo = {
            'premium_parent': {
                name: 'Family Plan',
                price: 4.99,
                features: [
                    'Advanced progress tracking dashboard',
                    'Download & print offline materials',
                    'Early access to new lessons and features',
                    'Priority customer support',
                    'Ad-free experience',
                    'Export learning reports'
                ]
            },
            'premium_teacher': {
                name: 'Teacher/Classroom Plan',
                price: 9.99,
                features: [
                    'Everything in Family Plan',
                    'AI-powered lesson plan generation',
                    'Per-student detailed analytics',
                    'Advanced classroom management tools',
                    'Bulk student account creation',
                    'Custom assignment builder',
                    'Parent communication tools',
                    'Attendance and engagement tracking'
                ]
            }
        };

        const plan = planInfo[planType];
        if (!plan) {
            alert('Invalid plan type');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-star-fill me-2"></i>${plan.name}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-4">
                            <h3 class="mb-0">$${plan.price}</h3>
                            <p class="text-muted mb-0">per month</p>
                        </div>
                        
                        <h6 class="mb-3">What's included:</h6>
                        <ul class="list-unstyled">
                            ${plan.features.map(f => `
                                <li class="mb-2">
                                    <i class="bi bi-check-circle-fill text-success me-2"></i>${f}
                                </li>
                            `).join('')}
                        </ul>
                        
                        <div class="alert alert-info mt-3">
                            <i class="bi bi-info-circle me-2"></i>
                            <strong>Note:</strong> In production, this would integrate with Stripe for secure payments.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="supportManager.processSubscription('${planType}')">
                            <i class="bi bi-credit-card me-1"></i>Subscribe Now
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
        });
    }

    // Process subscription
    async processSubscription(planType) {
        const planInfo = {
            'premium_parent': { name: 'Family Plan', price: 4.99 },
            'premium_teacher': { name: 'Teacher Plan', price: 9.99 }
        };
        
        const plan = planInfo[planType];
        if (!plan) {
            alert('Invalid plan type');
            return;
        }

        // Show payment modal
        if (window.paymentManager) {
            window.paymentManager.showPaymentModal(
                plan.name,
                'subscription',
                plan.price,
                { planType, planName: plan.name }
            );
        } else {
            alert('Payment system not loaded. Please refresh the page.');
        }
    }

    // Show thank you message
    showThankYouMessage(amount) {
        const toast = document.createElement('div');
        toast.className = 'toast position-fixed top-0 end-0 p-3';
        toast.innerHTML = `
            <div class="toast-header bg-success text-white">
                <i class="bi bi-heart-fill me-2"></i>
                <strong class="me-auto">Thank You!</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                Thank you for your $${amount} donation! Your support keeps learning free for children worldwide 🌍
            </div>
        `;
        
        document.body.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        toast.addEventListener('hidden.bs.toast', () => {
            document.body.removeChild(toast);
        });
    }

    // Check if user has premium features
    async hasPremiumFeatures(userId, userRole) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/support/premium/${userId}`);
            if (response.ok) {
                const data = await response.json();
                return data.hasPremium || false;
            }
        } catch (error) {
            console.error('Error checking premium status:', error);
        }
        return false;
    }

    // Show licensing modal for schools/districts
    showLicensingModal(planType) {
        const plans = {
            'small_school': { name: 'Small School License', price: 300, students: 'Up to 200 students' },
            'district': { name: 'District License', price: 500, students: 'Up to 500 students' },
            'enterprise': { name: 'Enterprise License', price: 1000, students: 'Unlimited students' }
        };
        
        const plan = plans[planType];
        if (!plan) {
            alert('Invalid plan type');
            return;
        }

        // Show payment modal
        if (window.paymentManager) {
            window.paymentManager.showPaymentModal(
                plan.name,
                'licensing',
                plan.price,
                { planType, planName: plan.name }
            );
        } else {
            alert('Payment system not loaded. Please refresh the page.');
        }
    }

    // Show certification modal
    showCertificationModal() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-warning text-dark">
                        <h5 class="modal-title">
                            <i class="bi bi-award-fill me-2"></i>Certification & Professional Development
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p class="lead">Earn recognized credentials and advance your teaching career</p>
                        
                        <div class="row g-3 mt-3">
                            <div class="col-12">
                                <div class="card h-100">
                                    <div class="card-body">
                                        <div class="d-flex">
                                            <i class="bi bi-mortarboard-fill text-primary fs-1 me-3"></i>
                                            <div class="flex-grow-1">
                                                <h5>Teacher Proficiency Certificate</h5>
                                                <p class="mb-2">Master the fundamentals of modern teaching methods and student engagement strategies.</p>
                                                <ul class="small mb-3">
                                                    <li>5 professional development modules</li>
                                                    <li>Digital badge for your profile</li>
                                                    <li>Certificate of completion</li>
                                                    <li>Can be used for CE credits</li>
                                                </ul>
                                                <button class="btn btn-primary w-100" onclick="supportManager.purchaseCertification('teacher_proficiency', 25)">
                                                    <i class="bi bi-cart me-1"></i>Enroll for $25
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="card h-100">
                                    <div class="card-body">
                                        <div class="d-flex">
                                            <i class="bi bi-bookmark-star-fill text-success fs-1 me-3"></i>
                                            <div class="flex-grow-1">
                                                <h5>Homeschool Mastery Certification</h5>
                                                <p class="mb-2">Comprehensive certification for homeschool parents and educators.</p>
                                                <ul class="small mb-3">
                                                    <li>10 comprehensive modules</li>
                                                    <li>Advanced curriculum planning</li>
                                                    <li>Student assessment strategies</li>
                                                    <li>Verification badge</li>
                                                </ul>
                                                <button class="btn btn-success w-100" onclick="supportManager.purchaseCertification('homeschool_mastery', 50)">
                                                    <i class="bi bi-cart me-1"></i>Enroll for $50
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="card h-100">
                                    <div class="card-body">
                                        <div class="d-flex">
                                            <i class="bi bi-trophy-fill text-warning fs-1 me-3"></i>
                                            <div class="flex-grow-1">
                                                <h5>Special Education Specialist</h5>
                                                <p class="mb-2">Specialized training for inclusive and special needs education.</p>
                                                <ul class="small mb-3">
                                                    <li>8 specialized modules</li>
                                                    <li>Adaptive learning strategies</li>
                                                    <li>IEP development skills</li>
                                                    <li>Professional recognition</li>
                                                </ul>
                                                <button class="btn btn-warning w-100" onclick="supportManager.purchaseCertification('special_education', 50)">
                                                    <i class="bi bi-cart me-1"></i>Enroll for $50
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
        });
    }

    // Purchase certification
    purchaseCertification(certType, price) {
        const certNames = {
            'teacher_proficiency': 'Teacher Proficiency Certificate',
            'homeschool_mastery': 'Homeschool Mastery Certification',
            'special_education': 'Special Education Specialist'
        };

        const certName = certNames[certType] || 'Professional Certification';

        // Show payment modal
        if (window.paymentManager) {
            window.paymentManager.showPaymentModal(
                certName,
                'certification',
                price,
                { certType, certName }
            );
        } else {
            alert('Payment system not loaded. Please refresh the page.');
        }
    }
}

// Global functions
function showSupportModal() {
    window.supportManager.showSupportModal();
}

function donateAmount(amount) {
    window.supportManager.donateAmount(amount);
}

function processDonation() {
    window.supportManager.processDonation();
}

function showPremiumModal(planType) {
    window.supportManager.showPremiumModal(planType);
}

function showLicensingModal(planType) {
    window.supportManager.showLicensingModal(planType);
}

function showCertificationModal() {
    window.supportManager.showCertificationModal();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    window.supportManager = new SupportManager();
});

