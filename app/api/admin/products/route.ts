import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const adminToken = req.cookies.get('admin_token');
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const products = await prisma.product.findMany({
      where: status ? { status } : undefined,
      include: {
        developer: { select: { name: true, email: true } },
        category: { select: { name: true, platform: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ products }, { status: 200 });

  } catch (error: any) {
    console.error("Admin fetch products error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const adminToken = req.cookies.get('admin_token');
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Product ID and status are required." }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });

  } catch (error: any) {
    console.error("Admin update product error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const adminToken = req.cookies.get('admin_token');
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    // Safely delete transactions and licenses first or use cascade delete
    // Note: We delete licenses, but leave transactions with a null product if we had optional relation.
    // However, Prisma schema says Transaction -> Product is NOT optional.
    // So we must delete related Transactions, Licenses, Royalties, or just delete everything cascade.
    
    // First, find all transactions for this product
    const transactions = await prisma.transaction.findMany({
      where: { productId: id }
    });
    const transactionIds = transactions.map(t => t.id);

    // Delete related Royalties
    await prisma.royalty.deleteMany({
      where: { transactionId: { in: transactionIds } }
    });

    // Delete Transactions
    await prisma.transaction.deleteMany({
      where: { productId: id }
    });

    // Delete Licenses
    await prisma.license.deleteMany({
      where: { productId: id }
    });

    // Delete Product
    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Admin delete product error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
