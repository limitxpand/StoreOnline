const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ where: { uid: null } });
  let updated = 0;
  for (const user of users) {
    const randomId = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.user.update({
      where: { id: user.id },
      data: { uid: `UID-${randomId}` }
    });
    updated++;
  }
  console.log(`Updated ${updated} users.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
