const TILE_CACHE_NAME = 'holamap-tiles-v4';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== TILE_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Intercept map tile requests for offline fast loading
  if (
    url.includes('google.com/vt') ||
    url.includes('mt0.google.com') ||
    url.includes('mt1.google.com') ||
    url.includes('mt2.google.com') ||
    url.includes('mt3.google.com') ||
    url.includes('tile.openstreetmap') ||
    url.includes('tile.openstreetmap.fr')
  ) {
    event.respondWith(
      caches.open(TILE_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          // Public tile CDNs return Access-Control-Allow-Origin: *
          // which browsers block if credentials mode is 'include'.
          // Must explicitly omit credentials so CORS allows wildcard.
          const tileReq = new Request(event.request.url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'omit',
          });

          const networkResponse = await fetch(tileReq);
          if (networkResponse && networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          // Fallback directly to native fetch without 408 timeout
          return fetch(event.request);
        }
      })
    );
  }
});
