import React, { useState, useEffect } from "react";
import DonationRecommendationForm from "./DonationRecommendationForm";
import MessageForm from "./MessageForm";
import "./Donations.css";

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [showRecommendationForm, setShowRecommendationForm] = useState({});
  const [showMessageForm, setShowMessageForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleRecommendClick = (donationId) => {
    setShowRecommendationForm((prev) => ({ ...prev, [donationId]: true }));
  };

  const handleCancelRecommendation = (donationId) => {
    setShowRecommendationForm((prev) => ({ ...prev, [donationId]: false }));
  };

  const handleRecommendationSubmit = async (donationId, recommendationData) => {
    try {
      const response = await fetch(
        `http://localhost:7000/api/donations/${donationId}/recommend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(recommendationData),
        }
      );

      if (response.ok) {
        console.log("Recommendation submitted successfully");
        setShowRecommendationForm((prev) => ({ ...prev, [donationId]: false }));
      } else {
        console.error(
          "Failed to submit recommendation:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error recommending donation:", error.message);
    }
  };

  const handleShowMessageForm = async (donationId) => {
    try {
      const donorInfoResponse = await fetch(
        `http://localhost:7000/api/donations/${donationId}`
      );
      const donorInfo = await donorInfoResponse.json();

      console.log("Donor Information for Donation ID:", donationId, donorInfo);

      setShowMessageForm((prev) => ({
        ...prev,
        [donationId]: { show: true, donorInfo },
      }));
    } catch (error) {
      console.error("Error fetching donor information:", error.message);
    }
  };

  const handleCancelMessageForm = (donationId) => {
    setShowMessageForm((prev) => ({ ...prev, [donationId]: false }));
  };

  const handleMessageSubmit = async (donationId, messageData) => {
    try {
      // Fetch the donor information (email, itemName, and itemDescription) based on the donation ID
      const donorInfoResponse = await fetch(
        `http://localhost:7000/api/donations/${donationId}`
      );
      const donorInfoArray = await donorInfoResponse.json();

      if (donorInfoArray.length > 0) {
        const donorInfo = donorInfoArray[0]; // Access the first element
        // Include donor email, itemName, and itemDescription in the message body
        const emailBody = `Donor Email: ${donorInfo.email}\nItem Name: ${donorInfo.itemName}\nItem Description: ${donorInfo.itemDescription}\n\n${messageData.message}`;

        // Create a mailto link with subject and body
        const subject = encodeURIComponent("Donation Message");
        const body = encodeURIComponent(emailBody);
        const mailtoLink = `mailto:${donorInfo.email}?subject=${subject}&body=${body}`;

        // Open a new window or tab with the mailto link
        window.open(mailtoLink);

        setShowMessageForm((prev) => ({ ...prev, [donationId]: false }));
      } else {
        console.error(
          "Donor information not found for Donation ID:",
          donationId
        );
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch("http://localhost:7000/api/donations");
        if (response.ok) {
          const data = await response.json();
          setDonations(data);

          setShowRecommendationForm(
            Object.fromEntries(data.map((donation) => [donation.id, false]))
          );

          setShowMessageForm(
            Object.fromEntries(data.map((donation) => [donation.id, false]))
          );

          setLoading(false);
        } else {
          console.error(
            "Failed to fetch donations:",
            response.status,
            response.statusText
          );
          setError("Failed to fetch donations");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching donations:", error.message);
        setError("Error fetching donations");
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  return (
    <div>
      <h1 className="donations-header">Donations</h1>
      <hr />
      <div className="donations-container">
        {donations.map((donation, index) => (
          <div key={index} className="donation-card">
            {donation.category
              ? donation.category.toLowerCase()
              : "Unknown Category"}
            <p className="item-description">{donation.itemDescription}</p>

            <div>
              <button
                className="recommend-button"
                onClick={() => handleRecommendClick(donation.id)}
              >
                Recommend this Donation
              </button>
              {showRecommendationForm[donation.id] && (
                <DonationRecommendationForm
                  donation={donation}
                  onRecommendationSubmit={(data) =>
                    handleRecommendationSubmit(donation.id, data)
                  }
                  onCancelClick={() => handleCancelRecommendation(donation.id)}
                />
              )}
            </div>

            <div>
              <button
                className="message-button"
                onClick={() => handleShowMessageForm(donation.id)}
              >
                Message
              </button>
              {showMessageForm[donation.id] && (
                <MessageForm
                  donation={donation}
                  donorInfo={showMessageForm[donation.id].donorInfo}
                  onMessageSubmit={(data) =>
                    handleMessageSubmit(donation.id, data)
                  }
                  onCancelClick={() => handleCancelMessageForm(donation.id)}
                />
              )}
            </div>
            <hr />
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default Donations;
