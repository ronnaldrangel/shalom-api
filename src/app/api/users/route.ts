import { NextRequest, NextResponse } from 'next/server';
import { createUser, createApiKey, getUsageStats, getAllUsers } from '../../../lib/database';
import { connectDatabase, prisma } from '../../../lib/database';
import { validateApiKeyLegacyString } from '../../../lib/auth';

// Conectar a la base de datos al inicializar
connectDatabase();

// POST /api/users - Crear un nuevo usuario
export async function POST(request: NextRequest) {
  try {
    // Validar API key master
    const apiKey = request.headers.get('x-api-key') || 
                  request.headers.get('authorization')?.replace('Bearer ', '') || null;
    
    if (!validateApiKeyLegacyString(apiKey)) {
      return NextResponse.json(
        { error: 'API key de administrador requerida' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Nombre es requerido' },
        { status: 400 }
      );
    }

    // Crear usuario
    const user = await createUser(email, name);

    // Crear API key automáticamente para el usuario
    const newApiKey = await createApiKey(user.id, `API Key de ${name}`, 5000);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        monthlyLimit: user.monthlyLimit,
        isActive: true,
        createdAt: user.createdAt,
      },
      apiKey: {
        id: newApiKey.id,
        key: newApiKey.key,
        name: newApiKey.name,
        isActive: newApiKey.isActive,
        createdAt: newApiKey.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error creando usuario:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PATCH /api/users - Gestionar API keys de usuarios (límite por usuario)
export async function PATCH(request: NextRequest) {
  try {
    // Validar API key master
    const adminApiKey = request.headers.get('x-api-key') || 
                       request.headers.get('authorization')?.replace('Bearer ', '') || null;
    
    if (!validateApiKeyLegacyString(adminApiKey)) {
      return NextResponse.json(
        { error: 'API key de administrador requerida' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, userId, apiKeyId, name, monthlyLimit, isActive } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'action es requerido (create, update, delete)' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'create':
        // Crear nueva API key para un usuario
        if (!userId || !name) {
          return NextResponse.json(
            { error: 'userId y name son requeridos para crear API key' },
            { status: 400 }
          );
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
          return NextResponse.json(
            { error: 'Usuario no encontrado' },
            { status: 404 }
          );
        }

        // Nota: monthlyLimit se ignora aquí ya que el límite es por usuario, no por API key
        const newApiKey = await createApiKey(userId, name, 0); // 0 indica que el límite es por usuario
        return NextResponse.json({
          success: true,
          action: 'create',
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            monthlyLimit: user.monthlyLimit,
            isActive: true
          },
          apiKey: {
            id: newApiKey.id,
            key: newApiKey.key,
            name: newApiKey.name,
            createdAt: newApiKey.createdAt,
          },
          note: 'El límite de consumo es por usuario, no por API key individual'
        });

      case 'update':
        // Actualizar API key existente
        if (!apiKeyId) {
          return NextResponse.json(
            { error: 'apiKeyId es requerido para actualizar' },
            { status: 400 }
          );
        }

        const updateData: any = {};
        if (typeof isActive === 'boolean') updateData.isActive = isActive;
        // monthlyLimit se ignora ya que el límite es por usuario
        if (typeof name === 'string') updateData.name = name;

        if (Object.keys(updateData).length === 0) {
          return NextResponse.json(
            { error: 'No hay datos para actualizar' },
            { status: 400 }
          );
        }

        const updatedApiKey = await prisma.apiKey.update({
          where: { id: apiKeyId },
          data: updateData,
          include: {
            user: true
          }
        });

        return NextResponse.json({
          success: true,
          action: 'update',
          user: {
            id: updatedApiKey.user.id,
            email: updatedApiKey.user.email,
            name: updatedApiKey.user.name,
            monthlyLimit: updatedApiKey.user.monthlyLimit,
            isActive: true
          },
          apiKey: {
            id: updatedApiKey.id,
            key: updatedApiKey.key,
            name: updatedApiKey.name,
            isActive: updatedApiKey.isActive,
            updatedAt: updatedApiKey.updatedAt,
          },
          note: 'El límite de consumo es por usuario, no por API key individual'
        });

      case 'delete':
        // Eliminar API key específica
        if (!apiKeyId) {
          return NextResponse.json(
            { error: 'apiKeyId es requerido para eliminar' },
            { status: 400 }
          );
        }

        await prisma.apiKey.delete({
          where: { id: apiKeyId },
        });

        return NextResponse.json({
          success: true,
          action: 'delete',
          message: 'API key eliminada correctamente',
        });

      default:
        return NextResponse.json(
          { error: 'action debe ser create, update o delete' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Error gestionando API keys:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Recurso no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET /api/users - Listar todos los usuarios
export async function GET(request: NextRequest) {
  try {
    // Validar API key master
    const apiKey = request.headers.get('x-api-key') || 
                  request.headers.get('authorization')?.replace('Bearer ', '') || null;
    
    if (!validateApiKeyLegacyString(apiKey)) {
      return NextResponse.json(
        { error: 'API key de administrador requerida' },
        { status: 401 }
      );
    }

    const users = await getAllUsers();

    // Obtener estadísticas de uso para cada usuario
     const usersWithStats = await Promise.all(
       users.map(async (user) => {
         const stats = await getUsageStats(user.id);
         return {
           id: user.id,
           email: user.email,
           name: user.name,
           monthlyLimit: user.monthlyLimit,
           isActive: true,
           createdAt: user.createdAt,
           currentUsage: stats.totalUsage,
           remainingRequests: stats.remaining,
           apiKeys: user.apiKeys?.map(key => ({
             id: key.id,
             name: key.name,
             key: key.key,
             isActive: key.isActive,
             createdAt: key.createdAt,
           })) || [],
         };
       })
     );

    return NextResponse.json({
      success: true,
      users: usersWithStats,
      total: users.length,
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/users - Eliminar un usuario
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const email = url.searchParams.get('email');

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'Se requiere userId o email como parámetro de consulta' },
        { status: 400 }
      );
    }

    // Buscar usuario por ID o email
    const whereClause = userId ? { id: userId } : { email: email as string };
    const user = await prisma.user.findUnique({
      where: whereClause,
      include: { apiKeys: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar todas las API keys del usuario primero
    await prisma.apiKey.deleteMany({
      where: { userId: user.id }
    });

    // Eliminar el usuario
    await prisma.user.delete({
      where: { id: user.id }
    });

    return NextResponse.json({
      success: true,
      message: `Usuario ${user.name} (${user.email}) eliminado exitosamente`,
      deletedUser: {
        id: user.id,
        email: user.email,
        name: user.name,
        apiKeysDeleted: user.apiKeys.length
      }
    });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}