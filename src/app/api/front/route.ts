import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Agencia {
  lugar_over?: string;
  nombre?: string;
  direccion?: string;
  telefono?: string;
  hora_atencion?: string;
  hora_domingo?: string;
  ter_habilitado_OS?: number;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'agencias.json');

export async function GET(request: NextRequest) {
  // Protección interna - solo permitir requests desde el mismo origen
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');
  const userAgent = request.headers.get('user-agent') || '';

  // Verificar que el request viene del mismo host
  if (origin && !origin.includes('localhost:3000')) {
    return NextResponse.json(
      { error: 'Acceso no autorizado - origen inválido' },
      { status: 403 }
    );
  }

  // Verificar referer si está presente
  if (referer && !referer.includes('localhost:3000')) {
    return NextResponse.json(
      { error: 'Acceso no autorizado - referer inválido' },
      { status: 403 }
    );
  }

  // Bloquear user agents sospechosos
  const suspiciousAgents = ['curl', 'wget', 'postman', 'insomnia', 'httpie'];
  if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    return NextResponse.json(
      { error: 'Acceso no autorizado - user agent no permitido' },
      { status: 403 }
    );
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
    const fileData = fs.readFileSync(DATA_FILE, 'utf8');
    const jsonData = JSON.parse(fileData);
    const agencias = jsonData.data || [];

    return NextResponse.json({
      success: true,
      data: agencias,
      total: agencias.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error al leer agencias:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}