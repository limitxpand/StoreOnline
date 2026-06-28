import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getRoyaltySettings } from "@/lib/settings";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'developer') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const developerId = session.user.id;

    // Calculate available amount
    const pendingRoyalties = await prisma.royalty.findMany({
      where: { developerId, status: 'pending' }
    });

    const availableAmount = pendingRoyalties.reduce((sum, r) => sum + r.royaltyAmount, 0);

    const royaltySettings = await getRoyaltySettings();

    if (availableAmount < royaltySettings.minPayoutThreshold) {
      return NextResponse.json({ error: `Minimum withdrawal amount is $${royaltySettings.minPayoutThreshold}` }, { status: 400 });
    }

    // Check if there's already a pending withdrawal
    const existingPending = await prisma.withdrawal.findFirst({
      where: { developerId, status: 'pending' }
    });

    if (existingPending) {
      return NextResponse.json({ error: "You already have a pending withdrawal request." }, { status: 400 });
    }

    const withdrawalStatus = royaltySettings.autoApprovePayouts ? 'completed' : 'pending';

    // Create withdrawal
    const withdrawal = await prisma.withdrawal.create({
      data: {
        developerId,
        amount: availableAmount,
        status: withdrawalStatus
      }
    });

    if (withdrawalStatus === 'completed') {
      // Mark all pending royalties as paid
      await prisma.royalty.updateMany({
        where: { developerId, status: 'pending' },
        data: { status: 'paid' }
      });
    }

    return NextResponse.json({ success: true, status: withdrawalStatus }, { status: 200 });

  } catch (error: any) {
    console.error("Withdrawal error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
