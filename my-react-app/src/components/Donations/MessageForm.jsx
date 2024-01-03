import React, { useState, useEffect } from "react";
import "../Pages/DonationsPage.css";

const MessageForm = ({
  donation,
  donorInfo,
  onMessageSubmit,
  onCancelClick,
}) => {
  const [formData, setFormData] = useState({
    email: donorInfo.email,
    itemName: donation.itemName,
    itemDescription: donation.itemDescription,
    message: "",
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      email: donorInfo.email,
      itemName: donation.itemName,
      itemDescription: donation.itemDescription,
    }));
  }, [donorInfo, donation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = { ...formData, donationId: donation.id };
    onMessageSubmit(updatedFormData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={() => {}}
        disabled
        required
      />

      <br />
      <label>Item Name:</label>
      <input
        type="text"
        name="itemName"
        value={formData.itemName}
        onChange={() => {}}
        disabled
        required
      />

      <br />
      <label>Item Description:</label>
      <textarea
        name="itemDescription"
        value={formData.itemDescription}
        onChange={() => {}}
        disabled
        required
      />

      <br />
      <label>Message:</label>
      <textarea
        name="message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        required
      />

      <br />
      <button type="submit">Send Message</button>
      <button type="button" onClick={onCancelClick}>
        Cancel
      </button>
    </form>
  );
};

export default MessageForm;
