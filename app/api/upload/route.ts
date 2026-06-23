import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Client, Storage, ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'developer') {
      return NextResponse.json({ error: "Unauthorized. Developer access required." }, { status: 401 });
    }

    const formData = await req.formData();
    
    // Parse text fields
    const title = formData.get("title") as string;
    const categorySlug = formData.get("category") as string;
    const price = parseFloat(formData.get("price") as string);
    const platform = formData.get("platform") as string;
    const description = formData.get("description") as string;
    
    // Parse files
    const logoFile = formData.get("logo") as File | null;
    const sourceFile = formData.get("source") as File | null;

    if (!title || !categorySlug || isNaN(price) || !platform || !description || !logoFile || !sourceFile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Appwrite Setup
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
      .setKey(process.env.APPWRITE_API_KEY || "");
    const storage = new Storage(client);
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "products_bucket";

    // Helper function to upload to Appwrite
    const uploadToAppwrite = async (file: File) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const inputFile = InputFile.fromBuffer(buffer, file.name);
      const uploadedFile = await storage.createFile(bucketId, ID.unique(), inputFile);
      return `https://sgp.cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
    };

    // Upload files to Appwrite
    const logoUrl = await uploadToAppwrite(logoFile);
    
    // Note: for zip/source files you might want to use /download instead of /view 
    const bufferSrc = Buffer.from(await sourceFile.arrayBuffer());
    const inputSrcFile = InputFile.fromBuffer(bufferSrc, sourceFile.name);
    const uploadedSrcFile = await storage.createFile(bucketId, ID.unique(), inputSrcFile);
    const sourceFileUrl = `https://sgp.cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${uploadedSrcFile.$id}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;

    // Find or create category
    let category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    });
    
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categorySlug,
          slug: categorySlug,
          platform: platform
        }
      });
    }

    // Insert Product into Database
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        platform,
        status: "pending",
        logoUrl: logoUrl,
        sourceFileUrl: sourceFileUrl,
        developerId: session.user.id,
        categoryId: category.id,
      }
    });

    return NextResponse.json({ success: true, product }, { status: 201 });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
