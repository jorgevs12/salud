// ========================================
// SERVICE WORKER - SOPORTE OFFLINE Y PWA
// ========================================

const CACHE_NAME = 'health-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/comidas.html',
  '/entrenos.html',
  '/ajustes.html',
  '/inicio.html'
];

// INSTALL - Cachear archivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Cacheando archivos...');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// ACTIVATE - Limpiar cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Eliminando caché:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// FETCH - Estrategia de caché
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo cachear GET
  if (request.method !== 'GET') {
    return;
  }

  // Estrategia: Network first, fallback a caché
  event.respondWith(
    fetch(request)
      .then(response => {
        // No cachear errores
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Cachear respuesta exitosa
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // Si falla la red, usar caché
        return caches.match(request)
          .then(response => {
            if (response) {
              return response;
            }

            // Página offline
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// MENSAJES - Comunicación con clientes
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

// BACKGROUND SYNC - Sincronización de datos
self.addEventListener('sync', event => {
  if (event.tag === 'sync-health-data') {
    event.waitUntil(syncHealthData());
  }
  if (event.tag === 'sync-watch-data') {
    event.waitUntil(syncWatchData());
  }
});

async function syncHealthData() {
  console.log('🔄 Sincronizando datos de salud...');
  try {
    // Aquí irían las llamadas a sincronización
    // await fetch('/api/sync', { method: 'POST', body: localStorage.getItem('healthAppData') });
    console.log('✅ Datos sincronizados');
  } catch (error) {
    console.error('❌ Error en sincronización:', error);
    throw error; // Reintentar
  }
}

async function syncWatchData() {
  console.log('🔄 Sincronizando datos del reloj...');
  try {
    // Aquí irían las llamadas a Samsung Health API
    console.log('✅ Datos del reloj sincronizados');
  } catch (error) {
    console.error('❌ Error en sincronización del reloj:', error);
    throw error;
  }
}

// PUSH NOTIFICATIONS - Notificaciones push
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%232196F3" width="192" height="192"/><text x="96" y="120" font-size="100" text-anchor="middle" fill="white">❤️</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><circle cx="48" cy="48" r="45" fill="%232196F3"/></svg>',
    tag: 'health-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('Mi Salud', options)
  );
});

// NOTIFICATION CLICK
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/index.html');
      }
    })
  );
});

console.log('✅ Service Worker cargado');
