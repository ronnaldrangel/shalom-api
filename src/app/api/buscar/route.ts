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

export async function GET(request: Request) {
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

    // Filtrar agencias basado en el término de búsqueda
    const queryLower = query.toLowerCase();
    const resultados = agencias.filter((agencia: Agencia) => {
      // Filtrar agencias que tengan ter_habilitado_OS = 0
      if (agencia.ter_habilitado_OS === 0) return false;
      
      return (
        agencia.lugar_over?.toLowerCase().includes(queryLower) ||
        agencia.nombre?.toLowerCase().includes(queryLower) ||
        agencia.direccion?.toLowerCase().includes(queryLower) ||
        agencia.telefono?.toLowerCase().includes(queryLower) ||
        agencia.hora_atencion?.toLowerCase().includes(queryLower) ||
        agencia.hora_domingo?.toLowerCase().includes(queryLower)
      );
    });

    // Devolver los resultados con información adicional
    return NextResponse.json({
      query: query,
      total: resultados.length,
      resultados: resultados
    });
  } catch (error) {
    console.error('Error al buscar agencias:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}