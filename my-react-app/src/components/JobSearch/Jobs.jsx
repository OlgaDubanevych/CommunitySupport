import React, { useState, useEffect } from "react";
import ApplicationForm from "./JobApplication";
import RecommendationForm from "./JobRecommendation";
import "../Pages/JobSearchPage.css";

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
    setShowRecommendationForm(true);
    setSelectedJobTitle(jobTitle);
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

  useEffect(() => {
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

    fetchJobs();
  }, []);

  // Use useEffect to update the jobs state when new jobs are added
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

    // Schedule an update when the showApplicationForm state changes
    if (showApplicationForm || showRecommendationForm) {
      updateJobs();
    }
  }, [showApplicationForm, showRecommendationForm]);

  return (
    <div className="job-list">
      <h2 className="header">Job Postings</h2>
      {jobs.map((job, index) => (
        <div key={index} className="job">
          <h3 className="text">{job.jobTitle}</h3>
          <p className="other_text">{job.jobDescription}</p>
          <button
            className="submit_text"
            onClick={() => handleApplyNowClick(job.jobTitle)}
          >
            Apply Now
          </button>
          <p></p>
          <button
            className="submit_text"
            onClick={() => handleRecommendClick(job.jobTitle)}
          >
            Recommend
          </button>{" "}
          {job.showApplicationForm && (
            <ApplicationForm
              jobTitle={job.jobTitle}
              onCancelClick={() => handleCancelClick(job.jobTitle)}
            />
          )}
          {showRecommendationForm && selectedJobTitle === job.jobTitle && (
            <RecommendationForm
              onCancelClick={() => handleCancelClick(job.jobTitle)}
            />
          )}
          {index !== jobs.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
};

export default Jobs;
