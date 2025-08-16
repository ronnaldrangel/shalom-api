#!/bin/bash

# Script de inicialización de base de datos para producción
echo "🚀 Inicializando base de datos..."

# Verificar si la base de datos ya existe
if [ ! -f "./prisma/dev.db" ]; then
  echo "📦 Creando base de datos..."
  npx prisma migrate deploy
else
  echo "✅ Base de datos ya existe"
fi

# Verificar si hay usuarios en la base de datos
USER_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) as count FROM users;" | grep -o '[0-9]\+' | tail -1)

if [ "$USER_COUNT" = "0" ]; then
  echo "👤 Creando usuario administrador por defecto..."
  
  # Crear usuario admin por defecto
  node -e "
    const { PrismaClient } = require('./src/generated/prisma');
    const { createUser, createApiKey } = require('./src/lib/database');
    
    async function initAdmin() {
      try {
        const user = await createUser('admin@shalom.com', 'Administrador');
        const apiKey = await createApiKey(user.id, 'Admin Key', 10000);
        
        console.log('✅ Usuario administrador creado:');
        console.log('📧 Email:', user.email);
        console.log('🔑 API Key:', apiKey.key);
        console.log('📊 Límite mensual:', apiKey.monthlyLimit);
        
        process.exit(0);
      } catch (error) {
        console.error('❌ Error creando usuario admin:', error);
        process.exit(1);
      }
    }
    
    initAdmin();
  "
else
  echo "✅ Ya existen usuarios en la base de datos"
fi

echo "🎉 Inicialización completada"