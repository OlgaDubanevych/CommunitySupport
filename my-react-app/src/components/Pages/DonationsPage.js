import React from "react";
import DonationForm from "../Donations/DonationForm"
import DonationCategory from '../Donations/DonationSearch/DonationCategory'
import Donations from "../Donations/Donations";
import Intro from '../Donations/Text'
import DonationsImage2 from '../Donations/Image2'
import DonationsImage1 from '../Donations/Image1'

const DonationsPage = () => {
  return (
      <div className="content">
        <Intro/>
        <Donations/>
        <DonationCategory/>
        <br/>
        <p></p>
        <DonationsImage1/>
        <DonationForm/>
        <DonationsImage2/>
      </div>
  );
};

export default DonationsPage;
