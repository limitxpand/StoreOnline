import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Client, Storage, ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const formData = await req.formData();
    
    // Parse files
    const file = formData.get("file") as File | null;
    const oldFileUrl = formData.get("oldFileUrl") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Appwrite Setup
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
      .setKey(process.env.APPWRITE_API_KEY || "");
    const storage = new Storage(client);
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "products_bucket";

    // Helper function to upload to Appwrite
    const uploadToAppwrite = async (f: File) => {
      // Delete old file if exists
      if (oldFileUrl) {
        const fileIdMatch = oldFileUrl.match(/\/files\/([a-zA-Z0-9_\-]+)\/view/);
        if (fileIdMatch && fileIdMatch[1]) {
          try {
            await storage.deleteFile(bucketId, fileIdMatch[1]);
            console.log(`Deleted old QR code: ${fileIdMatch[1]}`);
          } catch (deleteError) {
            console.warn("Could not delete old file:", deleteError);
          }
        }
      }

      const buffer = Buffer.from(await f.arrayBuffer());
      const inputFile = InputFile.fromBuffer(buffer, f.name);
      const uploadedFile = await storage.createFile(bucketId, ID.unique(), inputFile);
      return `https://sgp.cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
    };

    // Upload file to Appwrite
    const fileUrl = await uploadToAppwrite(file);

    return NextResponse.json({ success: true, url: fileUrl }, { status: 201 });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { fileUrl } = await req.json();

    if (!fileUrl) {
      return NextResponse.json({ error: "No fileUrl provided" }, { status: 400 });
    }

    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
      .setKey(process.env.APPWRITE_API_KEY || "");
    const storage = new Storage(client);
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "products_bucket";

    const fileIdMatch = fileUrl.match(/\/files\/([a-zA-Z0-9_\-]+)\/view/);
    if (fileIdMatch && fileIdMatch[1]) {
      await storage.deleteFile(bucketId, fileIdMatch[1]);
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
