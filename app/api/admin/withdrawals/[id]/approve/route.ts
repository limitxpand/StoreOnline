import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const adminToken = (await cookies()).get('admin_token');
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { id } = await params;

    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id }
    });

    if (!withdrawal) {
      return NextResponse.json({ error: "Withdrawal not found" }, { status: 404 });
    }

    if (withdrawal.status !== 'pending') {
      return NextResponse.json({ error: "Withdrawal is already processed" }, { status: 400 });
    }

    // 1. Mark withdrawal as completed
    await prisma.withdrawal.update({
      where: { id },
      data: { status: 'completed' }
    });

    // 2. Mark all pending royalties for this developer as paid
    await prisma.royalty.updateMany({
      where: { 
        developerId: withdrawal.developerId,
        status: 'pending' 
      },
      data: { status: 'paid' }
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Approve withdrawal error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
