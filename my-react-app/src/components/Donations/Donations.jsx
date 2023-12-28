import React, { useState, useEffect } from "react";
import "./Donations.css";
import DonationRecommendationForm from "./DonationRecommendation";

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showRecommendationForm, setShowRecommendationForm] = useState(false);

  const handleRecommendClick = () => {
    setShowRecommendationForm(true);
  };

  const handleCancelClick = () => {
    setShowRecommendationForm(false);
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await fetch("http://localhost:7000/api/donations");
      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);
        setDonations(data);
        setComments(
          Object.fromEntries(data.map((donation) => [donation.id, []]))
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

  const handleCommentSubmit = async (donationId) => {
    try {
      const response = await fetch(
        `http://localhost:7000/api/donations/${donationId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: commentInput,
          }),
        }
      );

      if (response.ok) {
        setComments((prevComments) => ({
          ...prevComments,
          [donationId]: [...prevComments[donationId], commentInput],
        }));
        setCommentInput("");
      } else {
        console.error(
          "Failed to submit comment:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error submitting comment:", error.message);
    }
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
          body: JSON.stringify({
            firstName: recommendationData.firstName,
            lastName: recommendationData.lastName,
            email: recommendationData.email,
          }),
        }
      );

      // ... rest of the code
    } catch (error) {
      console.error("Error recommending donation:", error.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1 className="donations-header">Donations</h1>
      <hr />
      <div className="donations-container">
        {donations.map((donation, index) => {
          return (
            <div key={index} className="donation-card">
              {donation.category
                ? donation.category.toLowerCase()
                : "Unknown Category"}
              <p className="item-description">{donation.itemDescription}</p>

              <div className="like-comment-container">
                <h4 className="comment-header text">Comments:</h4>
                <div className="comment-section">
                  {comments[donation.id] &&
                    comments[donation.id].map((comment, index) => (
                      <p key={index} className="comment-text">
                        {comment}
                      </p>
                    ))}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCommentSubmit(donation.id);
                    }}
                  >
                    <input
                      type="text"
                      className="text"
                      placeholder="Leave your comment"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                    />
                    <button type="submit" className="submit">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
              <div>
                <button
                  className="recommend-button"
                  onClick={() => handleRecommendClick(donation)}
                >
                  Recommend this Donation
                </button>
                {showRecommendationForm && (
                  <DonationRecommendationForm
                    donation={donation}
                    onRecommendationSubmit={(data) =>
                      handleRecommendationSubmit(donation.id, data)
                    }
                    onCancelClick={handleCancelClick}
                  />
                )}
              </div>
              <hr />
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default Donations;
