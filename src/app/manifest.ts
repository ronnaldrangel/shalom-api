import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shalom API - Agencias Oficial',
    short_name: 'Shalom API',
    description: 'Consulta todas las agencias Shalom en tiempo real. Ubicaciones, horarios y servicios.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#dc2626',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/logos/logo.png',
        sizes: 'any',
        type: 'image/png',
      }
    ],
  };
}
