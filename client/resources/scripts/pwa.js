// PWA Initialization and Management
// Handles service worker registration, installation prompts, and offline status

class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isOnline = navigator.onLine;
    this.registration = null;
    this.updateAvailable = false;
    
    this.init();
  }

  async init() {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.warn('[PWA] Service Workers not supported');
      return;
    }

    // Register service worker
    await this.registerServiceWorker();

    // Setup event listeners
    this.setupEventListeners();

    // Update UI based on online/offline status
    this.updateOnlineStatus();

    // Check for updates periodically
    this.checkForUpdates();
  }

  async registerServiceWorker() {
    try {
      this.registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('[PWA] Service Worker registered:', this.registration);

      // Check for updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration.installing;
        console.log('[PWA] New Service Worker found');

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New update available
            this.updateAvailable = true;
            this.showUpdateNotification();
          }
        });
      });

      // Listen for controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] New Service Worker activated');
        window.location.reload();
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleServiceWorkerMessage(event.data);
      });

    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
    }
  }

  setupEventListeners() {
    // Online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.updateOnlineStatus();
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.updateOnlineStatus();
    });

    // Install prompt event
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt = event;
      this.showInstallButton();
    });

    // App installed event
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully');
      this.deferredPrompt = null;
      this.hideInstallButton();
      this.showNotification('App installed! You can now use AQE offline.', 'success');
    });
  }

  updateOnlineStatus() {
    // Update UI to show online/offline status
    const statusIndicator = document.getElementById('offlineIndicator');
    
    if (!statusIndicator) {
      this.createOfflineIndicator();
    }

    const indicator = document.getElementById('offlineIndicator');
    
    if (this.isOnline) {
      indicator.classList.add('d-none');
    } else {
      indicator.classList.remove('d-none');
    }

    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('connectionchange', {
      detail: { online: this.isOnline }
    }));
  }

  createOfflineIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'offlineIndicator';
    indicator.className = 'd-none';
    indicator.innerHTML = `
      <div class="alert alert-warning m-0 rounded-0 text-center py-2" role="alert">
        <i class="bi bi-wifi-off me-2"></i>
        <strong>You're offline</strong> - Some features may be limited. Changes will sync when you're back online.
      </div>
    `;
    
    document.body.insertBefore(indicator, document.body.firstChild);
  }

  showInstallButton() {
    // Check if install button exists
    let installBtn = document.getElementById('pwaInstallBtn');
    
    if (!installBtn) {
      // Create install button
      installBtn = document.createElement('button');
      installBtn.id = 'pwaInstallBtn';
      installBtn.className = 'btn btn-primary btn-sm';
      installBtn.innerHTML = '<i class="bi bi-download me-1"></i>Install App';
      installBtn.onclick = () => this.promptInstall();
      
      // Add to header actions
      const headerActions = document.querySelector('.header-actions');
      if (headerActions) {
        headerActions.insertBefore(installBtn, headerActions.firstChild);
      }
    }
    
    installBtn.style.display = 'inline-block';
  }

  hideInstallButton() {
    const installBtn = document.getElementById('pwaInstallBtn');
    if (installBtn) {
      installBtn.style.display = 'none';
    }
  }

  async promptInstall() {
    if (!this.deferredPrompt) {
      console.log('[PWA] Install prompt not available');
      return;
    }

    // Show the install prompt
    this.deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await this.deferredPrompt.userChoice;
    console.log('[PWA] Install prompt outcome:', outcome);

    // Clear the deferred prompt
    this.deferredPrompt = null;
    this.hideInstallButton();
  }

  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'alert alert-info alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
      <strong>Update Available!</strong> A new version of AQE is ready.
      <button type="button" class="btn btn-sm btn-primary ms-2" onclick="pwaManager.applyUpdate()">
        Update Now
      </button>
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 30 seconds
    setTimeout(() => {
      notification.remove();
    }, 30000);
  }

  applyUpdate() {
    if (this.registration && this.registration.waiting) {
      // Tell the waiting service worker to take over
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  async checkForUpdates() {
    if (this.registration) {
      try {
        await this.registration.update();
        console.log('[PWA] Checked for updates');
      } catch (error) {
        console.error('[PWA] Update check failed:', error);
      }
    }

    // Check again in 1 hour
    setTimeout(() => this.checkForUpdates(), 60 * 60 * 1000);
  }

  async syncOfflineData() {
    console.log('[PWA] Syncing offline data...');
    
    // Trigger background sync if supported
    if ('sync' in this.registration) {
      try {
        await this.registration.sync.register('aqe-sync');
        console.log('[PWA] Background sync registered');
      } catch (error) {
        console.error('[PWA] Background sync failed:', error);
        // Fallback to manual sync
        this.manualSync();
      }
    } else {
      // Background sync not supported, do manual sync
      this.manualSync();
    }
  }

  async manualSync() {
    try {
      // Get unsynced data from IndexedDB
      const unsyncedAttempts = await window.offlineDB.getUnsyncedAttempts();
      const syncQueue = await window.offlineDB.getSyncQueue();
      
      console.log('[PWA] Manual sync:', {
        attempts: unsyncedAttempts.length,
        queue: syncQueue.length
      });

      // Sync practice attempts
      for (const attempt of unsyncedAttempts) {
        try {
          const response = await fetch('/api/student/complete-lesson', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attempt)
          });

          if (response.ok) {
            await window.offlineDB.markAttemptSynced(attempt.id);
          }
        } catch (error) {
          console.error('[PWA] Failed to sync attempt:', error);
        }
      }

      // Sync queued requests
      for (const item of syncQueue) {
        try {
          const response = await fetch(item.url, {
            method: item.method,
            headers: JSON.parse(item.headers),
            body: item.body
          });

          if (response.ok) {
            await window.offlineDB.removeSyncItem(item.id);
          }
        } catch (error) {
          console.error('[PWA] Failed to sync queue item:', error);
        }
      }

      this.showNotification('Data synced successfully!', 'success');
    } catch (error) {
      console.error('[PWA] Manual sync error:', error);
      this.showNotification('Sync failed. Will retry later.', 'warning');
    }
  }

  handleServiceWorkerMessage(data) {
    console.log('[PWA] Message from Service Worker:', data);
    
    switch (data.type) {
      case 'SYNC_COMPLETE':
        this.showNotification(`Synced ${data.itemsSynced} items successfully!`, 'success');
        break;
      case 'CACHE_COMPLETE':
        console.log('[PWA] Content cached for offline use');
        break;
      default:
        console.log('[PWA] Unknown message type:', data.type);
    }
  }

  async cacheLessonsForOffline(lessons) {
    if (this.registration && this.registration.active) {
      this.registration.active.postMessage({
        type: 'CACHE_LESSONS',
        lessons: lessons
      });
      
      console.log('[PWA] Caching lessons for offline use');
      this.showNotification('Lessons saved for offline access!', 'success');
    }
  }

  showNotification(message, type = 'info') {
    // Use the app's notification system if available
    if (window.app && typeof window.app.showNotification === 'function') {
      window.app.showNotification(message, type);
    } else {
      console.log(`[PWA] ${type.toUpperCase()}: ${message}`);
    }
  }

  async getStorageInfo() {
    const dbInfo = await window.offlineDB.getStorageInfo();
    
    return {
      indexedDB: dbInfo,
      cacheStorage: await this.getCacheStorageInfo()
    };
  }

  async getCacheStorageInfo() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const cacheNames = await caches.keys();
      
      return {
        caches: cacheNames.length,
        quota: estimate.quota,
        usage: estimate.usage
      };
    }
    return null;
  }

  async clearAllData() {
    try {
      // Clear caches
      if (this.registration && this.registration.active) {
        this.registration.active.postMessage({ type: 'CLEAR_CACHE' });
      }

      // Clear IndexedDB
      const stores = ['lessons', 'books', 'assignments', 'userProgress', 'syncQueue'];
      for (const store of stores) {
        await window.offlineDB.clear(store);
      }

      this.showNotification('All offline data cleared!', 'success');
    } catch (error) {
      console.error('[PWA] Failed to clear data:', error);
      this.showNotification('Failed to clear data', 'danger');
    }
  }
}

// Initialize PWA Manager
window.pwaManager = new PWAManager();

// Global helper functions
function installApp() {
  if (window.pwaManager) {
    window.pwaManager.promptInstall();
  }
}

function syncNow() {
  if (window.pwaManager) {
    window.pwaManager.syncOfflineData();
  }
}

function cacheCurrentLessons() {
  // This would be called when viewing lessons
  // For now, just a placeholder
  console.log('[PWA] Cache current lessons requested');
}

