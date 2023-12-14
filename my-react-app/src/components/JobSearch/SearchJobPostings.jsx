import React, { useState, useEffect } from "react";

const SearchJobAds = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm !== "") {
      fetchJobs(searchTerm);
    } else {
      setJobs([]);
    }
  }, [searchTerm]);

  const fetchJobs = async (term) => {
    try {
      const response = await fetch(
        `http://localhost:7000/api/jobs?searchTerm=${encodeURIComponent(term)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <h1 className="header">Jobs</h1>
      <hr />
      {!searchTerm && (
        <p className="text">Enter a search term to see results.</p>
      )}
      <p></p>
      <div className="textr">
        <div className="search-container">
          <input
            className="text"
            type="text"
            placeholder="Search jobs by title, company, location, or job type"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        {searchTerm && jobs.length === 0 && (
          <p className="other_text">
            There are no matching jobs at this point{" "}
          </p>
        )}
        {searchTerm &&
          jobs.map((job, index) => (
            <div key={index} className="job-card">
              <h3 className="text">{job.jobTitle}</h3>
              <h4 className="company-name text">{job.companyName}</h4>
              <p className="other_text">{job.location}</p>
              <p className="other_text">{job.jobType}</p>
              <p className="other_text">{job.jobDescription}</p>
            </div>
          ))}
      </div>
      <hr />
    </div>
  );
};

export default SearchJobAds;
