const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Iniciando seed de la base de datos...');
    
    // Verificar si el usuario administrador ya existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@shalom.com' }
    });

    if (existingAdmin) {
      console.log('✅ Usuario administrador ya existe');
      return;
    }

    // Crear usuario administrador
    const admin = await prisma.user.create({
      data: {
        email: 'admin@shalom.com',
        name: 'Administrador',
        role: 'ADMIN'
      }
    });

    console.log('✅ Usuario administrador creado:', admin.email);
    console.log('🌱 Seed completado exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });