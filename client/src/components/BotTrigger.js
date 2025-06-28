import React, { useState } from 'react';
import axios from 'axios';

const BotTrigger = ({ platform }) => {
  const [status, setStatus] = useState('idle');

  const runBot = async () => {
    setStatus('loading');
    try {
      await axios.post(`https://job-apply-system.onrender.com/run/${platform}`);
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="border p-4 rounded shadow w-full max-w-md mx-auto my-4">
      <h2 className="text-lg font-semibold capitalize">{platform}</h2>
      <button
        onClick={runBot}
        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded mt-2"
      >
        Run Bot
      </button>
      {status === 'loading' && <p>Running...</p>}
      {status === 'success' && <p className="text-green-600">✅ Completed</p>}
      {status === 'error' && <p className="text-red-600">❌ Error</p>}
    </div>
  );
};

export default BotTrigger;
