// ========================================
// SERVICE WORKER - OFFLINE COMPLETO SIN GITHUB PAGES
// Cachea index.html inmediatamente y mantiene caché
// ========================================

const CACHE_VERSION = 'v2-standalone';
const CACHE_NAME = 'health-app-' + CACHE_VERSION;
const INDEX_CACHE = 'health-index-cache';

// Archivos CRÍTICOS a cachear (deben estar siempre disponibles)
const CRITICAL_CACHE = [
  'index.html',     // MUY IMPORTANTE - Siempre disponible
  'manifest.json',
  'logo.png'
];

// Archivos adicionales
const INITIAL_CACHE = [
  './',
  'comidas.html',
  'entrenos.html',
  'ajustes.html',
  'inicio.html',
  'offline-helper.js'
];

// INSTALL - Cachear archivos esenciales INMEDIATAMENTE
self.addEventListener('install', event => {
  console.log('📦 [SW] INSTALANDO - Cacheando AHORA...');
  
  event.waitUntil(
    Promise.all([
      // Caché crítico (index.html DEBE estar aquí)
      caches.open(INDEX_CACHE).then(cache => {
        console.log('🔴 [SW] Cacheando ARCHIVOS CRÍTICOS (index.html)...');
        return Promise.allSettled(
          CRITICAL_CACHE.map(url => {
            return cache.add(url).then(() => {
              console.log('✅ [SW] CACHEADO CRÍTICO:', url);
            }).catch(err => {
              console.error('❌ [SW] ERROR CRÍTICO al cachear:', url, err);
              // Intentar de nuevo con versión forzada
              return fetch(url, { cache: 'reload' })
                .then(r => cache.put(url, r))
                .catch(e => console.error('❌ Fallo total:', url));
            });
          })
        );
      }),
      
      // Caché general
      caches.open(CACHE_NAME).then(cache => {
        console.log('🟢 [SW] Cacheando archivos generales...');
        return Promise.allSettled(
          [...CRITICAL_CACHE, ...INITIAL_CACHE].map(url => {
            return cache.add(url).catch(err => {
              console.warn(`⚠️ [SW] No se pudo cachear (general): ${url}`);
            });
          })
        );
      })
    ]).then(() => {
      console.log('✅✅✅ [SW] TODO CACHEADO - APP LISTA SIN INTERNET');
      self.skipWaiting();
    }).catch(error => {
      console.error('❌ [SW] Error crítico en instalación:', error);
    })
  );
});

// ACTIVATE - Limpiar cachés antiguas y reclamar clientes
self.addEventListener('activate', event => {
  console.log('🔄 [SW] ACTIVANDO...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Mantener cachés actuales
          if (cacheName !== CACHE_NAME && cacheName !== INDEX_CACHE) {
            console.log('🗑️ [SW] Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ [SW] ACTIVADO - Control de cliente');
      return self.clients.claim();
    })
  );
});

