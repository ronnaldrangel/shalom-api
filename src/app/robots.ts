import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/listar', '/api/buscar', '/docs'],
      disallow: ['/dashboard/', '/admin/', '/api/admin/', '/api/user/'],
    },
    sitemap: 'https://shalom-api.lat/sitemap.xml',
  };
}
