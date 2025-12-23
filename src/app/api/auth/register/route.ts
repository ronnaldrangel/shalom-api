import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { hashPassword } from '@/lib/password';
import { sendEmail } from '@/lib/email';
import { randomInt } from 'crypto';

function generateVerificationCode(): string {
  return randomInt(100000, 999999).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 3600000); // 1 hora

    // Crear usuario directamente con Prisma para incluir campos de verificación
    // Usamos prisma importado desde lib/database que es la instancia correcta
    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        monthlyLimit: 10,
        isVerified: false,
        verificationCode,
        verificationExpires,
        apiKeys: {
          create: {
            key: `sk_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 15)}`,
            name: 'Default API Key',
            monthlyLimit: 10,
          },
        },
      },
    });

    // Enviar correo de verificación
    await sendEmail(
      email,
      'Verifica tu cuenta - Shalom API',
      `
      <h1>Bienvenido a Shalom API</h1>
      <p>Gracias por registrarte. Para activar tu cuenta, utiliza el siguiente código de verificación:</p>
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4f46e5;">${verificationCode}</span>
      </div>
      <p>Este código expirará en 1 hora.</p>
      `
    );

    return NextResponse.json({
      message: 'Usuario registrado exitosamente. Por favor verifica tu correo.',
      needsVerification: true,
      email: user.email,
    });
  } catch (error) {
    console.error('Error registrando usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
