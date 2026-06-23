import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'admin') {
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
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'admin') {
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
