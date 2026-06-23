const { PrismaClient } = require('@prisma/client');
const regions = [
    'ap-northeast-1', 'ap-northeast-2', 'ap-south-1', 'ap-southeast-1', 'ap-southeast-2',
    'ca-central-1', 'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3',
    'sa-east-1', 'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2'
];

async function testRegion(region) {
    const url = `postgresql://postgres.rztnqbfhruvzfxpkhxab:Deepak_ishu4748@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
    const prisma = new PrismaClient({
        datasources: { db: { url } }
    });
    try {
        await prisma.product.findFirst();
        console.log(`[SUCCESS] Region found: ${region}`);
        return true;
    } catch (e) {
        if (e.message.includes("tenant or user not found")) {
            console.log(`[${region}] Wrong region (tenant not found)`);
        } else {
            console.log(`[${region}] Error: ${e.message}`);
        }
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

async function run() {
    for (const region of regions) {
        if (await testRegion(region)) break;
    }
    console.log("Done testing regions.");
}
run();
