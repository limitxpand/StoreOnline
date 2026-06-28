import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { uid: null }
    });
    
    let updated = 0;
    for (const user of users) {
      const randomId = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit random number
      await prisma.user.update({
        where: { id: user.id },
        data: { uid: `UID-${randomId}` }
      });
      updated++;
    }
    
    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
