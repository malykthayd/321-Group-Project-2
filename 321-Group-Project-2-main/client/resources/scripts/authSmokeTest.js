// Smoke Test Script for Unified Authentication System
// Tests: login → refresh → stays on dashboard; logout → back to landing; publish endpoint sends Authorization header

class AuthSmokeTest {
    constructor() {
        this.testResults = [];
        this.apiBaseUrl = window.AQEConfig?.getApiBaseUrl() || 'http://localhost:5001';
    }

    async runAllTests() {
        console.log('🧪 Starting Authentication Smoke Tests...');
        
        try {
            await this.testLoginFlow();
            await this.testSessionPersistence();
            await this.testLogoutFlow();
            await this.testAuthHeaders();
            await this.testRoleProtection();
            
            this.printResults();
        } catch (error) {
            console.error('❌ Test suite failed:', error);
        }
    }

    async testLoginFlow() {
        console.log('🔐 Testing login flow...');
        
        try {
            // Test admin login
            const result = await window.auth.login('admin', {
                email: 'admin@demo.com',
                password: 'admin123'
            });

            if (result.success && window.auth.currentUser?.role === 'admin') {
                this.addResult('✅ Admin login successful', true);
            } else {
                this.addResult('❌ Admin login failed', false);
            }

            // Test student access code login
            const studentResult = await window.auth.login('student', {
                name: 'Demo Student',
                accessCode: '123456'
            });

            if (studentResult.success && window.auth.currentUser?.role === 'student') {
                this.addResult('✅ Student access code login successful', true);
            } else {
                this.addResult('❌ Student access code login failed', false);
            }

        } catch (error) {
            this.addResult(`❌ Login flow error: ${error.message}`, false);
        }
    }

    async testSessionPersistence() {
        console.log('💾 Testing session persistence...');
        
        try {
            // Login as admin
            await window.auth.login('admin', {
                email: 'admin@demo.com',
                password: 'admin123'
            });

            // Simulate page refresh by clearing and rehydrating
            const originalUser = { ...window.auth.currentUser };
            window.auth.currentUser = null;
            window.auth.token = null;

            // Rehydrate session
            const hydrated = window.auth.hydrateSession();

            if (hydrated && window.auth.currentUser?.id === originalUser.id) {
                this.addResult('✅ Session persistence works', true);
            } else {
                this.addResult('❌ Session persistence failed', false);
            }

        } catch (error) {
            this.addResult(`❌ Session persistence error: ${error.message}`, false);
        }
    }

    async testLogoutFlow() {
        console.log('🚪 Testing logout flow...');
        
        try {
            // Ensure we're logged in
            await window.auth.login('admin', {
                email: 'admin@demo.com',
                password: 'admin123'
            });

            const wasLoggedIn = !!window.auth.currentUser;
            
            // Logout
            window.auth.logout();

            if (!window.auth.currentUser && !window.auth.token) {
                this.addResult('✅ Logout clears session', true);
            } else {
                this.addResult('❌ Logout failed to clear session', false);
            }

            // Check if landing content is shown
            const mainTabContent = document.getElementById('mainTabContent');
            if (mainTabContent && mainTabContent.style.display !== 'none') {
                this.addResult('✅ Logout shows landing content', true);
            } else {
                this.addResult('❌ Logout failed to show landing content', false);
            }

        } catch (error) {
            this.addResult(`❌ Logout flow error: ${error.message}`, false);
        }
    }

    async testAuthHeaders() {
        console.log('🔑 Testing auth headers...');
        
        try {
            // Login as admin
            await window.auth.login('admin', {
                email: 'admin@demo.com',
                password: 'admin123'
            });

            // Test withAuthHeaders method
            const fetchArgs = window.auth.withAuthHeaders({
                method: 'POST',
                body: JSON.stringify({ test: 'data' })
            });

            if (fetchArgs.headers['Authorization'] && fetchArgs.headers['Authorization'].startsWith('Bearer ')) {
                this.addResult('✅ Auth headers include Bearer token', true);
            } else {
                this.addResult('❌ Auth headers missing Bearer token', false);
            }

            if (fetchArgs.headers['Content-Type'] === 'application/json') {
                this.addResult('✅ Auth headers include Content-Type', true);
            } else {
                this.addResult('❌ Auth headers missing Content-Type', false);
            }

            // Test actual API call with auth headers
            const response = await fetch(`${this.apiBaseUrl}/admin/curriculum/subjects`, 
                window.auth.withAuthHeaders({ method: 'GET' })
            );

            if (response.ok) {
                this.addResult('✅ API call with auth headers successful', true);
            } else {
                this.addResult(`❌ API call with auth headers failed: ${response.status}`, false);
            }

        } catch (error) {
            this.addResult(`❌ Auth headers error: ${error.message}`, false);
        }
    }

    async testRoleProtection() {
        console.log('🛡️ Testing role protection...');
        
        try {
            // Test requireRole method
            await window.auth.login('student', {
                name: 'Demo Student',
                accessCode: '123456'
            });

            // Student should not have admin access
            const adminAccess = window.auth.requireRole(['admin']);
            if (!adminAccess) {
                this.addResult('✅ Role protection blocks unauthorized access', true);
            } else {
                this.addResult('❌ Role protection failed', false);
            }

            // Student should have student access
            const studentAccess = window.auth.requireRole(['student']);
            if (studentAccess) {
                this.addResult('✅ Role protection allows authorized access', true);
            } else {
                this.addResult('❌ Role protection blocks authorized access', false);
            }

            // Test authGate method
            const gateResult = window.auth.authGate(['student']);
            if (gateResult) {
                this.addResult('✅ AuthGate allows authorized role', true);
            } else {
                this.addResult('❌ AuthGate blocks authorized role', false);
            }

        } catch (error) {
            this.addResult(`❌ Role protection error: ${error.message}`, false);
        }
    }

    addResult(message, success) {
        this.testResults.push({ message, success });
        console.log(message);
    }

    printResults() {
        console.log('\n📊 Test Results Summary:');
        console.log('========================');
        
        const passed = this.testResults.filter(r => r.success).length;
        const total = this.testResults.length;
        
        this.testResults.forEach(result => {
            console.log(result.message);
        });
        
        console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
        
        if (passed === total) {
            console.log('🎉 All tests passed! Authentication system is working correctly.');
        } else {
            console.log('⚠️ Some tests failed. Check the results above.');
        }
    }
}

// Auto-run tests when script loads
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        // Wait a bit for auth system to initialize
        setTimeout(() => {
            if (window.auth) {
                window.authSmokeTest = new AuthSmokeTest();
                // Uncomment the line below to auto-run tests
                // window.authSmokeTest.runAllTests();
            }
        }, 1000);
    });
}

// Export for manual testing
if (typeof window !== 'undefined') {
    window.runAuthTests = () => {
        if (window.authSmokeTest) {
            window.authSmokeTest.runAllTests();
        } else {
            console.log('Auth smoke test not initialized. Please refresh the page.');
        }
    };
}
