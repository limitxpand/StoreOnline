import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tickets = await prisma.ticket.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Fetch Tickets Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, initialMessage } = await request.json();
    if (!subject || !initialMessage) {
      return NextResponse.json({ error: 'Subject and initial message are required' }, { status: 400 });
    }

    const ticket = await prisma.ticket.create({
      data: {
        subject,
        userId: session.user.id,
        messages: {
          create: {
            content: initialMessage,
            senderId: session.user.id,
            isAdmin: false
          }
        }
      }
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Create Ticket Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
