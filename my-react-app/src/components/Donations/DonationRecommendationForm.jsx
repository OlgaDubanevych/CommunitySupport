import React, { useState } from "react";
import "../Pages/DonationsPage.css";

const DonationRecommendationForm = ({
  donation,
  onRecommendationSubmit,
  onCancelClick,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a mailto link with subject and body
    const subject = encodeURIComponent("Donation Recommendation");
    const body = encodeURIComponent(
      `I would like to recommend this donation for your consideration.\n\nItem Name: ${donation.itemName}\nDescription: ${donation.itemDescription}\n\nSincerely,\n${firstName} ${lastName}`
    );
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    // Open a new window or tab with the mailto link
    window.open(mailtoLink);

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onCancelClick(); // Close the recommendation form
    }, 4000);
  };

  return (
    <div className="recommendation-form-container">
      <h4 className="recommendation-header text">Recommend this Donation:</h4>
      {submitted ? (
        <p className="success-message text">Your recommendation was sent!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="firstName" className="text">
              Your First Name:&nbsp;
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="lastName" className="text">
              Your Last Name: &nbsp;
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="email" className="text">
              To recommend this donation to a specific person, kindly enter
              their email address: &nbsp;
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          {/* Display item name and description from the donation object */}
          <div className="form-field">
            <p className="text">
              Item Name: <strong>{donation.itemName}</strong>
            </p>
          </div>
          <div className="form-field">
            <p className="text">
              Item Description: <strong>{donation.itemDescription}</strong>
            </p>
          </div>
          <button type="submit" className="submit">
            Submit
          </button>
          <button type="button" onClick={onCancelClick} className="cancel">
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default DonationRecommendationForm;
