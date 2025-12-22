import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { verifyPassword, hashPassword } from '@/lib/password';
import { Prisma } from '@/generated/prisma';

export async function PUT(request: NextRequest) {
  try {
    const { userId, currentPassword, name, newPassword } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario es requerido' },
        { status: 400 }
      );
    }

    // 1. Buscar usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // 2. Verificar si se requiere validación de contraseña
    // Si se envía newPassword, la contraseña actual es obligatoria
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'La contraseña actual es requerida para cambiar la contraseña' },
          { status: 400 }
        );
      }
      
      if (!user.password) {
        return NextResponse.json(
          { error: 'El usuario no tiene contraseña establecida' },
          { status: 400 }
        );
      }

      const isPasswordValid = await verifyPassword(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'La contraseña actual es incorrecta' },
          { status: 401 }
        );
      }
    }

    // 3. Preparar datos para actualizar
    const updateData: Prisma.UserUpdateInput = {};
    
    if (name) {
      updateData.name = name;
    }

    if (newPassword) {
      updateData.password = await hashPassword(newPassword);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: 'No se enviaron datos para actualizar' },
        { status: 200 }
      );
    }

    // 4. Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Perfil actualizado correctamente',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        monthlyLimit: updatedUser.monthlyLimit,
      },
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al actualizar el perfil' },
      { status: 500 }
    );
  }
}
