import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { productId, txHash, network, amount } = await request.json();

    if (!productId || !txHash || !network || !amount) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Check if txHash is already used
    const existingTx = await prisma.transaction.findFirst({
      where: { txHash }
    });

    if (existingTx) {
      return NextResponse.json({ success: false, message: 'Transaction ID already submitted' }, { status: 400 });
    }

    // Create a pending transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        productId,
        amount: parseFloat(amount),
        status: 'pending',
        txHash,
        network
      }
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error: any) {
    console.error('Error submitting TxID:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
