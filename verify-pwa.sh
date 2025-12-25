#!/bin/bash
# verify-pwa.sh - Script para verificar la configuración PWA

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🔍 Verificador de Configuración PWA - Health           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
    else
        echo -e "${RED}❌${NC} $1 (NO ENCONTRADO)"
    fi
}

check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✅${NC} $1 contiene: $2"
    else
        echo -e "${RED}❌${NC} $1 NO contiene: $2"
    fi
}

echo "📋 Verificando archivos principales:"
echo ""
check_file "index.html"
check_file "manifest.json"
check_file "service-worker.js"
check_file ".htaccess"
check_file "browserconfig.xml"
check_file "package.json"
check_file "server.js"
echo ""

echo "🔗 Verificando configuración en index.html:"
echo ""
check_content "index.html" "manifest.json"
check_content "index.html" "service-worker"
check_content "index.html" "serviceWorker"
check_content "index.html" "viewport"
check_content "index.html" "theme-color"
echo ""

echo "📦 Verificando manifest.json:"
echo ""
check_content "manifest.json" '"name"'
check_content "manifest.json" '"start_url"'
check_content "manifest.json" '"display"'
check_content "manifest.json" '"icons"'
check_content "manifest.json" '"theme_color"'
echo ""

echo "⚙️ Verificando service-worker.js:"
echo ""
check_content "service-worker.js" "CACHE_NAME"
check_content "service-worker.js" "addEventListener"
check_content "service-worker.js" "caches.open"
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  ✅ CHECKLIST COMPLETADO                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📱 Próximos pasos:"
echo "  1. npm install && npm start"
echo "  2. Abre http://localhost:8000 en tu navegador"
echo "  3. F12 → Application → Manifest (verifica que sea válido)"
echo "  4. Despliega en: Vercel, GitHub Pages o Netlify"
echo "  5. En Android: Abre en Chrome → Instalar"
echo ""
echo "📚 Lee para más info:"
echo "  - QUICK_START.md (rápido)"
echo "  - DEPLOYMENT.md (despliegue)"
echo "  - README.md (guía completa)"
echo ""
