import { NextRequest } from 'next/server';

// API Key para autenticación
const API_KEY = process.env.API_KEY || 'shalom-api-key-2024';

/**
 * Valida la API key desde los headers de la request
 * @param request - NextRequest object
 * @returns boolean - true si la API key es válida
 */
export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!apiKey) {
    return false;
  }
  
  return apiKey === API_KEY;
}

/**
 * Middleware para validar API key
 * @param request - NextRequest object
 * @returns Response con error 401 si no es válida, null si es válida
 */
export function requireApiKey(request: NextRequest) {
  if (!validateApiKey(request)) {
    return new Response(
      JSON.stringify({ 
        error: 'API key requerida', 
        message: 'Incluye la API key en el header x-api-key o Authorization: Bearer <api-key>' 
      }),
      { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
  
  return null;
}