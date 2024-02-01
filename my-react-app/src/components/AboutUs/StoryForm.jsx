import React, { useState } from "react";
import "../Pages/AboutUs.css";

const StoryForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [story, setStory] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const successStoryData = {
      firstName,
      lastName,
      email,
      story,
    };

    try {
      const response = await fetch("http://localhost:7000/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(successStoryData),
      });

      if (response.ok) {
        console.log("Success story submitted!");
        setSubmitted(true);

        setFirstName("");
        setLastName("");
        setEmail("");
        setStory("");

        setTimeout(() => {
          setSubmitted(false);
        }, 4000);
      } else {
        console.error("Failed to submit success story.");
      }
    } catch (error) {
      console.error("Error submitting success story:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="header">Share Your Success Story</h1>
      <div className="input-text">
        <label htmlFor="firstName">First Name: </label>
        <p></p>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <p></p>
      <div className="input-text">
        <label htmlFor="lastName">Last Name: </label>
        <p></p>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <div className="input-text">
        <p></p>
        <label htmlFor="email">Your Email: </label>
        <p></p>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <p></p>
      <div className="input-text">
        <label htmlFor="story">Your Story: </label>
        <p></p>
        <textarea
          id="story"
          name="story"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          required
        />
      </div>
      <p></p>
      <button type="submit" className="submit">
        Submit
      </button>
      {submitted && (
        <p className="other_text">Thank you for sharing your story!</p>
      )}
    </form>
  );
};

export default StoryForm;
