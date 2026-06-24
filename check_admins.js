const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const admins = await prisma.user.findMany({ where: { role: 'admin' } });
  console.log("Found admins:", JSON.stringify(admins, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
