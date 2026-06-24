import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { licenseKey } = await req.json();

    if (!licenseKey) {
      return NextResponse.json({ error: "License key is required" }, { status: 400 });
    }

    const license = await prisma.license.findUnique({
      where: { key: licenseKey },
      include: {
        product: { select: { title: true, status: true, id: true } },
        user: { select: { email: true, name: true, id: true } }
      }
    });

    if (!license) {
      return NextResponse.json({ valid: false, error: "Invalid license key" }, { status: 404 });
    }

    // In a real-world scenario, you could also check if the license is bound to a specific HWID (hardware ID),
    // or if it has expired. Currently, it's a lifetime valid license once purchased.

    return NextResponse.json({
      valid: true,
      product: license.product.title,
      productId: license.product.id,
      customerName: license.user.name,
      customerEmail: license.user.email,
      message: "License verified successfully"
    });

  } catch (error: any) {
    console.error("License verification error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
