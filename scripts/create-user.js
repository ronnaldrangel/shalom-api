const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function createUser(email, name) {
  try {
    await prisma.$connect();
    console.log('🔗 Conectado a la base de datos');

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('❌ Error: El usuario con este email ya existe');
      return;
    }

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });

    console.log('✅ Usuario creado exitosamente:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nombre: ${user.name}`);
    console.log(`   Creado: ${user.createdAt}`);

    // Crear API key automáticamente
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        name: `API Key de ${name}`,
        key: `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        monthlyLimit: 5000,
        isActive: true,
      },
    });

    console.log('\n🔑 API Key generada automáticamente:');
    console.log(`   Nombre: ${apiKey.name}`);
    console.log(`   Key: ${apiKey.key}`);
    console.log(`   Límite mensual: ${apiKey.monthlyLimit} consultas`);
    
    console.log('\n📋 Instrucciones de uso:');
    console.log('   Para usar esta API key, incluye el header:');
    console.log(`   x-api-key: ${apiKey.key}`);
    console.log('   o');
    console.log(`   Authorization: Bearer ${apiKey.key}`);

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('❌ Error: El email ya está registrado');
    } else {
      console.error('❌ Error creando usuario:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Obtener argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('❌ Uso: node scripts/create-user.js <email> <nombre>');
  console.log('   Ejemplo: node scripts/create-user.js juan@ejemplo.com "Juan Pérez"');
  process.exit(1);
}

const [email, name] = args;

// Validar email básico
if (!email.includes('@')) {
  console.log('❌ Error: Email inválido');
  process.exit(1);
}

createUser(email, name);