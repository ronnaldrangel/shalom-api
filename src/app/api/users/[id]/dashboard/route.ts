import { NextRequest, NextResponse } from 'next/server';
import { prisma, getDailyUsageStats } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params as it's a Promise in Next.js 15
    const { id } = await params;
    
    // Obtener usuario con sus API keys y uso
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        apiKeys: true,
        usage: {
          where: {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Calcular uso total del mes
    const totalUsage = user.usage.reduce((sum, usage) => sum + usage.count, 0);
    const remaining = Math.max(0, user.monthlyLimit - totalUsage);

    // Obtener API key activa (asumimos una por usuario por ahora)
    const apiKey = user.apiKeys.find(key => key.isActive)?.key || null;

    // Obtener estadísticas diarias para el gráfico
    const dailyStats = await getDailyUsageStats(id);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        monthlyLimit: user.monthlyLimit,
      },
      usage: {
        total: totalUsage,
        remaining,
        limit: user.monthlyLimit,
      },
      apiKey,
      dailyStats, // Agregamos los datos para el gráfico
    });
  } catch (error) {
    console.error('Error obteniendo datos del dashboard:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
