const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: 'postgresql://postgres.rztnqbfhruvzfxpkhxab:Deepak_ishu4748@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true' } }
});
prisma.user.findFirst().then(user => {
  console.log('Connected to pooler!');
  prisma.$disconnect();
}).catch(e => {
  console.error(e.message);
  prisma.$disconnect();
});
