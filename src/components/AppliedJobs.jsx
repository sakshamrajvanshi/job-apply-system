import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppliedJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("https://job-apply-system.onrender.com/applied");
        setJobs(res.data.reverse());
      } catch (err) {
        console.error('❌ Failed to load jobs:', err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="max-w-2xl mx-auto my-8 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Applied Jobs</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs found yet.</p>
      ) : (
        <ul className="space-y-2">
          {jobs.map((job, index) => (
            <li key={index} className="border p-2 rounded hover:bg-gray-100">
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {job.url}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppliedJobs;
