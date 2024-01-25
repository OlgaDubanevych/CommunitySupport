import React, { useState } from "react";
import "../Pages/JobSearchPage.css";

const RecommendationForm = ({ onCancelClick }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create a mailto link with subject and body
    const subject = encodeURIComponent("Job Recommendation");
    const body = encodeURIComponent(
      `I would like to recommend the job for your consideration.\n\nSincerely,\n${firstName} ${lastName}`
    );
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    // Open a new window or tab with the mailto link
    window.open(mailtoLink);

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onCancelClick();
    }, 4000);
  };

  return (
    <div className="text">
      <h4 className="recommendation-header text">Recommend this Job:</h4>
      {submitted ? (
        <p className="success-message text">Your recommendation was sent!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <p></p>
            <label htmlFor="firstName">Your First Name:&nbsp;</label>
            <p></p>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </div>
          <p></p>
          <div className="form-field">
            <label htmlFor="lastName">Your Last Name: &nbsp;</label>
            <p></p>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>
          <p></p>
          <div className="form-field">
            <label htmlFor="email">
              email address of the individual you'd like to share this exciting
              job opportunity with: &nbsp;
            </label>
            <p></p>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <p></p>
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

export default RecommendationForm;
