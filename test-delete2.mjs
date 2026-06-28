import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDelete() {
  try {
    // create a dummy user
    const user = await prisma.user.create({
      data: {
        email: 'testdelete1@example.com',
        username: 'testdelete1',
        password: 'password',
        role: 'customer'
      }
    });
    
    console.log('Created user:', user.id);
    
    // delete the user
    await prisma.user.delete({
      where: { id: user.id }
    });
    
    console.log('Deleted successfully');
  } catch (e) {
    console.error('Delete error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

testDelete();
