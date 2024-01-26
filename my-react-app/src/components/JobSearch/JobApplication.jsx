import React, { useState } from "react";
import "../Pages/JobSearchPage.css";

const ApplicationForm = ({ jobTitle, onCancelClick }) => {
  const initialFormData = {
    jobTitle: jobTitle,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    resume: "",
    coverLetter: "",
  };

  const [formData, setFormData] = useState({ ...initialFormData });
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:7000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowMessage(true);
        setFormData({ ...initialFormData });
        setTimeout(() => {
          setShowMessage(false);
          onCancelClick();
        }, 4000);
      } else {
        console.error(
          "Application submission failed:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error submitting application:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="text">
      <h2>Application Form: {jobTitle}</h2>
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            First Name:&nbsp;
            <p></p>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <p></p>
          <label>
            Last Name:&nbsp;
            <p></p>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <p></p>
          <label>
            Email:&nbsp;
            <p></p>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <p></p>
          <label>
            Phone:&nbsp;
            <p></p>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <p></p>
          <label>
            Resume Text (mandatory):&nbsp;
            <p></p>
            <textarea
              name="resume"
              value={formData.resume}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <p></p>
          <label>
            Cover Letter Text (optional):&nbsp;
            <p></p>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
            />
          </label>
          <br />
          <p></p>
          <button type="submit" className="submit_s">
            Apply Now
          </button>
          <button type="button" onClick={onCancelClick} className="submit_s">
            Cancel
          </button>
        </form>
        {showMessage && (
          <p className="success-message">
            Your application has been submitted successfully! Best of Luck!
          </p>
        )}
      </div>
    </div>
  );
};

export default ApplicationForm;
