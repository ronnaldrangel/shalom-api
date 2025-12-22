const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcryptjs');

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

    // Hash de contraseña por defecto: "admin123"
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Crear usuario administrador
    const admin = await prisma.user.create({
      data: {
        email: 'admin@shalom.com',
        name: 'Administrador',
        password: hashedPassword,
        monthlyLimit: 1000
      }
    });

    console.log('✅ Usuario administrador creado:', admin.email);
    console.log('🔑 Contraseña por defecto: admin123');
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