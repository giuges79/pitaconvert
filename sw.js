const CACHE_NAME = 'pitaconvert-v3'; // Cambiato a v2 per forzare l'aggiornamento
const ASSETS = [
  'index.html',
  'manifest.json',
  'einstein192.png',
  'einstein512.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Fredoka+One&family=Quicksand:wght@500;700&display=swap'
];

// Installazione e attivazione immediata
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Forza il Service Worker ad attivarsi subito
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Pulizia cache vecchie e controllo client
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // Prende il controllo delle pagine aperte immediatamente
      caches.keys().then((keys) => {
        return Promise.all(
          keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        );
      })
    ])
  );
});

// Strategia Network-First per forzare gli aggiornamenti se online
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});