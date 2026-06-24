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

    // Create pending Transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        productId: product.id,
        amount: product.price,
        status: "pending"
      }
    });

    const baseUrl = process.env.NEXTAUTH_URL || `https://${req.headers.get('host')}`;

    // Prepare Cryptomus Payload
    const payload = {
      amount: product.price.toString(),
      currency: "USD",
      order_id: transaction.id,
      url_return: `${baseUrl}/customer/dashboard`,
      url_callback: `${baseUrl}/api/webhooks/cryptomus`,
      is_payment_multiple: false,
      lifetime: 3600 // 1 hour
    };

    const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64');
    const sign = crypto.createHash('md5').update(payloadBase64 + process.env.CRYPTOMUS_API_KEY).digest('hex');

    // Call Cryptomus API
    const cryptomusResponse = await fetch('https://api.cryptomus.com/v1/payment', {
      method: 'POST',
      headers: {
        'merchant': process.env.CRYPTOMUS_MERCHANT_ID || '',
        'sign': sign,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const cryptomusData = await cryptomusResponse.json();

    if (!cryptomusResponse.ok || cryptomusData.state !== 0) {
      console.error("Cryptomus API Error:", cryptomusData);
      return NextResponse.json({ error: "Failed to create payment with Cryptomus" }, { status: 500 });
    }

    // cryptomusData.result.url contains the checkout URL
    return NextResponse.json({ 
      success: true, 
      paymentUrl: cryptomusData.result.url,
      transactionId: transaction.id
    }, { status: 200 });

  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
