import { prisma } from './lib/prisma';

async function testDelete() {
  const users = await prisma.user.findMany();
  console.log('Users:', users.length);
  if (users.length > 0) {
    const userToBan = users.find(u => u.role !== 'admin');
    if (userToBan) {
      console.log('Trying to ban user:', userToBan.id);
      try {
        await prisma.user.update({
          where: { id: userToBan.id },
          data: { isBanned: true }
        });
        console.log('Banned successfully');
      } catch (e) {
        console.error('Ban failed:', e);
      }

      console.log('Trying to delete user:', userToBan.id);
      try {
        await prisma.user.delete({
          where: { id: userToBan.id }
        });
        console.log('Deleted successfully');
      } catch (e) {
        console.error('Delete failed:', e);
      }
    }
  }
}

testDelete();
