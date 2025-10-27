# AQE Platform - Server Configuration Guide

## Overview
The AQE Platform now uses dynamic API endpoint detection, making it compatible with different server configurations and environments.

## How It Works

### Automatic Detection
The platform automatically detects the API base URL based on:
- **Current hostname** (localhost, production domain, etc.)
- **Current protocol** (http/https)
- **Current port** (if specified)

### Configuration Logic

#### Development Environment
- **localhost/127.0.0.1**: API assumed to be on port 5001
- **Different frontend port** (8080, 3000, 8000): API on localhost:5001

#### Production Environment
- **Same host**: API on same host with `/api` path
- **Different port**: API on same host with port 5001

## Server Configurations

### 1. Development (Current Setup)
```
Frontend: http://localhost:8080 (Python server)
API: http://localhost:5001 (dotnet run)
```
✅ **Works automatically**

### 2. Production - Same Server
```
Frontend: https://yourdomain.com
API: https://yourdomain.com/api
```
✅ **Works automatically**

### 3. Production - Different Servers
```
Frontend: https://app.yourdomain.com
API: https://api.yourdomain.com
```
⚠️ **Requires manual configuration**

### 4. Docker/Container Setup
```
Frontend: http://frontend:3000
API: http://api:5001
```
⚠️ **Requires manual configuration**

## Manual Configuration

If automatic detection doesn't work for your setup, you can manually configure the API URL by editing `resources/scripts/config.js`:

```javascript
detectApiBaseUrl() {
    // Manual configuration for specific environments
    const hostname = window.location.hostname;
    
    if (hostname === 'your-production-domain.com') {
        return 'https://api.your-production-domain.com/api';
    }
    
    if (hostname === 'staging.yourdomain.com') {
        return 'https://staging-api.yourdomain.com/api';
    }
    
    // Default automatic detection
    return this.autoDetectApiBaseUrl();
}
```

## Environment Variables (Alternative)

You can also set the API URL via environment variables by modifying the config:

```javascript
detectApiBaseUrl() {
    // Check for environment variable first
    if (window.AQE_API_URL) {
        return window.AQE_API_URL;
    }
    
    // Fall back to automatic detection
    return this.autoDetectApiBaseUrl();
}
```

Then set it in your HTML:
```html
<script>
    window.AQE_API_URL = 'https://your-api-server.com/api';
</script>
```

## Testing Different Configurations

### Test Current Setup
1. Open browser console
2. Check: `window.AQEConfig.getApiBaseUrl()`
3. Should show: `http://localhost:5001/api`

### Test Production Setup
1. Deploy to production server
2. Check console: `window.AQEConfig.getApiBaseUrl()`
3. Should show your production API URL

## Troubleshooting

### API Calls Failing
1. Check browser console for CORS errors
2. Verify API server is running
3. Check `window.AQEConfig.getApiBaseUrl()` returns correct URL
4. Test API endpoint directly in browser

### Wrong API URL Detected
1. Check `window.AQEConfig.getEnvironment()` 
2. Modify `detectApiBaseUrl()` method if needed
3. Add manual configuration for your specific setup

## Benefits

✅ **No more hardcoded URLs**
✅ **Works on any server configuration**
✅ **Automatic environment detection**
✅ **Easy deployment to different environments**
✅ **Backward compatible with existing setup**

## Files Modified

- `resources/scripts/config.js` (new)
- All JavaScript files updated to use `window.AQEConfig.getApiBaseUrl()`
- `index.html` updated to load config.js first

The platform is now server-agnostic and will work on any hosting configuration!
