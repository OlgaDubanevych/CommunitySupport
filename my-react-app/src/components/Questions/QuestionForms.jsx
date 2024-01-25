// QuestionForms component
import React, { useState } from "react";
import "./QuestionForms.css";

function QuestionForms({ addQuestion }) {
  const [questionText, setQuestionText] = useState("");
  const [category, setQuestionCategory] = useState("Other");

  const handleChange = (event) => {
    const { value, type, checked } = event.target;
    setQuestionCategory(type === "checkbox" ? checked : value || "Other");
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
          category: category,
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
    <form onSubmit={handleSubmit}>
      <p></p>
      <h1 className="questions-header">Ask Your Question: </h1>
      <div className="text">
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
          value={category}
          placeholder="Choose your question category"
          onChange={handleChange}
          name="category"
        >
          <option value="OTHER">Other</option> {/* Default option */}
          <option value="JOB_SEARCH">Job Search/Career</option>
          <option value="IMMIGRATION">Immigration</option>
          <option value="EDUCATION_COLLEGE_UNIVERSITY">
            Education - College/University
          </option>
          <option value="EDUCATION_HIGH_SCHOOL_DAYCARE">
            {" "}
            Education - High School/Daycare{" "}
          </option>
          <option value="HEALTHCARE">Healthcare</option>
          <option value="FAMILY_RELATIONSHIPS">Family/Relationships</option>
          <option value="REAL_ESTATE"> Real Estate/ Rent</option>
          <option value="ENTERTAINMENT">Entertainment</option>
        </select>
        <p>
          <button className="text-submit" type="submit">
            Submit
          </button>
        </p>
      </div>
    </form>
  );
}

export default QuestionForms;
