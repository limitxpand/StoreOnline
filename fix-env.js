const { execSync } = require('child_process');
const fs = require('fs');

const token = 'vcp_6rptUQpnbKnIJpC1aAh9na5b7ZblgyzAWtpotmt9X5ryVZxm1B2qqICG';
const envFile = fs.readFileSync('.env', 'utf-8');

const lines = envFile.split('\n');
for (let line of lines) {
  line = line.trim();
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
    }
    val = val.replace(/^\uFEFF/g, '');
    if (key.startsWith('#') || !val) continue;
    
    console.log(`Fixing ${key}...`);
    for (const env of ['production', 'preview', 'development']) {
        try { 
            execSync(`npx vercel env rm ${key} ${env} -y --token ${token}`, { stdio: 'ignore' }); 
        } catch(e) {}
        try {
            execSync(`npx vercel env add ${key} ${env} --token ${token}`, { input: val, stdio: 'pipe' });
        } catch(e) {
            console.error(`Failed to add ${key} to ${env}`);
        }
    }
  }
}
console.log('Finished fixing env vars!');
