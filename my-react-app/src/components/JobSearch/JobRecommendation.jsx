import React, { useState } from "react";
import "../Pages/DonationsPage.css";

const JobRecommendationForm = ({
  job,
  onRecommendationSubmit,
  onCancelClick,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const subject = encodeURIComponent("Job Recommendation");
    const body = `
      I would like to recommend this job for your consideration.\n
      Job Title: ${job.jobTitle}\n
      Company: ${job.companyName}\n
      Description: ${job.jobDescription}\n
      Location: ${job.location}\n
      \nSincerely,\n${firstName} ${lastName}
    `;

    const encodedBody = encodeURIComponent(body);
    const mailtoLink = `mailto:${email}?subject=Job Recommendation&body=${encodedBody}`;

    window.open(mailtoLink);

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onCancelClick();
    }, 7000);
  };

  return (
    <div className="recommendation-form-container">
      <h4 className="recommendation-header text">Recommend this Job:</h4>
      {submitted ? (
        <p className="success-message text">Your recommendation was sent!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="firstName" className="text">
              Your First Name:&nbsp;
            </label>
            <p></p>
            <input
              className="other_text"
              type="text"
              id="firstName"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </div>
          <p></p>
          <div className="form-field">
            <label htmlFor="lastName" className="text">
              Your Last Name: &nbsp;
            </label>
            <p></p>
            <input
              className="other_text"
              type="text"
              id="lastName"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>
          <p></p>
          <div className="form-field">
            <label htmlFor="email" className="text">
              To recommend this job to a specific person, kindly enter their
              email address: &nbsp;
            </label>
            <p></p>
            <input
              className="other_text"
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          {/* job details */}
          <div className="form-field">
            <p className="text">
              Job Title: <strong>{job.jobTitle}</strong>
            </p>
          </div>
          <div className="form-field">
            <p className="text">
              Company: <strong>{job.companyName}</strong>
            </p>
          </div>
          <div className="form-field">
            <p className="text">
              Description: <strong>{job.jobDescription}</strong>
            </p>
          </div>
          <button type="submit" className="submit_s">
            Submit
          </button>
          <button type="button" onClick={onCancelClick} className="submit_s">
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default JobRecommendationForm;
