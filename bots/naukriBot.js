const puppeteer = require('puppeteer');
const config = require('../config.json');
const fs = require('fs');

module.exports = async () => {
  const appliedJobs = require('../applied_jobs.json');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.naukri.com/mnjuser/login');
  await page.type('#usernameField', config.naukri.email);
  await page.type('#passwordField', config.naukri.password);
  await page.click('[type="submit"]');
  await page.waitForNavigation();

  await page.goto('https://www.naukri.com/web-developer-jobs?experience=0');
  await page.waitForSelector('.jobTuple');

  const jobLinks = await page.$$eval('.jobTuple a.title', links =>
    links.map(link => link.href)
  );

  for (let url of jobLinks.slice(0, 3)) {
    if (appliedJobs.includes(url)) continue;

    await page.goto(url);
    await page.waitForTimeout(2000);

    const applyBtn = await page.$('button[title*="Apply"]');
    if (applyBtn) {
      await applyBtn.click();
      console.log("✅ Applied to:", url);
      appliedJobs.push(url);
      fs.writeFileSync('./applied_jobs.json', JSON.stringify(appliedJobs, null, 2));
    }
  }

  await browser.close();
};
