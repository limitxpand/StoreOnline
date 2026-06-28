import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import crypto from 'crypto';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json(); // 'approve' or 'reject'
    const resolvedParams = await params;

    const transaction = await prisma.transaction.findUnique({
      where: { id: resolvedParams.id },
      include: { product: true }
    });

    if (!transaction) {
      return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
    }

    if (transaction.status !== 'pending') {
      return NextResponse.json({ success: false, message: 'Transaction is not pending' }, { status: 400 });
    }

    if (action === 'approve') {
      // Update transaction status
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'completed' }
      });

      // Generate a license key for the user
      const licenseKey = crypto.randomBytes(16).toString('hex').toUpperCase();
      await prisma.license.create({
        data: {
          key: licenseKey,
          userId: transaction.userId,
          productId: transaction.productId
        }
      });

      return NextResponse.json({ success: true, message: 'Payment approved and license generated.' });
    } else if (action === 'reject') {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'failed' }
      });
      return NextResponse.json({ success: true, message: 'Payment rejected.' });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
