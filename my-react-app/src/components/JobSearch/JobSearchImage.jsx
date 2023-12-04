import React from "react";
import "./JobSearchImage.css";

const JobSearchImage = () => {
  return (
    <div className="image-display">
      <img
        src={require("./Images/Group - Bag-Checkmark.png")}
        alt="Group 16 Image"
        className="image"
      />
      <img
        src={require("./Images/person and check mark.png")}
        className="image"
      />
    </div>
  );
};

export default JobSearchImage;
