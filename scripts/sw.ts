(self as ServiceWorkerGlobalContext)['exports'] = {} // Hack to fix TS exports error
import { ServiceWorkerEvent, ServiceWorkerGlobalContext } from "./types"
const FILE_VERSION = '?v201'
const CACHE_NAME = 'whatsapp-direct' + FILE_VERSION

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', (e: ServiceWorkerEvent) => {
    const filesToCache = [
        'index.html',
        'css/style.css',
        'scripts/build/sw-install.js',
        'scripts/build/index.js',
    ]
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(filesToCache.map(file => file + FILE_VERSION)))
        .then(() => (self as ServiceWorkerGlobalContext).skipWaiting())
    )
})

/* Serve cached content when offline */
self.addEventListener('fetch', (e: ServiceWorkerEvent) => {
    e.respondWith(
        caches.match(e.request)
        .then(response => response || fetch(e.request))
    )
})

self.addEventListener('activate', (e: ServiceWorkerEvent) => {
    const cacheKeeplist = [CACHE_NAME]
    e.waitUntil(
        caches.keys()
        .then(keyList => Promise.all(
            keyList.filter(key => cacheKeeplist.includes(key))
            .map(key => caches.delete(key))
        ))
        .then(() => (self as ServiceWorkerGlobalContext).clients.claim()) 
    )
})