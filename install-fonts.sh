#!/bin/bash
# Script para instalar fuentes en el servidor de producción

# Para Ubuntu/Debian
if command -v apt-get &> /dev/null; then
    echo "Instalando fuentes en Ubuntu/Debian..."
    apt-get update
    apt-get install -y fonts-liberation fonts-dejavu-core fontconfig
    fc-cache -f -v
fi

# Para CentOS/RHEL/Amazon Linux
if command -v yum &> /dev/null; then
    echo "Instalando fuentes en CentOS/RHEL..."
    yum install -y liberation-fonts dejavu-sans-fonts fontconfig
    fc-cache -f -v
fi

# Para Alpine Linux (común en Docker)
if command -v apk &> /dev/null; then
    echo "Instalando fuentes en Alpine Linux..."
    apk add --no-cache fontconfig ttf-liberation ttf-dejavu
    fc-cache -f -v
fi

echo "Fuentes instaladas correctamente"
echo "Fuentes disponibles:"
fc-list | grep -i "liberation\|dejavu\|arial" | head -10