# ShalomAPI

Aplicación web que sincroniza y muestra información de agencias de Shalom con endpoints API seguros para integración.

## 🚀 Características

- **Interfaz web intuitiva** para visualizar agencias
- **API REST segura** con autenticación por API key
- **Sincronización automática** cada 24 horas
- **Búsqueda en tiempo real** de agencias
- **Integración con Google Maps** para direcciones
- **Diseño responsive** para móviles y desktop

## 🔐 Autenticación

Todas las rutas de la API requieren autenticación mediante API key.

### Configuración

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env.local
```

2. Configura la variable de entorno en `.env.local`:
```env
# API Key unificada para toda la aplicación
API_KEY=tu-clave-super-secreta-aqui
```

> **Nota:** En desarrollo, puedes usar la clave por defecto `shalom-api-key-2024`. En producción, cambia por una clave segura. La clave se mantiene segura en el servidor y no se expone al cliente.

### Uso de la API

**Método 1: Header x-api-key**
```bash
curl -H "x-api-key: $API_KEY" \
     http://localhost:3000/api/listar
```

**Método 2: Authorization Bearer**
```bash
curl -H "Authorization: Bearer $API_KEY" \
     http://localhost:3000/api/listar
```

## 📚 Endpoints API

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/listar` | GET | Lista todas las agencias |
| `/api/buscar?q=término` | GET | Busca agencias por cualquier campo |
| `/api/agencia?q=nombre` | GET | Busca agencias solo por nombre |

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd ShalomAPI
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📖 Documentación

Visita [http://localhost:3000/docs](http://localhost:3000/docs) para ver la documentación completa de la API con ejemplos interactivos.

## 🔄 Sincronización

- **Automática**: Cada 24 horas a las 00:00
- **Manual**: Endpoint `/api/sync` (requiere autenticación)
- **Al iniciar**: Primera carga automática al arrancar la aplicación

## 🏗️ Tecnologías

- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Heroicons** - Iconografía
- **Node.js** - Runtime

## 📱 Características de la Interfaz

- Búsqueda en tiempo real
- Vista minimal y completa
- Integración con Google Maps
- Información de horarios y contacto
- Descarga de tarifas en PDF
- Diseño responsive

## 🚀 Despliegue

Para desplegar en producción:

1. Configura las variables de entorno en tu plataforma
2. Asegúrate de usar una API key segura
3. Configura el dominio correcto en los metadatos

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
