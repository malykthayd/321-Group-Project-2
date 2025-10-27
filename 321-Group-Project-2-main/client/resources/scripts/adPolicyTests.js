// AQE Platform Ad Policy Tests
// Tests to ensure ad placement follows the centralized policy

class AdPolicyTests {
    constructor() {
        this.adPolicy = window.AdPolicy;
        this.adPlacement = window.adPlacement;
        this.testResults = [];
    }

    // Run all tests
    runAllTests() {
        console.log('🧪 Running Ad Policy Tests...');
        
        this.testResults = [];
        
        // Test ad policy configuration
        this.testAdPolicyConfiguration();
        
        // Test route detection
        this.testRouteDetection();
        
        // Test ad validation
        this.testAdValidation();
        
        // Test ad placement
        this.testAdPlacement();
        
        // Test accessibility
        this.testAccessibility();
        
        // Display results
        this.displayResults();
        
        return this.testResults;
    }

    // Test ad policy configuration
    testAdPolicyConfiguration() {
        const tests = [
            {
                name: 'Ad policy exists',
                test: () => this.adPolicy !== undefined,
                expected: true
            },
            {
                name: 'Home route allows ads',
                test: () => this.adPolicy.isAdAllowed('home'),
                expected: true
            },
            {
                name: 'Dashboard route disallows ads',
                test: () => this.adPolicy.isAdAllowed('dashboard'),
                expected: false
            },
            {
                name: 'Other routes disallow ads',
                test: () => this.adPolicy.isAdAllowed('other'),
                expected: false
            },
            {
                name: 'Premium ad type exists',
                test: () => this.adPolicy.getAdTypeConfig('premium') !== null,
                expected: true
            },
            {
                name: 'Professional dev ad type exists',
                test: () => this.adPolicy.getAdTypeConfig('professionalDev') !== null,
                expected: true
            }
        ];

        this.runTestSuite('Ad Policy Configuration', tests);
    }

    // Test route detection
    testRouteDetection() {
        // Mock different states
        const originalAuth = window.multiRoleAuth;
        
        // Test home route (no user)
        window.multiRoleAuth = { currentUser: null };
        const homeRoute = this.adPolicy.getCurrentRouteType();
        
        // Test dashboard route (user logged in)
        window.multiRoleAuth = { 
            currentUser: { role: 'teacher' },
            showRoleContent: () => {}
        };
        
        // Mock role dashboard element
        const mockDashboard = document.createElement('div');
        mockDashboard.id = 'roleDashboard';
        mockDashboard.style.display = 'block';
        document.body.appendChild(mockDashboard);
        
        const dashboardRoute = this.adPolicy.getCurrentRouteType();
        
        // Clean up
        document.body.removeChild(mockDashboard);
        window.multiRoleAuth = originalAuth;
        
        const tests = [
            {
                name: 'Detects home route when no user',
                test: () => homeRoute === 'home',
                expected: true
            },
            {
                name: 'Detects dashboard route when user logged in',
                test: () => dashboardRoute === 'dashboard',
                expected: true
            }
        ];

        this.runTestSuite('Route Detection', tests);
    }

    // Test ad validation
    testAdValidation() {
        const tests = [
            {
                name: 'Validates premium ad on home route',
                test: () => {
                    const result = this.adPolicy.validateAdPlacement('premium', 'above-fold');
                    return result.valid;
                },
                expected: true
            },
            {
                name: 'Rejects premium ad on dashboard route',
                test: () => {
                    // Mock dashboard route
                    const originalGetCurrentRouteType = this.adPolicy.getCurrentRouteType;
                    this.adPolicy.getCurrentRouteType = () => 'dashboard';
                    
                    const result = this.adPolicy.validateAdPlacement('premium', 'above-fold');
                    
                    // Restore original method
                    this.adPolicy.getCurrentRouteType = originalGetCurrentRouteType;
                    
                    return !result.valid;
                },
                expected: true
            },
            {
                name: 'Rejects ads in prohibited placements',
                test: () => {
                    const result = this.adPolicy.validateAdPlacement('premium', 'inside-forms');
                    return !result.valid;
                },
                expected: true
            },
            {
                name: 'Validates professional dev CTA on dashboard',
                test: () => {
                    // Mock dashboard route
                    const originalGetCurrentRouteType = this.adPolicy.getCurrentRouteType;
                    this.adPolicy.getCurrentRouteType = () => 'dashboard';
                    
                    const result = this.adPolicy.validateAdPlacement('professionalDev', 'cta-button');
                    
                    // Restore original method
                    this.adPolicy.getCurrentRouteType = originalGetCurrentRouteType;
                    
                    return result.valid;
                },
                expected: true
            }
        ];

        this.runTestSuite('Ad Validation', tests);
    }

