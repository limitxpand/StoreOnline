import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error: any) {
    console.error("Admin fetch categories error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { name, platform, slug } = await req.json();

    if (!name || !platform || !slug) {
      return NextResponse.json({ error: "Name, platform, and slug are required." }, { status: 400 });
    }

    const newCategory = await prisma.category.create({
      data: { name, platform, slug }
    });

    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });

  } catch (error: any) {
    console.error("Admin create category error:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "A category with this slug already exists." }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
