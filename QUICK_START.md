# Configuración PWA - Salud Pro
# Última actualización: 2025-12-25

## ✅ Estado de la Configuración

### Archivos Configurados:
- ✅ index.html - Meta tags PWA + Service Worker
- ✅ manifest.json - Metadata de la app
- ✅ service-worker.js - Funcionamiento offline
- ✅ .htaccess - Servidor Apache
- ✅ browserconfig.xml - Windows/Android config
- ✅ package.json - Dependencias Node.js
- ✅ server.js - Servidor Express

## 🚀 Inicio Rápido

### Para Testing Local (Opción más fácil):

```bash
# Con npm (si tienes Node.js instalado)
npm install
npm start

# Sin npm (Python)
python3 -m http.server 8000

# Sin npm (npx)
npx http-server
```

Luego abre: http://localhost:8000

### Para Desplegar Online:

**Opción 1: GitHub Pages (Gratis)**
```bash
git add .
git commit -m "PWA configurada"
git push
# Habilita Pages en GitHub Settings
```

**Opción 2: Vercel (Recomendado, Gratis)**
```bash
npm install -g vercel
vercel
```

**Opción 3: Netlify (Gratis)**
Conecta tu repo en netlify.com

## 📱 Instalar en Android

Una vez online:

1. **Chrome**: Espera banner "Instalar"
2. **Samsung Internet**: Menú → "Añadir página a" → "Pantalla de inicio"
3. **Edge**: Menú → "Apps" → "Instalar"

## 🔍 Verificar Que Todo Funciona

### En Desktop:
1. F12 → Application
2. Verifica "Manifest": debe estar OK
3. Verifica "Service Worker": "activated and running"

### En Android:
1. Abre en Chrome
2. Presiona botón "Instalar"
3. Confirma
4. La app aparece en pantalla de inicio

## 📊 Características Habilitadas

✅ Instalación como app nativa
✅ Funciona offline
✅ Notificaciones push
✅ Sincronización en segundo plano
✅ Accesos directos (shortcuts)
✅ Compartir archivos
✅ Pantalla de carga personalizada
✅ Barra de estado personalizada

## 🎨 Colores Configurados

- **Tema**: Azul (#2196F3)
- **Fondo**: Negro (#000000)
- **Barra de estado**: Azul (#2196F3)

## 🔗 URLs Importantes

Una vez desplegada, accede desde:
- Local: http://localhost:8000
- GitHub Pages: https://tu-usuario.github.io/salud-pro
- Vercel: https://salud-pro.vercel.app (o tu dominio)

## ⚠️ Requisitos Importantes

1. **HTTPS en producción**: Obligatorio para PWA
   - GitHub Pages: ✅ Automático
   - Vercel: ✅ Automático
   - Netlify: ✅ Automático

2. **Navegadores soportados**:
   - Chrome 39+ ✅
   - Edge 79+ ✅
   - Samsung Internet 4+ ✅
   - Opera 26+ ✅
   - Android 5+ ✅

## 📞 Soporte Rápido

- Verificar console (F12) para errores
- Ver https://web.dev/install-criteria/ para debugging
- Limpiar caché si algo no funciona

¡Tu PWA está lista! 🚀
