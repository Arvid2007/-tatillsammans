const CACHE_NAME = 'ate-tillsammans-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/activities.html',
  '/profile.html',
  '/styles.css',
  '/logo.png',
  '/profile.png',
  '/ide.png',
  '/malgrupp.png',
  '/logowebb.png',
  '/hero.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request)));
});
