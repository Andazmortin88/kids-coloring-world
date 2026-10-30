const PREFIX='kcw-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+'v4c-live-products';
const CORE=['./','index.html','style.css','app.js','coloring-engine.js','catalog.json','license-public.json','icon.svg','icon-192.png','icon-512.png','manifest.webmanifest'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);const r=await fetch('catalog.json',{cache:'reload'});if(!r.ok)throw Error('catalog');const catalog=await r.json();await cache.addAll([...CORE,...catalog.map(x=>x.svg)]);await cache.put('offline-ready',new Response('yes'));await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith(PREFIX)&&k!==CACHE)await caches.delete(k);await self.clients.claim();for(const client of await self.clients.matchAll())client.postMessage('OFFLINE_READY')})()));
self.addEventListener('message',event=>{if(event.data==='STATUS')event.waitUntil((async()=>{const cache=await caches.open(CACHE);event.source?.postMessage(await cache.match('offline-ready')?'OFFLINE_READY':'OFFLINE_FAILED')})())});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;event.respondWith((async()=>{const cache=await caches.open(CACHE);const hit=await cache.match(event.request);if(hit)return hit;try{return await fetch(event.request)}catch{if(event.request.mode==='navigate')return await cache.match('index.html');return new Response('Offline',{status:503})}})())});

