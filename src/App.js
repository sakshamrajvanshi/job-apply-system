import React from 'react';
import AppliedJobs from './components/AppliedJobs';
import BotTrigger from './components/BotTrigger';

function App() {
  const platforms = ['linkedin', 'naukri', 'internshala', 'indeed'];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl text-center font-bold mb-6">Job Apply Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map(platform => <BotTrigger key={platform} platform={platform} />)}
      </div>
      <AppliedJobs />
    </div>
  );
}

export default App;