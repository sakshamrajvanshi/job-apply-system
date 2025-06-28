const express = require('express');
const fs = require('fs');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

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
  try {
    const data = fs.readFileSync('./server/applied_jobs.json', 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read applied jobs.' });
  }
});

// Daily scheduled job run
cron.schedule('0 9 * * *', async () => {
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

app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));