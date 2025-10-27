// AQE Platform Ad Policy Configuration
// Centralized configuration for ad placement and content policy

class AdPolicy {
    constructor() {
        this.policy = {
            // Define where ads are allowed
            allowedRoutes: {
                home: true,           // Home page - allow ads
                dashboard: false,    // User dashboards - no ads, only PD CTA
                other: false         // All other routes - no ads
            },
            
            // Define ad types and their placement rules
            adTypes: {
                premium: {
                    allowedOn: ['home'],
                    maxPerPage: 1,
                    placement: 'above-fold' // or 'sidebar'
                },
                professionalDev: {
                    allowedOn: ['dashboard'],
                    maxPerPage: 1,
                    placement: 'cta-button'
                }
            },
            
            // Prohibited placements
            prohibitedPlacements: [
                'inside-forms',
                'inside-modals', 
                'inside-tables',
                'after-headings',
                'inside-dropdowns',
                'inside-toasts',
                'inside-confirmations'
            ],
            
            // Accessibility requirements
            accessibility: {
                adContainer: {
                    role: 'complementary',
                    ariaLabel: 'Site promotion'
                },
                ctaButton: {
                    focusable: true,
                    clearText: true,
                    visibleFocus: true,
                    colorContrast: 'AA'
                }
            }
        };
    }

    // Check if ads are allowed on current route
    isAdAllowed(routeType) {
        return this.policy.allowedRoutes[routeType] || false;
    }

    // Get ad type configuration
    getAdTypeConfig(adType) {
        return this.policy.adTypes[adType] || null;
    }

    // Check if placement is prohibited
    isPlacementProhibited(placement) {
        return this.policy.prohibitedPlacements.includes(placement);
    }

    // Get accessibility requirements
    getAccessibilityConfig(type) {
        return this.policy.accessibility[type] || {};
    }

    // Determine current route type based on app state
    getCurrentRouteType() {
        // Check if user is logged in
        const isLoggedIn = window.multiRoleAuth && window.multiRoleAuth.currentUser;
        
        if (!isLoggedIn) {
            return 'home';
        }
        
        // Check if we're in a dashboard view
        const roleDashboard = document.getElementById('roleDashboard');
        if (roleDashboard && roleDashboard.style.display !== 'none') {
            return 'dashboard';
        }
        
        return 'other';
    }

    // Validate ad placement
    validateAdPlacement(adType, placement) {
        const routeType = this.getCurrentRouteType();
        const adConfig = this.getAdTypeConfig(adType);
        
        if (!this.isAdAllowed(routeType)) {
            return { valid: false, reason: `Ads not allowed on ${routeType} route` };
        }
        
        if (!adConfig) {
            return { valid: false, reason: `Unknown ad type: ${adType}` };
        }
        
        if (!adConfig.allowedOn.includes(routeType)) {
            return { valid: false, reason: `${adType} ads not allowed on ${routeType}` };
        }
        
        if (this.isPlacementProhibited(placement)) {
            return { valid: false, reason: `Prohibited placement: ${placement}` };
        }
        
        return { valid: true };
    }
}

// Create global instance
window.AdPolicy = new AdPolicy();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdPolicy;
}
