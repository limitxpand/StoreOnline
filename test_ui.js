const puppeteer = require('puppeteer');

(async () => {
  console.log("Starting Chrome...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const loginUrl = 'https://storeonline.in/admin/login';
  console.log(`Navigating to ${loginUrl}...`);
  await page.goto(loginUrl, { waitUntil: 'networkidle2' });

  console.log("Typing credentials...");
  await page.type('#username', 'admin');
  await page.type('#password', 'admin');

  console.log("Clicking 'Secure Login'...");
  const startTime = Date.now();
  
  // Wait for either the dashboard to load or an error message to appear
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForResponse(response => response.url().includes('/api/auth/callback/credentials'))
  ]);

  console.log("Login API responded. Waiting for redirect or error...");
  
  try {
    // Wait up to 5 seconds for navigation to dashboard
    await page.waitForNavigation({ timeout: 5000, waitUntil: 'networkidle2' });
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (page.url().includes('/admin/dashboard')) {
      console.log(`SUCCESS: Logged in and redirected to Dashboard in ${duration}ms!`);
    } else {
      console.log(`Ended up on URL: ${page.url()}`);
    }
  } catch (err) {
    // Check if there's an error message on screen
    const errorText = await page.evaluate(() => {
      const el = document.querySelector('div[style*="rgba(239, 68, 68, 0.1)"]');
      return el ? el.innerText : null;
    });
    
    if (errorText) {
      console.error(`FAILED: UI showed error -> "${errorText}"`);
    } else {
      console.error("FAILED: Did not redirect to dashboard within 5 seconds.");
    }
  }

  await browser.close();
})();
