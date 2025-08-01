// Nama cache untuk versi service worker ini
const CACHE_NAME = 'absensi-pwa-cache-v1';

// Daftar file yang akan di-cache saat instalasi
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/absensi-icon-192.png',
  '/absensi-icon-512.png',
];

// Event listener 'install' untuk meng-cache file-file penting
self.addEventListener('install', (event) => {
  console.log('Service Worker: Event install dipicu.');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Meng-cache file-file statis.');
      return cache.addAll(urlsToCache);
    })
  );
});

// Event listener 'fetch' untuk melayani file dari cache atau jaringan
self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Event fetch untuk URL:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika respons ada di cache, kembalikan dari cache
      if (response) {
        console.log('Service Worker: Melayani dari cache:', event.request.url);
        return response;
      }
      
      // Jika tidak, ambil dari jaringan
      console.log('Service Worker: Mengambil dari jaringan:', event.request.url);
      return fetch(event.request);
    })
  );
});
