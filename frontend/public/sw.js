self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for messages from the page to show a notification
self.addEventListener("message", async (event) => {
  const data = event.data || {};
  if (data && data.type === "SHOW_NOTIFICATION") {
    const { title, body, icon, url, tag } = data.payload || {};
    self.registration.showNotification(title || "Notification", {
      body: body || "",
      icon: icon || "/icon.png",
      badge: "/icons/icon-96x96.png",
      tag: tag || undefined,
      data: { url: url || "/" },
    });
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url =
    (event.notification &&
      event.notification.data &&
      event.notification.data.url) ||
    "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.postMessage({ type: "NAVIGATE_TO", payload: { url } });
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
