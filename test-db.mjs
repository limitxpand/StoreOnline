import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No user found');
      return;
    }
    
    console.log('User role:', user.role);
    console.log('User isBanned:', user.isBanned);
    
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { isBanned: true }
    });
    
    console.log('Update successful, isBanned:', updated.isBanned);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { isBanned: false }
    });
    
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
