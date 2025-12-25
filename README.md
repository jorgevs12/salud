# 📱 Instalación de Salud Pro en Android

## ✅ Requisitos
- Android 5.0 o superior
- Chrome, Edge, Samsung Internet u otro navegador que soporte PWA
- Conexión a internet (para la instalación inicial)

## 🚀 Pasos de Instalación en Android

### Opción 1: Chrome (Recomendado)
1. Abre Chrome en tu dispositivo Android
2. Navega a tu aplicación (ej: `http://tu-dominio.com`)
3. Espera a que aparezca el banner "Instalar" o presiona el menú (⋮)
4. Selecciona "Instalar aplicación" o "Añadir a la pantalla de inicio"
5. Confirma la instalación
6. La app aparecerá en tu pantalla de inicio como una aplicación nativa

### Opción 2: Samsung Internet
1. Abre Samsung Internet
2. Navega a tu aplicación
3. Presiona el menú (⋮) → "Añadir página a"
4. Selecciona "Pantalla de inicio"
5. Personaliza el nombre si lo deseas
6. Confirma

### Opción 3: Edge
1. Abre Microsoft Edge
2. Navega a tu aplicación
3. Presiona el menú (⋮) → "Apps"
4. Selecciona "Instalar esta aplicación"
5. Confirma

## 📋 Características PWA Habilitadas

✅ **Instalación en pantalla de inicio** - Acceso rápido como app nativa
✅ **Modo offline** - Funciona sin conexión a internet
✅ **Notificaciones push** - Recibe alertas importantes
✅ **Sincronización en segundo plano** - Los datos se sincronizan automáticamente
✅ **Pantalla de carga personalizada** - Experiencia profesional al abrir
✅ **Barra de estado personalizada** - Integración con Android

## 🔧 Configuración Técnica

### Archivos PWA Configurados:
- `manifest.json` - Metadatos de la app
- `service-worker.js` - Funcionamiento offline
- `browserconfig.xml` - Configuración para Windows/Android
- `index.html` - Meta tags para PWA

### Características del Manifest:
```json
{
  "name": "Salud Pro",
  "display": "standalone",        // Pantalla completa sin UI del navegador
  "start_url": "/index.html",     // Punto de inicio
  "scope": "/",                   // Rango de la app
  "background_color": "#000000",  // Color de pantalla de carga
  "theme_color": "#2196F3"        // Color de barra de estado
}
```

## 📊 Requisitos Técnicos para Instalación

Tu aplicación cumple con todos los requisitos:

✅ Tiene un `manifest.json` válido
✅ Está servida con HTTPS (recomendado para producción)
✅ Tiene un `service-worker.js` registrado
✅ Tiene meta tags para móviles
✅ Tiene iconos definidos
✅ Tiene `start_url` configurado
✅ Tiene `display: "standalone"`

## 🌐 Despliegue en Internet

Para que tu app sea accesible desde Android:

### Opción 1: Servidor Local (Solo red local)
```bash
python3 -m http.server 8000
# O con Node.js:
npx http-server
```

### Opción 2: GitHub Pages (Gratis)
1. Sube tu código a un repositorio en GitHub
2. Habilita GitHub Pages en las settings
3. Tu app estará en: `https://tu-usuario.github.io/tu-repo`

### Opción 3: Vercel (Recomendado, Gratis)
```bash
npm install -g vercel
vercel
```

### Opción 4: Netlify (Gratis)
1. Conecta tu repositorio GitHub
2. Netlify deployará automáticamente
3. Tu app tendrá un dominio automático

## 🔒 Seguridad

Para producción, asegúrate de:
- Usar HTTPS (certificado SSL/TLS)
- Configurar CORS adecuadamente
- Validar datos del usuario
- Usar credenciales seguras

## 📚 Troubleshooting

**La app no aparece en el menú de instalación:**
- Asegúrate de estar usando HTTPS (en producción)
- Verifica que `manifest.json` sea válido
- Comprueba que el `service-worker.js` está registrado
- Espera 30 segundos después de la primera visita

**No funciona sin conexión:**
- Verifica que el `service-worker.js` está activo
- Abre DevTools (F12) → Application → Service Workers
- Debe estar el estado "activated"

**No reconoce como PWA:**
- Abre Chrome DevTools
- Ve a Application → Manifest
- Busca errores en la consola

## 📞 Soporte

Para más información sobre PWA:
- [Google: Build Installable Apps with Web App Manifests](https://web.dev/install-criteria/)
- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [PWA Checklist](https://www.pwachecklist.com/)
