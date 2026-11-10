/**
 * MOVY Central Service Worker — PWA v3.0.0
 * Regra: Cache apenas de estrutura visual estática (shell).
 * Todas as requisições de API, WebSocket, sessões e corridas são Network-Only.
 */

const CACHE_NAME = 'movy-central-shell-v3.0.0';

const STATIC_ASSETS = [
  '/',
  '/webfiles/css/variables.css',
  '/webfiles/css/default.css',
  '/webfiles/css/movy-central-v3.css',
  '/webfiles/img/logo/logo.png',
  '/webfiles/img/logo/logo-movy-transparent.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[MOVY SW] Pre-caching static assets non-blocking warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[MOVY SW] Removing legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Métodos não-GET (POST, PUT, DELETE) e chamadas de API ou WebSocket são sempre Network-Only
  if (
    request.method !== 'GET' ||
    url.pathname.includes('/api') ||
    url.hostname.includes('api.movymob.com') ||
    url.hostname.includes('socket.movymob.com') ||
    url.pathname.includes('socket.io') ||
    url.pathname.includes('/trip') ||
    url.pathname.includes('/customer') ||
    url.pathname.includes('/driver') ||
    url.pathname.includes('/login') ||
    url.pathname.includes('/logout')
  ) {
    return; // Pass through to network
  }

  // 2. Recursos estáticos locais (CSS, JS, imagens estáticas): Network-first com fallback para cache
  if (
    url.pathname.startsWith('/webfiles/css/') ||
    url.pathname.startsWith('/webfiles/img/')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 3. Documento HTML principal: Network-first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/'))
    );
  }
});
