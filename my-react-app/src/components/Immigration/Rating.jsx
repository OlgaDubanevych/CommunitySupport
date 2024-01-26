import React, { useState } from "react";
import "../Pages/ImmigrationPage.css";

function Rating({ websiteId, updateAverageRating }) {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = async (value) => {
    setRating(value);
    setSubmitted(true);

    try {
      const response = await fetch(
        `http://localhost:7000/api/websites/${websiteId}/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            websiteId: websiteId,
            rating: value,
          }),
        }
      );

      if (response.ok) {
        const averageRatingResponse = await fetch(
          `http://localhost:7000/api/websites/${websiteId}/average-rating`
        );
        const averageRating = await averageRatingResponse.json();
        updateAverageRating(averageRating);
      } else {
        console.error("Failed to submit rating");
      }
    } catch (error) {
      console.error("Error during rating submission:", error);
    }

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="other_text">
      {[...Array(5)].map((star, index) => {
        const value = index + 1;
        return (
          <span key={index} onClick={() => handleStarClick(value)}>
            {rating >= value ? "★" : "☆"}
          </span>
        );
      })}
      {submitted && <p>Thank you for your feedback!</p>}
      {submitted && <hr />}
    </div>
  );
}

export default Rating;
