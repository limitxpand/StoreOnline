import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: { pid: null },
  });

  for (const product of products) {
    let unique = false;
    let newPid = '';
    
    while (!unique) {
      newPid = `PID-${Math.floor(100000 + Math.random() * 900000)}`;
      const existing = await prisma.product.findUnique({
        where: { pid: newPid },
      });
      if (!existing) {
        unique = true;
      }
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { pid: newPid },
    });
    console.log(`Assigned ${newPid} to product ${product.id}`);
  }

  console.log('Finished assigning PIDs.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
