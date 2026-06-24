import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const adminToken = cookies().get('admin_token');
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const cats = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ categories: cats }, { status: 200 });

  } catch (error: any) {
    console.error("Admin fetch categories error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminToken = cookies().get('admin_token');
    if (!adminToken) {
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
