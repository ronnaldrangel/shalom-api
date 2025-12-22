import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si requestLog existe en Prisma Client
    if (!prisma.requestLog) {
      // Fallback con queryRaw para cuando el cliente no se ha regenerado pero la tabla existe
      try {
        const totalResult = await prisma.$queryRaw<Array<{count: bigint}>>`
          SELECT COUNT(*) as count FROM "request_logs" WHERE "userId" = ${id}
        `;
        const total = Number(totalResult[0]?.count || 0);
        
        const logsRaw = await prisma.$queryRaw<Array<{
          id: string;
          endpoint: string;
          method: string;
          status: number;
          ip: string;
          duration: number;
          createdAt: Date;
          userAgent: string;
          apiKeyName: string | null;
        }>>`
          SELECT 
            l.id, l.endpoint, l.method, l.status, l.ip, l.duration, l."createdAt", l."userAgent",
            k.name as "apiKeyName"
          FROM "request_logs" l
          LEFT JOIN "api_keys" k ON l."apiKeyId" = k.id
          WHERE l."userId" = ${id}
          ORDER BY l."createdAt" DESC
          LIMIT ${limit} OFFSET ${skip}
        `;

        // Formatear logs para que coincidan con la estructura esperada
        const logs = logsRaw.map(log => ({
          id: log.id,
          endpoint: log.endpoint,
          method: log.method,
          status: log.status,
          ip: log.ip,
          duration: log.duration,
          userAgent: log.userAgent,
          createdAt: log.createdAt,
          apiKey: {
            name: log.apiKeyName
          }
        }));
        
        return NextResponse.json({
          logs,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        });
      } catch (e) {
        console.error('Error en fallback raw query:', e);
        return NextResponse.json({
          logs: [],
          pagination: {
            total: 0,
            page,
            limit,
            totalPages: 0,
          },
        });
      }
    }

    // Obtener total de logs
    const total = await prisma.requestLog.count({
      where: { userId: id },
    });

    // Obtener logs paginados
    const logs = await prisma.requestLog.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip,
      select: {
        id: true,
        endpoint: true,
        method: true,
        status: true,
        ip: true,
        userAgent: true,
        duration: true,
        createdAt: true,
        apiKey: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error obteniendo logs:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
