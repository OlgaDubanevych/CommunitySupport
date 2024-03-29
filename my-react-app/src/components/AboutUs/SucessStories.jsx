import React, { useState, useEffect } from "react";
import "../Pages/AboutUs.css";

function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = async () => {
    try {
      const response = await fetch(
        "https://backend-service-7fgbxiruaq-nn.a.run.app/api/stories"
      );

      if (response.ok) {
        const storiesData = await response.json();
        setStories(storiesData);
      } else {
        console.error("Failed to fetch success stories.");
      }
    } catch (error) {
      console.error("Error fetching success stories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();

    const intervalId = setInterval(fetchStories, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <h1 className="header">Success Stories</h1>
      {loading && <p>Loading...</p>}
      {!loading && stories.length === 0 && (
        <p className="text">No stories were posted yet.</p>
      )}
      {stories.map((story) => (
        <div key={story.id} className="story-divider">
          <h2 className="text">{`${story.firstName} ${story.lastName}`}</h2>
          <p className="other_text">Email: {story.email}</p>
          <p className="other_text">{story.story}</p>
        </div>
      ))}
    </div>
  );
}

export default SuccessStories;
