const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // show browser so you can log in
    executablePath: 'C:\\Users\\sg886\\AppData\\Local\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://www.linkedin.com/login');

  console.log('⏳ Please log in manually in the browser window...');

  // Wait for login to complete (you may press Enter or navigate)
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  const cookies = await page.cookies();
  const cookiesPath = path.join(__dirname, '..', 'linkedinCookies.json');

  fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));
  console.log('✅ Cookies saved to linkedinCookies.json');

  await browser.close();
})();
