import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please login to purchase." }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Mock Payment Success -> Generate License Key
    const licenseKey = `LIC-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

    // Create Transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        productId: product.id,
        amount: product.price,
        status: "completed"
      }
    });

    // Create License
    const license = await prisma.license.create({
      data: {
        key: licenseKey,
        userId: session.user.id,
        productId: product.id,
      }
    });

    // Send Email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'StoreOnline <onboarding@resend.dev>', // Usually requires verified domain, but onboarding@resend.dev works for testing
          to: session.user.email as string,
          subject: `Your Purchase Receipt: ${product.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2>Thank you for your purchase!</h2>
              <p>You have successfully purchased <strong>${product.title}</strong>.</p>
              
              <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Your License Details</h3>
                <p><strong>License Key:</strong> <code style="background: #e2e2e2; padding: 3px 6px; border-radius: 3px;">${licenseKey}</code></p>
              </div>
              
              <p>You can download your product files from your Customer Dashboard.</p>
              
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #777;">Order ID: ${transaction.id}</p>
              <p style="font-size: 12px; color: #777;">StoreOnline Market</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Continue even if email fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Purchase successful!",
      licenseKey,
      transactionId: transaction.id
    }, { status: 200 });

  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
