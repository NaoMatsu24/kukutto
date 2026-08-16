const CACHE_NAME = "kukutto-offline-v13";
const APP_FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./images/character/penguin-celebrate-full.png",
  "./images/character/penguin-happy-face.png",
  "./images/character/penguin-sad-face.png",
  "./images/character/penguin-support-full.png",
  "./images/character/penguin-thinking-face.png",
  "./images/garden/blue-daisy.png",
  "./images/garden/bud.png",
  "./images/garden/leafy.png",
  "./images/garden/orange-marigold.png",
  "./images/garden/purple-pansy.png",
  "./images/garden/rare-moon-star.png",
  "./images/garden/rare-rainbow-flower.png",
  "./images/garden/red-tulip.png",
  "./images/garden/seed.png",
  "./images/garden/special-flower.png",
  "./images/garden/sprout.png",
  "./images/garden/sunflower.png",
  "./images/garden/two-leaves.png",
  "./images/garden/white-cosmos.png",
  "./images/icons/app-icon-192.png",
  "./images/icons/app-icon-512.png",
  "./images/icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)));
});

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith("kukutto-") && key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      const refreshed = fetch(request)
        .then(response => {
          if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
          return response;
        })
        .catch(() => cached);
      return cached || refreshed;
    })
  );
});
