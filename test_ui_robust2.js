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
    
    const responsePromise = page.waitForResponse(response => response.url().includes('/api/admin/auth'));
    await page.click('button[type="submit"]');
    
    const response = await responsePromise;
    console.log("Login API HTTP Status:", response.status());
    try {
      const json = await response.json();
      console.log("Login JSON:", json);
    } catch (e) {}

    console.log("Waiting for URL to change...");
    try {
      await page.waitForFunction(() => window.location.href.includes('/admin/dashboard'), { timeout: 10000 });
      console.log("SUCCESS! URL changed to dashboard!");
    } catch (e) {
      console.log("URL did not change to dashboard in 10s. Current:", page.url());
    }
    
  } catch (e) {
    console.error("Script failed:", e);
  } finally {
    await browser.close();
  }
})();
