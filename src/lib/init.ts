import { CronJobManager } from './cron-job';

// Función para inicializar servicios de la aplicación
export function initializeApp() {
  if (typeof window === 'undefined') { // Solo en el servidor
    console.log('Inicializando servicios de la aplicación...');
    
    // Iniciar el cron job
    CronJobManager.start();
    
    console.log('Servicios inicializados correctamente');
  }
}

// Auto-ejecutar la inicialización
initializeApp();