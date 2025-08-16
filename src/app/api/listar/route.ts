import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { validateApiKey, validateApiKeyLegacyString } from '@/lib/auth';

const DATA_FILE = path.join(process.cwd(), 'data', 'agencias.json');

export async function GET(request: NextRequest) {
  // Validar API key
  const apiKey = request.headers.get('x-api-key');
  
  // Primero intentar validación legacy (API key maestra)
  const isLegacyValid = validateApiKeyLegacyString(apiKey);
  
  if (!isLegacyValid) {
    // Si no es la API key maestra, validar con base de datos
    const authResult = await validateApiKey(apiKey);
    
    if (!authResult.isValid) {
      return NextResponse.json(
        { error: authResult.error || 'API key inválida' },
        { status: 401 }
      );
    }
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
    return NextResponse.json(agencias);
  } catch (error) {
    console.error('Error al leer datos de agencias:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}