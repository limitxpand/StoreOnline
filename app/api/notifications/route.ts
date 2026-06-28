import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const role = session.user.role;

    if (role === 'developer') {
      const [openTickets, pendingProducts, pendingWithdrawals] = await Promise.all([
        prisma.ticket.count({ where: { userId, status: 'open' } }),
        prisma.product.count({ where: { developerId: userId, status: 'pending' } }),
        prisma.withdrawal.count({ where: { developerId: userId, status: 'pending' } })
      ]);
      
      return NextResponse.json({
        openTickets,
        pendingProducts,
        pendingWithdrawals,
        total: openTickets + pendingProducts + pendingWithdrawals
      });
    } else {
      const openTickets = await prisma.ticket.count({ where: { userId, status: 'open' } });
      
      return NextResponse.json({
        openTickets,
        total: openTickets
      });
    }

  } catch (error) {
    console.error('Fetch User Notifications Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
