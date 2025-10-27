// AQE Platform Ad Placement Component
// Centralized component for rendering ads based on policy

class AdPlacement {
    constructor() {
        this.adPolicy = window.AdPolicy;
        this.renderedAds = new Map(); // Track rendered ads to prevent duplicates
    }

    // Main method to render ads based on current route
    renderAds() {
        const routeType = this.adPolicy.getCurrentRouteType();
        
        // Clear any existing ads first
        this.clearAds();
        
        switch (routeType) {
            case 'home':
                this.renderHomeAds();
                break;
            case 'dashboard':
                this.renderDashboardCTA();
                break;
            case 'other':
                // No ads on other routes
                break;
        }
    }

    // Render ads for home page
    renderHomeAds() {
        const validation = this.adPolicy.validateAdPlacement('premium', 'above-fold');
        if (!validation.valid) {
            console.warn('Ad placement validation failed:', validation.reason);
            return;
        }

        // Check if we already rendered this ad
        if (this.renderedAds.has('home-premium')) {
            return;
        }

        // Find the hero section to place ad after it
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) {
            console.warn('Hero section not found for ad placement');
            return;
        }

        // Create premium plans ad
        const adContainer = this.createAdContainer('home-premium');
        adContainer.innerHTML = this.getPremiumPlansHTML();
        
        // Insert after hero section
        heroSection.insertAdjacentElement('afterend', adContainer);
        
        // Track rendered ad
        this.renderedAds.set('home-premium', adContainer);
        
