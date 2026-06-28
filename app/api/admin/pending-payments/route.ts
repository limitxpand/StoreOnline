import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const pendingTransactions = await prisma.transaction.findMany({
      where: { status: 'pending' },
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { title: true, price: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, transactions: pendingTransactions });
  } catch (error) {
    console.error('Error fetching pending transactions:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
