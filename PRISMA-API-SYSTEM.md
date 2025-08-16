# 🚀 Sistema de API con Prisma y Rate Limiting

Este documento describe el nuevo sistema de autenticación y rate limiting implementado con Prisma para la API de Shalom.

## 📋 Características

- ✅ **Autenticación con API Keys**: Sistema robusto de API keys por usuario
- ✅ **Rate Limiting Mensual**: Límites de consultas que se reinician cada mes
- ✅ **Base de Datos SQLite**: Persistencia de datos con Prisma ORM
- ✅ **Gestión de Usuarios**: APIs para crear y administrar usuarios
- ✅ **Estadísticas de Uso**: Tracking detallado del uso por endpoint
- ✅ **Headers de Rate Limit**: Información en tiempo real del uso

## 🏗️ Arquitectura

### Modelos de Base de Datos

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  apiKeys   ApiKey[]
  usage     Usage[]
}

model ApiKey {
  id          String   @id @default(cuid())
  key         String   @unique
  name        String
  userId      String
  isActive    Boolean  @default(true)
  monthlyLimit Int     @default(1000)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User     @relation(fields: [userId], references: [id])
  usage       Usage[]
}

model Usage {
  id        String   @id @default(cuid())
  userId    String
  apiKeyId  String
  endpoint  String
  month     Int      // 1-12
  year      Int
  count     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      User     @relation(fields: [userId], references: [id])
  apiKey    ApiKey   @relation(fields: [apiKeyId], references: [id])
  
  @@unique([userId, apiKeyId, endpoint, month, year])
}
```

## 🔧 Configuración

### Variables de Entorno

```bash
# Base de datos
DATABASE_URL="file:./prisma/dev.db"

# API Key legacy para administración
API_KEY=shalom-api-key-20242

# Configuración de Prisma
PRISMA_CLI_QUERY_ENGINE_TYPE=binary
PRISMA_CLI_BINARY_TARGETS=linux-musl
```

### Inicialización

```bash
# Instalar dependencias
npm install prisma @prisma/client

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# (Opcional) Inicializar datos
./scripts/init-db.sh
```

## 📚 APIs Disponibles

### 1. Gestión de Usuarios

#### Crear Usuario
```http
POST /api/users
Content-Type: application/json
x-api-key: shalom-api-key-20242

{
  "email": "usuario@ejemplo.com",
  "name": "Nombre Usuario"
}
```

**Respuesta:**
```json
{
  "success": true,
  "user": {
    "id": "clx1234567890",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario",
    "createdAt": "2024-01-16T08:20:05.000Z"
  }
}
```

#### Obtener Estadísticas de Usuario
```http
GET /api/users?userId=clx1234567890
x-api-key: shalom-api-key-20242
```

**Respuesta:**
```json
{
  "success": true,
  "userId": "clx1234567890",
  "stats": [
    {
      "id": "clx0987654321",
      "name": "Mi API Key",
      "monthlyLimit": 1000,
      "currentUsage": 45,
      "isActive": true
    }
  ]
}
```

### 2. Gestión de API Keys

#### Crear API Key
```http
POST /api/api-keys
Content-Type: application/json
x-api-key: shalom-api-key-20242

{
  "userId": "clx1234567890",
  "name": "Mi API Key",
  "monthlyLimit": 1000
}
```

**Respuesta:**
```json
{
  "success": true,
  "apiKey": {
    "id": "clx0987654321",
    "key": "sk_1737012005_abc123def456",
    "name": "Mi API Key",
    "monthlyLimit": 1000,
    "isActive": true,
    "createdAt": "2024-01-16T08:20:05.000Z"
  }
}
```

#### Listar API Keys
```http
GET /api/api-keys?userId=clx1234567890
x-api-key: shalom-api-key-20242
```

#### Actualizar API Key
```http
PATCH /api/api-keys
Content-Type: application/json
x-api-key: shalom-api-key-20242

