import React, { useState } from "react";
import "../Pages/JobSearchPage.css";

const RecommendationForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create a mailto link with subject and body
    const subject = encodeURIComponent("Job Recommendation");
    const body = encodeURIComponent(
      `Dear Hiring Manager,\n\nI would like to recommend the job for your consideration.\n\nSincerely,\n${firstName} ${lastName}`
    );
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    // Open a new window or tab with the mailto link
    window.open(mailtoLink);

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="recommendation-form-container">
      <h4 className="recommendation-header text">Recommend this Job:</h4>
      {submitted ? (
        <p className="success-message text">Your recommendation was sent!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <p></p>
            <label htmlFor="firstName" className="text">
              First Name:&nbsp;
            </label>
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
            <label htmlFor="lastName" className="text">
              Last Name: &nbsp;
            </label>
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
            <label htmlFor="email" className="text">
              Email: &nbsp;
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <p></p>
          <button type="submit" className="submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default RecommendationForm;
