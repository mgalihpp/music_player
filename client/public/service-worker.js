self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (
    (url.pathname.endsWith(".mp3") || url.pathname.endsWith(".js")) &&
    !url.origin.startsWith("chrome-extension://")
  ) {
    event.respondWith(handleAudioOrJSRequest(event.request));
  } else {
    event.respondWith(fetch(event.request));
  }
});

async function handleAudioOrJSRequest(request) {
  if (request.url.startsWith("chrome-extension://")) {
    return fetch(request); // Skip caching extension resources
  }

  const cacheName = request.url.endsWith(".mp3")
    ? "audio-cache-v1"
    : "js-cache-v1";
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const fetchResponse = await fetch(request);

  if (!fetchResponse.ok) {
    return fetchResponse;
  }

  await cache.put(request, fetchResponse.clone());
  return fetchResponse;
}
