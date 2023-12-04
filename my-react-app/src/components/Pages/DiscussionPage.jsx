import React from "react";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import DiscussionImage from "../Questions/DiscussionImage"
import QuestionForms from "../Questions/QuestionForms";
import Search from "../Questions/QuestionSearch/QuestionSearch";
import Questions from "../Questions/Questions";
import Intro from '../Questions/Text'

const DiscussionPage = () => {
  return (
      <div className="content">
        <Intro/>
        <Questions/>  
        <Search/>
        <DiscussionImage />
        <QuestionForms />
      </div>
  );
};

export default DiscussionPage;
