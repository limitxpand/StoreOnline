import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token')?.value;
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { name: true, email: true, uid: true, role: true }
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: { name: true, role: true }
            }
          }
        }
      }
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Fetch Admin Ticket Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token')?.value;
    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await request.json();
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id }
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Get the admin user record for senderId
    const admin = await prisma.user.findFirst({ where: { role: 'admin' } });
    if (!admin) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 500 });
    }

    const message = await prisma.ticketMessage.create({
      data: {
        content,
        ticketId: params.id,
        senderId: admin.id,
        isAdmin: true
      }
    });
    
    // Update ticket updatedAt and reopen it if it was resolved
    await prisma.ticket.update({
      where: { id: params.id },
      data: { 
        updatedAt: new Date(),
        status: 'open' 
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Send Admin Message Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
