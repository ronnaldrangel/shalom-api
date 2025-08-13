import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'agencias.json');
const API_URL = 'https://servicesweb.shalomcontrol.com/api/v1/web/agencias/listar';

export class AgenciasService {
  private static ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  static async fetchAndSaveAgencias(): Promise<void> {
    try {
      console.log('Iniciando fetch de agencias desde API externa...');
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Si la API requiere algún body específico, agrégalo aquí
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData = await response.json();
      
      // Asegurar que el directorio existe
      this.ensureDataDirectory();

      // Guardar los datos directamente como vienen de la API externa
      fs.writeFileSync(DATA_FILE, JSON.stringify(apiData, null, 2));
      
      console.log('Datos de agencias guardados exitosamente:', new Date().toISOString());
    } catch (error) {
      console.error('Error al obtener datos de agencias:', error);
      throw error;
    }
  }

  static getStoredData(): unknown | null {
    try {
      if (!fs.existsSync(DATA_FILE)) {
        return null;
      }
      
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al leer datos almacenados:', error);
      return null;
    }
  }
}