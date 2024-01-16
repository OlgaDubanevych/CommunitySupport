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

  const fetchDonations = async () => {
    try {
      const controller = new AbortController();
      const signal = controller.signal;

      const timeoutId = setTimeout(() => controller.abort(), 180000); // Abort fetch after 5 seconds

      const response = await fetch("http://localhost:7000/api/donations", {
        signal,
      });

      clearTimeout(timeoutId); // Clear the timeout if the fetch is successful

      if (response.ok) {
        const data = await response.json();
        setDonations(data);

        setShowRecommendationForm((prev) => {
          const newFormState = { ...prev };
          data.forEach((donation) => {
            if (prev[donation.id] === undefined) {
              newFormState[donation.id] = false;
            }
          });
          return newFormState;
        });

        setShowMessageForm((prev) => {
          const newFormState = { ...prev };
          data.forEach((donation) => {
            if (prev[donation.id] === undefined) {
              newFormState[donation.id] = false;
            }
          });
          return newFormState;
        });

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

        // Fetch the updated donation after submission
        const updatedDonationResponse = await fetch(
          `http://localhost:7000/api/donations/${donationId}`
        );
        const updatedDonation = await updatedDonationResponse.json();

        // Update the state to include the new donation
        setDonations((prevDonations) => [
          updatedDonation,
          ...prevDonations.filter((donation) => donation.id !== donationId),
        ]);

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
      const donorInfoArray = await donorInfoResponse.json();

      console.log(
        "Donor Information for Donation ID:",
        donationId,
        donorInfoArray
      );

      setShowMessageForm((prev) => ({
        ...prev,
        [donationId]: { show: true, donorInfo: donorInfoArray[0] },
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
      // Fetch the updated donation after submission
      const updatedDonationResponse = await fetch(
        `http://localhost:7000/api/donations/${donationId}`
      );
      const updatedDonation = await updatedDonationResponse.json();

      // Update the state to include the new donation
      setDonations((prevDonations) => [
        updatedDonation,
        ...prevDonations.filter((donation) => donation.id !== donationId),
      ]);

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
    const intervalId = setInterval(fetchDonations, 1000);

    return () => clearInterval(intervalId);
  }, []);
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1 className="donations-header">Donations</h1>
      <div className="text">
        {donations.length === 0 ? (
          <p className="text">No donations available</p>
        ) : (
          donations.map((donation, index) => (
            <div key={index} className="donation-card">
              <p className="item-name">{donation.itemName}</p>
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
                    onCancelClick={() =>
                      handleCancelRecommendation(donation.id)
                    }
                  />
                )}
              </div>
              <p></p>
              <p>
                To reach out to the author of this donation post, please use the
                messaging feature:
              </p>
              <p></p>
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
          ))
        )}
      </div>
      <hr />
    </div>
  );
};

export default Donations;
