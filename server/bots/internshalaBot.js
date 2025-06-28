const puppeteer = require('puppeteer');
const config = require('../config.json');
const fs = require('fs');

module.exports = async () => {
  const appliedJobs = require('../applied_jobs.json');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://internshala.com/login');
  await page.type('#email', config.internshala.email);
  await page.type('#password', config.internshala.password);
  await page.click('#login_submit');
  await page.waitForNavigation();

  await page.goto('https://internshala.com/internships/work-from-home-web%20development-internships/');
  await page.waitForSelector('.individual_internship');

  const jobLinks = await page.$$eval('.individual_internship a.view_detail_button', links =>
    links.map(link => link.href)
  );

  for (let url of jobLinks.slice(0, 3)) {
    if (appliedJobs.includes(url)) continue;

    await page.goto(url);
    await page.waitForTimeout(2000);

    const applyBtn = await page.$('button[data-button-name="apply_now_button"]');
    if (applyBtn) {
      await applyBtn.click();
      await page.waitForTimeout(2000);

      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) {
        await submitBtn.click();
        console.log("✅ Applied to:", url);
        appliedJobs.push(url);
        fs.writeFileSync('./applied_jobs.json', JSON.stringify(appliedJobs, null, 2));
      } else {
        console.log("🛑 Requires manual questions, skipped.");
      }
    }
  }

  await browser.close();
};
