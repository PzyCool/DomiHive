const CACHE_NAME = 'domihive-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/CSS/style.css',
  '/CSS/book-inspection.css', 
  '/CSS/application.css',
  '/CSS/screening.css',
  '/CSS/payment.css',
  '/JAVASCRIPT/book-inspection.js',
  '/JAVASCRIPT/application.js', 
  '/JAVASCRIPT/screening.js',
  '/JAVASCRIPT/payment.js',
  '/Pages/rent.html',
  '/Pages/book-inspection.html',
  '/Pages/application.html',
  '/Pages/screening.html',
  '/Pages/payment.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache files
self.addEventListener('install', event => {
  console.log('Service Worker installed');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve cached files when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activated');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});