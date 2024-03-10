import React, { useState, useEffect } from "react";
import Results from "./QuestionResults";
import QuestionCategory from "./QuestionCategory";
import "./QuestionSearch.css";

export default function Search() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [allQuestions, setAllQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    filterQuestions(event.target.value, searchInput);
  };

  const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
    filterQuestions(selectedCategory, event.target.value);
  };

  const filterQuestions = (category, input) => {
    const filtered = allQuestions.filter(
      (question) =>
        (!category ||
          question.category.toUpperCase() === category.toUpperCase()) &&
        (!input || question.text.toLowerCase().includes(input.toLowerCase()))
    );
    setFilteredQuestions(filtered);
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://backend-service-7fgbxiruaq-nn.a.run.app/api/questions"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const questions = await response.json();

      setAllQuestions(questions);
      filterQuestions(selectedCategory, searchInput);
      setError(null);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Error fetching questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="text">
      <QuestionCategory
        questionCategory={selectedCategory}
        handleChange={handleCategoryChange}
      />

      {selectedCategory && filteredQuestions.length === 0 ? (
        <p>This question category has no questions yet.</p>
      ) : (
        <Results
          Results={filteredQuestions}
          searchInput={searchInput}
          selectedCategory={selectedCategory}
        />
      )}
    </main>
  );
}
