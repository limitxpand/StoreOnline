import { NextResponse } from 'next/server';
import { getPaymentSettings, saveSettings } from '@/lib/settings';

export async function GET() {
  try {
    const settings = await getPaymentSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to load payment settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await saveSettings({ payment: body });
    return NextResponse.json({ success: true, message: 'Payment settings saved successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to save payment settings' }, { status: 500 });
  }
}
