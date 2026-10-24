/* Service worker PBB TKE Barajas: solo notificaciones push (no guarda caché, para no frenar las actualizaciones) */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: "PBB TKE", body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "PBB TKE Barajas", {
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
