import React, { useState, useEffect } from "react";
import QuestionForms from "./QuestionForms";
import "./Questions.css";

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

      console.log("Category:", newQuestion.category);

      const formattedQuestion = {
        id: newQuestion.id,
        text: newQuestion.text,
        category: newQuestion.category,
        liked: newQuestion.liked || false,
        likes: newQuestion.likes || 0,
        comments: newQuestion.comments || [],
      };

      console.log("Formatted question:", formattedQuestion);

      setAllQuestions((prevQuestions) => [formattedQuestion, ...prevQuestions]);

      await fetchQuestions();
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
      <div>
        <h1 className="questions-header">Questions</h1>
        {loading ? (
          <p className="text">Loading questions...</p>
        ) : error ? (
          <p className="text">{error}</p>
        ) : allQuestions.length === 0 ? (
          <p className="text">No questions available</p>
        ) : (
          <div className="questions-container">
            {allQuestions.map((question) => (
              <div key={question.id}>
                <p className="question-text">{question.text}</p>

                {question.comments && question.comments.length > 0 && (
                  <div className="comment-text">
                    {question.comments.map((comment, index) => (
                      <div key={`${question.id}-${index}`}>{comment}</div>
                    ))}
                  </div>
                )}
                <p></p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCommentSubmit(question.id);
                  }}
                >
                  <label className="comment-form">
                    Leave your comment:
                    <p></p>
                    <input
                      className="comment-form textarea"
                      type="text"
                      value={inputComment}
                      onChange={handleCommentChange}
                    />
                  </label>
                  <p></p>
                  <button className="submit_c" type="submit">
                    Submit Comment
                  </button>
                </form>
                <p></p>
                <button
                  onClick={() => handleLike(question.id, !question.liked)}
                  className={`like-button ${question.liked ? "liked" : ""}`}
                >
                  <span className="like-icon">👍</span>
                  <span className="like-text text">
                    {question.liked ? "Liked" : "Like"}
                  </span>
                </button>
                <p></p>
                <span className="text">Likes: {question.likes}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <QuestionForms addQuestion={handleAddQuestion} />
    </div>
  );
};

export default Questions;
