import React, { useState } from 'react';
import { links } from './ListOfLinks';
import '../Pages/ImmigrationPage.css';

function Rating() {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = (value) => {
    setRating(value);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="other_text">
      {[...Array(5)].map((star, index) => {
        const value = index + 1;
        return (
          <span key={index} onClick={() => handleStarClick(value)}>
            {rating >= value ? '★' : '☆'}
          </span>
        );
      })}
      {submitted && <p>Thank you for your feedback!</p>}
      {submitted && <hr />}
    </div>
  );
}

function UsefulLinks() {
  return (
    <div>
      <h2 className="header">Links to Useful Resources</h2>
      <div className="text">
        {links.map((link, index) => (
          <div key={index}>
            <h3>{link.website_name}</h3>
            <p className="other_text">{link.website_description}</p>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.text}
            </a>
            <p>How would you rate this Website?</p>
            <Rating />
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default UsefulLinks;


