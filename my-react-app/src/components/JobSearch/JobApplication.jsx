import React, { useState, useRef } from 'react';
import '../Pages/JobSearchPage.css'

const ApplicationForm = ({ jobTitle, onCancelClick }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const resumeRef = useRef(null);
  const coverLetterRef = useRef(null);
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setMessage('Your application has been submitted successfully! Best of Luck!');

    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 4000); 
  };

  const handleFirstNameChange = e => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = e => {
    setLastName(e.target.value);
  };

  const handleEmailChange = e => {
    setEmail(e.target.value);
  };

  const handlePhoneChange = e => {
    setPhone(e.target.value);
  };

  const handleResumeChange = e => {
    resumeRef.current = e.target.files[0];
  };

  const handleCoverLetterChange = e => {
    coverLetterRef.current = e.target.files[0];
  };

  return (
    <div>
      <h2 className="text">Application Form: {jobTitle}</h2>
      <div className="other_text">
        <form onSubmit={handleSubmit}>
          <label>
            First Name:&nbsp;
            <input type="text" value={firstName} onChange={handleFirstNameChange} required />
          </label>
          <br />
          <label>
            Last Name:&nbsp;
            <input type="text" value={lastName} onChange={handleLastNameChange} required />
          </label>
          <br />
          <label>
            Email:&nbsp;
            <input type="email" value={email} onChange={handleEmailChange} required />
          </label>
          <br />
          <label>
            Phone:&nbsp;
            <input type="tel" value={phone} onChange={handlePhoneChange} required />
          </label>
          <br />
          <label>
            Resume Document Upload (mandatory):&nbsp;
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} required />
          </label>
          <br />
          <label>
            Cover Letter (optional):&nbsp;
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleCoverLetterChange} />
          </label>
          <br />
          <p></p>
          <button type="submit" className="submit">Apply Now</button>
        </form>
        {showMessage && <p className="success-message">{message}</p>}
      </div>
    </div>
  );
};

export default ApplicationForm;



