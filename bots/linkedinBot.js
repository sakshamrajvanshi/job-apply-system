const puppeteer = require('puppeteer');
const fs = require('fs');

module.exports = async () => {
  const appliedJobs = require('../applied_jobs.json');
  const cookies = JSON.parse(fs.readFileSync('./linkedinCookies.json', 'utf8'));

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setCookie(...cookies);

  await page.goto('https://www.linkedin.com/jobs/search/?keywords=web%20developer&location=India&f_AL=true');
  await page.waitForSelector('.jobs-search-results__list');

  const jobLinks = await page.$$eval('a.job-card-list__title', links =>
    links.map(link => link.href)
  );

  for (let url of jobLinks.slice(0, 3)) {
    if (appliedJobs.includes(url)) continue;

    await page.goto(url);
    await page.waitForTimeout(3000);

    const applyBtn = await page.$('button.jobs-apply-button');
    if (applyBtn) {
      await applyBtn.click();
      await page.waitForTimeout(2000);

      const submitBtn = await page.$('button[aria-label="Submit application"]');
      if (submitBtn) {
        await submitBtn.click();
        console.log("✅ Applied to:", url);
        appliedJobs.push(url);
        fs.writeFileSync('./applied_jobs.json', JSON.stringify(appliedJobs, null, 2));
      } else {
        console.log("🛑 Application too long, skipped:", url);
      }
    }
  }

  await browser.close();
};
