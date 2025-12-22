import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email y código son requeridos' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json({
        message: 'La cuenta ya está verificada',
        verified: true,
      });
    }

    if (user.verificationCode !== code) {
      return NextResponse.json(
        { error: 'Código de verificación incorrecto' },
        { status: 400 }
      );
    }

    if (user.verificationExpires && new Date() > user.verificationExpires) {
      return NextResponse.json(
        { error: 'El código de verificación ha expirado' },
        { status: 400 }
      );
    }

    // Verificar usuario y limpiar código
    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        verificationCode: null,
        verificationExpires: null,
      },
    });

    return NextResponse.json({
      message: 'Cuenta verificada exitosamente',
      verified: true,
    });
  } catch (error) {
    console.error('Error verificando usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
