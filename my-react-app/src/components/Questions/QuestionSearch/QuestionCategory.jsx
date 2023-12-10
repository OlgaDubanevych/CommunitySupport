import React from "react";
import "./QuestionCategory.css";

function QuestionCategory(props) {
  const { category, handleChange } = props;

  return (
    <>
      <h1 className="text_search-for-question"> Search by Category </h1>
      <select
        className="text"
        value={category}
        placeholder="Choose your question category"
        onChange={handleChange}
        name="category"
      >
        <option value="JOB_SEARCH">Job Search/Career</option>
        <option value="IMMIGRATION">Immigration</option>
        <option value="EDUCATION_COLLEGE_UNIVERSITY">
          Education - College/University
        </option>
        <option value="EDUCATION_HIGH_SCHOOL_DAYCARE">
          {" "}
          Education - High School/Daycare
        </option>
        <option value="HEALTHCARE">Healthcare</option>
        <option value="FAMILY_RELATIONSHIPS">Family/Relationships</option>
        <option value="REAL_ESTATE"> Real Estate/ Rent</option>
        <option value="ENTERTAINMENT">Entertainment</option>
        <option value="OTHER">Other</option>
      </select>
    </>
  );
}

export default QuestionCategory;
