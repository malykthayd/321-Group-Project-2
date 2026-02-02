// Getting Started Page System
class GettingStartedSystem {
    showPage() {
        // Hide ONLY the specific sections
        const elementsToHide = [
            '.hero-section',
            '.role-content',
            'section.dashboard-metrics',
            '.premium-support-section',
            '.institutional-section',
            '.certification-section'
        ];
        
        // Hide each element individually
        elementsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el) {
                    el.style.display = 'none';
                }
            });
        });

        // Hide guest dashboard if it's visible
        const guestDashboard = document.getElementById('guestDashboard');
        if (guestDashboard) {
            guestDashboard.style.display = 'none';
        }

        // Hide main role-based content area
        const main = document.querySelector('main');
        if (main) {
            main.style.display = 'none';
        }

        // Show or create getting started page
        let page = document.getElementById('gettingStartedPage');
        if (!page) {
            this.createPage();
            page = document.getElementById('gettingStartedPage');
        }
        
        // Make sure it's visible
        if (page) {
            page.style.display = 'block';
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'auto' });
    }

    createPage() {
        const page = document.createElement('div');
        page.id = 'gettingStartedPage';
        page.className = 'getting-started-page';
        
        page.innerHTML = `
            <div class="container-fluid py-5">
                <div class="row mb-5">
                    <div class="col-12 text-center">
                        <h1 class="display-4 fw-bold mb-3">Getting Started</h1>
                        <p class="lead text-muted">Choose your role and login with demo credentials to access your personalized dashboard</p>
                    </div>
                </div>

                <!-- Steps -->
                <div class="row mb-5">
                    <div class="col-md-4 mb-4">
                        <div class="card h-100 text-center">
                            <div class="card-body p-4">
                                <div class="display-1 mb-3">1</div>
                                <h5>Choose Your Role & Login</h5>
                                <p class="text-muted">Select your role and login with demo credentials to access your personalized dashboard</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4">
                        <div class="card h-100 text-center">
                            <div class="card-body p-4">
                                <div class="display-1 mb-3">2</div>
                                <h5>Access Content</h5>
                                <p class="text-muted">Browse lessons, books, and practice materials</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4">
                        <div class="card h-100 text-center">
                            <div class="card-body p-4">
                                <div class="display-1 mb-3">3</div>
                                <h5>Track Progress</h5>
                                <p class="text-muted">Monitor your learning journey and achievements</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Platform Features -->
                <div class="row mb-5">
                    <div class="col-12">
                        <h3 class="text-center mb-4">Platform Features</h3>
                    </div>
                    <div class="col-md-4 mb-3">
                        <div class="card">
                            <div class="card-body">
                                <h5><i class="bi bi-graph-up me-2"></i>Adaptive Learning</h5>
                                <p class="text-muted mb-0">Personalized difficulty adjustment</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <div class="card">
                            <div class="card-body">
                                <h5><i class="bi bi-wifi-off me-2"></i>Offline Support</h5>
                                <p class="text-muted mb-0">Learn without internet connection</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <div class="card">
                            <div class="card-body">
                                <h5><i class="bi bi-chat-dots me-2"></i>SMS Learning</h5>
                                <p class="text-muted mb-0">Learn via text messages</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- About AQE -->
                <div class="row mb-5">
                    <div class="col-lg-8 mx-auto">
                        <div class="card bg-light">
                            <div class="card-body text-center p-5">
                                <h4 class="mb-3">Accessible Quality Education</h4>
                                <p>Accessible Quality Education is your gateway to personalized learning experiences. Choose your role in the 'Getting Started' tab to begin your educational journey.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Role Cards -->
                <div class="row mb-5">
                    <div class="col-md-3 mb-4">
                        <div class="card h-100 text-center">
                            <div class="card-body">
                                <i class="bi bi-person me-2" style="font-size: 3rem;"></i>
                                <h5>For Students</h5>
                                <p class="text-muted small">Access lessons, track progress, and earn badges as you learn.</p>
                                <button class="btn btn-primary btn-sm" onclick="openAuthModal(); gettingStarted.closePage();">
                                    Login as Student
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-4">
                        <div class="card h-100 text-center">
                            <div class="card-body">
                                <i class="bi bi-mortarboard me-2" style="font-size: 3rem;"></i>
                                <h5>For Teachers</h5>
                                <p class="text-muted small">Create assignments and monitor student progress effectively.</p>
                                <button class="btn btn-primary btn-sm" onclick="openAuthModal(); gettingStarted.closePage();">
                                    Login as Teacher
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-4">
                        <div class="card h-100 text-center">
                            <div class="card-body">
                                <i class="bi bi-people me-2" style="font-size: 3rem;"></i>
                                <h5>For Parents</h5>
                                <p class="text-muted small">Support your child's learning journey with progress insights.</p>
                                <button class="btn btn-primary btn-sm" onclick="openAuthModal(); gettingStarted.closePage();">
                                    Login as Parent
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-4">
                        <div class="card h-100 text-center">
                            <div class="card-body">
                                <i class="bi bi-shield-check me-2" style="font-size: 3rem;"></i>
                                <h5>For Admins</h5>
                                <p class="text-muted small">Manage content, users, and system settings.</p>
                                <button class="btn btn-primary btn-sm" onclick="openAuthModal(); gettingStarted.closePage();">
                                    Login as Admin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Premium Plans -->
                <div class="row mb-5">
                    <div class="col-12 text-center mb-4">
                        <h3>Choose Your Experience</h3>
                        <p class="text-muted">Enhance your educational journey with powerful tools and features designed for modern learning.</p>
                    </div>
                    
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <div class="card-body text-center">
                                <h4 class="text-primary mb-3">$4.99<small>/mo</small></h4>
                                <h5>Family Premium</h5>
                                <ul class="list-unstyled text-start small mt-3 mb-3">
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Advanced learning analytics & progress tracking</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Offline access to all content</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Priority customer support</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Download & print materials</li>
                                </ul>
                                <button class="btn btn-primary w-100" onclick="showPremiumModal('premium_parent')">Get Started</button>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4 mb-4">
                        <div class="card h-100 border-primary">
                            <div class="badge bg-primary position-absolute top-0 end-0 m-3">Most Popular</div>
                            <div class="card-body text-center">
                                <h4 class="text-success mb-3">$9.99<small>/mo</small></h4>
                                <h5>Teacher Premium</h5>
                                <ul class="list-unstyled text-start small mt-3 mb-3">
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Everything in Family Premium</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>AI-powered lesson plan generator</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Student analytics dashboard</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Classroom management tools</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Bulk student account management</li>
                                </ul>
                                <button class="btn btn-success w-100" onclick="showPremiumModal('premium_teacher')">Get Started</button>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <div class="card-body text-center">
                                <h4 class="mb-3">Free</h4>
                                <h5>Standard Access</h5>
                                <ul class="list-unstyled text-start small mt-3 mb-3">
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Access to all core lessons</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Basic progress tracking</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Online content library</li>
                                    <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Community support</li>
                                </ul>
                                <p class="text-muted small mb-0">Perfect for getting started with quality education</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Back Button -->
                <div class="row mb-4">
                    <div class="col-12 text-center">
                        <button class="btn btn-primary btn-lg" onclick="gettingStarted.closePage()">
                            <i class="bi bi-house-door me-2"></i>Return to Homepage
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Insert the page after the header
        const header = document.querySelector('header');
        if (header && header.parentNode) {
            header.parentNode.insertBefore(page, header.nextSibling);
        } else {
            document.body.prepend(page);
        }
    }

    closePage() {
        const page = document.getElementById('gettingStartedPage');
        if (page) {
            page.style.display = 'none';
        }
        
        // Show hero section again
        document.querySelectorAll('.hero-section').forEach(el => {
            el.style.display = '';
        });
        
        // Show main sections
        document.querySelectorAll('main > section').forEach(el => {
            el.style.display = '';
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Global instance
const gettingStarted = new GettingStartedSystem();

// Helper function
function showGettingStarted() {
    gettingStarted.showPage();
}

