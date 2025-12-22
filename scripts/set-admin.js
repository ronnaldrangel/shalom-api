const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function setAdmin(email) {
  try {
    await prisma.$connect();
    console.log('🔗 Conectado a la base de datos');

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('❌ Error: Usuario no encontrado');
      return;
    }

    await prisma.user.update({
      where: { email },
      data: { role: 'admin' }
    });

    console.log(`✅ Usuario ${email} actualizado a administrador.`);

  } catch (error) {
    console.error('❌ Error actualizando usuario:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

const args = process.argv.slice(2);

if (args.length < 1) {
  console.log('❌ Uso: node scripts/set-admin.js <email>');
  process.exit(1);
}

const [email] = args;
setAdmin(email);
