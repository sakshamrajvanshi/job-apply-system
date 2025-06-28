const express = require('express');
const fs = require('fs');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Run bot for specific platform
app.post('/run/:platform', async (req, res) => {
  const platform = req.params.platform;
  try {
    const botPath = path.join(__dirname, 'bots', `${platform}Bot.js`);
    const bot = require(botPath);
    await bot();
    res.json({ message: `✅ ${platform} bot run successfully.` });
  } catch (err) {
    res.status(500).json({ error: `❌ Error running ${platform} bot: ${err.message}` });
  }
});

// View applied jobs
app.get('/applied', (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'applied_jobs.json'), 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to read applied_jobs.json' });
  }
});

// Schedule bots to run every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('⏰ Daily bot run started');
  const platforms = ['linkedin', 'naukri', 'internshala', 'indeed'];

  for (const platform of platforms) {
    try {
      const bot = require(`./bots/${platform}Bot.js`);
      await bot();
      console.log(`✅ ${platform} bot completed`);
    } catch (err) {
      console.error(`❌ Error in ${platform}Bot: ${err.message}`);
    }
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Job Apply System backend is running on http://localhost:${PORT}`);
});
