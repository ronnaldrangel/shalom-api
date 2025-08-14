# Despliegue en EasyPanel con Docker

## Problema de Fuentes en Servidor

Si el texto no se ve en las imágenes generadas cuando subes a EasyPanel, es porque el servidor no tiene las fuentes necesarias instaladas.

## Solución con Docker (Recomendado)

### Opción 1: Despliegue con Docker en EasyPanel

1. **Sube todo el proyecto a tu repositorio Git**

2. **En EasyPanel, crea una nueva aplicación Docker**

3. **Configura las siguientes variables de entorno:**
   ```
   API_KEY=shalom-api-key-20242
   NODE_ENV=production
   FONTCONFIG_PATH=/etc/fonts
   NEXT_TELEMETRY_DISABLED=1
   PORT=3000
   HOSTNAME=0.0.0.0
   ```

4. **EasyPanel automáticamente usará el Dockerfile para construir la imagen**

5. **El puerto expuesto es 3000**

### Ventajas del Dockerfile:
- ✅ Fuentes preinstaladas (Arial, Liberation, Dejavu, Noto)
- ✅ Multi-stage build optimizado
- ✅ Usuario no-root para seguridad
- ✅ Healthcheck incluido
- ✅ Límites de recursos configurados

## Solución Manual (Sin Docker)

### Opción 1: Script de Instalación de Fuentes (Recomendado)

1. **Sube el archivo `install-fonts.sh` a tu servidor EasyPanel**

2. **Ejecuta el script en tu servidor:**
   ```bash
   chmod +x install-fonts.sh
   sudo ./install-fonts.sh
   ```

3. **Reinicia tu aplicación en EasyPanel**

### Opción 2: Instalación Manual

**Para servidores Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y fontconfig fonts-liberation fonts-dejavu fonts-noto
sudo fc-cache -fv
```

**Para servidores CentOS/RHEL:**
```bash
sudo yum install -y fontconfig liberation-fonts dejavu-fonts google-noto-fonts
sudo fc-cache -fv
```

**Para servidores Alpine Linux:**
```bash
sudo apk add --no-cache fontconfig ttf-liberation ttf-dejavu font-noto
sudo fc-cache -fv
```

### Opción 3: Variables de Entorno

Si no puedes instalar fuentes, agrega estas variables de entorno en EasyPanel:

```
FONTCONFIG_PATH=/etc/fonts
FC_LANG=en
```

## Verificación

### Verificar que las fuentes están instaladas:
```bash
fc-list | grep -i arial
fc-list | grep -i liberation
```

### Probar la API:
```bash
curl -H "x-api-key: shalom-api-key-20242" \
     "https://tu-dominio.com/api/image?query=lima" \
     -o test-image.png
```

## Configuración de EasyPanel

### Build Command:
```bash
npm install && npm run build
```

### Start Command:
```bash
npm start
```

### Variables de Entorno Necesarias:
```
API_KEY=shalom-api-key-20242
NODE_ENV=production
FONTCONFIG_PATH=/etc/fonts
```

## Troubleshooting

### Si el texto sigue sin verse:

1. **Verifica los logs del servidor** para mensajes como:
   ```
   Fontconfig warning: using without calling FcInit()
   ```

2. **Prueba con diferentes fuentes** modificando el archivo `route.ts`:
   ```typescript
   // Cambiar de:
   font-family="Arial, sans-serif"
   // A:
   font-family="monospace"
   // O:
   font-family="serif"
   ```

3. **Reinicia completamente la aplicación** en EasyPanel después de instalar fuentes

4. **Verifica que el servidor tiene permisos** para acceder a las fuentes:
   ```bash
   ls -la /usr/share/fonts/
   ```

## Notas Importantes

- ✅ La fuente `Arial, sans-serif` funciona mejor cuando las fuentes están instaladas
- ✅ `monospace` es más compatible pero menos estético
- ✅ El parámetro de búsqueda puede ser `query` o `q`
- ✅ La API key es: `shalom-api-key-20242`
- ✅ Siempre reinicia la aplicación después de cambios de fuentes

## API Endpoints

### Generar Imagen
```
GET /api/image?query=lima
Headers: x-api-key: shalom-api-key-20242
```

### Obtener Agencias (JSON)
```
GET /api/front
```

Este archivo contiene toda la información necesaria para desplegar correctamente en EasyPanel sin usar Docker.