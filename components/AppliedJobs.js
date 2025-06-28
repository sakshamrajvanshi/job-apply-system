import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppliedJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios
      .get('https://job-apply-system.onrender.com/applied')
      .then((res) => setJobs(res.data.reverse()))
      .catch((err) => console.error('❌ Failed to load jobs', err));
  }, []);

  return (
    <div className="max-w-2xl mx-auto my-8 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Applied Jobs</h2>
      <ul className="space-y-2">
        {jobs.map((job, index) => (
          <li key={index} className="border p-2 rounded hover:bg-gray-100">
            <a
              href={job.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              {job.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppliedJobs;
