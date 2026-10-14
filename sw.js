// Service worker — device notifications for anniversaries and new content.
// periodicsync: Chrome/Edge (installed app) wake this up about once a day.
// push: ready for a server that sends Web Push messages { title, body, url }.
self.window = self;
importScripts("/data.js", "/notify.js");

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("periodicsync", (e) => {
  if (e.tag === "emmy-daily") e.waitUntil(self.notifyToday(self.registration));
});

self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || "EMMY · BLM48", {
    body: d.body || "", icon: "/images/icon-512.png", badge: "/images/icon-192.png", data: { url: d.url || "/notifications" },
  }));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "/notifications", self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
    const win = wins.find((w) => w.url.startsWith(self.location.origin));
    if (win) return win.navigate(url).then((w) => (w || win).focus());
    return self.clients.openWindow(url);
  }));
});
