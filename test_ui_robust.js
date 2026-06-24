const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    console.log("Navigating to https://www.storeonline.in/admin/login ...");
    await page.goto('https://www.storeonline.in/admin/login', { waitUntil: 'networkidle2', timeout: 30000 });
    
    console.log("Typing admin / admin...");
    await page.type('#username', 'admin');
    await page.type('#password', 'admin');
    
    console.log("Clicking submit...");
    
    const startTime = Date.now();
    await page.click('button[type="submit"]');
    
    console.log("Waiting for URL to change to /admin/dashboard...");
    await page.waitForFunction(() => window.location.href.includes('/admin/dashboard'), { timeout: 30000 });
    
    const endTime = Date.now();
    console.log(`SUCCESS! Reached dashboard in ${endTime - startTime}ms.`);
    
  } catch (e) {
    console.error("Script failed:", e);
  } finally {
    await browser.close();
  }
})();
