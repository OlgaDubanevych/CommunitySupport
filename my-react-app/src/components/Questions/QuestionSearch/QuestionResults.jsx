import React from 'react';
import ResultItem from './QuestionResultItem';

export default function Results({ Results, searchInput, selectedCategory }) {
  const hasComments = (comments) => comments.length > 0;

  const filteredResults = Results.filter((result) => {
    if (selectedCategory === '') {
      return result.question_text.toLowerCase().includes(searchInput.toLowerCase());
    } else {
      return result.question_category === selectedCategory &&
        result.question_text.toLowerCase().includes(searchInput.toLowerCase());
    }
  });

  return (
    <main>
      <ul>
        {filteredResults.map((result) => (
          <ResultItem
            key={result.id}
            question_category={result.question_category}
            question_text={result.question_text}
            hasComments={hasComments(result.comments)}
            comments={[result.comments]}
          />
        ))}
      </ul>
    </main>
  );
}
