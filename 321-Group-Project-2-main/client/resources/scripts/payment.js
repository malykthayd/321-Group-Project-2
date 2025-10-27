// Simulated Stripe Payment Processing
class PaymentManager {
    constructor() {
        this.apiBaseUrl = window.AQEConfig.getApiBaseUrl();
    }

    // Show payment modal
    showPaymentModal(item, type, amount, data = {}) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'paymentModal';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-credit-card-2-front me-2"></i>Complete Payment
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" onclick="this.closest('.modal').remove()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="text-muted">Item:</span>
                                <strong>${item}</strong>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="text-muted">Amount:</span>
                                <strong class="text-primary">$${amount.toFixed(2)}</strong>
                            </div>
                        </div>
                        <hr>

                        <form id="paymentForm">
                            <!-- Cardholder Name -->
                            <div class="mb-3">
                                <label class="form-label">Cardholder Name *</label>
                                <input type="text" class="form-control" id="cardholderName" 
                                       placeholder="John Doe" required 
                                       pattern="[A-Za-z\s]{2,}">
                                <div class="invalid-feedback">Please enter a valid name</div>
                            </div>

                            <!-- Card Number -->
                            <div class="mb-3">
                                <label class="form-label">Card Number *</label>
                                <input type="text" class="form-control" id="cardNumber" 
                                       placeholder="1234 5678 9012 3456" 
                                       maxlength="19" required
                                       oninput="this.value = this.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();">
                                <div class="invalid-feedback">Card number must be 16 digits</div>
                                <small class="text-muted">Must be exactly 16 digits</small>
                            </div>

                            <!-- Expiration and CVV -->
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Expiration Date *</label>
                                    <input type="text" class="form-control" id="expirationDate" 
                                           placeholder="MM/YY" maxlength="5" required
                                           oninput="this.value = this.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');">
                                    <div class="invalid-feedback">Format: MM/YY</div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">CVV *</label>
                                    <input type="text" class="form-control" id="cvv" 
                                           placeholder="123" maxlength="3" required
                                           pattern="[0-9]{3}">
                                    <div class="invalid-feedback">Must be exactly 3 digits</div>
                                </div>
                            </div>

                            <div class="alert alert-info">
                                <i class="bi bi-shield-check me-2"></i>
                                This is a simulated payment system for demonstration purposes.
                            </div>