{
  "apiKeyId": "clx0987654321",
  "isActive": false,
  "monthlyLimit": 2000
}
```

#### Eliminar API Key
```http
DELETE /api/api-keys?apiKeyId=clx0987654321
x-api-key: shalom-api-key-20242
```

### 3. APIs Protegidas

Todas las APIs existentes ahora requieren autenticación y respetan los límites:

#### Generar Imagen
```http
GET /api/image?query=lima
x-api-key: sk_1737012005_abc123def456
```

#### Obtener Datos
```http
GET /api/front
x-api-key: sk_1737012005_abc123def456
```

**Headers de Respuesta:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 955
X-RateLimit-Used: 45
```

## 🚦 Rate Limiting

### Funcionamiento

1. **Límite Mensual**: Cada API key tiene un límite de consultas por mes
2. **Reinicio Automático**: Los contadores se reinician el primer día de cada mes
3. **Por Endpoint**: El tracking es independiente por endpoint
4. **Headers Informativos**: Cada respuesta incluye información del uso actual

### Códigos de Respuesta

- **200**: Solicitud exitosa
- **401**: API key inválida o faltante
- **429**: Límite mensual excedido
- **500**: Error interno del servidor

### Ejemplo de Límite Excedido

```json
{
  "error": "Límite mensual excedido. Uso actual: 1000/1000"
}
```

**Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Used: 1000
```

## 🐳 Despliegue con Docker

### Dockerfile Actualizado

El Dockerfile incluye:
- ✅ Instalación de Prisma
- ✅ Generación del cliente
- ✅ Ejecución de migraciones
- ✅ Script de inicialización automática

### Variables de Entorno para EasyPanel

```bash
DATABASE_URL=file:./prisma/dev.db
API_KEY=shalom-api-key-20242
NODE_ENV=production
FONTCONFIG_PATH=/etc/fonts
NEXT_TELEMETRY_DISABLED=1
PORT=3000
HOSTNAME=0.0.0.0
PRISMA_CLI_QUERY_ENGINE_TYPE=binary
PRISMA_CLI_BINARY_TARGETS=linux-musl
```

### Inicialización Automática

Al iniciar el contenedor:
1. Se ejecutan las migraciones de Prisma
2. Se crea un usuario administrador por defecto (si no existe)
3. Se genera una API key de administrador
4. Se inicia la aplicación

## 🔒 Seguridad

### API Keys
- Formato: `sk_{timestamp}_{random}`
- Almacenadas de forma segura en la base de datos
- Pueden ser activadas/desactivadas
- Eliminación en cascada al eliminar usuario

### Autenticación
- Headers soportados: `x-api-key` o `Authorization: Bearer <key>`
- Validación en tiempo real contra la base de datos
- Sistema legacy mantenido para administración

## 📊 Monitoreo

### Logs
Todos los eventos importantes se registran:
- Creación de usuarios y API keys
- Intentos de autenticación
- Límites excedidos
- Errores de base de datos

### Métricas
- Uso por usuario
- Uso por endpoint
- Tendencias mensuales
- API keys activas/inactivas

## 🛠️ Comandos Útiles

```bash
# Ver estado de la base de datos
npx prisma studio

# Resetear base de datos (desarrollo)
npx prisma migrate reset

# Generar nueva migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Inspeccionar base de datos
npx prisma db pull
```

## 🚨 Troubleshooting

### Problemas Comunes

1. **Error de cliente Prisma no generado**
   ```bash
   npx prisma generate
   ```

2. **Base de datos no encontrada**
   ```bash
   npx prisma migrate deploy
   ```

3. **API key no funciona**
   - Verificar que la API key esté activa
   - Verificar que no se haya excedido el límite
   - Verificar formato del header

4. **Error en Docker**
   - Verificar variables de entorno
   - Verificar que el script de inicio sea ejecutable
   - Revisar logs del contenedor

## 📈 Próximas Mejoras

- [ ] Dashboard web para gestión
- [ ] Webhooks para notificaciones
- [ ] Análisis avanzado de uso
- [ ] Soporte para múltiples bases de datos
- [ ] API de facturación
- [ ] Límites por tiempo (por hora, por día)

---

**¡El sistema está listo para producción!** 🎉

Para más información, consulta la documentación de [Prisma](https://www.prisma.io/docs) y [Next.js](https://nextjs.org/docs).