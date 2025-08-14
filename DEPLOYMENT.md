# Guía de Despliegue - Shalom API

## Problema de Fuentes en Servidor

Si las imágenes generadas muestran caracteres extraños o no se ve el texto correctamente en el servidor de producción, sigue estos pasos:

### Opción 1: Usar Docker (Recomendado)

```bash
# Construir y ejecutar con Docker Compose
docker-compose up -d
```

El Dockerfile incluye todas las fuentes necesarias automáticamente.

### Opción 2: Instalación Manual de Fuentes

#### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y fonts-liberation fonts-dejavu-core fontconfig
sudo fc-cache -f -v
```

#### CentOS/RHEL/Amazon Linux:
```bash
sudo yum install -y liberation-fonts dejavu-sans-fonts fontconfig
sudo fc-cache -f -v
```

#### Alpine Linux:
```bash
sudo apk add --no-cache fontconfig ttf-liberation ttf-dejavu
sudo fc-cache -f -v
```

### Opción 3: Script Automático

```bash
# Hacer ejecutable y correr el script
chmod +x install-fonts.sh
sudo ./install-fonts.sh
```

### Verificar Fuentes Instaladas

```bash
# Listar fuentes disponibles
fc-list | grep -i "liberation\|dejavu\|arial"

# Verificar configuración de fontconfig
fc-cache -v
```

### Variables de Entorno Importantes

```bash
export FONTCONFIG_PATH=/etc/fonts
export NODE_ENV=production
```

### Reiniciar Servicios

Después de instalar las fuentes:

```bash
# Reiniciar la aplicación
pm2 restart shalom-api
# o
sudo systemctl restart shalom-api
```

### Troubleshooting

1. **Verificar que las fuentes estén instaladas:**
   ```bash
   fc-list | wc -l  # Debe mostrar más de 0
   ```

2. **Verificar permisos de fontconfig:**
   ```bash
   ls -la /etc/fonts/
   ```

3. **Probar la API después de instalar fuentes:**
   ```bash
   curl -H "X-API-Key: tu-api-key" "http://tu-servidor:3000/api/image?q=test" -o test.png
   ```

### Notas Adicionales

- La aplicación usa `monospace` como fuente principal para máxima compatibilidad
- Los caracteres especiales se convierten automáticamente a ASCII
- El sistema de escape XML previene errores de renderizado