const express = require('express');
const fs = require('fs');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Run specific bot
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

// View applied jobs
app.get('/applied', (req, res) => {
  const data = fs.readFileSync('./applied_jobs.json', 'utf8');
  res.json(JSON.parse(data));
});

// Daily scheduled job run at 9 AM
cron.schedule('0 9 * * *', async () => {
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
