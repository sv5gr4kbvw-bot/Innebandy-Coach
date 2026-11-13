// Innebandy Coach PRO 30.11 – uppdaterbar offline-app
const CACHE='innebandy-coach-v30-11';
const CORE=['./','./index.html','./manifest.webmanifest','./match.js','./firebase-config.js','./coach294.js','./coach294.js?v=301','./coach-data.js?v=301','./match.js?v=311','./coach30-tools.js','./coach30-animation.js','./coach30-halfpitch.js','./coach30-halfpitch.js?v=308','./coach30-mobile.css','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>(key.startsWith('innebandy-coach-')||key.startsWith('coach-pro-'))&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 if(request.mode==='navigate'){
  event.respondWith(fetch(request).then(response=>{
   if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put('./index.html',copy)));}
   return response;
  }).catch(async()=>await caches.match('./index.html')||Response.error()));
 }else{
  event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));}return response;}).catch(()=>caches.match(request)));
 }
});
