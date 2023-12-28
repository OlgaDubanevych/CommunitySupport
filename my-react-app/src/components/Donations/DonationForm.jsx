// DonationForm.js
import React, { useState } from "react";
import "./Donations.css";
import DonationCategory from "./DonationCategory"; // Import the correct DonationCategory component

function DonationForm() {
  const Category = {
    CLOTHING: "CLOTHING",
    ELECTRONICS: "ELECTRONICS",
    FURNITURE: "FURNITURE",
    BOOKS: "BOOKS",
    OTHER: "OTHER",
  };

  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("OTHER");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const donationData = {
      itemName,
      itemDescription,
      firstName,
      lastName,
      email,
      phone,
      category: Category[category], // Convert string to enum
    };

    try {
      console.log("Sending data to backend:", donationData); // Log what you are sending to the backend

      const response = await fetch("http://localhost:7000/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donationData),
      });

      // Reset form fields after successful submission
      if (response.ok) {
        const responseData = await response.json();
        console.log("Received data from backend:", responseData); // Log what you received from the backend

        setTimeout(() => {
          setIsSubmitted(false);
          setItemName("");
          setItemDescription("");
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setCategory("OTHER");
        }, 4000);
      } else {
        console.error(
          "Donation submission failed:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error submitting donation:", error.message);
    }
  };

  return (
    <div>
      <h2 className="header">Submit your Donation</h2>
      <form className="donation-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <span>Item Name:</span>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            <span>Item Description:</span>
            <textarea
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            <span>First Name:</span>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            <span>Last Name:</span>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            <span>Email:</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            <span>Phone:</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
        </div>
        <div className="form-group">
          <DonationCategory
            category={category}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="submit-button">
            Submit
          </button>
        </div>
        {isSubmitted && (
          <p>Your submission is under review and will be posted shortly.</p>
        )}
      </form>
    </div>
  );
}

export default DonationForm;
