import fs from 'fs';
import path from 'path';

interface Agencia {
  ter_id: string;
  ter_abrebiatura: string;
  zona: string;
  ter_zona: string;
  provincia: string;
  departamento: string;
  nombre: string;
  lugar_over: string;
  direccion: string;
  telefono: string;
  hora_atencion: string;
  hora_domingo?: string;
  latitud: string;
  longitud: string;
  ter_habilitado_OS: number;
}

interface AgenciasResponse {
  success: boolean;
  message: string;
  data: Agencia[];
}

const DATA_FILE = path.join(process.cwd(), 'data', 'agencias.json');

/**
 * Lee los datos de agencias directamente del archivo JSON
 * Esta función se ejecuta en el servidor y no expone ninguna API
 */
export async function getAgenciasData(): Promise<AgenciasResponse> {
  try {
    // Verificar si el archivo existe
    if (!fs.existsSync(DATA_FILE)) {
      return {
        success: false,
        message: 'No hay datos disponibles',
        data: []
      };
    }

    // Leer los datos del archivo directamente desde el servidor
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const agencias = JSON.parse(data);

    // Devolver los datos exactamente como vienen del archivo
    return agencias;
  } catch (error) {
    console.error('Error al leer datos de agencias:', error);
    return {
      success: false,
      message: 'Error interno del servidor',
      data: []
    };
  }
}

export type { Agencia, AgenciasResponse };