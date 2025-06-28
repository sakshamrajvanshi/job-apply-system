const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Root route to fix "Cannot GET /"
app.get("/", (req, res) => {
  res.send("🚀 Job Apply System backend is running!");
});

// ✅ Endpoint to get applied jobs
app.get("/applied", (req, res) => {
  const filePath = path.join(__dirname, "applied_jobs.json");
  if (!fs.existsSync(filePath)) return res.json([]);
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
});

// ✅ Run a bot based on platform
app.post("/run/:platform", async (req, res) => {
  const platform = req.params.platform;
  const botPath = path.join(__dirname, "bots", `${platform}Bot.js`);

  if (!fs.existsSync(botPath)) {
    return res.status(404).json({ error: `No bot found for ${platform}` });
  }

  try {
    const runBot = require(botPath);
    await runBot();
    res.json({ message: `✅ ${platform} bot completed.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Bot execution failed." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
