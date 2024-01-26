import React, { useState, useEffect } from "react";
import "./Questions.css";

function QuestionDisplay() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {};

  const handleLike = async (questionId, liked) => {};

  const handleCommentSubmit = async (questionId, inputComment) => {};

  return (
    <div>
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
            <div key={question.id}>{/* Question display structure here */}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuestionDisplay;
