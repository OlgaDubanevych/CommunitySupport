import React, { useState, useEffect } from "react";
import ApplicationForm from "./JobApplication";
import RecommendationForm from "./JobRecommendation";
import "../Pages/JobSearchPage.css";
import JobPostingForm from "./PostYourJob.jsx";

const Jobs = () => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showRecommendationForm, setShowRecommendationForm] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);
  const [jobs, setJobs] = useState([]);

  const handleApplyNowClick = (jobTitle) => {
    setJobs((prevJobs) => {
      return prevJobs.map((job) => {
        if (job.jobTitle === jobTitle) {
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
    const selectedJob = jobs.find((job) => job.jobTitle === jobTitle);

    if (selectedJob) {
      setShowRecommendationForm(true);
      setSelectedJobTitle(selectedJob.jobTitle);
    }
  };

  const handleCancelClick = (jobTitle) => {
    setJobs((prevJobs) => {
      return prevJobs.map((job) => {
        if (job.jobTitle === jobTitle) {
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

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:7000/api/jobs");
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        console.error(
          "Failed to fetch jobs:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching jobs:", error.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const updateJobs = async () => {
      try {
        const response = await fetch("http://localhost:7000/api/jobs");
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        } else {
          console.error(
            "Failed to fetch jobs:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching jobs:", error.message);
      }
    };

    if (showApplicationForm || showRecommendationForm) {
      updateJobs();
    }
  }, [showApplicationForm, showRecommendationForm]);

  const handleJobPosted = () => {
    fetchJobs();
  };

  return (
    <div className="job-list">
      <h2 className="header">Job Postings</h2>
      {jobs.length === 0 ? (
        <p className="text">No jobs were posted yet</p>
      ) : (
        jobs.map((job, index) => (
          <div key={index} className="job">
            <h3 className="text">{job.jobTitle}</h3>
            <p className="other_text">Company: {job.companyName}</p>
            <p className="other_text">Location: {job.location}</p>
            <p className="other_text">{job.jobDescription}</p>
            <button
              className="submit_c"
              onClick={() => handleApplyNowClick(job.jobTitle)}
            >
              Apply Now
            </button>
            <p></p>
            <button
              className="submit_c"
              onClick={() => handleRecommendClick(job.jobTitle)}
            >
              Recommend
            </button>{" "}
            {showRecommendationForm && selectedJobTitle === job.jobTitle && (
              <RecommendationForm
                job={job}
                onCancelClick={() => handleCancelClick(job.jobTitle)}
              />
            )}
            {index !== jobs.length - 1 && <hr />}
          </div>
        ))
      )}

      <JobPostingForm onJobPosted={handleJobPosted} />
    </div>
  );
};

export default Jobs;
