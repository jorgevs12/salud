// server.js - Servidor Express para servir la PWA
// Para usar: npm install express
// Luego: node server.js

const express = require('express');
const path = require('path');
const compression = require('compression');
const app = express();

const PORT = process.env.PORT || 8000;

// Middleware
app.use(compression());
app.use(express.static(path.join(__dirname), {
  maxAge: '1y',
  etag: false,
  setHeaders: (res, path) => {
    // No cachear archivos críticos
    if (path.endsWith('index.html') || 
        path.endsWith('manifest.json') || 
        path.endsWith('service-worker.js')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
}));

// SPA - Redirigir todas las rutas a index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor PWA ejecutándose en http://localhost:${PORT}`);
  console.log(`📱 Abre en tu navegador: http://localhost:${PORT}`);
});
