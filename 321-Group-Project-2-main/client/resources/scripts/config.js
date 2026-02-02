// AQE Platform Configuration
// Centralized configuration for API endpoints and environment settings

class AQEConfig {
    constructor() {
        // Auto-detect the API base URL based on the current environment
        this.apiBaseUrl = this.detectApiBaseUrl();
        this.environment = this.detectEnvironment();
        
        console.log('AQE Config initialized:', {
            apiBaseUrl: this.apiBaseUrl,
            environment: this.environment
        });
    }

    detectApiBaseUrl() {
        // Get the current hostname and protocol
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const port = window.location.port;
        
        // If opened directly from file system (file:// protocol)
        if (protocol === 'file:') {
            // Use localhost:5001 for API calls when opening HTML files directly
            return 'http://localhost:5001';
        }
        
        // Development environment (localhost)
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // If we're on port 5001, the API is served from the same server
            if (port === '5001') {
                return '';
            }
            // Check if we're running on a specific port (like 8080 for Python server)
            if (port === '8080' || port === '3000' || port === '8000') {
                // Frontend is on a different port, API is likely on 5001
                return 'http://localhost:5001';
            }
            // Default to localhost:5001 for development
            return 'http://localhost:5001';
        }
        
        // Production environment
        // Assume API is on the same host but different port
        if (port) {
            // If frontend has a port, API might be on a different port
            return `${protocol}//${hostname}:5001`;
        } else {
            // No port specified, assume API is on same host
            return `${protocol}//${hostname}`;
        }
    }

    detectEnvironment() {
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'development';
        } else if (hostname.includes('staging') || hostname.includes('test')) {
            return 'staging';
        } else {
            return 'production';
        }
    }

    // Get the API base URL
    getApiBaseUrl() {
        return this.apiBaseUrl;
    }

    // Get the environment
    getEnvironment() {
        return this.environment;
    }

    // Check if we're in development mode
    isDevelopment() {
        return this.environment === 'development';
    }

    // Check if we're in production mode
    isProduction() {
        return this.environment === 'production';
    }

    // Get full API URL for a specific endpoint
    getApiUrl(endpoint) {
        // Remove leading slash if present
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
        // Add /api prefix if not already present
        const apiEndpoint = cleanEndpoint.startsWith('api/') ? cleanEndpoint : `api/${cleanEndpoint}`;
        return `${this.apiBaseUrl}/${apiEndpoint}`;
    }
}

// Create global config instance
window.AQEConfig = new AQEConfig();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AQEConfig;
}
