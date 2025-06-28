import React from 'react';
import BotTrigger from './components/BotTrigger';
import AppliedJobs from './components/AppliedJobs';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Job Application Automation Dashboard</h1>

      {/* Bot Triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <BotTrigger platform="linkedin" />
        <BotTrigger platform="naukri" />
        <BotTrigger platform="internshala" />
        <BotTrigger platform="indeed" />
      </div>

      {/* Applied Jobs List */}
      <AppliedJobs />
    </div>
  );
}

export default App;
