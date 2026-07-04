self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};

  // Show the notification
  self.registration.showNotification(data.title || 'New message', {
    body: data.body,
    icon: '/logo.png', // use your manifest icons
    badge: '/logo.png',
    data: { url: data.url }, // used in the click handler
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data?.url ?? '/';
  event.waitUntil(clients.openWindow(target));
});