    // Test ad placement
    testAdPlacement() {
        const tests = [
            {
                name: 'Ad placement component exists',
                test: () => this.adPlacement !== undefined,
                expected: true
            },
            {
                name: 'Ad placement has renderAds method',
                test: () => typeof this.adPlacement.renderAds === 'function',
                expected: true
            },
            {
                name: 'Ad placement has clearAds method',
                test: () => typeof this.adPlacement.clearAds === 'function',
                expected: true
            },
            {
                name: 'Ad placement has openCertificatesPage method',
                test: () => typeof this.adPlacement.openCertificatesPage === 'function',
                expected: true
            }
        ];

        this.runTestSuite('Ad Placement', tests);
    }

    // Test accessibility
    testAccessibility() {
        const tests = [
            {
                name: 'Ad container accessibility config exists',
                test: () => {
                    const config = this.adPolicy.getAccessibilityConfig('adContainer');
                    return config.role === 'complementary' && config.ariaLabel === 'Site promotion';
                },
                expected: true
            },
            {
                name: 'CTA button accessibility config exists',
                test: () => {
                    const config = this.adPolicy.getAccessibilityConfig('ctaButton');
                    return config.focusable === true && config.clearText === true;
                },
                expected: true
            }
        ];

        this.runTestSuite('Accessibility', tests);
    }

    // Run a test suite
    runTestSuite(suiteName, tests) {
        console.log(`\n📋 Testing ${suiteName}:`);
        
        tests.forEach(test => {
            try {
                const result = test.test();
                const passed = result === test.expected;
                
                this.testResults.push({
                    suite: suiteName,
                    name: test.name,
                    passed: passed,
                    expected: test.expected,
                    actual: result
                });
                
                console.log(`  ${passed ? '✅' : '❌'} ${test.name}`);
                if (!passed) {
                    console.log(`    Expected: ${test.expected}, Got: ${result}`);
                }
            } catch (error) {
                this.testResults.push({
                    suite: suiteName,
                    name: test.name,
                    passed: false,
                    error: error.message
                });
                
                console.log(`  ❌ ${test.name} - Error: ${error.message}`);
            }
        });
    }

    // Display test results
    displayResults() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        
        console.log(`\n📊 Test Results:`);
        console.log(`  Total: ${totalTests}`);
        console.log(`  Passed: ${passedTests}`);
        console.log(`  Failed: ${failedTests}`);
        
        if (failedTests > 0) {
            console.log(`\n❌ Failed Tests:`);
            this.testResults
                .filter(r => !r.passed)
                .forEach(r => {
                    console.log(`  - ${r.suite}: ${r.name}`);
                    if (r.error) {
                        console.log(`    Error: ${r.error}`);
                    } else {
                        console.log(`    Expected: ${r.expected}, Got: ${r.actual}`);
                    }
                });
        }
        
        console.log(`\n${failedTests === 0 ? '🎉 All tests passed!' : '⚠️  Some tests failed.'}`);
    }

    // Test DOM elements for ad policy compliance
    testDOMCompliance() {
        console.log('\n🔍 Testing DOM Compliance:');
        
        // Check for prohibited ad placements
        const prohibitedElements = [
            { selector: 'form .ad-container', name: 'Ads in forms' },
            { selector: '.modal .ad-container', name: 'Ads in modals' },
            { selector: 'table .ad-container', name: 'Ads in tables' },
            { selector: 'h1 + .ad-container, h2 + .ad-container', name: 'Ads after headings' }
        ];
        
        prohibitedElements.forEach(test => {
            const elements = document.querySelectorAll(test.selector);
            const found = elements.length > 0;
            
            console.log(`  ${found ? '❌' : '✅'} ${test.name}: ${found ? 'Found' : 'Not found'}`);
            
            if (found) {
                console.log(`    Found ${elements.length} prohibited ad placement(s)`);
            }
        });
        
        // Check for proper ad containers
        const adContainers = document.querySelectorAll('.ad-container');
        console.log(`\n📦 Ad Containers Found: ${adContainers.length}`);
        
        adContainers.forEach((container, index) => {
            const hasRole = container.getAttribute('role') === 'complementary';
            const hasAriaLabel = container.getAttribute('aria-label') === 'Site promotion';
            
            console.log(`  Container ${index + 1}:`);
            console.log(`    Role: ${hasRole ? '✅' : '❌'} ${container.getAttribute('role') || 'none'}`);
            console.log(`    Aria-label: ${hasAriaLabel ? '✅' : '❌'} ${container.getAttribute('aria-label') || 'none'}`);
        });
    }
}

// Create global test instance
window.adPolicyTests = new AdPolicyTests();

// Auto-run tests when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for other scripts to load
        setTimeout(() => {
            window.adPolicyTests.runAllTests();
            window.adPolicyTests.testDOMCompliance();
        }, 1000);
    });
} else {
    setTimeout(() => {
        window.adPolicyTests.runAllTests();
        window.adPolicyTests.testDOMCompliance();
    }, 1000);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdPolicyTests;
}
