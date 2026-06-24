import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't reveal if user exists or not for security reasons
      return NextResponse.json({ success: true });
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry }
    });

    if (resend) {
      try {
        const resetLink = `https://www.storeonline.in/reset-password?token=${resetToken}`;
        await resend.emails.send({
          from: 'StoreOnline <noreply@storeonline.in>',
          to: user.email,
          subject: 'Reset your StoreOnline password',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #4F46E5;">Password Reset Request</h2>
              <p>Hi ${user.name || 'User'},</p>
              <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
              <div style="margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Reset Password
                </a>
              </div>
              <p>This link will expire in 1 hour.</p>
              <p>Thanks,<br/>StoreOnline Team</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Failed to send reset email:', emailError);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
