/* Timestamp: ${new Date().getTime()} */
const FILES_TO_CACHE = [
  './',
  './index.html',
  './script.js',
  './offlineJS.js',
  './onlineFunctions.js', // New JavaScript module
  './service-worker.js'
  // './onlineJS.php' // Removed as PHP files are server-side and not typically cached for offline execution
];

const CACHE_NAME_PREFIX = 'offline-cache-modulingXserviceworker-';
// A more robust CACHE_VERSION could be a hash of file contents in a build step.
// For development, we'll rely on the service-worker.js file itself changing.
const CACHE_NAME = CACHE_NAME_PREFIX + 'v' + Math.random().toString(36).substring(7); // Use a random string for more reliable cache busting during dev

// Install Service Worker and cache files
self.addEventListener('install', event => {
  console.log('Service Worker installing...', CACHE_NAME);
  self.skipWaiting(); // Force the waiting service worker to become the active service worker.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache', CACHE_NAME);
        return cache.addAll(FILES_TO_CACHE);
      })
      .catch(error => {
        console.error('Cache failed during install:', error);
      })
  );
});

// Activate Service Worker and claim clients
self.addEventListener('activate', event => {
  console.log('Service Worker activating...', CACHE_NAME);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith(CACHE_NAME_PREFIX)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => clients.claim())
  );
  console.log('Service Worker activated');
});

// Fetch event: Network-first strategy
self.addEventListener('fetch', event => {
  // Bypass service worker for online-check.txt
  if (event.request.url.includes('/online-check.txt')) {
    return;
  }
  event.respondWith(async function() {
    // For offlineJS.js, try cache first when offline
    if (event.request.url.includes('offlineJS.js')) {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    // Try network first for all other requests
    try {
      const response = await fetch(event.request);
      // If the request is for a cached asset, update the cache with the new response
      if (event.request.method === 'GET' && FILES_TO_CACHE.includes(event.request.url.replace(self.location.origin, '.'))) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch (error) {
      // Network request failed, try cache
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // If not in cache, and it's a navigation request, return cached index.html
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
      throw error; // Re-throw if nothing can be served
    }
  }());
});
