import React, { useState, useEffect } from 'react';
import jobData from './JobSearch';
import '../Pages/JobSearchPage.css'

const SearchJobAds = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (searchTerm !== '') {
      if (Array.isArray(jobData)) {
        const filteredJobs = jobData.filter((job) => {
          return (
            job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
        setJobs(filteredJobs);
      }
    } else {
      setJobs([]);
    }
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <h1 className="header">Jobs</h1>
      <hr />
      {!searchTerm && <p className='text'>Enter a search term to see results.</p>}
      <p></p>
      <div className="textr">
  <div className="search-container">
    <input className = "text" type="text" placeholder="Search jobs by title, company, location, or job type" value={searchTerm} onChange={handleSearchChange} />
  </div>
  {searchTerm && jobs.length === 0 && (
    <p className="other_text">There are no matching jobs at this point </p>
  )}
  {searchTerm && jobs.map((job, index) => (
    <div key={index} className="job-card">
      <h3 className="text">{job.job_title}</h3>
      <h4 className="company-name text">{job.company_name}</h4>
      <p className="other_text">{job.location}</p>
      <p className="other_text">{job.job_type}</p>
      <p className="other_text">{job.job_description}</p>
    </div>
  ))}
  
</div>

      <hr />
    </div>
  );
};

export default SearchJobAds;