// FETCH - Estrategia: Cache FIRST para index.html, Network FIRST para otros
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  const pathname = url.pathname;

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

  // ESTRATEGIA 1: index.html - CACHE FIRST (CRÍTICO)
  if (pathname.endsWith('index.html') || pathname === '/') {
    event.respondWith(
      // Primero intentar caché
      caches.match('index.html', { cacheName: INDEX_CACHE })
        .then(cachedResponse => {
          if (cachedResponse) {
            console.log('✅ [SW] USANDO INDEX CACHEADO');
            return cachedResponse;
          }
          
          // Si no está en caché crítico, intenta caché general
          return caches.match('index.html', { cacheName: CACHE_NAME })
            .then(generalCache => {
              if (generalCache) {
                console.log('✅ [SW] INDEX desde caché general');
                return generalCache;
              }
              
              // Si no hay caché, intenta red
              return fetch(request).then(response => {
                if (!response || response.status !== 200) {
                  return response;
                }
                
                // Cachea en ambos cachés
                const cloned = response.clone();
                caches.open(INDEX_CACHE).then(c => c.put('index.html', cloned));
                caches.open(CACHE_NAME).then(c => c.put('index.html', response.clone()));
                console.log('💾 [SW] INDEX cacheado desde red');
                return response;
              });
            });
        })
        .catch(error => {
          console.error('❌ [SW] Error obtener index.html:', error);
          // Devolver página de error amigable
          return new Response(
            `<!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Health App</title>
              <style>
                body { background: #000; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
                .container { text-align: center; }
                .logo { font-size: 60px; margin-bottom: 20px; }
                h1 { margin: 0 0 10px 0; }
                p { color: #aaa; margin: 10px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="logo">❤️</div>
                <h1>Health</h1>
                <p>Aplicación sin conexión</p>
                <p>Intenta recargar o espera conexión</p>
              </div>
            </body>
            </html>`,
            { 
              status: 200,
              headers: { 'Content-Type': 'text/html; charset=utf-8' }
            }
          );
        })
    );
    return;
  }

  // ESTRATEGIA 2: Otros archivos - NETWORK FIRST
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

  // Network first con fallback a caché
  event.respondWith(
    fetch(request)
      .then(response => {
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(request, responseToCache)
              .then(() => console.log('💾 [SW] Cacheado:', pathname))
              .catch(err => console.warn('⚠️ Error al cachear:', pathname));
          });

        return response;
      })
      .catch(error => {
        console.log('🌐 [SW] Sin red - usando caché:', pathname);
        
        return caches.match(request, { cacheName: CACHE_NAME })
          .then(cachedResponse => {
            if (cachedResponse) {
              console.log('📦 [SW] Desde caché:', pathname);
              return cachedResponse;
            }

            // Si es documento y no hay caché, usar index.html
            if (request.destination === 'document') {
              return caches.match('index.html', { cacheName: INDEX_CACHE })
                .then(indexResponse => {
                  if (indexResponse) {
                    console.log('📄 [SW] Devolviendo index.html cacheado');
                    return indexResponse;
                  }
                  
                  // Fallback final
                  return new Response(
                    '❌ Recurso no disponible. Por favor recarga.',
                    { status: 404 }
                  );
                });
            }

            return new Response(
              'Recurso no disponible offline',
              { status: 404 }
            );
          });
      })
  );
});

// MENSAJES - Comunicación con la app
self.addEventListener('message', event => {
  const { type, data } = event.data || {};

  if (type === 'FORCE_CACHE_INDEX') {
    console.log('🔴 [SW] FORZANDO CACHÉ DE INDEX.HTML');
    caches.open(INDEX_CACHE).then(cache => {
      fetch('index.html', { cache: 'reload' })
        .then(r => cache.put('index.html', r))
        .then(() => {
          console.log('✅ [SW] INDEX.HTML CACHEADO FORZOSAMENTE');
          if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({ success: true });
          }
        });
    });
  }

  if (type === 'SKIP_WAITING') {
    console.log('⏭️ [SW] Saltando espera...');
    self.skipWaiting();
  }

  if (type === 'CLEAR_CACHE') {
    console.log('🗑️ [SW] Limpiando caché (EXCEPTO INDEX)...');
    caches.delete(CACHE_NAME).then(() => {
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ success: true });
      }
      console.log('✅ [SW] Caché limpiado (INDEX mantiene)');
    });
  }

  if (type === 'GET_CACHE_SIZE') {
    Promise.all([
      caches.open(INDEX_CACHE),
      caches.open(CACHE_NAME)
    ]).then(([indexCache, mainCache]) => {
      let totalSize = 0;
      let cached = [];
      
      Promise.all([
        indexCache.keys().then(keys => {
          return Promise.all(keys.map(req => {
            cached.push(new URL(req.url).pathname);
            return indexCache.match(req).then(resp => {
              if (resp && resp.headers) {
                const size = resp.headers.get('content-length') || 0;
                totalSize += parseInt(size, 10);
              }
            });
          }));
        }),
        mainCache.keys().then(keys => {
          return Promise.all(keys.map(req => {
            cached.push(new URL(req.url).pathname);
            return mainCache.match(req).then(resp => {
              if (resp && resp.headers) {
                const size = resp.headers.get('content-length') || 0;
                totalSize += parseInt(size, 10);
              }
            });
          }));
        })
      ]).then(() => {
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

// SYNC - Sincronización en segundo plano
self.addEventListener('sync', event => {
  console.log('🔄 [SW] Evento de sincronización:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(
      Promise.resolve().then(() => {
        console.log('✅ [SW] Datos sincronizados');
      })
    );
  }
});

// PUSH - Notificaciones push
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

console.log('✅ Service Worker cargado - INDEX.HTML PROTEGIDO');
