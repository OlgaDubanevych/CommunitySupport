// QuestionForms component
import React, { useState } from "react";
import "./QuestionForms.css";

function QuestionForms({ addQuestion }) {
  const [questionText, setQuestionText] = useState("");
  const [questionCategory, setQuestionCategory] = useState("Other");

  const handleChange = (event) => {
    const { value, type, checked } = event.target;
    type === "checkbox"
      ? setQuestionCategory(checked)
      : setQuestionCategory(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:7000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: questionText,
          category: questionCategory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit question");
      }

      // Assuming the backend responds with the new question data
      const newQuestion = await response.json();

      console.log("Response from the server:", newQuestion);

      // Reset the form state
      setQuestionText("");
      setQuestionCategory("Other");

      // Call the provided addQuestion function to update the question list
      addQuestion(newQuestion);
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

  return (
    <form className="text" onSubmit={handleSubmit}>
      <p></p>
      <h1 className="text-post">Ask Your Question: </h1>
      <p></p>
      <textarea
        className="text"
        type="text"
        name="questionText"
        value={questionText}
        placeholder="Type your question here"
        onChange={(e) => setQuestionText(e.target.value)}
      />

      <br />
      <label className="text">Please select your question category </label>
      <p></p>
      <select
        className="text"
        value={questionCategory}
        placeholder="Choose your question category"
        onChange={handleChange}
        name="questionCategory"
      >
        <option value="Job Search/Career">Job Search/Career</option>
        <option value="Immigration">Immigration</option>
        <option value="Education - College/University">
          Education - College/University
        </option>
        <option value="Education - High School/Daycare">
          {" "}
          Education - High School/Daycare
        </option>
        <option value="Healthcare">Healthcare</option>
        <option value="Family/Relationships">Family/Relationships</option>
        <option value="Real Estate"> Real Estate/ Rent</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Other">Other</option>
      </select>
      <p>
        <button className="text-submit" type="submit">
          Submit
        </button>
      </p>
    </form>
  );
}

export default QuestionForms;
