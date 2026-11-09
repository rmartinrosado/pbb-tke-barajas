/* Service worker PBB TKE Maintenance
   v394: caché para arrancar rápido SIN mostrar nunca una versión antigua:
   · index.html (navegación), version.json y sw.js → SIEMPRE de la red (no-store); la copia guardada solo se usa sin cobertura.
   · Scripts con ?v=NNN y librerías del CDN con versión en la URL → caché primero (son inmutables: cada versión nueva cambia la URL).
     Al guardar un ?v= nuevo se borran las copias anteriores de ese mismo archivo.
   · Imágenes/iconos → caché y refresco en segundo plano. Supabase (API, storage, funciones) no pasa por aquí.
   Además: notificaciones push. */
const C="pbb-tke-v394";
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil((async()=>{const ks=await caches.keys();await Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)));await self.clients.claim()})()));
const CDN=/^(cdn\.jsdelivr\.net|unpkg\.com)$/;
self.addEventListener("fetch", e => {
  const q=e.request;if(q.method!=="GET")return;let u;try{u=new URL(q.url)}catch(x){return}
  const mismo=u.origin===self.location.origin;
  if(!mismo&&!CDN.test(u.hostname))return;
  const f=u.pathname.split("/").pop();
  if(q.mode==="navigate"||(mismo&&(f===""||f==="index.html"))){
    e.respondWith((async()=>{const c=await caches.open(C);
      const vj=fetch("version.json?t="+Date.now(),{cache:"no-store"}).then(r=>r.ok?r.text():null).catch(()=>null);
      try{const r=await fetch(q.url,{cache:"no-store",credentials:"same-origin"});
        /* versión nueva publicada → se vacía la caché de scripts (por si algún archivo cambió sin cambiar su ?v=) */
        try{const v=await vj;if(v){const a=await c.match("./__ver");const va=a?await a.text():"";if(va!==v){const ks=await c.keys();await Promise.all(ks.map(k=>c.delete(k)));await c.put("./__ver",new Response(v))}}}catch(x){}
        if(r&&r.ok&&r.type!=="opaqueredirect")c.put("./index.html",r.clone());return r}
      catch(x){const m=await c.match("./index.html");return m||Response.error()}})());return}
  if(mismo&&(f==="version.json"||f==="sw.js"))return;
  const verU=mismo?/[?&]v=\d/.test(u.search):/@\d/.test(u.pathname);
  if(verU){
    e.respondWith((async()=>{const c=await caches.open(C);const m=await c.match(q);if(m)return m;
      const r=await fetch(q);if(r&&(r.ok||r.type==="opaque")){const cp=r.clone();
        e.waitUntil((async()=>{if(mismo){const ks=await c.keys();await Promise.all(ks.filter(k=>{try{const v=new URL(k.url);return v.pathname===u.pathname&&v.search!==u.search}catch(x){return false}}).map(k=>c.delete(k)))}await c.put(q,cp)})())}
      return r})());return}
  if(mismo&&/\.(png|jpe?g|webp|svg|ico|webmanifest)$/i.test(f)){
    e.respondWith((async()=>{const c=await caches.open(C);const m=await c.match(q);
      const red=fetch(q).then(r=>{if(r&&r.ok)c.put(q,r.clone());return r}).catch(()=>null);
      if(m){e.waitUntil(red);return m}const r=await red;return r||Response.error()})());return}
});
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: "PBB TKE", body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "PBB TKE Maintenance", {
    body: d.body || "",
    tag: d.tag || "pbb",
    renotify: true,
    requireInteraction: true,
    vibrate: [600, 250, 600, 250, 600],
    icon: "icon-192.png",
    badge: "icon-192.png",
    data: { id: d.id || "" }
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(l => {
    for (const c of l) { if ("focus" in c) return c.focus(); }
    return self.clients.openWindow("./");
  }));
});
