import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/database';
import { verifyPassword } from '@/lib/password';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'Cuenta no verificada. Por favor revisa tu correo.' },
        { status: 403 }
      );
    }

    // En un caso real, aquí se generaría un JWT o sesión.
    // Por simplicidad, devolveremos los datos del usuario.
    // El frontend puede guardar estos datos en localStorage/context.
    
    return NextResponse.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        monthlyLimit: user.monthlyLimit,
      },
    });
  } catch (error) {
    console.error('Error iniciando sesión:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
