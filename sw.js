const CACHE_NAME = "eorb-marine-v24";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./icons/bg-ship.jpg",
  "./icons/intro-bg.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    // Cache each file on its own so one missing file (e.g. an icon) cannot
    // abort the whole install and leave the app un-installable/offline-broken.
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(APP_SHELL.map((url) => cache.add(url).catch(() => null)))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// HTML (navigation) requests use network-first, so a redeploy shows up the
// very next time the app is opened online instead of being masked by an
// old cached copy. Everything else same-origin (icons, manifest) stays
// cache-first for fast offline loads. Cross-origin (e.g. Google Fonts)
// stays network-first with cache fallback.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isNavigation = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");

  if (isSameOrigin && isNavigation) {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((cached) => cached || caches.match("./index.html")))
    );
  } else if (isSameOrigin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        }).catch(() => caches.match("./index.html"));
      })
    );
  } else {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
  }
});
