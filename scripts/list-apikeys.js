#!/usr/bin/env node

// Script para listar todas las API keys
// Uso: node scripts/list-apikeys.js

const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function listApiKeys() {
  try {
    // Conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos');

    // Obtener usuario del sistema
    const user = await prisma.user.findFirst({
      where: { email: 'system@shalomapi.com' },
    });

    if (!user) {
      console.log('❌ No se encontró el usuario del sistema');
      console.log('💡 Crea una API key primero con: node scripts/create-apikey.js "Mi API Key"');
      return;
    }

    // Obtener todas las API keys
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: user.id },
      include: {
        usage: {
          where: {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (apiKeys.length === 0) {
      console.log('\n📭 No hay API keys creadas');
      console.log('💡 Crea una con: node scripts/create-apikey.js "Mi API Key"');
      return;
    }

    console.log(`\n📋 API Keys encontradas (${apiKeys.length}):`);
    console.log('━'.repeat(120));

    apiKeys.forEach((apiKey, index) => {
      const currentUsage = apiKey.usage[0]?.count || 0;
      const usagePercent = ((currentUsage / apiKey.monthlyLimit) * 100).toFixed(1);
      const status = apiKey.isActive ? '🟢 Activa' : '🔴 Inactiva';
      
      console.log(`\n${index + 1}. ${apiKey.name}`);
      console.log(`   🔑 Key: ${apiKey.key}`);
      console.log(`   📊 Uso: ${currentUsage}/${apiKey.monthlyLimit} (${usagePercent}%)`);
      console.log(`   📅 Creada: ${apiKey.createdAt.toLocaleDateString()}`);
      console.log(`   ${status}`);
      
      // Barra de progreso visual
      const barLength = 30;
      const filledLength = Math.round((currentUsage / apiKey.monthlyLimit) * barLength);
      const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
      console.log(`   [${bar}] ${usagePercent}%`);
    });

    console.log('\n━'.repeat(120));
    console.log(`\n💡 Para crear una nueva API key: node scripts/create-apikey.js "Nombre de la key"`);
    console.log(`💡 Para usar una API key: curl -H "x-api-key: TU_API_KEY" http://localhost:3000/api/protected`);

  } catch (error) {
    console.error('❌ Error al listar API keys:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  listApiKeys();
}

module.exports = { listApiKeys };