import React, { useState, useEffect } from 'react';
import '../Pages/AboutUs.css'

const StoryForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [story, setStory] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted!');
    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted) {
      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    }
  }, [submitted]);

  return (
    <form onSubmit={handleSubmit}>
        <h1 className='header'>Share Your Success Story</h1>
        <div className='input-text'>
          <label htmlFor="firstName">First Name:</label>
          <input
            className='input-text'
            type="text"
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <br/>
    
        <div className='input-text'>
          <label htmlFor="lastName">Last Name:</label>
          <input
            className='input-text'
            type="text"
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <br/>

        <div className='input-text'>
          <label htmlFor="lastName"> Your Email:</label>
          <input
            className='input-text'
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <br/>
        <div className='input-text'>
          <label htmlFor="story">Your Story:</label>
          <textarea
            className='input-text'
            id="story"
            name="story"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            required
          />
        </div>
        <br/>
        <p></p>
        <button type="submit" className="submit">Submit</button>
        <p></p>
      
        {submitted && <p className = "other_text">Thank you for sharing your story. It will be posted on this page shortly.</p>}
    </form>
  );
};

export default StoryForm;
