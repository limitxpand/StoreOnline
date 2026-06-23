const { execSync } = require('child_process');

const TOKEN = "vcp_6rptUQpnbKnIJpC1aAh9na5b7ZblgyzAWtpotmt9X5ryVZxm1B2qqICG";
const newDbUrl = 'postgresql://postgres:Deepak_ishu4748@db.rztnqbfhruvzfxpkhxab.supabase.co:6543/postgres?schema=public&pgbouncer=true';

function run(cmd) {
    try {
        console.log(`Running: ${cmd}`);
        return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
    } catch (e) {
        console.log(`Failed (maybe not found)`);
    }
}

console.log("Removing DATABASE_URL...");
run(`echo "y" | npx vercel env rm DATABASE_URL production --scope limit-xpand --token ${TOKEN}`);
run(`echo "y" | npx vercel env rm DATABASE_URL preview --scope limit-xpand --token ${TOKEN}`);
run(`echo "y" | npx vercel env rm DATABASE_URL development --scope limit-xpand --token ${TOKEN}`);

console.log("Adding DATABASE_URL...");
execSync(`echo "${newDbUrl}" | npx vercel env add DATABASE_URL production --scope limit-xpand --token ${TOKEN}`, { stdio: 'inherit' });
execSync(`echo "${newDbUrl}" | npx vercel env add DATABASE_URL preview --scope limit-xpand --token ${TOKEN}`, { stdio: 'inherit' });
execSync(`echo "${newDbUrl}" | npx vercel env add DATABASE_URL development --scope limit-xpand --token ${TOKEN}`, { stdio: 'inherit' });

console.log("Done updating DATABASE_URL!");
