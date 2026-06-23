import { NextResponse } from 'next/server';
import { getWebsiteSettings, saveSettings } from '@/lib/settings';

export async function GET() {
  try {
    const settings = getWebsiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to load settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    saveSettings({ website: body });
    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save settings' }, { status: 500 });
  }
}
