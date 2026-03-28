// Écoute les événements push
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  const title = data.title || 'Nouveau message'
  const options = {
    body: data.body || 'Vous avez reçu un nouveau message',
    icon: '/logo.png',
    badge: '/logo.png',
    data: { url: data.url || '/admin/messages' },
    vibrate: [200, 100, 200]
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

// Clic sur la notification → ouvre l'URL
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data.url))
})