                            <input type="hidden" id="paymentType" value="${type}">
                            <input type="hidden" id="paymentAmount" value="${amount}">
                            <input type="hidden" id="paymentData" value='${JSON.stringify(data)}'>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onclick="this.closest('.modal').remove()">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="paymentManager.processPayment()">
                            <i class="bi bi-lock-fill me-2"></i>Pay $${amount.toFixed(2)}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        modal.addEventListener('hidden.bs.modal', () => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        });

        // Store payment details
        this.currentPayment = { item, type, amount, data };
    }

    // Validate card details
    validateCard(cardholderName, cardNumber, expirationDate, cvv) {
        const errors = [];

        // Validate cardholder name
        if (!cardholderName || cardholderName.trim().length < 2) {
            errors.push('Cardholder name must be at least 2 characters');
        }

        // Validate card number (remove spaces and check length)
        const cardNumberDigits = cardNumber.replace(/\s/g, '');
        if (cardNumberDigits.length !== 16 || !/^\d{16}$/.test(cardNumberDigits)) {
            errors.push('Card number must be exactly 16 digits');
        }

        // Validate expiration date
        if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
            errors.push('Expiration date must be in MM/YY format');
        } else {
            const [month, year] = expirationDate.split('/');
            const expMonth = parseInt(month);
            const expYear = parseInt(year);
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;

            if (expMonth < 1 || expMonth > 12) {
                errors.push('Invalid month (must be 01-12)');
            } else if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
                errors.push('Card has expired');
            }
        }

        // Validate CVV
        if (cvv.length !== 3 || !/^\d{3}$/.test(cvv)) {
            errors.push('CVV must be exactly 3 digits');
        }

        return errors;
    }

    // Process payment
    async processPayment() {
        const form = document.getElementById('paymentForm');
        if (!form) return;

        const cardholderName = document.getElementById('cardholderName').value.trim();
        const cardNumber = document.getElementById('cardNumber').value;
        const expirationDate = document.getElementById('expirationDate').value;
        const cvv = document.getElementById('cvv').value;
        const type = document.getElementById('paymentType').value;
        const amount = parseFloat(document.getElementById('paymentAmount').value);
        const data = JSON.parse(document.getElementById('paymentData').value);

        // Validate inputs
        const errors = this.validateCard(cardholderName, cardNumber, expirationDate, cvv);
        
        if (errors.length > 0) {
            alert('Please fix the following errors:\n\n' + errors.join('\n'));
            return;
        }

        // Remove spaces from card number
        const cardNumberDigits = cardNumber.replace(/\s/g, '');

        try {
            // Simulate API call
            const response = await fetch(`${this.apiBaseUrl}/payment/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type,
                    amount,
                    cardholderName,
                    cardNumber: '****' + cardNumberDigits.slice(-4),
                    expirationDate,
                    data
                })
            });

            const result = await response.json();

            if (response.ok) {
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
                if (modal) {
                    modal.hide();
                }

                // Show success message
                this.showSuccessMessage(type, amount);

                // Handle post-payment actions
                this.handlePostPayment(type, data);

            } else {
                alert('Payment failed: ' + (result.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment processing error. Please try again.');
        }
    }

    // Show success message
    showSuccessMessage(type, amount) {
        const messages = {
            'donation': `Thank you for your $${amount} donation! Your support helps keep education accessible worldwide.`,
            'subscription': 'Your subscription has been activated! Enjoy your premium features.',
            'licensing': 'Your institutional license has been processed! Welcome to AQE.',
            'certification': 'Your enrollment has been confirmed! Access your course materials now.'
        };

        const message = messages[type] || 'Payment processed successfully!';
        
        const toast = document.createElement('div');
        toast.className = 'toast position-fixed top-0 end-0 p-3';
        toast.innerHTML = `
            <div class="toast-header bg-success text-white">
                <i class="bi bi-check-circle-fill me-2"></i>
                <strong class="me-auto">Payment Successful</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        document.body.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        toast.addEventListener('hidden.bs.toast', () => {
            document.body.removeChild(toast);
        });
    }

    // Handle post-payment actions
    handlePostPayment(type, data) {
        switch (type) {
            case 'subscription':
                // Refresh subscription status
                if (window.supportManager) {
                    window.supportManager.hasPremiumFeatures(window.currentUser?.id);
                }
                break;
            case 'licensing':
                // Show licensing confirmation
                alert('Thank you for your interest! Our team will contact you shortly to set up your institutional account.');
                break;
            case 'certification':
                // Redirect or show course access
                alert('Enrollment confirmed! Check your Professional Development tab to access course materials.');
                break;
        }
    }

    // Donate with payment
    async donateWithPayment(amount) {
        this.showPaymentModal('Donation', 'donation', amount);
    }

    // Subscribe with payment
    async subscribeWithPayment(planType, planName, monthlyPrice) {
        this.showPaymentModal(
            planName,
            'subscription',
            monthlyPrice,
            { planType, planName }
        );
    }

    // Purchase licensing
    async purchaseLicensing(planType, planName, price) {
        this.showPaymentModal(
            planName + ' License',
            'licensing',
            price,
            { planType, planName }
        );
    }

    // Purchase certification
    async purchaseCertification(certType, certName, price) {
        this.showPaymentModal(
            certName,
            'certification',
            price,
            { certType, certName }
        );
    }
}

// Initialize
window.paymentManager = new PaymentManager();

