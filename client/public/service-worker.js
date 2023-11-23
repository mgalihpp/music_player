self.addEventListener("fetch", (event) => {
  const { pathname } = new URL(event.request.url);

  if (pathname.endsWith(".mp3")) {
    event.respondWith(handleAudioRequest(event.request));
  } else if (
    pathname.endsWith(".js") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg")
  ) {
    event.respondWith(handleStaticFileRequest(event.request));
  } else {
    event.respondWith(fetch(event.request));
  }
});

async function handleAudioRequest(request) {
  const cacheName = "audio-cache-v1";
  return handleCacheRequest(request, cacheName);
}

async function handleStaticFileRequest(request) {
  const cacheName = "static-cache-v1";
  return handleCacheRequest(request, cacheName);
}

async function handleCacheRequest(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error(`Error fetching ${request.url}:`, error);
    throw error;
  }
}
