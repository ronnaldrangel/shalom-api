const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
  try {
    await prisma.$connect();
    console.log('🔗 Conectado a la base de datos');

    // Obtener todos los usuarios con sus API keys y estadísticas de uso
    const users = await prisma.user.findMany({
      include: {
        apiKeys: {
          include: {
            usage: {
              where: {
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (users.length === 0) {
      console.log('📭 No hay usuarios registrados');
      console.log('\n💡 Para crear un usuario, usa:');
      console.log('   node scripts/create-user.js <email> <nombre>');
      return;
    }

    console.log(`\n👥 Usuarios registrados (${users.length}):`);
    console.log('=' .repeat(80));

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. 👤 ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🆔 ID: ${user.id}`);
      console.log(`   📅 Creado: ${new Date(user.createdAt).toLocaleString('es-ES')}`);
      
      if (user.apiKeys.length > 0) {
        console.log(`   🔑 API Keys (${user.apiKeys.length}):`);
        
        user.apiKeys.forEach((apiKey, keyIndex) => {
          const currentUsage = apiKey.usage.reduce((sum, usage) => sum + usage.count, 0);
          const usagePercent = Math.round((currentUsage / apiKey.monthlyLimit) * 100);
          const progressBar = '█'.repeat(Math.floor(usagePercent / 5)) + '░'.repeat(20 - Math.floor(usagePercent / 5));
          
          console.log(`     ${keyIndex + 1}. ${apiKey.name}`);
          console.log(`        🔐 Key: ${apiKey.key}`);
          console.log(`        📊 Uso: ${currentUsage}/${apiKey.monthlyLimit} (${usagePercent}%)`);
          console.log(`        📈 [${progressBar}]`);
          console.log(`        ✅ Estado: ${apiKey.isActive ? 'Activa' : 'Inactiva'}`);
          console.log(`        📅 Creada: ${new Date(apiKey.createdAt).toLocaleString('es-ES')}`);
        });
      } else {
        console.log(`   🔑 API Keys: Ninguna`);
      }
      
      if (index < users.length - 1) {
        console.log('   ' + '-'.repeat(76));
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log('\n📋 Comandos útiles:');
    console.log('   • Crear usuario: node scripts/create-user.js <email> <nombre>');
    console.log('   • Listar usuarios: node scripts/list-users.js');
    console.log('   • Crear API key: node scripts/create-apikey.js <nombre>');
    console.log('   • Listar API keys: node scripts/list-apikeys.js');

  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();