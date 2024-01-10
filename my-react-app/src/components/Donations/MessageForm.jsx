import React, { useState } from "react";
import "../Pages/DonationsPage.css";

const MessageForm = ({
  donation,
  donorEmail,
  onMessageSubmit,
  onCancelClick,
}) => {
  const [formData, setFormData] = useState({
    email: donorEmail || "N/A",
    itemName: donation.itemName,
    itemDescription: donation.itemDescription,
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = { ...formData, donationId: donation.id };
    onMessageSubmit(updatedFormData);
  };

  return (
    <div>
      <div>
        <strong>Item Name:</strong> {formData.itemName}
      </div>

      <div>
        <strong>Item Description:</strong> {formData.itemDescription}
      </div>

      <form onSubmit={handleSubmit}>
        <label> Your Message:</label>
        <p></p>
        <textarea
          name="message"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          required
        />

        <br />
        <p></p>
        <button type="submit">Send Message</button>
        <button type="button" onClick={onCancelClick}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
