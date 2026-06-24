import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const adminToken = cookies().get('admin_token');
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const pendingProducts = await prisma.product.findMany({
      where: {
        status: "pending"
      },
      include: {
        developer: {
          select: { name: true, email: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ products: pendingProducts }, { status: 200 });

  } catch (error: any) {
    console.error("Fetch pending products error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
