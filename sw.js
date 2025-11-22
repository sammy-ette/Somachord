const putInCache = async (request, response) => {
	const cache = await caches.open("v1")
	await cache.put(request, response)
}

async function networkThenCache(event) {
	try {
		const responseFromNetwork = await fetch(event.request)
		event.waitUntil(putInCache(event.request, responseFromNetwork.clone()))
		return responseFromNetwork
	} catch(e) {
		const responseFromCache = await caches.match(event.request)
		if (responseFromCache) {
			return responseFromCache
		}

		return new Response("Offline...", {
			status: 408,
			headers: { "Content-Type": "text/plain" },
		})
	}
}

async function cacheFirst(event) {
	const responseFromCache = await caches.match(event.request)
	if (responseFromCache) {
		return responseFromCache
	}

	try {
		const responseFromNetwork = await fetch(event.request)
		event.waitUntil(putInCache(event.request, responseFromNetwork.clone()))
		return responseFromNetwork
	} catch (error) {
		return new Response("Offline...", {
			status: 408,
			headers: { "Content-Type": "text/plain" },
		})
	}
}

self.addEventListener("fetch", (event) => {
	const url = new URL(event.request.url)
	if (url.protocol === 'chrome-extension:') {
		return
	}

	const cacheFirstList = ["/rest/getCoverArt.view"]
	const isCacheFirst = cacheFirstList.some(path => event.request.url.includes(path))

	const networkOnly = ["/rest/scrobble.view", "/rest/stream.view"]
	const isNetworkOnly = networkOnly.some(path => event.request.url.includes(path))

	if(isNetworkOnly) {
		return
	}

	if(isCacheFirst) {
		event.respondWith(
			cacheFirst({
				request: event.request,
				event,
			}),
		)
	} else {
		event.respondWith(networkThenCache(event))
	}
})
