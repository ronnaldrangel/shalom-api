import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple health check que verifica que la aplicación está funcionando
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      message: 'API funcionando correctamente'
    }, { status: 200 });
  } catch {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Error en el health check'
    }, { status: 500 });
  }
}