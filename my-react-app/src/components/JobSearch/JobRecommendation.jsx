import React, { useState } from 'react';
import '../Pages/JobSearchPage.css'


const RecommendationForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
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
            <label htmlFor="firstName" className="text">First Name:&nbsp;</label>
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
            <label htmlFor="lastName" className="text">Last Name: &nbsp;</label>
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
            <label htmlFor="email" className="text">Email: &nbsp;</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <p></p>
          <button type="submit" className="submit">Submit</button>
        </form>
      )}
    </div>
  );
};
export default RecommendationForm ;
