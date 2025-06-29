import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppliedJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get('https://job-apply-system.onrender.com/applied')
      .then(res => setJobs(res.data))
      .catch(err => console.error("❌ Failed to load jobs:", err));
  }, []);

  return (
    <div>
      <h2>Applied Jobs</h2>
      <ul>
        {jobs.map((job, i) => <li key={i}>{job}</li>)}
      </ul>
    </div>
  );
};

export default AppliedJobs;
