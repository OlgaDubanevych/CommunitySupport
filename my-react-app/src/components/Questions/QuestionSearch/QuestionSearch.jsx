import React, { useState } from "react";
import SearchBox from './QuestionSearchBox'
import Results from './QuestionResults'
import ResultItem from "./QuestionResultItem";
import Questions from './Questions.json'
import QuestionCategory from './QuestionCategory'
import './QuestionSearch.css'

export default function Search () {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  }

  const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
  }

  const filteredQuestions = Questions.filter(question => question.question_category === selectedCategory);

  return (
    <main className="text">
      <QuestionCategory questionCategory={selectedCategory} handleChange={handleCategoryChange} />
      
      {selectedCategory && filteredQuestions.length === 0 ? 
        <p>This question category has no questions yet.</p> : 
        <Results Results={filteredQuestions} searchInput={searchInput} selectedCategory={selectedCategory} />}
    </main>
  )
}
