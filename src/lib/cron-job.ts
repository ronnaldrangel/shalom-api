import * as cron from 'node-cron';
import { AgenciasService } from './agencias-service';

export class CronJobManager {
  private static job: cron.ScheduledTask | null = null;

  static start() {
    // Detener el job anterior si existe
    if (this.job) {
      this.job.stop();
    }

    console.log('Iniciando cron job para actualización de agencias...');
    
    // Ejecutar inmediatamente al iniciar
    this.executeJob();

    // Programar para ejecutarse cada 24 horas a las 00:00
    this.job = cron.schedule('0 0 * * *', () => {
      this.executeJob();
    }, {
      timezone: 'America/Mexico_City' // Ajusta según tu zona horaria
    });

    console.log('Cron job programado para ejecutarse cada 24 horas a las 00:00');
  }

  static stop() {
    if (this.job) {
      this.job.stop();
      this.job = null;
      console.log('Cron job detenido');
    }
  }

  private static async executeJob() {
    try {
      console.log('Ejecutando actualización de agencias:', new Date().toISOString());
      await AgenciasService.fetchAndSaveAgencias();
      console.log('Actualización de agencias completada exitosamente');
    } catch (error) {
      console.error('Error en la actualización programada de agencias:', error);
    }
  }

  // Método para ejecutar manualmente (útil para testing)
  static async executeManually() {
    await this.executeJob();
  }
}