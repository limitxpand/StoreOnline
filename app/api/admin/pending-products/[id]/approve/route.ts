import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { Client, Storage, ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const adminToken = (await cookies()).get('admin_token');
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { id: productId } = await params;
    const formData = await req.formData();
    const isAuto = formData.get("isAuto") === "true";
    const compiledFile = formData.get("compiledFile") as File | null;

    let compiledFileUrl = `/uploads/compiled/compiled_${productId}.zip`; // fallback for auto

    if (!isAuto) {
      if (compiledFile) {
        // Appwrite Setup
        const client = new Client()
          .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
          .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
          .setKey(process.env.APPWRITE_API_KEY || "");
        const storage = new Storage(client);
        const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "products_bucket";

        const buffer = Buffer.from(await compiledFile.arrayBuffer());
        const inputFile = InputFile.fromBuffer(buffer, compiledFile.name);
        const uploadedFile = await storage.createFile(bucketId, ID.unique(), inputFile);
        compiledFileUrl = `https://sgp.cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${uploadedFile.$id}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
      } else {
        // Find if platform is android (allow missing file)
        const productCheck = await prisma.product.findUnique({ where: { id: productId }});
        if (productCheck && productCheck.platform.toLowerCase() !== 'android') {
          return NextResponse.json({ error: "Compiled file is required for manual publish." }, { status: 400 });
        }
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        status: "published",
        compiledFileUrl: compiledFileUrl
      }
    });

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });

  } catch (error: any) {
    console.error("Approve product error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
