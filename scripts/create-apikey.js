#!/usr/bin/env node

// Script para crear API keys fácilmente
// Uso: node scripts/create-apikey.js "Nombre de la API Key"

const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

function generateApiKey() {
  return 'sk-' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

async function createApiKey(name) {
  try {
    // Conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos');

    // Crear usuario del sistema si no existe
    let user = await prisma.user.findFirst({
      where: { email: 'system@shalomapi.com' },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'system@shalomapi.com',
          name: 'System User',
        },
      });
      console.log('✅ Usuario del sistema creado');
    }

    // Crear API key
    const apiKey = await prisma.apiKey.create({
      data: {
        key: generateApiKey(),
        name: name,
        userId: user.id,
        monthlyLimit: 5000,
        isActive: true,
      },
    });

    console.log('\n🎉 API Key creada exitosamente:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📝 Nombre: ${apiKey.name}`);
    console.log(`🔑 API Key: ${apiKey.key}`);
    console.log(`📊 Límite mensual: ${apiKey.monthlyLimit} consultas`);
    console.log(`📅 Creada: ${apiKey.createdAt.toLocaleString()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 Usa esta API key en el header: x-api-key');
    console.log('💡 Ejemplo: curl -H "x-api-key: ' + apiKey.key + '" http://localhost:3000/api/front');

  } catch (error) {
    console.error('❌ Error creando API key:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Obtener el nombre de la línea de comandos
const name = process.argv[2];

if (!name) {
  console.log('❌ Error: Debes proporcionar un nombre para la API key');
  console.log('💡 Uso: node scripts/create-apikey.js "Mi API Key"');
  process.exit(1);
}

createApiKey(name);