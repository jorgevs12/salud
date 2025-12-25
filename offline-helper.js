/**
 * offline-helper.js
 * Utilidades para manejo de offline en PWA Health
 * Incluir este script en tu HTML: <script src="offline-helper.js"></script>
 */

class OfflineHelper {
  constructor() {
    this.isOnline = navigator.onLine;
    this.cacheReady = false;
    this.init();
  }

  // Inicializar listeners
  init() {
    // Eventos de conexión
    window.addEventListener('online', () => this.onOnline());
    window.addEventListener('offline', () => this.onOffline());

    // Verificar estado inicial
    this.checkConnection();
    console.log('📱 OfflineHelper inicializado');
  }

  // ============================================
  // EVENTOS DE CONEXIÓN
  // ============================================

  onOnline() {
    this.isOnline = true;
    console.log('✅ Conexión restaurada');
    this.showNotification('Conexión restaurada', 'Sincronizando datos...');
    this.syncData();
  }

  onOffline() {
    this.isOnline = false;
    console.log('❌ Sin conexión');
    this.showNotification('Modo offline', 'Trabajando sin conexión');
    this.updateUI();
  }

  // ============================================
  // VERIFICACIÓN DE CONEXIÓN
  // ============================================

  checkConnection() {
    if (navigator.onLine) {
      console.log('🌐 Online');
    } else {
      console.log('📴 Offline');
      this.updateUI();
    }
  }

  // ============================================
  // ACTUALIZAR UI
  // ============================================

  updateUI() {
    // Cambiar color de barra de estado
    document.documentElement.style.setProperty('--theme-color', '#ff9800');

    // Mostrar indicador offline
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.style.display = 'block';
    }

    // Deshabilitar botones que requieren conexión
    document.querySelectorAll('[data-requires-online]').forEach(btn => {
      btn.disabled = true;
      btn.style.opacity = '0.5';
    });
  }

  // ============================================
  // CACHÉ
  // ============================================

  async getCacheSize() {
    if (!('caches' in window)) return null;

    const cacheNames = await caches.keys();
    let totalSize = 0;

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();

      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }

    return {
      size: totalSize,
      sizeKB: (totalSize / 1024).toFixed(2),
      sizeMB: (totalSize / 1024 / 1024).toFixed(2)
    };
  }

  async clearCache() {
    if (!('caches' in window)) return false;

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('🗑️ Caché limpiado');
      return true;
    } catch (error) {
      console.error('❌ Error limpiando caché:', error);
      return false;
    }
  }

  async cacheUrls(urls) {
    if (!navigator.serviceWorker.controller) {
      console.warn('⚠️ Service Worker no disponible');
      return;
    }

    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_URLS',
      urls: urls
    });
  }

  // ============================================
  // SINCRONIZACIÓN
  // ============================================

  async syncData() {
    console.log('🔄 Sincronizando datos...');

    // Aquí va tu lógica de sincronización
    // Por ejemplo:
    // - Enviar datos pendientes
    // - Descargar datos nuevos
    // - Actualizar caché

    try {
      // Ejemplo: enviar datos al servidor
      const pendingData = localStorage.getItem('pending-data');
      if (pendingData) {
        const response = await fetch('/api/sync', {
          method: 'POST',
          body: pendingData
        });

        if (response.ok) {
          localStorage.removeItem('pending-data');
          console.log('✅ Sincronización completada');
          this.showNotification('Sincronización', 'Datos actualizados');
        }
      }
    } catch (error) {
      console.error('❌ Error en sincronización:', error);
    }
  }

  // ============================================
  // NOTIFICACIONES
  // ============================================

  showNotification(title, message) {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: 'logo.png',
        badge: 'logo.png'
      });
    }
  }

  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.warn('⚠️ Notificaciones no soportadas');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // ============================================
  // ALMACENAMIENTO LOCAL
  // ============================================

  saveOfflineData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log('💾 Datos guardados:', key);
      return true;
    } catch (error) {
      console.error('❌ Error guardando datos:', error);
      return false;
    }
  }

  getOfflineData(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Error leyendo datos:', error);
      return null;
    }
  }

  // ============================================
  // INDEXEDDB
  // ============================================

  async initIndexedDB() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject('IndexedDB no soportado');
        return;
      }

      const request = indexedDB.open('HealthAppDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('data')) {
          db.createObjectStore('data', { keyPath: 'id' });
        }
      };
    });
  }

  async saveToIndexedDB(data) {
    try {
      const db = await this.initIndexedDB();
      const transaction = db.transaction('data', 'readwrite');
      const store = transaction.objectStore('data');
      store.add(data);

      return new Promise((resolve) => {
        transaction.oncomplete = () => {
          console.log('💾 Guardado en IndexedDB:', data.id);
          resolve(true);
        };
      });
    } catch (error) {
      console.error('❌ Error en IndexedDB:', error);
      return false;
    }
  }

  // ============================================
  // DEBUG
  // ============================================

  async getDebugInfo() {
    const cacheSize = await this.getCacheSize();
    return {
      isOnline: this.isOnline,
      serviceWorkerReady: !!navigator.serviceWorker.controller,
      cacheSize: cacheSize,
      browserStorage: {
        localStorage: {
          available: !!window.localStorage,
          items: localStorage.length
        },
        indexedDB: {
          available: !!window.indexedDB
        }
      }
    };
  }

  printDebugInfo() {
    this.getDebugInfo().then(info => {
      console.table(info);
    });
  }
}

// Crear instancia global
window.offlineHelper = new OfflineHelper();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OfflineHelper;
}
