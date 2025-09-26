const CACHE_NAME = 'offline-cache-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './service-worker.js'
];

// Install Service Worker and cache files
self.addEventListener('install', event => {
  self.skipWaiting(); // Added to force activation
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(FILES_TO_CACHE);
      })
      .catch(error => {
        console.error('Cache failed:', error);
      })
  );
});

// Activate Service Worker and claim clients
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim()); // Added to claim clients
  console.log('Service Worker activated');
});

// Fetch event: Network-first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If the request is for a cached asset, update the cache with the new response
        if (event.request.method === 'GET' && FILES_TO_CACHE.includes(event.request.url.replace(self.location.origin, '.'))) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(event.request);
      })
  );
});
