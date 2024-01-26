import React, { useState } from "react";
import "../Pages/ImmigrationPage.css";

const MessageForm = ({
  consultant,
  consultantInfo,
  onMessageSubmit,
  onCancelClick,
}) => {
  const [formData, setFormData] = useState({
    email: consultantInfo.email || "N/A",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = { ...formData, consultantId: consultant.id };
    onMessageSubmit(updatedFormData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Your Message:</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          required
        />

        <br />
        <button type="submit">Send Message</button>
        <button type="button" onClick={onCancelClick}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
