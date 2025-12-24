import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, recordUsage } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  // Validar API key y verificar rate limit
  const authResult = await authMiddleware(request, '/api/track');
  
  if (!authResult.success) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Agregar headers de rate limit si están disponibles
    if (authResult.rateLimitHeaders) {
      Object.assign(headers, authResult.rateLimitHeaders);
    }
    
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status || 401, headers }
    );
  }

  try {
    // Obtener el body de la petición
    const body = await request.json();

    // Enviar el mismo body a la API externa
    const response = await fetch('https://master.shalom-api.lat/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Obtener la respuesta de la API externa
    const data = await response.json();

    // Registrar el uso si no es la API key master
    if (authResult.user && authResult.apiKey && authResult.user.id !== 'master') {
      const duration = Date.now() - startTime;
      await recordUsage(
        authResult.user.id,
        authResult.apiKey.id,
        '/api/track',
        'POST',
        response.status,
        request.headers.get('x-forwarded-for') || undefined,
        request.headers.get('user-agent') || undefined,
        duration
      );
    }

    // Devolver la respuesta al cliente
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error en /api/track:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
