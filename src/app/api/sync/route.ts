import { NextRequest, NextResponse } from 'next/server';
import { CronJobManager } from '@/lib/cron-job';
import { requireApiKey } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // Validar API key
  const authError = requireApiKey(request);
  if (authError) {
    return authError;
  }
  try {
    console.log('Ejecutando sincronización manual de agencias...');
    
    await CronJobManager.executeManually();
    
    return NextResponse.json({
      success: true,
      message: 'Sincronización de agencias ejecutada exitosamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error en sincronización manual:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error al ejecutar la sincronización',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Validar API key
  const authError = requireApiKey(request);
  if (authError) {
    return authError;
  }
  
  return NextResponse.json({
    message: 'Endpoint para sincronización manual de agencias',
    usage: 'Envía una petición POST para ejecutar la sincronización',
    cronSchedule: 'Cada 24 horas a las 00:00'
  });
}