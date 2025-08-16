import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey as dbValidateApiKey, checkMonthlyLimit, incrementUsage } from './database';

// API Key para autenticación
const API_KEY = process.env.API_KEY || 'shalom-api-key-2024';

export interface AuthResult {
  isValid: boolean;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  apiKey?: {
    id: string;
    name: string;
    monthlyLimit: number;
  };
  error?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  currentUsage: number;
  limit: number;
  remaining: number;
  error?: string;
}

// Función de validación de API key con base de datos
export async function validateApiKey(apiKey: string | null): Promise<AuthResult> {
  if (!apiKey) {
    return { isValid: false, error: 'API key requerida' };
  }

  try {
    const result = await dbValidateApiKey(apiKey);
    
    if (!result) {
      return { isValid: false, error: 'API key inválida' };
    }

    return {
      isValid: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name || undefined,
      },
      apiKey: {
        id: result.id,
        name: result.name,
        monthlyLimit: result.monthlyLimit,
      },
    };
  } catch (error) {
    console.error('Error validando API key:', error);
    return { isValid: false, error: 'Error interno del servidor' };
  }
}

// Función para verificar límite de uso por usuario
export async function checkRateLimit(
  userId: string,
  apiKeyId: string,
  endpoint: string
): Promise<RateLimitResult> {
  try {
    const limitCheck = await checkMonthlyLimit(userId, apiKeyId, endpoint);
    
    return {
      allowed: limitCheck.allowed,
      currentUsage: limitCheck.currentUsage,
      limit: limitCheck.limit,
      remaining: Math.max(0, limitCheck.limit - limitCheck.currentUsage),
    };
  } catch (error) {
    console.error('Error verificando límite:', error);
    return {
      allowed: false,
      currentUsage: 0,
      limit: 0,
      remaining: 0,
      error: 'Error verificando límite de uso',
    };
  }
}

// Función para registrar el uso de una API
export async function recordUsage(
  userId: string,
  apiKeyId: string,
  endpoint: string
): Promise<void> {
  try {
    await incrementUsage(userId, apiKeyId, endpoint);
  } catch (error) {
    console.error('Error registrando uso:', error);
    // No lanzamos error para no interrumpir la respuesta
  }
}

// Función requireApiKey que soporta API key master
export function requireApiKey(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key') || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  // Primero verificar si es la API key master
  if (validateApiKeyLegacyString(apiKey)) {
    return null; // API key master válida, no hay error
  }
  
  // Si no es la API key master, devolver error (las rutas que usan requireApiKey no necesitan validación de base de datos)
  return NextResponse.json(
    { error: 'API key inválida o requerida' },
    { status: 401 }
  );
}

// Función legacy para compatibilidad (mantener por ahora)
export function validateApiKeyLegacy(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '');
  return validateApiKeyLegacyString(apiKey);
}

export function validateApiKeyLegacyString(apiKey: string | null): boolean {
  if (!apiKey) return false;
  
  const validKey = process.env.API_KEY || 'shalom-api-key-2024';
  return apiKey === validKey;
}

// Middleware completo para autenticación y rate limiting
export async function authMiddleware(
  request: NextRequest,
  endpoint: string
): Promise<{
  success: boolean;
  user?: any;
  apiKey?: any;
  rateLimitHeaders?: Record<string, string>;
  error?: string;
  status?: number;
}> {
  // Extraer API key de los headers
  const apiKeyHeader = request.headers.get('x-api-key') || 
                      request.headers.get('authorization')?.replace('Bearer ', '');

  if (!apiKeyHeader) {
    return {
      success: false,
      error: 'API key requerida. Incluye x-api-key en los headers.',
      status: 401,
    };
  }

  // Primero verificar si es la API key master
  if (validateApiKeyLegacyString(apiKeyHeader)) {
    // API key master válida, permitir acceso sin rate limiting
    return {
      success: true,
      user: { id: 'master', email: 'master@shalomapi.com', name: 'Master User' },
      apiKey: { id: 'master', name: 'Master API Key', monthlyLimit: 999999 },
      rateLimitHeaders: {
        'X-RateLimit-Limit': '999999',
        'X-RateLimit-Remaining': '999999',
        'X-RateLimit-Used': '0',
      },
    };
  }

  // Si no es la API key master, validar con base de datos
  const authResult = await validateApiKey(apiKeyHeader);
  
  if (!authResult.isValid) {
    return {
      success: false,
      error: authResult.error || 'API key inválida',
      status: 401,
    };
  }

  // Verificar rate limit
  const rateLimitResult = await checkRateLimit(authResult.user!.id, authResult.apiKey!.id, endpoint);
  
  if (!rateLimitResult.allowed) {
    return {
      success: false,
      error: `Límite mensual excedido. Uso actual: ${rateLimitResult.currentUsage}/${rateLimitResult.limit}`,
      status: 429,
      rateLimitHeaders: {
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Used': rateLimitResult.currentUsage.toString(),
      },
    };
  }

  // Registrar el uso (async, no bloquea la respuesta)
  recordUsage(authResult.user!.id, authResult.apiKey!.id, endpoint);

  return {
    success: true,
    user: authResult.user,
    apiKey: authResult.apiKey,
    rateLimitHeaders: {
      'X-RateLimit-Limit': rateLimitResult.limit.toString(),
      'X-RateLimit-Remaining': (rateLimitResult.remaining - 1).toString(), // -1 porque ya se va a usar
      'X-RateLimit-Used': (rateLimitResult.currentUsage + 1).toString(), // +1 porque ya se va a usar
    },
  };
}