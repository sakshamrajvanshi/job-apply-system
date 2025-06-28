const express = require('express');
const fs = require('fs');
const cors = require('cors');
const cron = require('node-cron');

const app = express();

// ✅ Allow only your Vercel frontend to access this backend
app.use(cors({
  origin: 'https://job-apply-system123.vercel.app', // your deployed frontend
}));

app.use(express.json());

const PORT = 5000;

// 📌 Run specific bot
app.post('/run/:platform', async (req, res) => {
  const platform = req.params.platform;
  try {
    const bot = require(`./bots/${platform}Bot.js`);
    await bot();
    res.json({ message: `✅ ${platform} bot run successfully.` });
  } catch (err) {
    res.status(500).json({ error: `❌ Error running ${platform} bot: ${err.message}` });
  }
});

// 📌 View applied jobs
app.get('/applied', (req, res) => {
  try {
    const data = fs.readFileSync('./applied_jobs.json', 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read applied_jobs.json' });
  }
});

// 📅 Daily scheduled job run at 9 AM IST
cron.schedule('0 3 * * *', async () => {
  // 9 AM IST = 3:30 AM UTC, but we approximate with 3 AM UTC for now
  console.log("⏰ Scheduled run started");
  const bots = ['linkedin', 'naukri', 'internshala', 'indeed'];
  for (const bot of bots) {
    try {
      const run = require(`./bots/${bot}Bot.js`);
      await run();
    } catch (err) {
      console.error(`❌ Error in ${bot}Bot: ${err.message}`);
    }
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
