import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('category');
    const platform = searchParams.get('platform');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;

    const whereClause: any = {
      status: "published", // Only fetch published products
    };

    if (categoryId) whereClause.categoryId = categoryId;
    if (platform) whereClause.platform = platform;

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        developer: {
          select: { name: true }
        },
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return NextResponse.json({ products }, { status: 200 });

  } catch (error: any) {
    console.error("Fetch products error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
