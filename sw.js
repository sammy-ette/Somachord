importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

workbox.routing.setDefaultHandler(new workbox.strategies.StaleWhileRevalidate())

workbox.routing.registerRoute(({url}) => url.pathname.includes('somachord'), new workbox.strategies.NetworkFirst())

workbox.routing.registerRoute(({url}) => url.pathname.includes('getPlaylist.view')
  || url.pathname.includes('getStarred2.view')
  || url.pathname.includes('getSimilarSongs.view')
  || url.pathname.includes('getSimilarSongs2.view'), new workbox.strategies.NetworkFirst())

workbox.routing.registerRoute(({url}) => url.pathname.includes('search3.view')
  || url.pathname.includes('scrobble.view')
  || url.pathname.includes('star.view')
  || url.pathname.includes('unstar.view')
  || url.pathname.includes('getPlayQueue.view')
  || url.pathname.includes('updatePlaylist.view')
  || url.pathname.includes('createPlaylist.view')
  || url.pathname.includes('savePlayQueue.view'), new workbox.strategies.NetworkOnly())

workbox.routing.registerRoute(({url}) => url.pathname.includes('getCoverArt.view'), new workbox.strategies.CacheFirst())
workbox.routing.registerRoute(({url}) => url.pathname.includes('stream.view'), new workbox.strategies.CacheFirst({plugins: [new workbox.rangeRequests.RangeRequestsPlugin()]}))
