import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'agencias.json');

export async function GET() {
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
    return NextResponse.json(agencias);
  } catch (error) {
    console.error('Error al leer datos de agencias:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}