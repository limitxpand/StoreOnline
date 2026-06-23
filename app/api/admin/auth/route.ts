import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/settings';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, username, password, secretCode, newPassword } = body;
    const settings = getSettings();
    const admin = settings.admin;

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
        // Update password
        saveSettings({
          admin: {
            username: admin.username,
            secretCode: admin.secretCode,
            password: newPassword
          }
        });
        return NextResponse.json({ success: true, message: 'Password reset successfully' });
      }
      return NextResponse.json({ success: false, message: 'Invalid secret code' }, { status: 401 });
    }

    if (action === 'change_secret') {
      // Must verify current password to change secret
      if (password === admin.password) {
        saveSettings({
          admin: {
            username: admin.username,
            password: admin.password,
            secretCode: secretCode // This is the new secret code
          }
        });
        return NextResponse.json({ success: true, message: 'Secret code updated successfully' });
      }
      return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Auth Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
