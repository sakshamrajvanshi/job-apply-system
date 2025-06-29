import React from 'react';
import axios from 'axios';

const BotTrigger = () => {
  const runBot = async (platform) => {
    try {
      await axios.post(`https://job-apply-system.onrender.com/run/${platform}`);
      alert(`✅ Bot triggered for ${platform}`);
    } catch (err) {
      console.error(`❌ Bot run failed for ${platform}:`, err);
    }
  };

  return (
    <div>
      <button onClick={() => runBot('linkedin')}>Run LinkedIn Bot</button>
      <button onClick={() => runBot('naukri')}>Run Naukri Bot</button>
    </div>
  );
};

export default BotTrigger;
