import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'developer') {
      return NextResponse.json({ error: "Unauthorized. Only developers can upload products." }, { status: 401 });
    }

    const data = await req.json();

    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        platform: data.platform,
        categoryId: data.categoryId,
        developerId: (session.user as any).id,
        logoUrl: data.logoUrl,
        sourceFileUrl: data.sourceFileUrl,
        compiledFileUrl: data.compiledFileUrl,
        status: "pending", // Requires admin approval
      }
    });

    return NextResponse.json({ success: true, product }, { status: 201 });

  } catch (error: any) {
    console.error("Upload product error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
