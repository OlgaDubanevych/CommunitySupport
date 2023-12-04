import React, { useState, useEffect } from 'react';
import ApplicationForm from './JobApplication';
import RecommendationForm from './JobRecommendation';
import jobData from './JobSearch';
import '../Pages/JobSearchPage.css';

const JobList = () => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showRecommendationForm, setShowRecommendationForm] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);
  const [jobs, setJobs] = useState(jobData);

  const handleApplyNowClick = (jobTitle) => {
    setJobs((prevJobs) => {
      return prevJobs.map((job) => {
        if (job.job_title === jobTitle) {
          return {
            ...job,
            showApplicationForm: true,
          };
        } else {
          return job;
        }
      });
    });
    setShowRecommendationForm(false);
  };

  const handleRecommendClick = (jobTitle) => {
    setShowRecommendationForm(true);
    setSelectedJobTitle(jobTitle);
  };

  const handleCancelClick = (jobTitle) => {
    setJobs((prevJobs) => {
      return prevJobs.map((job) => {
        if (job.job_title === jobTitle) {
          return {
            ...job,
            showApplicationForm: false,
          };
        } else {
          return job;
        }
      });
    });
    setShowApplicationForm(false);
    setShowRecommendationForm(false);
  };

  useEffect(() => {
    const fetchData = async () => {
    };
    fetchData();
  }, []);

  return (
    <div className="job-list">
      <h2 className='header'>Job Postings</h2>
      {jobs.map((job, index) => (
        <div key={index} className="job">
          <h3 className="text">{job.job_title}</h3>
          <p className="other_text">{job.job_description}</p>
          <button className="submit_text" onClick={() => handleApplyNowClick(job.job_title)}>Apply Now</button>
          <p></p>
          <button className="submit_text" onClick={() => handleRecommendClick(job.job_title)}>Recommend</button> {/* passing the jobTitle as an argument */}
          {job.showApplicationForm && (
            <ApplicationForm jobTitle={job.job_title} onCancelClick={() => handleCancelClick(job.job_title)} />
          )}
          {showRecommendationForm && selectedJobTitle === job.job_title && (
            <RecommendationForm onCancelClick={() => handleCancelClick(job.job_title)} />
          )}
          {index !== jobs.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
};

export default JobList;














