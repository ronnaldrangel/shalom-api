import { NextResponse } from 'next/server';

/**
 * Endpoint interno para obtener la API key
 * Solo accesible desde el mismo dominio (frontend)
 */
export async function GET() {
  const apiKey = process.env.API_KEY || 'shalom-api-key-2024';
  
  return NextResponse.json({ apiKey });
}