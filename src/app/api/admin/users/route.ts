import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

async function verifyAdmin(request: NextRequest) {
  const adminId = request.headers.get('x-admin-id');
  if (!adminId) return false;

  const user = await prisma.user.findUnique({
    where: { id: adminId },
  });

  return user?.role === 'admin';
}

export async function GET(request: NextRequest) {
  try {
    if (!await verifyAdmin(request)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        monthlyLimit: true,
        createdAt: true,
        isVerified: true,
        apiKeys: {
          select: {
            key: true,
            isActive: true
          }
        },
        _count: {
          select: { apiKeys: true }
        }
      }
    });

    // Calculate usage for each user
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const usersWithUsage = await Promise.all(
      users.map(async (user) => {
        const usage = await prisma.usage.findMany({
          where: {
            userId: user.id,
            month: currentMonth,
            year: currentYear
          }
        });

        const totalUsage = usage.reduce((sum, u) => sum + u.count, 0);
        const remaining = Math.max(0, user.monthlyLimit - totalUsage);

        return {
          ...user,
          currentUsage: totalUsage,
          remaining
        };
      })
    );

    return NextResponse.json({ users: usersWithUsage });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!await verifyAdmin(request)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!await verifyAdmin(request)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, monthlyLimit, role, isVerified, resetUsage } = body;

    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    const updateData: any = {};

    if (monthlyLimit !== undefined) updateData.monthlyLimit = Number(monthlyLimit);
    if (role !== undefined) updateData.role = role;
    if (isVerified !== undefined) updateData.isVerified = isVerified;

    if (resetUsage) {
      // Reset usage for current month/year
      const now = new Date();
      await prisma.usage.deleteMany({
        where: {
          userId,
          month: now.getMonth() + 1,
          year: now.getFullYear()
        }
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Usuario actualizado correctamente',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
