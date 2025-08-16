import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { authMiddleware } from '@/lib/auth';

interface Agencia {
  ter_id: string;
  nombre: string;
  lugar_over: string;
  direccion: string;
  provincia: string;
  departamento: string;
  telefono: string;
  hora_atencion: string;
  hora_domingo?: string;
  latitud: string;
  longitud: string;
  ter_habilitado_OS: number;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'agencias.json');

export async function GET(request: NextRequest) {
  // Validar API key y verificar rate limit
  const authResult = await authMiddleware(request, '/api/agencia');
  
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
    // Obtener el query parameter
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Parámetro de búsqueda "q" es requerido' },
        { status: 400 }
      );
    }

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

    // Filtrar agencias basado únicamente en el campo 'nombre'
    const queryLower = query.toLowerCase();
    const resultados = agencias.filter((agencia: Agencia) => {
      // Filtrar agencias que tengan ter_habilitado_OS = 0
      if (agencia.ter_habilitado_OS === 0) return false;
      
      // Solo buscar en el campo 'nombre'
      return agencia.nombre?.toLowerCase().includes(queryLower);
    });

    // Devolver los resultados con información adicional
    return NextResponse.json({
      query: query,
      campo_busqueda: 'nombre',
      total: resultados.length,
      resultados: resultados
    });
  } catch (error) {
    console.error('Error al buscar agencias por nombre:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}