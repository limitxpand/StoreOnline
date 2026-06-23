import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function getAdminUser() {
  let admin = await prisma.user.findFirst({ where: { role: 'admin' } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: 'admin@system.local',
        username: 'admin',
        password: 'admin',
        role: 'admin',
        secretCode: '333725',
        name: 'Super Admin'
      }
    });
  }
  return admin;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, username, password, secretCode, newPassword, newUsername } = body;
    const admin = await getAdminUser();

    if (action === 'login') {
      if (username === admin.username && password === admin.password) {
        // Successful login
        const response = NextResponse.json({ success: true, message: 'Logged in successfully' });
        response.cookies.set({
          name: 'admin_token',
          value: 'true',
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60 * 24 // 1 day
        });
        return response;
      }
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
      response.cookies.set({
        name: 'admin_token',
        value: '',
        httpOnly: true,
        path: '/',
        maxAge: 0 // Expire immediately
      });
      return response;
    }

    if (action === 'reset_password') {
      if (secretCode === admin.secretCode) {
        await prisma.user.update({
          where: { id: admin.id },
          data: {
            username: newUsername || 'admin',
            password: newPassword || 'admin'
          }
        });
        return NextResponse.json({ success: true, message: 'Credentials reset successfully' });
      }
      return NextResponse.json({ success: false, message: 'Invalid secret code' }, { status: 401 });
    }

    if (action === 'change_secret') {
      // Must verify current password to change secret
      if (password === admin.password) {
        await prisma.user.update({
          where: { id: admin.id },
          data: { secretCode }
        });
        return NextResponse.json({ success: true, message: 'Secret code updated successfully' });
      }
      return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
    }

    if (action === 'change_credentials') {
      // Allow changing username and password by verifying the current password
      const { currentPassword } = body;
      if (currentPassword === admin.password) {
        await prisma.user.update({
          where: { id: admin.id },
          data: {
            username: newUsername || admin.username,
            password: newPassword || admin.password
          }
        });
        return NextResponse.json({ success: true, message: 'Credentials updated successfully' });
      }
      return NextResponse.json({ success: false, message: 'Invalid current password' }, { status: 401 });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Auth Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
