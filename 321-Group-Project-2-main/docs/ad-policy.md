# AQE Platform Ad Policy Documentation

## Overview

The AQE Platform implements a centralized ad policy system to ensure consistent and appropriate placement of promotional content throughout the application. This system prevents ads from appearing in inappropriate locations and maintains a clean user experience.

## Architecture

### Core Components

1. **AdPolicy** (`resources/config/adPolicy.js`)
   - Centralized configuration for ad placement rules
   - Route-based ad permissions
   - Accessibility requirements
   - Validation logic

2. **AdPlacement** (`resources/scripts/adPlacement.js`)
   - Renders ads based on current route and policy
   - Manages ad lifecycle (creation, display, cleanup)
   - Handles Professional Development CTA for dashboards
   - Creates certificates page

3. **AdPolicyTests** (`resources/scripts/adPolicyTests.js`)
   - Automated tests for ad policy compliance
   - DOM compliance checking
   - Route detection validation

## Ad Placement Rules

### Route-Based Permissions

| Route Type | Ads Allowed | Content Type |
|------------|-------------|--------------|
| `home` | ✅ Yes | Premium subscription offers |
| `dashboard` | ❌ No | Professional Development CTA only |
| `other` | ❌ No | No ads |

### Ad Types

#### Premium Ads (Home Page Only)
- **Type**: `premium`
- **Allowed On**: `home`
- **Max Per Page**: 1
- **Placement**: `above-fold` (after hero section)
- **Content**: Family Premium ($4.99/mo), Teacher Premium ($9.99/mo), Standard Access (Free)

#### Professional Development CTA (Dashboard Only)
- **Type**: `professionalDev`
- **Allowed On**: `dashboard`
- **Max Per Page**: 1
- **Placement**: `cta-button` (top of dashboard content)
- **Content**: Single CTA button linking to certificates page

### Prohibited Placements

Ads are **never** allowed in:
- Inside forms
- Inside modals
- Inside tables
- After headings (h1, h2)
- Inside dropdowns
- Inside toasts
- Inside confirmation dialogs

## Implementation Details

### Route Detection

The system automatically detects the current route type:

```javascript
// Home route: No user logged in
getCurrentRouteType() // returns 'home'

// Dashboard route: User logged in with role dashboard visible
getCurrentRouteType() // returns 'dashboard'

// Other routes: User logged in but not in dashboard
getCurrentRouteType() // returns 'other'
```

### Ad Rendering

Ads are rendered automatically based on the current route:

```javascript
// Called automatically on page load and route changes
window.adPlacement.renderAds();
```

### Professional Development CTA

When users are on their dashboard, a single CTA button appears:

```html
<div class="alert alert-info">
  <h6>Professional Development for Teachers</h6>
  <p>Earn recognized certificates and advance your teaching career</p>
  <button onclick="window.adPlacement.openCertificatesPage()">
    Learn More
  </button>
</div>
```

## Accessibility

### Ad Containers
- **Role**: `complementary`
- **Aria-label**: `Site promotion`

### CTA Buttons
- **Focusable**: Yes
- **Clear text**: Yes
- **Visible focus outline**: Yes
- **Color contrast**: AA compliant

## Analytics

The system tracks Professional Development CTA clicks:

```javascript
// Fired when user clicks "Learn More" on dashboard
analytics.track('PD_Certificates_CTA_Click');
```

## Testing

### Automated Tests

Run tests in browser console:
```javascript
window.adPolicyTests.runAllTests();
window.adPolicyTests.testDOMCompliance();
```

### Test Coverage

- ✅ Ad policy configuration
- ✅ Route detection
- ✅ Ad validation
- ✅ Ad placement functionality
- ✅ Accessibility compliance
- ✅ DOM compliance checking

## Maintenance

### Adding New Ad Types

1. Update `adPolicy.js` configuration:
```javascript
adTypes: {
    newAdType: {
        allowedOn: ['home'],
        maxPerPage: 1,
        placement: 'sidebar'
    }
}
```

2. Add rendering logic in `adPlacement.js`:
```javascript
renderNewAdType() {
    // Implementation
}
```

### Modifying Placement Rules

Update the `allowedRoutes` or `prohibitedPlacements` in `adPolicy.js`:

```javascript
allowedRoutes: {
    home: true,
    dashboard: false,
    newRoute: true  // Add new route
}
```

### Preventing Regression

The test suite automatically checks for:
- Ads in prohibited locations
- Missing accessibility attributes
- Policy compliance violations

## Migration Notes

### Removed Components

The following scattered ad placements were removed and centralized:

- ❌ Premium plans section in `index.html`
- ❌ Premium info cards in support modal
- ❌ Premium offers in guest dashboard
- ❌ Premium plans in getting started page

### Replaced With

- ✅ Centralized premium ads on home page only
- ✅ Professional Development CTA on dashboards only
- ✅ Clean certificates page accessible via CTA

## Best Practices

1. **Never bypass the AdPlacement system** - Always use `window.adPlacement.renderAds()`
2. **Test route changes** - Ensure ads update when users log in/out
3. **Maintain accessibility** - Always include proper ARIA attributes
4. **Keep ads minimal** - One ad per page maximum
5. **Respect user context** - No ads in forms, modals, or critical workflows

## Troubleshooting

### Ads Not Showing
1. Check route detection: `window.AdPolicy.getCurrentRouteType()`
2. Verify policy: `window.AdPolicy.isAdAllowed('home')`
3. Check validation: `window.AdPolicy.validateAdPlacement('premium', 'above-fold')`

### CTA Not Appearing
1. Ensure user is logged in
2. Check dashboard is visible: `document.getElementById('roleDashboard').style.display`
3. Verify CTA rendering: `window.adPlacement.renderDashboardCTA()`

### Test Failures
1. Run individual test suites: `window.adPolicyTests.testAdPolicyConfiguration()`
2. Check DOM compliance: `window.adPolicyTests.testDOMCompliance()`
3. Review console for specific error messages
