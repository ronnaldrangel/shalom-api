import { NextRequest, NextResponse } from 'next/server';
import { requireApiKey } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

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

function generateCompactPNG(agencias: Agencia[], query: string): string {
  const width = 800;
  const itemHeight = 80;
  const padding = 20;
  const headerHeight = 90;
  const itemsPerRow = 2;
  const itemWidth = (width - padding * 3) / itemsPerRow;
  
  // Limitar a 20 agencias máximo
  const limitedAgencias = agencias.slice(0, 20);
  const rows = Math.ceil(limitedAgencias.length / itemsPerRow);
  const contentHeight = rows * (itemHeight + 15) + padding;
  const totalHeight = headerHeight + contentHeight;

  // Función para truncar y capitalizar texto
  const truncateAndCapitalize = (text: string, maxLength: number = 50): string => {
    if (!text) return '';
    const capitalized = text.toUpperCase();
    return capitalized.length > maxLength ? capitalized.substring(0, maxLength) + '...' : capitalized;
  };

  // Función para escapar caracteres especiales en XML/SVG
  const escapeXml = (text: string): string => {
    return text
      // Normalizar acentos y caracteres especiales
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover diacríticos
      // Reemplazar caracteres especiales comunes
      .replace(/ñ/g, 'n')
      .replace(/Ñ/g, 'N')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'U')
      // Escapar XML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      // Mantener solo caracteres ASCII imprimibles
      .replace(/[^\x20-\x7E]/g, '');
  };

  let svg = `
    <svg width="${width}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .header { font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; fill: white; }
          .subtitle { font-family: Arial, sans-serif; font-size: 12px; fill: white; opacity: 0.9; }
          .agency-name { font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; fill: #1f2937; }
          .agency-address { font-family: Arial, sans-serif; font-size: 11px; fill: #6b7280; }
          .bg-red { fill: #dc2626; }
          .bg-white { fill: white; }
          .bg-gray { fill: #f8fafc; }
          .border { stroke: #e2e8f0; stroke-width: 1; fill: none; }
          .shadow { filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1)); }
        </style>
      </defs>
      
      <!-- Header Background with gradient -->
      <defs>
        <linearGradient id="headerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#dc2626;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#b91c1c;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${headerHeight}" fill="url(#headerGradient)"/>
      
      <!-- Header Content -->
      <text x="${padding}" y="35" class="header">Shalom - Agencias</text>
      <text x="${padding}" y="58" class="subtitle">Búsqueda: "${escapeXml(query)}" - ${agencias.length} resultado(s)</text>
      
      <!-- Background for content -->
      <rect x="0" y="${headerHeight}" width="${width}" height="${contentHeight}" class="bg-gray"/>
  `;

  limitedAgencias.forEach((agencia, index) => {
    const row = Math.floor(index / itemsPerRow);
    const col = index % itemsPerRow;
    const x = padding + col * (itemWidth + padding);
    const y = headerHeight + padding + row * (itemHeight + 15);

    const nombre = escapeXml(agencia.lugar_over || agencia.nombre || 'Sin nombre');
    const direccion = escapeXml(truncateAndCapitalize(agencia.direccion || 'Sin dirección', 45));

    svg += `
      <rect x="${x}" y="${y}" width="${itemWidth}" height="${itemHeight}" rx="8" class="bg-white shadow"/>
      <rect x="${x}" y="${y}" width="${itemWidth}" height="${itemHeight}" rx="8" class="border"/>
    
      <!-- Indicador circular mejorado -->
      <circle cx="${x + 20}" cy="${y + 25}" r="8" fill="#dc2626"/>
      <circle cx="${x + 20}" cy="${y + 25}" r="3" fill="white"/>
    
      <!-- Contenido con mejor espaciado -->
      <text x="${x + 35}" y="${y + 25}" class="agency-name">${nombre}</text>
      <text x="${x + 35}" y="${y + 45}" class="agency-address">${direccion}</text>
    `;
  });

  svg += `
    </svg>
  `;

  return svg;
}

export async function GET(request: NextRequest) {
  try {
    // Validar API key
  const authError = requireApiKey(request);
  if (authError) {
    return authError;
  }

    // Obtener parámetro de búsqueda
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Parámetro de búsqueda "query" o "q" es requerido' },
        { status: 400 }
      );
    }

    // Leer datos de agencias
    const agenciasPath = path.join(process.cwd(), 'data', 'agencias.json');
    const agenciasData = fs.readFileSync(agenciasPath, 'utf8');
    const jsonData = JSON.parse(agenciasData);
    const agencias: Agencia[] = jsonData.data || [];

    // Filtrar agencias por nombre y excluir las que tienen ter_habilitado_OS = 0
    const agenciasFiltradas = agencias.filter(agencia => 
      agencia.ter_habilitado_OS !== 0 &&
      agencia.nombre.toLowerCase().includes(query.toLowerCase())
    );

    // Generar SVG compacto
    const svgContent = generateCompactPNG(agenciasFiltradas, query);

    // Convertir SVG a PNG usando sharp
    const pngBuffer = await sharp(Buffer.from(svgContent))
      .png()
      .toBuffer();

    // Retornar PNG con headers apropiados
    return new NextResponse(new Uint8Array(pngBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=1800', // Cache por 30 minutos
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error en API de imagen:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}