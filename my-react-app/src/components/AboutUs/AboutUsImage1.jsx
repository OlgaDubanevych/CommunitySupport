import React from "react";
import "./Image1.css";

const AboutUsImage1 = () => {
  return (
    <div className="image-display">
      <img
        src={require("./Images/Big_Maple_Leaf_with_Heart.jpg")}
        alt="Big Maple Leaf with Heart"
        className="image1"
      />
    </div>
  );
};

export default AboutUsImage1;
