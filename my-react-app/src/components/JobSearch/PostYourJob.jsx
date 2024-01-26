import React, { useState } from "react";
import "../Pages/JobSearchPage.css";

const JobPostingForm = ({ onJobPosted }) => {
  const [jobPostingDate, setJobPostingDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    const jobData = {
      jobPostingDate,
      expiryDate,
      companyName,
      jobTitle,
      jobDescription,
      location,
      salary,
      firstName,
      lastName,
      email,
      phone,
    };

    try {
      const response = await fetch("http://localhost:7000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        setSuccess(true);

        setJobPostingDate("");
        setExpiryDate("");
        setCompanyName("");
        setJobTitle("");
        setJobDescription("");
        setLocation("");
        setSalary("");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");

        onJobPosted();

        setTimeout(() => {
          setSuccess(false);
        }, 6000);
      } else {
        console.error("Job post failed:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error posting job:", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="header">Post Your Job</h2>

      <label className="text">
        Job Posting Date:
        <p></p>
        <input
          className="input-text"
          type="date"
          value={jobPostingDate}
          onChange={(e) => setJobPostingDate(e.target.value)}
        />
      </label>
      <br />
      <p></p>
      <label className="text">
        Job Expiry Date:
        <p></p>
        <input
          className="input-text"
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
      </label>
      <br />
      <p></p>
      <label className="text">
        Company Name:
        <p></p>
        <p></p>
        <input
          className="input-text"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </label>
      <br />
      <p></p>
      <label className="text">
        Job Title/ Role:
        <p></p>
        <input
          className="input-text"
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
      </label>
      <br />
      <p></p>
      <label className="text">
        Job Description:
        <p></p>
        <textarea
          className="input-text"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </label>
      <br />
      <p></p>
      <label className="text">
        Job Location:
        <p></p>
        <input
          className="input-text"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>
      <br />
      <p></p>
      <label className="text">
        Anticipated Salary:
        <p></p>
        <input
          className="input-text"
          type="text"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />
      </label>
      <br />
      <p></p>
      <label className="text">
        Your First Name:
        <p></p>
        <input
          className="input-text"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </label>
      <br />
      <p></p>
      <label className="text">
        Your Last Name:
        <p></p>
        <input
          className="input-text"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </label>
      <br />
      <p></p>
      <label className="text">
        Your Email Address:
        <p></p>
        <input
          className="input-text"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br />
      <p></p>
      <label className="text">
        Your Phone Number:
        <p></p>
        <input
          className="input-text"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <br />
      <p></p>
      <button type="submit" className="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Post Job"}
      </button>
      {success && <p>Job posted successfully!</p>}
      <p></p>
    </form>
  );
};

export default JobPostingForm;
