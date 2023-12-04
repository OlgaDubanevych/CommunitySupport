import React from "react";
import ImmigrationToCanada from '../Immigration/ImmigraitionInfo'
import ImmigrationConsultants from "../Immigration/ImmigrationConsultants";
import  RecommendImmigrationConsultant from '../Immigration/RecommendConsultant'
import UsefulLinks from "../Immigration/UsefulLinks";
import ImmigrationPoll from "../Immigration/ImmigrationPoll";
import ImmigrationImage2 from "../Immigration/Image2"
import ImmigrationImage1 from "../Immigration/Image1"

const ImmigrationPage = () => {
  return (
      <div className="content">
        <ImmigrationToCanada/>
        <ImmigrationConsultants/>
        <RecommendImmigrationConsultant/>
        <ImmigrationImage1/>
        <UsefulLinks/>
        <ImmigrationPoll/>
        <ImmigrationImage2/>
      </div>
  );
};

export default ImmigrationPage;
