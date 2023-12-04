import React from "react";
import Intro from '../AboutUs/Text'
import SuccessStories from "../AboutUs/SucessStories";
import StoryForm from "../AboutUs/StoryForm";
import './AboutUs.css'
import AboutUsImage1 from '../AboutUs/AboutUsImage1'
import AboutUsImage2 from "../AboutUs/AboutUsImage2";


const AboutUs = () => {
  return (
    <div>
      <Intro/>
      <SuccessStories/>
      <AboutUsImage2/>
      <StoryForm/>
      <AboutUsImage1/>
      <br></br>
    </div>
  );
};

export default AboutUs;
