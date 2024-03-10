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

      const timeoutId = setTimeout(() => controller.abort(), 180000);

      const response = await fetch(
        "https://backend-service-7fgbxiruaq-nn.a.run.app/api/donations",
        {
          signal,
        }
      );

      clearTimeout(timeoutId);

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
        `https://backend-service-7fgbxiruaq-nn.a.run.app/api/donations/${donationId}/recommend`,
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

        const updatedDonationResponse = await fetch(
          `http://192.168.2.14:7000/donations/${donationId}`
        );
        const updatedDonation = await updatedDonationResponse.json();

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
      const donationInfoResponse = await fetch(
        `https://backend-service-7fgbxiruaq-nn.a.run.app/api/donations/${donationId}`
      );

      if (donationInfoResponse.ok) {
        const donationInfoArray = await donationInfoResponse.json();
        const updatedDonationInfo =
          donationInfoArray.length > 0
            ? donationInfoArray.find((donation) => donation.id === donationId)
            : null;

        console.log(
          "donation Information for donation ID:",
          donationId,
          updatedDonationInfo
        );

        setShowMessageForm((prev) => ({
          ...prev,
          [donationId]: {
            show: true,
            donationInfo: updatedDonationInfo,
            email: updatedDonationInfo.email,
          },
        }));
      } else {
        console.error(
          "Failed to fetch donation information:",
          donationInfoResponse.status,
          donationInfoResponse.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching donation information:", error.message);
    }
  };

  const handleCancelMessageForm = (donationId) => {
    setShowMessageForm((prev) => ({
      ...prev,
      [donationId]: { show: false, donationInfo: null },
    }));
  };

  const handleMessageSubmit = async (donationId, messageData) => {
    try {
      console.log("Donation ID:", donationId);
      const response = await fetch(
        `https://backend-service-7fgbxiruaq-nn.a.run.app/api/donations/${donationId}`
      );

      if (response.ok) {
        const updatedDonations = await response.json();
        console.log("Updated donation Information:", updatedDonations);

        const updatedDonation = updatedDonations.find(
          (donation) => donation.id === donationId
        );

        if (updatedDonation) {
          const emailBody = `Item Name: ${updatedDonation.itemName}\nItem Description: ${updatedDonation.itemDescription}\n\n${messageData.message}`;

          const subject = encodeURIComponent("Inquiry about your donation");
          const body = encodeURIComponent(emailBody);

          const mailtoLink = `mailto:${updatedDonation.email}?subject=${subject}&body=${body}`;

          window.open(mailtoLink);
        } else {
          console.error("Donation with ID not found:", donationId);
        }
      } else {
        console.error(
          "Failed to fetch updated donation:",
          response.status,
          response.statusText
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
                  className="submit_s"
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
                  className="submit_s"
                  onClick={() => handleShowMessageForm(donation.id)}
                >
                  Message
                </button>
                {showMessageForm[donation.id] &&
                  showMessageForm[donation.id].show && (
                    <MessageForm
                      donation={donation}
                      email={
                        showMessageForm[donation.id]
                          ? showMessageForm[donation.id].email
                          : ""
                      }
                      donationInfo={
                        showMessageForm[donation.id]
                          ? showMessageForm[donation.id].donationInfo
                          : null
                      }
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
