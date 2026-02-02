// IndexedDB Wrapper for Offline Data Storage
// Provides simple API for storing and retrieving data offline

class OfflineDB {
  constructor() {
    this.dbName = 'AQE_DB';
    this.version = 1;
    this.db = null;
  }

  // Initialize database
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('[OfflineDB] Error opening database:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('[OfflineDB] Database opened successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        console.log('[OfflineDB] Upgrading database schema');

        // Create object stores
        if (!db.objectStoreNames.contains('lessons')) {
          const lessonsStore = db.createObjectStore('lessons', { keyPath: 'id' });
          lessonsStore.createIndex('subject', 'subject', { unique: false });
          lessonsStore.createIndex('gradeLevel', 'gradeLevel', { unique: false });
        }

        if (!db.objectStoreNames.contains('books')) {
          const booksStore = db.createObjectStore('books', { keyPath: 'id' });
          booksStore.createIndex('subject', 'subject', { unique: false });
          booksStore.createIndex('readingLevel', 'readingLevel', { unique: false });
        }

        if (!db.objectStoreNames.contains('userProgress')) {
          db.createObjectStore('userProgress', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('practiceAttempts')) {
          const attemptsStore = db.createObjectStore('practiceAttempts', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          attemptsStore.createIndex('studentId', 'studentId', { unique: false });
          attemptsStore.createIndex('synced', 'synced', { unique: false });
        }

        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
          syncStore.createIndex('status', 'status', { unique: false });
        }

        if (!db.objectStoreNames.contains('assignments')) {
          const assignmentsStore = db.createObjectStore('assignments', { keyPath: 'id' });
          assignmentsStore.createIndex('studentId', 'studentId', { unique: false });
          assignmentsStore.createIndex('dueDate', 'dueDate', { unique: false });
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  // Generic methods for all stores

  async add(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async put(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName, key) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, key) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Lesson-specific methods

  async saveLessons(lessons) {
    const promises = lessons.map(lesson => this.put('lessons', lesson));
    return Promise.all(promises);
  }

  async getLesson(lessonId) {
    return this.get('lessons', lessonId);
  }

  async getAllLessons() {
    return this.getAll('lessons');
  }

  async getLessonsBySubject(subject) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['lessons'], 'readonly');
      const store = transaction.objectStore('lessons');
      const index = store.index('subject');
      const request = index.getAll(subject);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Practice attempt methods

  async savePracticeAttempt(attempt) {
    attempt.timestamp = Date.now();
    attempt.synced = false;
    return this.add('practiceAttempts', attempt);
  }

  async getUnsyncedAttempts() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['practiceAttempts'], 'readonly');
      const store = transaction.objectStore('practiceAttempts');
      const index = store.index('synced');
      const request = index.getAll(false);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async markAttemptSynced(attemptId) {
    const attempt = await this.get('practiceAttempts', attemptId);
    if (attempt) {
      attempt.synced = true;
      return this.put('practiceAttempts', attempt);
    }
  }

  // Sync queue methods

  async addToSyncQueue(type, url, method, data) {
    const queueItem = {
      type,
      url,
      method,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
      timestamp: Date.now(),
      status: 'pending'
    };
    
    return this.add('syncQueue', queueItem);
  }

  async getSyncQueue() {
    return this.getAll('syncQueue');
  }

  async removeSyncItem(id) {
    return this.delete('syncQueue', id);
  }

  async clearSyncQueue() {
    return this.clear('syncQueue');
  }

  // Settings methods

  async saveSetting(key, value) {
    return this.put('settings', { key, value });
  }

  async getSetting(key) {
    const result = await this.get('settings', key);
    return result ? result.value : null;
  }

  // Assignment methods

  async saveAssignments(assignments) {
    const promises = assignments.map(assignment => this.put('assignments', assignment));
    return Promise.all(promises);
  }

  async getAssignments() {
    return this.getAll('assignments');
  }

  async getStudentAssignments(studentId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['assignments'], 'readonly');
      const store = transaction.objectStore('assignments');
      const index = store.index('studentId');
      const request = index.getAll(studentId);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // User progress methods

  async saveProgress(progress) {
    return this.put('userProgress', progress);
  }

  async getProgress() {
    return this.getAll('userProgress');
  }

  // Book methods

  async saveBooks(books) {
    const promises = books.map(book => this.put('books', book));
    return Promise.all(promises);
  }

  async getBook(bookId) {
    return this.get('books', bookId);
  }

  async getAllBooks() {
    return this.getAll('books');
  }

  // Export/Import for backups

  async exportData() {
    const stores = ['lessons', 'books', 'assignments', 'userProgress', 'settings'];
    const exportData = {};
    
    for (const storeName of stores) {
      exportData[storeName] = await this.getAll(storeName);
    }
    
    exportData.exportDate = new Date().toISOString();
    exportData.version = this.version;
    
    return exportData;
  }

  async importData(data) {
    if (data.version !== this.version) {
      console.warn('[OfflineDB] Import data version mismatch');
    }
    
    const stores = ['lessons', 'books', 'assignments', 'userProgress', 'settings'];
    
    for (const storeName of stores) {
      if (data[storeName] && Array.isArray(data[storeName])) {
        await this.clear(storeName);
        for (const item of data[storeName]) {
          await this.put(storeName, item);
        }
      }
    }
    
    console.log('[OfflineDB] Data imported successfully');
  }

  // Database info

  async getStorageInfo() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage,
        quota: estimate.quota,
        percentUsed: (estimate.usage / estimate.quota * 100).toFixed(2)
      };
    }
    return null;
  }
}

// Initialize global instance
window.offlineDB = new OfflineDB();

// Auto-initialize when script loads
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await window.offlineDB.init();
    console.log('[OfflineDB] Initialized successfully');
  } catch (error) {
    console.error('[OfflineDB] Initialization failed:', error);
  }
});

