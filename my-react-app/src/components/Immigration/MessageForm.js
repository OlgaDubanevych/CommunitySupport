import React, { useState, useEffect } from "react";
import "../Pages/ImmigrationPage.css";

const MessageForm = ({
  email,
  consultantInfo,
  onMessageSubmit,
  onCancelClick,
}) => {
  const [formData, setFormData] = useState({
    email: email || "N/A",
    message: "",
  });

  useEffect(() => {
    if (consultantInfo) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: consultantInfo.email,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: "N/A",
      }));
    }
  }, [consultantInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onMessageSubmit(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Your Message:</label>
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
        <button type="submit">Send Message</button>
        <button type="button" onClick={onCancelClick}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
