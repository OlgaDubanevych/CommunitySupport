// Questions component
import React, { useState, useEffect } from "react";
import QuestionForms from "./QuestionForms"; // Import the QuestionForms component

const Questions = () => {
  const [inputComment, setInputComment] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allQuestions, setAllQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:7000/api/questions");

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const responseBody = await response.text();

      try {
        const jsonData = JSON.parse(responseBody);
        setAllQuestions(jsonData);
        setError(null);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        console.log("Plain text data:", responseBody);
        setAllQuestions([{ text: responseBody, comments: [] }]);
        setError(null);
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Error fetching questions");
      setLoading(false);
    }
  };

  const handleCommentChange = (e) => {
    setInputComment(e.target.value);
  };

  const handleAddQuestion = async (newQuestion) => {
    try {
      console.log("New question received:", newQuestion);

      const formattedQuestion = {
        id: newQuestion.id, // Assuming the new question data includes an 'id' property
        text: newQuestion.text,
        liked: newQuestion.liked || false, // Set liked to false if not present
        likes: newQuestion.likes || 0, // Set likes to 0 if not present
        comments: newQuestion.comments || [], // Set comments to an empty array if not present
      };

      console.log("Formatted question:", formattedQuestion);

      setAllQuestions((prevQuestions) => [formattedQuestion, ...prevQuestions]);
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleCommentSubmit = async (questionId) => {
    try {
      const response = await fetch(
        `http://localhost:7000/api/questions/${questionId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: inputComment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to submit comment: ${response.statusText}`);
      }

      fetchQuestions();
      setInputComment("");
      setError(null);
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("Error submitting comment");
    }
  };

  const handleLike = async (questionId, liked) => {
    try {
      const requestBody = JSON.stringify({ liked });

      const response = await fetch(
        `http://localhost:7000/api/questions/likes/${questionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update likes: ${response.statusText}`);
      }

      fetchQuestions();
    } catch (error) {
      console.error("Error updating likes:", error);
      setError("Error updating likes");
    }
  };

  return (
    <div>
      <QuestionForms addQuestion={handleAddQuestion} />
      <h2>All Questions</h2>
      {loading ? (
        <p>Loading questions...</p>
      ) : error ? (
        <p>{error}</p>
      ) : allQuestions.length === 0 ? (
        <p>No questions available</p>
      ) : (
        <div>
          {allQuestions.map((question) => (
            <div key={question.id}>
              <p>{question.text}</p>
              <button
                onClick={() => handleLike(question.id, !question.liked)}
                className={`like-button ${question.liked ? "liked" : ""}`}
              >
                <span className="like-icon">👍</span>
                <span className="like-text text">
                  {question.liked ? "Liked" : "Like"}
                </span>
              </button>
              <span>Likes: {question.likes}</span>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCommentSubmit(question.id);
                }}
              >
                <label>
                  Your Comment:
                  <input
                    type="text"
                    value={inputComment}
                    onChange={handleCommentChange}
                  />
                </label>
                <button type="submit">Submit Comment</button>
              </form>
              <ul>
                {question.comments &&
                  question.comments.map((comment, index) => (
                    <li key={index}>{comment}</li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Questions;
