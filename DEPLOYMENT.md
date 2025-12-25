# 🚀 Guía de Despliegue - Salud Pro PWA

## 📋 Resumen de Cambios Realizados

Tu proyecto está completamente configurado como PWA (Progressive Web App) para Android. Se han realizado los siguientes cambios:

### ✅ Archivos Modificados:
- **index.html** - Añadidas meta tags de PWA, manifest link, y registro de service worker
- **manifest.json** - Actualizado con configuración optimizada para Android
- **service-worker.js** - Actualizado para cachear los archivos correctos

### ✅ Archivos Creados:
- **browserconfig.xml** - Configuración para Windows/Android tiles
- **.htaccess** - Configuración de servidor Apache
- **server.js** - Servidor Node.js/Express para desarrollo
- **package.json** - Dependencias de npm
- **README.md** - Guía completa de instalación

---

## 🌐 Opciones de Despliegue

### OPCIÓN 1: GitHub Pages (Gratis, Recomendado)

```bash
# 1. Crear repositorio en GitHub
git init
git add .
git commit -m "Initial PWA commit"
git remote add origin https://github.com/tu-usuario/salud-pro.git
git push -u origin main

# 2. En GitHub: Settings → Pages → Select "main" branch
# 3. Tu app estará en: https://tu-usuario.github.io/salud-pro
```

**Ventajas:**
- ✅ Gratis
- ✅ HTTPS automático
- ✅ Fácil de mantener
- ✅ Funciona perfectamente con PWA

---

### OPCIÓN 2: Vercel (Gratis, Muy Fácil)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Desplegar
vercel

# 3. Sigue el asistente interactivo
# 4. Tu app estará en un dominio automático (ej: salud-pro.vercel.app)
```

**Ventajas:**
- ✅ Deploy automático desde Git
- ✅ HTTPS automático
- ✅ Muy rápido
- ✅ Gratis para proyectos personales

---

### OPCIÓN 3: Netlify (Gratis)

```bash
# 1. Conectar con GitHub
# 2. Ir a netlify.com
# 3. Connect your Git repo
# 4. Seleccionar rama y desplegar
```

**Ventajas:**
- ✅ Deploy automático desde Git
- ✅ HTTPS automático
- ✅ Build automático
- ✅ Gratis

---

### OPCIÓN 4: Servidor Local (Para Testing)

#### Con Node.js (Recomendado):
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor
npm start

# 3. Abre en tu navegador
# http://localhost:8000
```

#### Sin Node.js:
```bash
# Python 3
python3 -m http.server 8000

# O con Python 2
python -m SimpleHTTPServer 8000

# O con npx (sin instalar)
npx http-server
```

---

### OPCIÓN 5: Hosting Pagado (Producción)

#### Hosts recomendados:
1. **Bluehost, GoDaddy, Hostinger** (~$3-5/mes)
2. **DigitalOcean** (~$5/mes) - VPS
3. **AWS EC2** (Tier gratis durante 1 año)
4. **Heroku** (gratis pero limitado)

**Pasos generales:**
1. Comprar hosting o VPS
2. Conectar por FTP/SSH
3. Subir archivos
4. Configurar .htaccess si usas Apache
5. Configurar HTTPS con Let's Encrypt

---

## 📱 Instalación en Android Desde Cualquier Sitio

Una vez que tu app esté online:

### Chrome:
1. Abre tu URL en Chrome
2. Espera el banner "Instalar"
3. O ve a menú (⋮) → "Instalar aplicación"
4. Confirma

### Samsung Internet:
1. Abre tu URL
2. Menú (⋮) → "Añadir página a"
3. "Pantalla de inicio"

### Edge:
1. Abre tu URL
2. Menú (⋮) → "Apps"
3. "Instalar esta aplicación"

---

## ✅ Checklist PWA

Tu aplicación cumple con:

- ✅ Manifest.json válido
- ✅ Service Worker registrado
- ✅ HTTPS-ready (necesario en producción)
- ✅ Responsive design
- ✅ Meta tags correctos
- ✅ Iconos configurados
- ✅ Pantalla de carga personalizada
- ✅ Funcionamiento offline
- ✅ Caché estratégico

---

## 🧪 Testing Local

### Verificar PWA en Chrome DevTools:

1. Abre tu app
2. Presiona F12 (DevTools)
3. Ve a "Application"
4. Verifica:
   - **Manifest**: Debe estar bien formado
   - **Service Worker**: Debe estar "activated and running"
   - **Cache Storage**: Debe ver tus archivos en caché

### Probar offline:
1. DevTools → Network
2. Marca "Offline"
3. Recarga la página
4. Debe funcionar normalmente

---

## 🔒 Configuración HTTPS (Importante)

Para producción, **HTTPS es obligatorio**:

### GitHub Pages:
- ✅ HTTPS automático

### Vercel:
- ✅ HTTPS automático

### Netlify:
- ✅ HTTPS automático

### Servidor propio:
```bash
# Con Let's Encrypt (GRATIS)
sudo apt-get install certbot python3-certbot-apache

# Para Apache
sudo certbot --apache -d tu-dominio.com

# Para Nginx
sudo certbot --nginx -d tu-dominio.com
```

---

## 📊 Monitorear Instalaciones

Una vez online, puedes saber cuántas personas han instalado:

```javascript
// Agregar este código en tu app para tracking
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA puede instalarse');
  // Guardar evento para mostrar botón personalizado
});

window.addEventListener('appinstalled', (e) => {
  console.log('PWA instalada');
  // Enviar analytics, etc.
});
```

---

## 🐛 Troubleshooting Comunes

### "No aparece botón de instalar"
- Verificar HTTPS en producción
- Esperar 30 segundos
- Limpiar caché del navegador
- Verificar manifest.json en DevTools

### "No funciona offline"
- DevTools → Application → Service Workers
- Debe estar "activated and running"
- Verificar cache storage
- Revisar console para errores

### "Se ve roto en Android"
- Verificar viewport meta tag
- Testar en Chrome DevTools device emulation
- Verificar estilos CSS
- Usar rem/em en lugar de px

---

## 📞 Soporte

Para dudas sobre PWA:
- [PWA Builder](https://www.pwabuilder.com/)
- [MDN PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google Web.dev](https://web.dev/progressive-web-apps/)

---

## 🎯 Próximos Pasos Recomendados

1. ✅ Elegir opción de despliegue (recomendado: Vercel o GitHub Pages)
2. ✅ Desplegar la app
3. ✅ Probar instalación en Android
4. ✅ Verificar funcionamiento offline
5. ✅ Agregar analytics/tracking (opcional)
6. ✅ Configurar notificaciones push (opcional)

¡Tu app está lista para usar en Android! 🚀
