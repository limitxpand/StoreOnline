import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminToken = req.cookies.get('admin_token')?.value;
    if (adminToken !== 'true') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = params.id;

    // We can simulate compiling by simply updating the status
    // The "compiledFileUrl" could theoretically be set here if we had a compilation module
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        status: "published",
        // Fake compiled URL
        compiledFileUrl: `/uploads/compiled/compiled_${productId}.zip` 
      }
    });

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });

  } catch (error: any) {
    console.error("Approve product error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
