import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { validateApiKey, validateApiKeyLegacyString } from '@/lib/auth';

const DATA_FILE = path.join(process.cwd(), 'data', 'agencias.json');

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  // Validar API key
  const apiKey = request.headers.get('x-api-key');

  // Primero intentar validación legacy (API key maestra)
  const isLegacyValid = validateApiKeyLegacyString(apiKey);

  let authResult: any = { isValid: false };

  if (!isLegacyValid) {
    // Si no es la API key maestra, validar con base de datos
    authResult = await validateApiKey(apiKey);

    if (!authResult.isValid) {
      return NextResponse.json(
        { error: authResult.error || 'API key inválida' },
        { status: 401 }
      );
    }
  } else {
    // Es la API key maestra
    authResult = { isValid: true, user: { id: 'master' }, apiKey: { id: 'master' } };
  }
  try {
    // Verificar si el archivo existe
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json(
        { error: 'No hay datos disponibles' },
        { status: 404 }
      );
    }

    // Leer los datos del archivo
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const agencias = JSON.parse(data);

    // Devolver los datos exactamente como vienen de la API externa

    // Registrar uso y log
    if (authResult.isValid && authResult.user && authResult.apiKey) {
      const duration = Date.now() - startTime;
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';

      // Usar recordUsage que ahora soporta logs detallados
      const { recordUsage } = await import('@/lib/auth');
      await recordUsage(
        authResult.user.id,
        authResult.apiKey.id,
        '/api/listar',
        'GET',
        200,
        ip,
        userAgent,
        duration
      );
    }

    return NextResponse.json(agencias);
  } catch (error) {
    console.error('Error al leer datos de agencias:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}