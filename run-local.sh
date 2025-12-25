#!/bin/bash

# ============================================
# PRUEBA LOCAL - SIN GITHUB PAGES
# ============================================

echo "🚀 Health App - Prueba Local"
echo "===================================="
echo ""

# Verificar que Python3 está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 no está instalado"
    exit 1
fi

# Cambiar al directorio
cd "$(dirname "$0")" || exit 1

echo "📁 Directorio: $(pwd)"
echo ""

# Validar archivos críticos
echo "✓ Validando archivos..."
for file in manifest.json service-worker.js index.html logo.png; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ Falta $file"
    fi
done
echo ""

# Validar JSON
echo "✓ Validando JSON..."
if python3 -m json.tool manifest.json > /dev/null 2>&1; then
    echo "  ✅ manifest.json válido"
else
    echo "  ❌ manifest.json inválido"
fi
echo ""

# Iniciar servidor
echo "🌐 Iniciando servidor HTTP..."
echo "===================================="
echo ""
echo "📱 Accede a la app en:"
echo ""
echo "  🖥️  http://localhost:8000"
echo ""
echo "===================================="
echo ""
echo "📋 Prueba de offline:"
echo "  1. Abre DevTools (F12)"
echo "  2. Network → marcar 'Offline'"
echo "  3. Recarga (F5)"
echo "  4. ¡Debe funcionar!"
echo ""
echo "❌ Para detener: Ctrl+C"
echo ""

# Iniciar servidor
python3 -m http.server 8000
