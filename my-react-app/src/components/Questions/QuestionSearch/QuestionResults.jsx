import React from "react";
import ResultItem from "./QuestionResultItem";
import "./Results.css"; // Import a CSS file for Results component styles

export default function Results({ Results, searchInput, selectedCategory }) {
  const hasComments = (comments) => comments.length > 0;

  const filteredResults = Results.filter((result) => {
    if (selectedCategory === "") {
      return result.text.toLowerCase().includes(searchInput.toLowerCase());
    } else {
      return (
        result.category === selectedCategory &&
        result.text.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
  });

  return (
    <main>
      {filteredResults.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="result-list-container">
          {filteredResults.map((result) => (
            <div key={result.id} className="result-item-container">
              <ResultItem
                category={result.category}
                text={result.text}
                hasComments={hasComments(result.comments)}
                comments={result.comments}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
