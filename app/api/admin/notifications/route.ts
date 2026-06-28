import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token')?.value;
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [pendingProducts, openTickets, pendingWithdrawals] = await Promise.all([
      prisma.product.count({ where: { status: 'pending' } }),
      prisma.ticket.count({ where: { status: 'open' } }),
      prisma.withdrawal.count({ where: { status: 'pending' } })
    ]);

    return NextResponse.json({
      pendingProducts,
      openTickets,
      pendingWithdrawals,
      total: pendingProducts + openTickets + pendingWithdrawals
    });
  } catch (error) {
    console.error('Fetch Admin Notifications Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
