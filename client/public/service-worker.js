// Service Worker - service-worker.js

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.endsWith(".mp3")) {
    // Adjust this to your audio format
    event.respondWith(handleAudioRequest(event.request));
  } else {
    event.respondWith(fetch(event.request));
  }
});

self.addEventListener("fetch", function (event) {
  if (event.request.url.includes("/img/")) {
    event.respondWith(
      caches.match(event.request).then(function (response) {
        if (response) {
          return response; // Return the cached image if present in cache
        }
        // If not cached, fetch and cache the image
        return fetch(event.request).then(function (networkResponse) {
          caches.open("image-cache").then(function (cache) {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        });
      })
    );
  }
});

async function handleAudioRequest(request) {
  const cache = await caches.open("audio-cache-v1");
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const fetchResponse = await fetch(request);

  if (!fetchResponse.ok) {
    return fetchResponse;
  }

  const clonedResponse = fetchResponse.clone();
  const contentLength = parseInt(fetchResponse.headers.get("Content-Length"));

  if (contentLength) {
    // Stream and cache audio in chunks
    let offset = 0;
    const chunkSize = 1024 * 1024; // Adjust the chunk size as needed

    while (offset < contentLength) {
      const end = Math.min(offset + chunkSize, contentLength);
      const rangeRequest = request.clone();
      rangeRequest.headers.set("Range", `bytes=${offset}-${end}`);

      const rangeResponse = await fetch(rangeRequest);
      await cache.put(request, rangeResponse);
      offset = end + 1;
    }
  }

  return fetchResponse;
}
