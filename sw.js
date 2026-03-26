// ============================================================
//  LazScan AI — Service Worker
//  Cache-first PWA strategy with network fallback
// ============================================================

const CACHE_NAME = 'lazscan-v1.0.0';
const OFFLINE_URL = './index.html';

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png',
  './icons/icon-32.png',
  './favicon.ico'
];

// External CDN assets to cache on first use
const CDN_CACHE_NAME = 'lazscan-cdn-v1.0.0';

// ===== INSTALL =====
self.addEventListener('install', (event) => {
  console.log('[SW] Installing LazScan AI v1.0.0');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-caching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[SW] Pre-cache complete');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((err) => {
        console.warn('[SW] Pre-cache failed (some assets may be missing):', err);
        return self.skipWaiting();
      })
  );
});

// ===== ACTIVATE =====
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating LazScan AI');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== CDN_CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// ===== FETCH =====
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and non-http requests
  if (!url.protocol.startsWith('http')) return;

  // Skip NHTSA, Groq, and other API calls — always go to network
  const apiHosts = [
    'api.nhtsa.gov',
    'vpic.nhtsa.dot.gov',
    'api.groq.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com'
  ];
  if (apiHosts.some(host => url.hostname.includes(host))) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache Google Fonts for offline use
          if (url.hostname.includes('fonts')) {
            const responseClone = response.clone();
            caches.open(CDN_CACHE_NAME).then(cache => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // CDN assets (Chart.js, etc) — cache-first
  if (url.hostname.includes('cdn.jsdelivr.net') || url.hostname.includes('cdnjs.cloudflare.com')) {
    event.respondWith(
      caches.open(CDN_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch(e) {
          return new Response('// CDN resource unavailable offline', {
            headers: { 'Content-Type': 'application/javascript' }
          });
        }
      })
    );
    return;
  }

  // App shell — cache-first, network fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Refresh cache in background
        fetch(request).then(response => {
          if (response.ok) {
            caches.open(CACHE_NAME).then(cache => cache.put(request, response));
          }
        }).catch(() => {});
        return cached;
      }

      // Not in cache — fetch from network
      return fetch(request).then((response) => {
        if (!response.ok) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      }).catch(() => {
        // Offline fallback — return main app shell
        return caches.match(OFFLINE_URL);
      });
    })
  );
});

// ===== MESSAGE HANDLER =====
// Allows the app to trigger cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => event.source.postMessage({ type: 'CACHE_CLEARED' }));
  }
});