        console.log('Home page ads rendered');
    }

    // Render Professional Development CTA for dashboard
    renderDashboardCTA() {
        const validation = this.adPolicy.validateAdPlacement('professionalDev', 'cta-button');
        if (!validation.valid) {
            console.warn('Dashboard CTA validation failed:', validation.reason);
            return;
        }

        // Check if we already rendered this CTA
        if (this.renderedAds.has('dashboard-pd-cta')) {
            return;
        }

        // Find the dashboard content area
        const dashboardContent = document.querySelector('#roleDashboard .tab-content');
        if (!dashboardContent) {
            console.warn('Dashboard content not found for CTA placement');
            return;
        }

        // Create CTA container
        const ctaContainer = this.createAdContainer('dashboard-pd-cta');
        ctaContainer.innerHTML = this.getProfessionalDevCTAHTML();
        
        // Insert at the top of dashboard content
        dashboardContent.insertAdjacentElement('afterbegin', ctaContainer);
        
        // Track rendered CTA
        this.renderedAds.set('dashboard-pd-cta', ctaContainer);
        
        console.log('Dashboard Professional Development CTA rendered');
    }

    // Create ad container with proper accessibility attributes
    createAdContainer(adId) {
        const container = document.createElement('div');
        container.id = `ad-container-${adId}`;
        container.className = 'ad-container';
        
        // Add accessibility attributes
        const accessibilityConfig = this.adPolicy.getAccessibilityConfig('adContainer');
        if (accessibilityConfig.role) {
            container.setAttribute('role', accessibilityConfig.role);
        }
        if (accessibilityConfig.ariaLabel) {
            container.setAttribute('aria-label', accessibilityConfig.ariaLabel);
        }
        
        return container;
    }

    // Get HTML for premium plans (home page ads)
    getPremiumPlansHTML() {
        return `
            <div class="container-fluid py-5">
                <div class="row mb-4">
                    <div class="col-12 text-center">
                        <h3 class="section-title-modern">Choose Your Experience</h3>
                        <p class="section-subtitle-modern">Enhance your educational journey with powerful tools and features designed for modern learning.</p>
                    </div>
                </div>
                
                <div class="row g-4">
                    <div class="col-lg-4">
                        <div class="value-card">
                            <div class="price">$4.99<small>/mo</small></div>
                            <h5 class="fw-bold mb-3">Family Premium</h5>
                            <div class="value-feature">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>Advanced learning analytics & progress tracking</span>
                            </div>
                            <div class="value-feature">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>Offline access to all content</span>
                            </div>
                            <div class="value-feature">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>Priority customer support</span>
                            </div>
                            <div class="value-feature">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>Download & print materials</span>
                            </div>
                            <button class="btn btn-primary-modern w-100 mt-4" onclick="showPremiumModal('premium_parent')">
                                Get Started →
                            </button>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="value-card border-primary position-relative">
                            <span class="badge bg-primary position-absolute top-0 end-0 m-3">Most Popular</span>
                            <div class="price">$9.99<small>/mo</small></div>
                            <h5 class="fw-bold mb-3">Teacher Premium</h5>
                            <div class="value-feature">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>Everything in Family Premium</span>
                            </div>
                            <div class="value-feature">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>AI-powered lesson plan generator</span>
                            </div>
                            <div class="value-feature">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>Student analytics dashboard</span>
                            </div>
                            <div class="value-feature">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>Classroom management tools</span>
                            </div>
                            <div class="value-feature">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>Bulk student account management</span>
                            </div>
                            <button class="btn btn-primary-modern w-100 mt-4" onclick="showPremiumModal('premium_teacher')">
                                Get Started →
                            </button>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="value-card">
                            <div class="price">Free</div>
                            <h5 class="fw-bold mb-3">Standard Access</h5>
                            <div class="value-feature">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>Access to all core lessons</span>
                            </div>
                            <div class="value-feature">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>Basic progress tracking</span>
                            </div>
                            <div class="value-feature">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>Online content library</span>
                            </div>
                            <div class="value-feature">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>Community support</span>
                            </div>
                            <p class="text-muted small mb-0 mt-3">Perfect for getting started with quality education</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Get HTML for Professional Development CTA (dashboard)
    getProfessionalDevCTAHTML() {
        return `
            <div class="row mb-4">
                <div class="col-12">
                    <div class="alert alert-info border-0 shadow-sm">
                        <div class="d-flex align-items-center">
                            <div class="flex-grow-1">
                                <h6 class="alert-heading mb-1">
                                    <i class="bi bi-award-fill me-2"></i>Professional Development for Teachers
                                </h6>
                                <p class="mb-0 small">Earn recognized certificates and advance your teaching career with our professional development courses.</p>
                            </div>
                            <div class="ms-3">
                                <button class="btn btn-primary btn-sm" onclick="window.adPlacement.openCertificatesPage()" 
                                        aria-label="Learn more about professional development certificates">
                                    <i class="bi bi-mortarboard me-1"></i>Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Open certificates page
    openCertificatesPage() {
        // Track analytics event
        if (window.analytics && typeof window.analytics.track === 'function') {
            window.analytics.track('PD_Certificates_CTA_Click');
        }
        
        // Navigate to certificates page
        window.location.href = '#certificates';
        this.showCertificatesPage();
    }

    // Show certificates page content
    showCertificatesPage() {
        // Hide all other content
        const allContent = document.querySelectorAll('.tab-content > .tab-pane, .role-content');
        allContent.forEach(content => {
            content.classList.add('d-none');
            content.style.display = 'none';
        });

        // Show certificates content
        let certificatesContent = document.getElementById('certificates-content');
        if (!certificatesContent) {
            certificatesContent = this.createCertificatesPage();
        }
        
        certificatesContent.classList.remove('d-none');
        certificatesContent.style.display = 'block';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Create certificates page content
    createCertificatesPage() {
        const container = document.createElement('div');
        container.id = 'certificates-content';
        container.className = 'tab-pane fade show active';
        
        container.innerHTML = `
            <div class="container-fluid py-4">
                <div class="row mb-4">
                    <div class="col-12">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item">
                                    <a href="#" onclick="window.adPlacement.hideCertificatesPage()" class="text-decoration-none">
                                        <i class="bi bi-house-door me-1"></i>Dashboard
                                    </a>
                                </li>
                                <li class="breadcrumb-item active" aria-current="page">Professional Development</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                
                <div class="row mb-5">
                    <div class="col-12 text-center">
                        <h2 class="display-5 fw-bold mb-3">Professional Development Certificates</h2>
                        <p class="lead text-muted">Earn recognized credentials and advance your teaching career with our comprehensive certification programs.</p>
                    </div>
                </div>
                
                <div class="row g-4">
                    <div class="col-lg-4">
                        <div class="card h-100 border-primary">
                            <div class="card-body text-center p-4">
                                <div class="cert-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                    <i class="bi bi-mortarboard-fill fs-4"></i>
                                </div>
                                <h5 class="card-title">Teacher Proficiency Certificate</h5>
                                <div class="cert-price text-primary fs-4 fw-bold mb-3">$25</div>
                                <p class="text-muted mb-3">Master the fundamentals of modern teaching methods and student engagement strategies.</p>
                                <ul class="list-unstyled text-start small mb-4">
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>5 professional development modules</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Digital badge for your profile</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Certificate of completion</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Can be used for CE credits</li>
                                </ul>
                                <button class="btn btn-primary w-100" onclick="supportManager.purchaseCertification('teacher_proficiency', 25)">
                                    <i class="bi bi-cart me-2"></i>Enroll Now
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-4">
                        <div class="card h-100 border-success">
                            <div class="card-body text-center p-4">
                                <div class="cert-icon bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                    <i class="bi bi-bookmark-star-fill fs-4"></i>
                                </div>
                                <h5 class="card-title">Homeschool Mastery Certification</h5>
                                <div class="cert-price text-success fs-4 fw-bold mb-3">$50</div>
                                <p class="text-muted mb-3">Comprehensive certification for homeschool parents and educators.</p>
                                <ul class="list-unstyled text-start small mb-4">
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>10 comprehensive modules</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Advanced curriculum planning</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Student assessment strategies</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Verification badge</li>
                                </ul>
                                <button class="btn btn-success w-100" onclick="supportManager.purchaseCertification('homeschool_mastery', 50)">
                                    <i class="bi bi-cart me-2"></i>Enroll Now
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-4">
                        <div class="card h-100 border-warning">
                            <div class="card-body text-center p-4">
                                <div class="cert-icon bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
                                    <i class="bi bi-trophy-fill fs-4"></i>
                                </div>
                                <h5 class="card-title">Special Education Specialist</h5>
                                <div class="cert-price text-warning fs-4 fw-bold mb-3">$50</div>
                                <p class="text-muted mb-3">Specialized training for inclusive and special needs education.</p>
                                <ul class="list-unstyled text-start small mb-4">
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>8 specialized modules</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Adaptive learning strategies</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>IEP development skills</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Professional recognition</li>
                                </ul>
                                <button class="btn btn-warning w-100" onclick="supportManager.purchaseCertification('special_education', 50)">
                                    <i class="bi bi-cart me-2"></i>Enroll Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row mt-5">
                    <div class="col-12 text-center">
                        <div class="card bg-light">
                            <div class="card-body p-4">
                                <h5 class="card-title">Why Choose Our Certifications?</h5>
                                <div class="row g-3 mt-3">
                                    <div class="col-md-4">
                                        <div class="text-center">
                                            <i class="bi bi-award-fill text-primary fs-2 mb-2"></i>
                                            <h6>Recognized Credentials</h6>
                                            <p class="small text-muted mb-0">Industry-recognized certificates for professional development</p>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="text-center">
                                            <i class="bi bi-clock-fill text-success fs-2 mb-2"></i>
                                            <h6>Flexible Learning</h6>
                                            <p class="small text-muted mb-0">Self-paced courses that fit your schedule</p>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="text-center">
                                            <i class="bi bi-people-fill text-warning fs-2 mb-2"></i>
                                            <h6>Expert Instruction</h6>
                                            <p class="small text-muted mb-0">Learn from experienced educators and industry experts</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert into main content area
        const mainContent = document.querySelector('.tab-content') || document.querySelector('main');
        if (mainContent) {
            mainContent.appendChild(container);
        }
        
        return container;
    }

    // Hide certificates page and return to dashboard
    hideCertificatesPage() {
        const certificatesContent = document.getElementById('certificates-content');
        if (certificatesContent) {
            certificatesContent.classList.add('d-none');
            certificatesContent.style.display = 'none';
        }
        
        // Show role-specific content
        if (window.multiRoleAuth && window.multiRoleAuth.currentUser) {
            window.multiRoleAuth.showRoleContent(window.multiRoleAuth.currentUser.role);
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Clear all rendered ads
    clearAds() {
        this.renderedAds.forEach((container, adId) => {
            if (container && container.parentNode) {
                container.parentNode.removeChild(container);
            }
        });
        this.renderedAds.clear();
    }

    // Initialize ad placement system
    initialize() {
        // Listen for route changes
        document.addEventListener('DOMContentLoaded', () => {
            this.renderAds();
        });
        
        // Listen for authentication state changes
        window.addEventListener('userLogin', () => {
            setTimeout(() => this.renderAds(), 100);
        });
        
        window.addEventListener('userLogout', () => {
            setTimeout(() => this.renderAds(), 100);
        });
        
        console.log('Ad placement system initialized');
    }
}

// Create global instance
window.adPlacement = new AdPlacement();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.adPlacement.initialize();
    });
} else {
    window.adPlacement.initialize();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdPlacement;
}
