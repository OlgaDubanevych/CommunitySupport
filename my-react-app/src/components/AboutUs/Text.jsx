import React from 'react';
import '../Pages/AboutUs.css'

function Intro () {
  return (
    <div>
      <div className="Community_Support">
        <h1 className='header'>Welcome to Community Support! </h1>
      </div>
      <p></p>
      <div className="text">
        <div>
          We are dedicated to creating a cooperating, nurturing and reassuring environment for newcomers and everyone searching for advice from the power of our community’s wisdom and expertise.
        </div>
      </div>
      <p></p>

      <div className="what_you_can_do">
        <div className='text'>
          If you are looking for advice and assistance, would like to give back to community by sharing your experience or want to meet new people in our discussion board, this is a perfect place to:
        </div>
        <ul className='other_text'>
          <li>Post your questions, provide your own input and insight to the discussions</li>
          <li>Seek job search tips, search for people in the industry of your interest, obtain inspiration from the success stories, provide mentorship and guidance and excel your network</li>
          <li>Donate clothes, books, appliances, funds, any items community members are looking for via our discussion board</li>
          <li>Have useful links in relation to immigration and settling process all collected in one convenient place along with success stories of those who can proudly call Canada their new home.</li>
        </ul>
      </div>
    </div>
  );
}

export default Intro;
