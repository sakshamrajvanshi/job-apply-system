const express = require('express');
const fs = require('fs');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');

const app = express();

// ✅ Allow both frontend (Vercel) and local testing
const allowedOrigins = [
  'http://localhost:3000',
  'https://job-apply-system123.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// ✅ Root route for health check
app.get('/', (req, res) => {
  res.send('🚀 Job Apply System backend is running!');
});

// ✅ Run bot by platform name
app.post('/run/:platform', async (req, res) => {
  const platform = req.params.platform.toLowerCase();
  try {
    const botPath = path.join(__dirname, 'bots', `${platform}Bot.js`);
    if (!fs.existsSync(botPath)) {
      return res.status(404).json({ error: `Bot for ${platform} not found.` });
    }

    const runBot = require(botPath);
    await runBot();
    res.json({ message: `✅ ${platform} bot ran successfully.` });
  } catch (err) {
    console.error(`❌ Error running ${platform} bot:`, err);
    res.status(500).json({ error: `❌ Error running ${platform} bot.` });
  }
});

// ✅ Return applied jobs
app.get('/applied', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'applied_jobs.json');
    if (!fs.existsSync(filePath)) {
      return res.json([]);
    }

    const data = fs.readFileSync(filePath, 'utf8');
    const jobs = JSON.parse(data);
    res.json(jobs);
  } catch (err) {
    console.error('❌ Failed to read applied_jobs.json:', err);
    res.status(500).json({ error: '❌ Failed to load applied jobs.' });
  }
});

// ✅ Cron job to run all bots daily at 3 AM server time
cron.schedule('0 3 * * *', async () => {
  console.log("⏰ Scheduled bot run started...");
  const platforms = ['linkedin', 'naukri', 'internshala', 'indeed'];
  for (const platform of platforms) {
    try {
      const botPath = path.join(__dirname, 'bots', `${platform}Bot.js`);
      if (fs.existsSync(botPath)) {
        const runBot = require(botPath);
        await runBot();
        console.log(`✅ ${platform} bot ran in cron job.`);
      }
    } catch (err) {
      console.error(`❌ Error in ${platform} bot (cron):`, err.message);
    }
  }
});

// ✅ Use dynamic port (for Render or local)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
