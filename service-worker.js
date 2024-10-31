// service-worker.js
const CACHE_NAME = "Baryte Loading-v1";
const CACHE_ASSETS = [
  "index.html",
  "manifest.json",
  "BarMask512.png",
  "icon192.png",
  "screenshot_Wide.png",
  "screenshot_Narrow.png",
];

// Install event - caching assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching all assets");
      return cache.addAll(CACHE_ASSETS);
    })
  );
});

// Activate event - cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Clearing old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event - serving cached assets or fetching from the network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          console.error("Fetching failed, offline mode");
        })
      );
    })
  );
});