import React from "react";
import "./Image1.css";

const DonationsImage1 = () => {
  return (
    <div className="image-display">
      <img
        src={require("./Images/Group 16.png")}
        alt="Group 16 Image"
        style={{ width: 270, height: 125 }}
      />
    </div>
  );
};

export default DonationsImage1;
