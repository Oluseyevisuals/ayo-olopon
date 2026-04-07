// Ayo Olopon — Service Worker
const CACHE = 'ayo-v6';
const LOCAL_ASSETS = [
  './',
  './index.html',
  './game.css',
  './game.js',
  './sound.js',
  './manifest.json',
  './icon.svg',
  './meta-melody.mp4',
  './bg_village.png',
  './bg_palace.png',
  './bg_throne.png',
];

// Install: cache all local assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(LOCAL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: remove old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch: cache-first for local, network-only for external (fonts)
self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith(self.location.origin)) {
    // External (Google Fonts etc.) — network only, fail silently
    e.respondWith(fetch(e.request).catch(() => new Response('', { status: 408 })));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
