/**
 * EduConnect - Offline Sync Module
 * Handles offline functionality and data synchronization
 */

class OfflineSyncManager {
  constructor(app) {
    this.app = app;
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.lastSyncTime = null;
    this.offlineData = this.loadOfflineData();
    
    this.setupEventListeners();
  }

  /**
   * Initialize offline sync
   */
  init() {
    this.setupServiceWorker();
    this.loadOfflineContent();
    this.setupOfflineIndicators();
    
    console.log('Offline sync manager initialized');
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Online/offline status changes
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.hideOfflineIndicator();
      this.syncWithServer();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showOfflineIndicator();
    });

    // Before unload - save any pending data
    window.addEventListener('beforeunload', () => {
      this.savePendingData();
    });

    // Visibility change - sync when tab becomes active
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.syncWithServer();
      }
    });
  }

  /**
   * Set up service worker for offline functionality
   */
  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }

  /**
   * Load offline content
   */
  loadOfflineContent() {
    // Cache essential lesson content
    this.cacheEssentialLessons();
    
    // Cache user progress
    this.cacheUserProgress();
    
    // Cache achievements and gamification data
    this.cacheGamificationData();
  }

  /**
   * Cache essential lessons for offline access
   */
  cacheEssentialLessons() {
    const essentialLessons = window.SampleData?.lessons?.slice(0, 5) || [];
    
    essentialLessons.forEach(lesson => {
      const lessonData = {
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        duration: lesson.duration,
        difficulty: lesson.difficulty,
        cachedAt: new Date().toISOString()
      };
      
      localStorage.setItem(`lesson_${lesson.id}`, JSON.stringify(lessonData));
    });
    
    console.log(`Cached ${essentialLessons.length} essential lessons`);
  }

  /**
   * Cache user progress
   */
  cacheUserProgress() {
    if (!this.app.currentUser) return;

    const userId = this.app.currentUser.id;
    const progressData = {
      user: this.app.currentUser,
      progress: window.SampleData?.progressData?.[userId] || {},
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(`progress_${userId}`, JSON.stringify(progressData));
  }

  /**
   * Cache gamification data
   */
  cacheGamificationData() {
    const gamificationData = {
      achievements: window.SampleData?.achievements || [],
      leaderboard: window.SampleData?.leaderboard || [],
      cachedAt: new Date().toISOString()
    };

    localStorage.setItem('gamification_data', JSON.stringify(gamificationData));
  }

  /**
   * Save data for offline sync
   */
  saveForSync(action, data) {
    const syncItem = {
      id: this.generateSyncId(),
      action: action,
      data: data,
      timestamp: Date.now(),
      retries: 0
    };

    this.syncQueue.push(syncItem);
    this.saveSyncQueue();

    // Try to sync immediately if online
    if (this.isOnline) {
      this.syncWithServer();
    }
  }

  /**
   * Sync with server
   */
  async syncWithServer() {
    if (!this.isOnline || this.syncQueue.length === 0) return;

    console.log(`Syncing ${this.syncQueue.length} items...`);

    const successfulSyncs = [];
    const failedSyncs = [];

    for (const item of this.syncQueue) {
      try {
        await this.syncItem(item);
        successfulSyncs.push(item.id);
      } catch (error) {
        console.error('Sync failed for item:', item, error);
        
        item.retries++;
        if (item.retries < 3) {
          failedSyncs.push(item);
        }
      }
    }

    // Remove successfully synced items
    this.syncQueue = failedSyncs;
    this.saveSyncQueue();

    this.lastSyncTime = new Date().toISOString();
    localStorage.setItem('lastSyncTime', this.lastSyncTime);

    if (successfulSyncs.length > 0) {
      this.showSyncSuccess(successfulSyncs.length);
    }
  }

  /**
   * Sync individual item
   */
  async syncItem(item) {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve(item);
        } else {
          reject(new Error('Network error'));
        }
      }, 500);
    });
  }

  /**
   * Load offline data
   */
  loadOfflineData() {
    try {
      return JSON.parse(localStorage.getItem('educonnect_offline_data')) || {};
    } catch (error) {
      console.error('Failed to load offline data:', error);
      return {};
    }
  }

  /**
   * Save offline data
   */
  saveOfflineData() {
    try {
      localStorage.setItem('educonnect_offline_data', JSON.stringify(this.offlineData));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }

  /**
   * Save sync queue
   */
  saveSyncQueue() {
    try {
      localStorage.setItem('sync_queue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }

  /**
   * Load sync queue
   */
  loadSyncQueue() {
    try {
      const queue = localStorage.getItem('sync_queue');
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Failed to load sync queue:', error);
      return [];
    }
  }

  /**
   * Save pending data before page unload
   */
  savePendingData() {
    // Save current progress
    if (this.app.currentUser) {
      this.cacheUserProgress();
    }

    // Save any unsaved changes
    this.saveOfflineData();
    this.saveSyncQueue();
  }

  /**
   * Show offline indicator
   */
  showOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.style.display = 'block';
    }
  }

  /**
   * Hide offline indicator
   */
  hideOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }

  /**
   * Set up offline indicators
   */
  setupOfflineIndicators() {
    if (!this.isOnline) {
      this.showOfflineIndicator();
    }
  }

  /**
   * Show sync success message
   */
  showSyncSuccess(count) {
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-success border-0';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <i class="bi bi-cloud-check me-2"></i>
          Synced ${count} item${count > 1 ? 's' : ''} successfully
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
    
    document.body.appendChild(toast);
    new bootstrap.Toast(toast).show();
    
    setTimeout(() => toast.remove(), 3000);
  }

  /**
   * Generate unique sync ID
   */
  generateSyncId() {
    return 'sync_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get offline status
   */
  getOfflineStatus() {
    return {
      isOnline: this.isOnline,
      pendingSyncs: this.syncQueue.length,
      lastSync: this.lastSyncTime,
      offlineDataSize: JSON.stringify(this.offlineData).length
    };
  }

  /**
   * Clear offline data
   */
  clearOfflineData() {
    this.offlineData = {};
    this.syncQueue = [];
    this.saveOfflineData();
    this.saveSyncQueue();
    
    // Clear cached lessons
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('lesson_') || key.startsWith('progress_') || key.startsWith('gamification_')) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Force sync
   */
  forceSync() {
    if (this.isOnline) {
      this.syncWithServer();
    } else {
      this.showError('Cannot sync while offline');
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    if (this.app && this.app.showError) {
      this.app.showError(message);
    }
  }

  /**
   * Export offline data for debugging
   */
  exportOfflineData() {
    return {
      offlineData: this.offlineData,
      syncQueue: this.syncQueue,
      status: this.getOfflineStatus(),
      cachedLessons: this.getCachedLessons(),
      userProgress: this.getCachedUserProgress()
    };
  }

  /**
   * Get cached lessons
   */
  getCachedLessons() {
    const lessons = [];
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith('lesson_')) {
        try {
          const lesson = JSON.parse(localStorage.getItem(key));
          lessons.push(lesson);
        } catch (error) {
          console.error('Failed to parse cached lesson:', key, error);
        }
      }
    });
    
    return lessons;
  }

  /**
   * Get cached user progress
   */
  getCachedUserProgress() {
    if (!this.app.currentUser) return null;

    const userId = this.app.currentUser.id;
    try {
      return JSON.parse(localStorage.getItem(`progress_${userId}`));
    } catch (error) {
      console.error('Failed to load cached user progress:', error);
      return null;
    }
  }
}

// Initialize offline sync manager
window.OfflineSync = new OfflineSyncManager(window.app);
