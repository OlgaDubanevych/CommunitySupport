import React from "react";
import '../JobSearch/JobSearch'
import SearchJobAds from '../JobSearch/SearchJobPostings'
import Intro from '../JobSearch/Text'
import JobPostingForm from '../JobSearch/PostYourJob'
import JobList from "../JobSearch/Jobs";
import JobSearchImage from '../JobSearch/JobSearchImage'


const JobSearchPage = () => {
  return (
      <div className="content">
        <Intro/>
       <JobList/>
        <SearchJobAds/>
        <JobPostingForm/>
        <JobSearchImage/>
        <p></p>
      </div> 
  );
};

export default JobSearchPage;
