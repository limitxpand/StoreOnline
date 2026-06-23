import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// The worker script will authenticate using a secret token passed in headers
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const workerToken = process.env.WORKER_SECRET_TOKEN || "super_secret_worker_token_123";

    if (!authHeader || authHeader !== `Bearer ${workerToken}`) {
      return NextResponse.json({ error: "Unauthorized worker" }, { status: 401 });
    }

    // Fetch products that are set to 'compiling' status
    const jobs = await prisma.product.findMany({
      where: {
        status: "compiling"
      },
      select: {
        id: true,
        title: true,
        platform: true,
        sourceFileUrl: true,
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json({ jobs }, { status: 200 });

  } catch (error: any) {
    console.error("Fetch compile jobs error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
