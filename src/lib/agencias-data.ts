import fs from 'fs';
import path from 'path';

interface Agencia {
  ter_id: number;
  ter_abrebiatura: string;
  zona: string;
  ter_zona: string;
  provincia: string;
  departamento: string;
  lugar: string;
  latitud: string;
  longitud: string;
  sp: string;
  imagen: string;
  direccion: string;
  telefono: string;
  hora_atencion: string;
  hora_domingo: string;
  hora_entrega: string | null;
  detalles: string;
  estadoAgencia: string;
  nombre: string;
  lugar_over: string;
  ter_tipo_destino: string;
  ter_tipo_conexion: string | null;
  ter_estado_agente: string;
  ter_reparto_habilitado: string;
  ter_habilitado_OS: number;
  origen: number;
  destino: number;
  ter_aereo: number;
  ter_estado_pro: string;
  ter_principal: number;
  ter_internacional: number;
  dep_id: number;
  prov_id: number;
  dist_id: number;
  ubi_id: number;
  origenes_aereos: unknown[];
  destinos_aereos: number[];
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