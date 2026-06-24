import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (role !== 'customer' && role !== 'contributor') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const dbRole = role === 'contributor' ? 'developer' : 'customer';

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate Verification Token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: dbRole,
        isVerified: false,
        verificationToken,
      },
    });

    // Send Verification Email
    if (resend) {
      try {
        const verifyLink = `https://www.storeonline.in/verify-email?token=${verificationToken}`;
        await resend.emails.send({
          from: 'StoreOnline <onboarding@resend.dev>', // In production, use your verified domain e.g. noreply@storeonline.in
          to: user.email,
          subject: 'Verify your StoreOnline account',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #4F46E5;">Welcome to StoreOnline!</h2>
              <p>Hi ${user.name},</p>
              <p>Thank you for registering. Please click the button below to verify your email address and activate your account.</p>
              <div style="margin: 30px 0;">
                <a href="${verifyLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Verify Email Address
                </a>
              </div>
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p><a href="${verifyLink}" style="color: #4F46E5;">${verifyLink}</a></p>
              <p>Thanks,<br/>StoreOnline Team</p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // We don't fail the registration if email fails, but they will need to contact support.
      }
    } else {
      console.warn("RESEND_API_KEY is not set. Verification email skipped.");
    }

    return NextResponse.json({
      message: 'User registered successfully. Please check your email to verify.',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
