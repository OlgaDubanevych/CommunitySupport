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
        setFormData({ ...initialFormData }); // Clear form fields
        setTimeout(() => {
          setShowMessage(false);
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
    <div>
      <h2 className="text">Application Form: {jobTitle}</h2>
      <div className="other_text">
        <form onSubmit={handleSubmit}>
          <label>
            First Name:&nbsp;
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Last Name:&nbsp;
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Email:&nbsp;
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Phone:&nbsp;
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Resume Text (mandatory):&nbsp;
            <textarea
              name="resume"
              value={formData.resume}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            Cover Letter Text (optional):&nbsp;
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
            />
          </label>
          <br />
          <p></p>
          <button type="submit" className="submit">
            Apply Now
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
