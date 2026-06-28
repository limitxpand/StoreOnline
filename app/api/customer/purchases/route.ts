import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getRoyaltySettings } from "@/lib/settings";

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
    const purchases = transactions.map((t: any) => {
      const productLicense = licenses.find((l: any) => l.productId === t.productId);
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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    // Check if transaction already exists
    const existing = await prisma.transaction.findFirst({
      where: {
        userId: session.user.id,
        productId: productId,
        status: "completed"
      }
    });

    if (existing) {
      return NextResponse.json({ message: "Already purchased", transaction: existing });
    }

    // Fetch product to get price, though we treat it as 0 for download
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        productId: productId,
        amount: product.price || 0,
        status: "completed"
      }
    });

    if (product.price > 0 && product.developerId) {
      const royaltySettings = await getRoyaltySettings();
      const platformFeePct = royaltySettings.platformCommission / 100;
      const platformFee = product.price * platformFeePct;
      const royaltyAmount = product.price - platformFee;

      await prisma.royalty.create({
        data: {
          transactionId: transaction.id,
          developerId: product.developerId,
          saleAmount: product.price,
          platformFee: platformFee,
          royaltyAmount: royaltyAmount,
          status: "pending"
        }
      });
    }

    return NextResponse.json({ message: "Purchase registered", transaction }, { status: 201 });
  } catch (error: any) {
    console.error("Purchase registration error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
