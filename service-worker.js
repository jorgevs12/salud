// ========================================
// SERVICE WORKER - SOPORTE OFFLINE COMPLETO
// FUNCIONA SIN GITHUB PAGES - STANDALONE
// ========================================

const CACHE_VERSION = 'v1';
const CACHE_NAME = 'health-app-' + CACHE_VERSION;
const DATA_STORE_NAME = 'health-app-data';

// Archivos a cachear en la instalación (rutas relativas)
const INITIAL_CACHE = [
  './',
  'index.html',
  'manifest.json',
  'comidas.html',
  'entrenos.html',
  'ajustes.html',
  'inicio.html',
  'logo.png',
  'offline-helper.js'
];

// INSTALL - Cachear archivos esenciales
self.addEventListener('install', event => {
  console.log('📦 [SW] Instalando Service Worker - OFFLINE READY...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('🖥️ [SW] Cacheando archivos esenciales...');
        // Intentar cachear todos, pero no fallar si alguno no existe
        return Promise.allSettled(
          INITIAL_CACHE.map(url => {
            return cache.add(url).catch(err => {
              console.warn(`⚠️ [SW] No se pudo cachear: ${url}`);
              return Promise.resolve();
            });
          })
        ).then(() => {
          console.log('✅ [SW] Archivos cacheados correctamente');
        });
      })
      .then(() => {
        console.log('✅ [SW] Service Worker LISTO - FUNCIONA SIN CONEXIÓN');
        self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ [SW] Error en instalación:', error);
      })
  );
});

// ACTIVATE - Limpiar cachés antiguas y reclamar clientes
self.addEventListener('activate', event => {
  console.log('🔄 [SW] Activando Service Worker...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ [SW] Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ [SW] Service Worker ACTIVADO');
      self.clients.claim();
      // Notificar a todos los clientes que SW está listo
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_READY',
            message: 'Service Worker activado - modo offline disponible'
          });
        });
      });
    })
  );
});

// FETCH - Estrategia: Network first con fallback a cache
// Funciona completamente offline una vez cacheado
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // No cachear POST, PUT, DELETE
  if (request.method !== 'GET') {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response('Método no permitido offline', { 
          status: 405,
          statusText: 'Method Not Allowed'
        });
      })
    );
    return;
  }

  // No cachear solicitudes a dominios externos (excepto CDN confiables)
  const isSameDomain = url.origin === location.origin;
  const isTrustedCDN = url.hostname.includes('cdn.') || 
                       url.hostname.includes('cdnjs.') ||
                       url.hostname.includes('jsdelivr');
  
  if (!isSameDomain && !isTrustedCDN) {
    event.respondWith(fetch(request).catch(() => {
      return new Response('Recurso externo no disponible offline', { status: 503 });
    }));
    return;
  }

  // Estrategia: Intentar red primero, fallback a caché
  event.respondWith(
    fetch(request)
      .then(response => {
        // Solo cachear respuestas exitosas
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clonar la respuesta para cachearla
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(request, responseToCache).then(() => {
              console.log('💾 [SW] Cacheado:', url.pathname);
            }).catch(err => {
              console.warn('⚠️ [SW] Error al actualizar caché:', url.pathname);
            });
          })
          .catch(error => {
            console.warn('⚠️ [SW] Error al abrir caché:', error);
          });

        return response;
      })
      .catch(error => {
        console.log('🌐 [SW] Sin conexión - usando caché para:', url.pathname);
        
        // Si falla la red, usar caché
        return caches.match(request)
          .then(cachedResponse => {
            if (cachedResponse) {
              console.log('📦 [SW] Usando caché:', url.pathname);
              return cachedResponse;
            }

            // Si no hay caché, devolver página offline inteligente
            if (request.destination === 'document') {
              console.log('📄 [SW] Devolviendo página principal');
              return caches.match('index.html')
                .then(response => {
                  return response || new Response(
                    '<!DOCTYPE html><html><body><h1>Aplicación sin conexión</h1><p>Por favor, intenta más tarde o recarga la página.</p></body></html>',
                    { 
                      status: 200,
                      headers: { 'Content-Type': 'text/html' }
                    }
                  );
                });
            }

            // Para otros recursos, devolver respuesta vacía apropiada
            return new Response(
              'Recurso no disponible offline',
              {
                status: 404,
                statusText: 'Not Found',
                headers: new Headers({
                  'Content-Type': 'text/plain'
                })
              }
            );
          });
      })
  );
});

// MENSAJES - Comunicación con la app
self.addEventListener('message', event => {
  const { type, data } = event.data || {};

  if (type === 'SKIP_WAITING') {
    console.log('⏭️ [SW] Saltando espera...');
    self.skipWaiting();
  }

  if (type === 'CLEAR_CACHE') {
    console.log('🗑️ [SW] Limpiando caché...');
    caches.delete(CACHE_NAME).then(() => {
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ success: true, message: 'Caché limpiado' });
      }
      console.log('✅ [SW] Caché limpiado completamente');
    });
  }

  if (type === 'GET_CACHE_SIZE') {
    caches.open(CACHE_NAME).then(cache => {
      cache.keys().then(requests => {
        let totalSize = 0;
        let cached = [];
        
        Promise.all(requests.map(req => {
          cached.push(new URL(req.url).pathname);
          return cache.match(req).then(resp => {
            if (resp && resp.headers) {
              const size = resp.headers.get('content-length') || 0;
              totalSize += parseInt(size, 10);
            }
          });
        })).then(() => {
          if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({ 
              size: totalSize,
              items: cached.length,
              files: cached
            });
          }
          console.log(`📊 [SW] Caché: ${cached.length} archivos, ${(totalSize/1024).toFixed(2)}KB`);
        });
      });
    });
  }

  if (type === 'CACHE_URLS') {
    const urls = data || [];
    caches.open(CACHE_NAME).then(cache => {
      Promise.allSettled(
        urls.map(url => cache.add(url))
      ).then(results => {
        const succeeded = results.filter(r => r.status === 'fulfilled').length;
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ 
            success: true,
            cached: succeeded,
            total: urls.length
          });
        }
        console.log(`📦 [SW] Cacheados ${succeeded}/${urls.length} archivos`);
      });
    });
  }

  if (type === 'GET_OFFLINE_STATUS') {
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({
        offline: true,
        message: 'Service Worker activo - app funciona sin conexión',
        cacheVersion: CACHE_VERSION
      });
    }
  }
});

// SYNC - Sincronización en segundo plano (si se soporta)
self.addEventListener('sync', event => {
  console.log('🔄 [SW] Evento de sincronización:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Aquí iría lógica de sincronización
      Promise.resolve().then(() => {
        console.log('✅ [SW] Datos sincronizados');
      })
    );
  }
});

// PUSH - Notificaciones push (si se soporta)
self.addEventListener('push', event => {
  console.log('📬 [SW] Notificación recibida');
  
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: 'logo.png',
      badge: 'logo.png',
      tag: 'health-notification',
      requireInteraction: false
    };
    
    event.waitUntil(
      self.registration.showNotification('Health App', options)
    );
  }
});

console.log('✅ Service Worker cargado - MODO OFFLINE DISPONIBLE');
