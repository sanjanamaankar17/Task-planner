self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('message', e => {
  const { title, body, tag } = e.data;
  self.registration.showNotification(title || 'Task Reminder', {
    body: body || '',
    tag: tag || 'task-notif',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📋</text></svg>',
    requireInteraction: true
  });
});
