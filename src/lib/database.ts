import { PrismaClient } from '../generated/prisma';

// Singleton para el cliente de Prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Función para conectar a la base de datos
export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    throw error;
  }
}

// Función para desconectar de la base de datos
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log('✅ Desconectado de la base de datos');
  } catch (error) {
    console.error('❌ Error desconectando de la base de datos:', error);
  }
}

// Función para crear un usuario
export async function createUser(email: string, name?: string, monthlyLimit: number = 5000) {
  return await prisma.user.create({
    data: {
      email,
      name,
      monthlyLimit,
    },
  });
}

// Función para crear una API key
export async function createApiKey(
  userId: string,
  name: string,
  monthlyLimit: number = 1000
) {
  const key = generateApiKey();
  
  return await prisma.apiKey.create({
    data: {
      key,
      name,
      userId,
      monthlyLimit,
    },
  });
}

// Función para generar una API key única
function generateApiKey(): string {
  const prefix = 'sk';
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}_${timestamp}_${random}`;
}

// Función para validar una API key
export async function validateApiKey(key: string) {
  const apiKey = await prisma.apiKey.findUnique({
    where: {
      key,
      isActive: true,
    },
    include: {
      user: true,
    },
  });

  return apiKey;
}

// Función para obtener o crear registro de uso mensual
export async function getOrCreateUsage(
  userId: string,
  apiKeyId: string,
  endpoint: string
) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  let usage = await prisma.usage.findUnique({
    where: {
      userId_apiKeyId_endpoint_month_year: {
        userId,
        apiKeyId,
        endpoint,
        month,
        year,
      },
    },
  });

  if (!usage) {
    usage = await prisma.usage.create({
      data: {
        userId,
        apiKeyId,
        endpoint,
        month,
        year,
        count: 0,
      },
    });
  }

  return usage;
}

// Función para incrementar el uso de una API key
export async function incrementUsage(
  userId: string,
  apiKeyId: string,
  endpoint: string
) {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  return await prisma.usage.upsert({
    where: {
      userId_apiKeyId_endpoint_month_year: {
        userId,
        apiKeyId,
        endpoint,
        month,
        year,
      },
    },
    update: {
      count: {
        increment: 1,
      },
    },
    create: {
      userId,
      apiKeyId,
      endpoint,
      month,
      year,
      count: 1,
    },
  });
}

// Función para verificar límite mensual por usuario
export async function checkMonthlyLimit(
  userId: string,
  apiKeyId: string,
  endpoint: string
): Promise<{ allowed: boolean; currentUsage: number; limit: number }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      usage: {
        where: {
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        },
      },
    },
  });

  if (!user) {
    return { allowed: false, currentUsage: 0, limit: 0 };
  }

  // Calcular uso total del usuario en el mes actual
  const totalUsage = user.usage.reduce((sum, usage) => sum + usage.count, 0);
  
  return {
    allowed: totalUsage < user.monthlyLimit,
    currentUsage: totalUsage,
    limit: user.monthlyLimit,
  };
}

// Función para obtener estadísticas de uso por usuario
export async function getUsageStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Calcular uso total del usuario sumando todas sus API keys
  const totalUsage = user.apiKeys.reduce((total, apiKey) => {
    return total + apiKey.usage.reduce((sum, usage) => sum + usage.count, 0);
  }, 0);

  return {
    userId: user.id,
    userMonthlyLimit: user.monthlyLimit,
    totalUsage,
    remaining: Math.max(0, user.monthlyLimit - totalUsage),
    apiKeys: user.apiKeys.map(apiKey => ({
      id: apiKey.id,
      name: apiKey.name,
      currentUsage: apiKey.usage.reduce((sum, usage) => sum + usage.count, 0),
      isActive: apiKey.isActive,
    })),
  };
}

// Función legacy para validar API keys del sistema anterior
export function validateApiKeyLegacyString(apiKey: string | null): boolean {
  if (!apiKey) return false;
  
  const validKey = process.env.API_KEY || 'shalom-api-key-2024';
  return apiKey === validKey;
}

// Obtener todos los usuarios con sus API keys
export async function getAllUsers() {
  const users = await prisma.user.findMany({
    include: {
      apiKeys: {
        select: {
          id: true,
          name: true,
          key: true,
          monthlyLimit: true,
          isActive: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return users;
}