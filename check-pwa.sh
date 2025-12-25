#!/bin/bash

echo "✅ Verificando archivos PWA..."
echo ""

# Verificar que existen los archivos
echo "📋 Archivos existentes:"
[ -f "manifest.json" ] && echo "✅ manifest.json" || echo "❌ manifest.json NO EXISTE"
[ -f "service-worker.js" ] && echo "✅ service-worker.js" || echo "❌ service-worker.js NO EXISTE"
[ -f "index.html" ] && echo "✅ index.html" || echo "❌ index.html NO EXISTE"
[ -f ".nojekyll" ] && echo "✅ .nojekyll" || echo "❌ .nojekyll NO EXISTE"
[ -f "_config.yml" ] && echo "✅ _config.yml" || echo "❌ _config.yml NO EXISTE"
echo ""

# Verificar JSON válido
echo "🔍 Validando JSON..."
if python3 -m json.tool manifest.json > /dev/null 2>&1; then
    echo "✅ manifest.json es JSON válido"
else
    echo "❌ manifest.json tiene errores de JSON"
fi
echo ""

# Verificar contenido del manifest
echo "📦 Contenido del manifest.json:"
grep -o '"name"[^,]*' manifest.json | head -1
grep -o '"start_url"[^,]*' manifest.json | head -1
grep -o '"display"[^,]*' manifest.json | head -1
grep -o '"scope"[^,]*' manifest.json | head -1
echo ""

# Verificar que el link manifest existe en index.html
echo "🔗 Verificando link manifest en index.html:"
if grep -q 'link rel="manifest"' index.html; then
    echo "✅ Link manifest encontrado"
    grep 'link rel="manifest"' index.html | head -1
else
    echo "❌ Link manifest NO encontrado"
fi
echo ""

# Verificar que service-worker se registra
echo "⚙️ Verificando registro de Service Worker:"
if grep -q 'navigator.serviceWorker.register' index.html; then
    echo "✅ Service Worker se registra en index.html"
else
    echo "❌ Service Worker NO se registra"
fi
echo ""

# Verificar rutas relativas
echo "🔀 Verificando rutas relativas:"
echo "manifest.json:"
grep '"start_url"\|"scope"' manifest.json | head -2
echo ""
echo "service-worker.js:"
grep 'urlsToCache = ' service-worker.js -A 5 | head -8
echo ""

echo "✅ Verificación completa"
echo ""
echo "Próximos pasos:"
echo "1. git add ."
echo "2. git commit -m 'PWA lista para Samsung Internet'"
echo "3. git push"
echo "4. Espera 2-5 minutos"
echo "5. En Samsung Internet: limpia caché y abre tu URL"
echo "6. Abre: tu-url/pwa-test.html para verificar"
