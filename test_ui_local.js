const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    
    console.log("Navigating to http://localhost:3000/admin/login ...");
    await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle2', timeout: 30000 });
    
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

    await new Promise(r => setTimeout(r, 2000));
    
    const errorText = await page.evaluate(() => {
      const el = document.querySelector('div[style*="rgba(239, 68, 68, 0.1)"]');
      return el ? el.innerText : null;
    });
    
    console.log("Error text on screen:", errorText);
    console.log("Current URL:", page.url());
    
  } catch (e) {
    console.error("Script failed:", e);
  } finally {
    await browser.close();
  }
})();
