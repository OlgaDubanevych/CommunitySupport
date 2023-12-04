import React from "react";
import "./Image2.css";

const AboutUsImage2 = () => {
  return (
    <div className="image-display">
      <img
        src={require("./Images/Maple Leaf.png")}
        alt="Maple Leaf Image"
        style={{ width: 150, height: 150 }}
      />
    </div>
  );
};

export default AboutUsImage2;
