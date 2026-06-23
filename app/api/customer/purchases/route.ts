import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all transactions for the user
    const transactions = await prisma.transaction.findMany({
      where: { 
        userId: session.user.id,
        status: "completed"
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            logoUrl: true,
            sourceFileUrl: true,
            platform: true,
            developer: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get all licenses for the user
    const licenses = await prisma.license.findMany({
      where: { userId: session.user.id }
    });

    // Map licenses to their corresponding products
    const purchases = transactions.map(t => {
      const productLicense = licenses.find(l => l.productId === t.productId);
      return {
        id: t.id,
        date: t.createdAt,
        amount: t.amount,
        product: t.product,
        licenseKey: productLicense?.key || null
      };
    });

    return NextResponse.json({ purchases }, { status: 200 });

  } catch (error: any) {
    console.error("Fetch purchases error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
