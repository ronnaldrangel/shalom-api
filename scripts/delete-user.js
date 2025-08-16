const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteUser(identifier) {
  try {
    await prisma.$connect();
    console.log('🔗 Conectado a la base de datos');

    // Determinar si el identificador es un email o un ID
    const isEmail = identifier.includes('@');
    const whereClause = isEmail ? { email: identifier } : { id: identifier };

    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: whereClause,
      include: { apiKeys: true }
    });

    if (!user) {
      console.log('❌ Error: Usuario no encontrado');
      console.log(`   Buscado: ${identifier}`);
      return;
    }

    // Mostrar información del usuario antes de eliminar
    console.log('👤 Usuario encontrado:');
    console.log(`   Nombre: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   API Keys: ${user.apiKeys.length}`);
    console.log(`   Creado: ${new Date(user.createdAt).toLocaleString('es-ES')}`);

    // Eliminar todas las API keys del usuario primero
    if (user.apiKeys.length > 0) {
      console.log('\n🔑 Eliminando API keys...');
      await prisma.apiKey.deleteMany({
        where: { userId: user.id }
      });
      console.log(`   ✅ ${user.apiKeys.length} API key(s) eliminada(s)`);
    }

    // Eliminar el usuario
    console.log('\n👤 Eliminando usuario...');
    await prisma.user.delete({
      where: { id: user.id }
    });

    console.log('\n✅ Usuario eliminado exitosamente:');
    console.log(`   ${user.name} (${user.email})`);
    console.log(`   API Keys eliminadas: ${user.apiKeys.length}`);

  } catch (error) {
    console.error('❌ Error eliminando usuario:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Obtener argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.length !== 1) {
  console.log('❌ Uso: node scripts/delete-user.js <email_o_id>');
  console.log('   Ejemplos:');
  console.log('     node scripts/delete-user.js juan@ejemplo.com');
  console.log('     node scripts/delete-user.js cmee0irx20005up80dv7jyxh4');
  process.exit(1);
}

const [identifier] = args;

deleteUser(identifier);