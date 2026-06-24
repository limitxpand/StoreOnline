import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    const { sign, ...payloadWithoutSign } = body;

    // Cryptomus Webhook Signature Verification
    // payload -> json string -> base64 -> + API_KEY -> md5
    const jsonString = JSON.stringify(payloadWithoutSign);
    const payloadBase64 = Buffer.from(jsonString).toString('base64');
    const expectedSign = crypto.createHash('md5').update(payloadBase64 + process.env.CRYPTOMUS_API_KEY).digest('hex');

    if (sign !== expectedSign) {
      console.error("Cryptomus Webhook Signature Mismatch");
      // Even if signature fails due to some stringify formatting issue, in a real prod app we might want to check the status via API directly. 
      // For now, we strictly enforce it.
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const { order_id, status } = body;

    // Cryptomus statuses for success: 'paid', 'paid_over'
    if (status !== 'paid' && status !== 'paid_over') {
      // Payment not successful (could be cancel, fail, etc)
      return NextResponse.json({ received: true, status });
    }

    // Process Successful Payment
    const transaction = await prisma.transaction.findUnique({
      where: { id: order_id },
      include: { product: true, user: true }
    });

    if (!transaction) {
      console.error("Transaction not found:", order_id);
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Prevent duplicate processing
    if (transaction.status === 'completed') {
      return NextResponse.json({ received: true, message: "Already processed" });
    }

    // 1. Mark transaction as completed
    await prisma.transaction.update({
      where: { id: order_id },
      data: { status: 'completed' }
    });

    // 2. Generate License Key
    const licenseKey = `LIC-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
    await prisma.license.create({
      data: {
        key: licenseKey,
        userId: transaction.userId,
        productId: transaction.productId,
      }
    });

    // 3. Calculate and insert Royalty (70% for Contributor)
    const platformFeePercent = 0.30;
    const royaltyPercent = 0.70;
    const saleAmount = transaction.amount;
    const platformFee = saleAmount * platformFeePercent;
    const royaltyAmount = saleAmount * royaltyPercent;

    await prisma.royalty.create({
      data: {
        transactionId: transaction.id,
        developerId: transaction.product.developerId,
        saleAmount: saleAmount,
        platformFee: platformFee,
        royaltyAmount: royaltyAmount,
        status: "pending" // Admin will later mark as paid when withdrawn
      }
    });

    // 4. Send Email Notification
    if (resend) {
      try {
        await resend.emails.send({
          from: 'StoreOnline <onboarding@resend.dev>',
          to: transaction.user.email,
          subject: `Your Purchase Receipt: ${transaction.product.title}`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2>Thank you for your purchase!</h2>
              <p>You have successfully purchased <strong>${transaction.product.title}</strong>.</p>
              
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
        console.error("Failed to send email in webhook:", emailError);
      }
    }

    return NextResponse.json({ success: true, received: true });

  } catch (error: any) {
    console.error("Cryptomus webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
