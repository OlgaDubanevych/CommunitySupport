import React, { useState } from 'react';
import '../Pages/JobSearchPage.css'

function ImmigrationPoll() {
  const [pollData, setPollData] = useState({
    job: 0,
    networking: 0,
    friends: 0,
    education: 0,
    language: 0,
    finance: 0,
    housing: 0,
    culture: 0,
    daycare: 0,
    other: 0,
  });
  const [selectedOption, setSelectedOption] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedOption) {
      setPollData((prevState) => ({ ...prevState, [selectedOption]: prevState[selectedOption] + 1 }));
      setSelectedOption('');
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
      }, 6000);
    }
  };

  const totalVotes = Object.values(pollData).reduce((a, b) => parseInt(a) + parseInt(b), 0);

  const pollOptions = [
    { name: 'job', label: 'Finding a Job' },
    { name: 'networking', label: 'Networking' },
    { name: 'friends', label: 'Finding Friends' },
    { name: 'education', label: 'Need to Continue Education' },
    { name: 'language', label: 'Language Barrier' },
    { name: 'finance', label: 'Financial Difficulties' },
    { name: 'housing', label: 'Rental/Home Purchase Price' },
    { name: 'culture', label: 'Cultural Differences' },
    { name: 'daycare', label: 'Daycare/Child Support' },
    { name: 'other', label: 'Other' },
  ];

  return (
    <div classsName = "text">
      <h2 className = "header">What aspects of immigrating to Canada you personally find most challenging?</h2>
      <div>
      <form onSubmit={handleSubmit}>
        {pollOptions.map((option) => (
          <div key={option.name}>
            <label className = "text" htmlFor={option.name}>
              <input
                type="radio"
                id={option.name}
                name="selectedOption"
                value={option.name}
                checked={selectedOption === option.name}
                onChange={handleOptionChange}
              />
              {option.label}
            </label>
          </div>
        ))}
        <p></p>
        <button type="submit" className = "submit" >Submit</button>
        <p></p>
      </form>
      {submitted && (
        <div className="results">
          <p className="other_text">Thank you for your opinion!</p>
          <h3 className="other_text">Poll Results:</h3>
          <ul>
            {pollOptions.map((option) => (
              <li className = "other_text" key={option.name}>
                <span className="other_text">{option.label}</span>
                <span className="other_text">{pollData[option.name]}</span>
                <span className="percentage">
                  ({Math.round((pollData[option.name] / totalVotes) * 100)}%)
                </span>
              </li>
            ))}
            <p></p>
            <li className="text">Total Votes: {totalVotes}</li>
          </ul>
        </div>
      )}
    </div>
    </div>
  );
}

export default ImmigrationPoll;
