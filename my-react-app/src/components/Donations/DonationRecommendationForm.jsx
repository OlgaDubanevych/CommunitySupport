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

    const subject = encodeURIComponent("Donation Recommendation");
    const body = encodeURIComponent(
      `I would like to recommend this donation for your consideration.\n\nItem Name: ${donation.itemName}\nDescription: ${donation.itemDescription}\n\nSincerely,\n${firstName} ${lastName}`
    );
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    window.open(mailtoLink);

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onCancelClick();
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
            <p></p>
            <input
              className="other_text"
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
              Your Last Name: &nbsp;
            </label>
            <p></p>
            <input
              className="other_text"
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
              To recommend this donation to a specific person, kindly enter
              their email address: &nbsp;
            </label>
            <p></p>
            <input
              className="other_text"
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          {/* Display item name and description */}
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
          <button type="submit" className="submit_s">
            Submit
          </button>
          <button type="button" onClick={onCancelClick} className="submit_s">
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default DonationRecommendationForm;
