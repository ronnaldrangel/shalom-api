# Multi-stage build para optimizar el tamaño de la imagen
FROM node:18-alpine AS base

# Instalar dependencias del sistema y fuentes
RUN apk add --no-cache \
    fontconfig \
    ttf-liberation \
    ttf-dejavu \
    font-noto \
    font-noto-emoji \
    ttf-opensans \
    && fc-cache -fv

# Establecer directorio de trabajo
WORKDIR /app

# Stage para dependencias
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copiar esquema de Prisma
COPY prisma ./prisma/

# Generar cliente de Prisma
RUN npx prisma generate

# Stage para build
FROM base AS builder
COPY package*.json ./
RUN npm ci

# Copiar esquema de Prisma y archivo de entorno
COPY prisma ./prisma/
COPY .env.example ./.env

RUN npx prisma generate

# Copiar código fuente
COPY src ./src
COPY public ./public
COPY next.config.ts ./
COPY tsconfig.json ./
COPY postcss.config.mjs ./
COPY scripts ./scripts

RUN npm run build

# Stage final para producción
FROM base AS runner

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Crear directorio para la base de datos y hacer ejecutable el script
RUN mkdir -p /app/prisma && \
    chmod +x /app/scripts/init-db.sh && \
    chown -R nextjs:nodejs /app

# Copiar archivo de entorno al contenedor final
COPY --from=builder --chown=nextjs:nodejs /app/.env ./.env

# Variables de entorno para producción
ENV NODE_ENV=production
ENV FONTCONFIG_PATH=/etc/fonts
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/front || exit 1

# Comando para iniciar la aplicación
CMD ["sh", "-c", "echo '🚀 Iniciando aplicación Shalom API...' && npx prisma generate && echo '📦 Ejecutando migraciones...' && npx prisma migrate deploy && echo '🔧 Inicializando datos...' && /app/scripts/init-db.sh && echo '🌟 Iniciando servidor...' && npm start"]