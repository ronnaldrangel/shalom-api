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