const puppeteer = require('puppeteer');
const config = require('../config.json');
const fs = require('fs');

module.exports = async () => {
  const appliedJobs = require('../applied_jobs.json');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const keyword = config.keywords.join(' ');
  const location = config.locations[0];

  await page.goto('https://www.indeed.com');
  await page.type('input[name="q"]', keyword);
  await page.type('input[name="l"]', location);
  await page.keyboard.press('Enter');

  await page.waitForSelector('a[data-jk]');
  const jobLinks = await page.$$eval('a[data-jk]', links =>
    links.map(link => 'https://www.indeed.com/viewjob?jk=' + link.getAttribute('data-jk'))
  );

  for (let url of jobLinks.slice(0, 5)) {
    if (appliedJobs.includes(url)) continue;

    await page.goto(url);
    await page.waitForTimeout(2000);

    const applyBtn = await page.$('button.ia-ApplyButton');
    if (applyBtn) {
      await applyBtn.click();
      console.log("✅ Applied to:", url);
      appliedJobs.push(url);
      fs.writeFileSync('./applied_jobs.json', JSON.stringify(appliedJobs, null, 2));
    } else {
      console.log("🚫 No Easy Apply on:", url);
    }
  }

  await browser.close();
};
