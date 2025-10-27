// AQE Platform Service Worker
// Provides offline functionality, caching, and background sync

const CACHE_VERSION = 'aqe-v2-updated';
const CACHE_NAME = `aqe-cache-${CACHE_VERSION}`;
const DATA_CACHE_NAME = `aqe-data-${CACHE_VERSION}`;

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/resources/styles/main.css',
  '/resources/styles/dark-mode.css',
  '/resources/scripts/main.js',
  '/resources/scripts/auth.js',
  '/resources/scripts/translations.js',
  '/resources/scripts/lessons.js',
  '/resources/scripts/library.js',
  '/resources/scripts/student.js',
  '/resources/scripts/teacher.js',
  '/resources/scripts/parent.js',
  '/resources/scripts/admin.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// API endpoints to cache with network-first strategy
const API_ENDPOINTS = [
  '/api/auth/demo-accounts',
  '/api/student/',
  '/api/teacher/',
  '/api/parent/',
  '/api/statistics/'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Precaching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
              console.log('[ServiceWorker] Removing old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Handle app shell and assets with cache-first strategy
  event.respondWith(cacheFirstStrategy(request));
});

// Cache-first strategy (for static assets)
async function cacheFirstStrategy(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[ServiceWorker] Serving from cache:', request.url);
      return cachedResponse;
    }

    console.log('[ServiceWorker] Fetching from network:', request.url);
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[ServiceWorker] Fetch failed:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/index.html');
    }
    
    // Return a fallback response
    return new Response('Offline - content not available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
  }
}

// Network-first strategy (for API requests)
async function networkFirstStrategy(request) {
  try {
    console.log('[ServiceWorker] Network first for:', request.url);
    const networkResponse = await fetch(request);
    
    // Cache successful API responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(DATA_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[ServiceWorker] Network request failed, trying cache:', error);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[ServiceWorker] Serving API from cache:', request.url);
      return cachedResponse;
    }
    
    // Return error response
    return new Response(JSON.stringify({
      error: 'Offline - no cached data available',
      offline: true
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }
}

// Background sync event - sync offline actions when online
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag);
  
  if (event.tag === 'aqe-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data to server
async function syncOfflineData() {
  try {
    console.log('[ServiceWorker] Syncing offline data...');
    
    // Get sync queue from IndexedDB
    const db = await openIndexedDB();
    const queue = await getFromDB(db, 'syncQueue');
    
    if (!queue || queue.length === 0) {
      console.log('[ServiceWorker] No data to sync');
      return;
    }
    
    // Process each queued item
    for (const item of queue) {
      try {
        const response = await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.body
        });
        
        if (response.ok) {
          // Remove from queue on success
          await removeFromDB(db, 'syncQueue', item.id);
          console.log('[ServiceWorker] Synced:', item.url);
        }
      } catch (error) {
        console.error('[ServiceWorker] Sync failed for:', item.url, error);
        // Keep in queue for next sync attempt
      }
    }
    
    // Notify clients that sync is complete
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        itemsSynced: queue.length
      });
    });
  } catch (error) {
    console.error('[ServiceWorker] Sync error:', error);
  }
}

// IndexedDB helper functions
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AQE_DB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('lessons')) {
        db.createObjectStore('lessons', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('userProgress')) {
        db.createObjectStore('userProgress', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function getFromDB(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function removeFromDB(db, storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Push notification event (for future use)
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received:', event);
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'AQE Platform';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: data
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification click:', event);
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Message event - handle messages from clients
self.addEventListener('message', (event) => {
  console.log('[ServiceWorker] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_LESSONS') {
    event.waitUntil(cacheLessons(event.data.lessons));
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearAllCaches());
  }
});

// Cache lessons for offline access
async function cacheLessons(lessons) {
  try {
    const cache = await caches.open(DATA_CACHE_NAME);
    const db = await openIndexedDB();
    
    for (const lesson of lessons) {
      // Cache lesson data in IndexedDB
      const transaction = db.transaction(['lessons'], 'readwrite');
      const store = transaction.objectStore('lessons');
      store.put(lesson);
      
      // Cache any media assets
      if (lesson.media && Array.isArray(lesson.media)) {
        for (const mediaUrl of lesson.media) {
          try {
            const response = await fetch(mediaUrl);
            if (response.ok) {
              cache.put(mediaUrl, response);
            }
          } catch (error) {
            console.error('[ServiceWorker] Failed to cache media:', mediaUrl, error);
          }
        }
      }
    }
    
    console.log('[ServiceWorker] Cached lessons:', lessons.length);
  } catch (error) {
    console.error('[ServiceWorker] Failed to cache lessons:', error);
  }
}

// Clear all caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map((cacheName) => caches.delete(cacheName))
    );
    console.log('[ServiceWorker] All caches cleared');
  } catch (error) {
    console.error('[ServiceWorker] Failed to clear caches:', error);
  }
}

console.log('[ServiceWorker] Service Worker loaded');

