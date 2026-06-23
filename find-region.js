const dns = require('dns').promises;

const regions = [
    'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
    'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1',
    'ap-south-1', 'ap-northeast-1', 'ap-northeast-2',
    'ap-northeast-3', 'ap-southeast-1', 'ap-southeast-2',
    'sa-east-1', 'ca-central-1'
];

async function findRegion() {
    for (const region of regions) {
        const hostname = `aws-0-${region}.pooler.supabase.com`;
        try {
            await dns.lookup(hostname);
            console.log(`Region found: ${hostname}`);
            // Let's test the connection
            const { PrismaClient } = require('@prisma/client');
            const prisma = new PrismaClient({
                datasources: {
                    db: { url: `postgresql://postgres.rztnqbfhruvzfxpkhxab:Deepak_ishu4748@${hostname}:6543/postgres?pgbouncer=true` }
                }
            });
            await prisma.product.findFirst();
            console.log(`SUCCESS with ${hostname}`);
            await prisma.$disconnect();
            return;
        } catch (e) {
            // ignore
        }
    }
    console.log("No valid pooler found");
}
findRegion();
