const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://postgres.rztnqbfhruvzfxpkhxab:Deepak_ishu4748@db.rztnqbfhruvzfxpkhxab.pooler.supabase.com:6543/postgres?pgbouncer=true'
        }
    }
});
prisma.product.findFirst().then(console.log).catch(console.error).finally(() => prisma.$disconnect());
