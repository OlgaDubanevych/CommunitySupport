/*import React, { useState, useEffect } from "react";

const Questions = () => {
  const [inputQuestion, setInputQuestion] = useState("");
  const [inputComment, setInputComment] = useState("");
  const [allQuestions, setAllQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all questions from the Java backend on component mount
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      // Set loading to true while fetching questions
      setLoading(true);

      // Fetch questions from the Java backend
      const response = await fetch("http://localhost:7000/api/questions");

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      // Read the response body as text
      const responseBody = await response.text();

      try {
        // Parse the JSON data
        const jsonData = JSON.parse(responseBody);

        // Update the displayed questions after fetching
        setAllQuestions(jsonData);
        setError(null);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);

        // Log the plain text data
        console.log("Plain text data:", responseBody);

        // Update the displayed questions after fetching
        setAllQuestions([{ text: responseBody, comments: [] }]);
        setError(null);
      } finally {
        // Set loading to false after fetching is complete
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Error fetching questions");

      // Set loading to false in case of an error
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputQuestion(e.target.value);
  };

  const handleCommentChange = (e) => {
    setInputComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the input question to the Java backend
      const response = await fetch("http://localhost:7000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputQuestion,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit question");
      }

      // Read the response body as text
      const responseBody = await response.text();

      // Log the full response from the server (for debugging purposes)
      console.log("Full response from the server:", response);

      // Update the displayed questions after submitting
      fetchQuestions(); // This will ensure consistent handling of all questions
      setInputQuestion("");
      setError(null);
    } catch (error) {
      console.error("Error submitting question:", error);
      setError("Error submitting question");
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

      // Update the displayed questions after submitting
      fetchQuestions();
      setInputComment("");
      setError(null);
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("Error submitting comment");
    }
  };

  return (
    <div>
      <h1>Ask a Question</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Your Question:
          <input
            type="text"
            value={inputQuestion}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>

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
                {question.comments.map((comment, index) => (
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
*/

/*import React, { useState, useEffect } from "react";

const Questions = () => {
  const [inputQuestion, setInputQuestion] = useState("");
  const [inputComment, setInputComment] = useState("");
  const [questionCategory, setQuestionCategory] = useState("Other"); // Default category
  const [allQuestions, setAllQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all questions from the Java backend on component mount
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      // Set loading to true while fetching questions
      setLoading(true);

      // Fetch questions from the Java backend
      const response = await fetch("http://localhost:7000/api/questions");

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      // Read the response body as text
      const responseBody = await response.text();

      try {
        // Parse the JSON data
        const jsonData = JSON.parse(responseBody);

        // Update the displayed questions after fetching
        setAllQuestions(jsonData);
        setError(null);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);

        // Log the plain text data
        console.log("Plain text data:", responseBody);

        // Update the displayed questions after fetching
        setAllQuestions([{ text: responseBody, comments: [] }]);
        setError(null);
      } finally {
        // Set loading to false after fetching is complete
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Error fetching questions");

      // Set loading to false in case of an error
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputQuestion(e.target.value);
  };

  const handleCommentChange = (e) => {
    setInputComment(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setQuestionCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the input question and category to the Java backend
      const response = await fetch("http://localhost:7000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputQuestion,
          category: questionCategory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit question");
      }

      // Read the response body as text
      const responseBody = await response.text();

      // Log the full response from the server (for debugging purposes)
      console.log("Full response from the server:", responseBody);

      // Update the displayed questions after submitting
      fetchQuestions(); // This will ensure consistent handling of all questions
      setInputQuestion("");
      setQuestionCategory("General"); // Reset category to default after submission
      setError(null);
    } catch (error) {
      console.error("Error submitting question:", error);
      setError("Error submitting question");
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

      // Update the displayed questions after submitting
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

      // Update the displayed questions after updating likes
      fetchQuestions();
    } catch (error) {
      console.error("Error updating likes:", error);
      setError("Error updating likes");
    }
  };

  return (
    <div>
      <h1>Ask a Question</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Your Question:
          <input
            type="text"
            value={inputQuestion}
            onChange={handleInputChange}
            placeholder="Type your question here"
          />
        </label>
        <p>Please select your question category:</p>
        <select value={questionCategory} onChange={handleCategoryChange}>
          <option value="Job Search/Career">Job Search/Career</option>
          <option value="Immigration">Immigration</option>
          <option value="Education - College/University">
            {" "}
            Education - College/University
          </option>
          <option value="Education - High School/Daycare">
            {" "}
            Education - High School/Daycare
          </option>
          <option value="Healthcare">Healthcare</option>
          <option value="Family/Relationships">Family/Relationships</option>
          <option value="Real Estate/ Rent"> Real Estate/ Rent</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit">Submit</button>
      </form>

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
                {question.comments.map((comment, index) => (
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
*/
