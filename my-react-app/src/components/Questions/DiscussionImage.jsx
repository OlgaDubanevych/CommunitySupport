import React from "react";
import "./ImageDiscussionBoard.css";

const DiscussionImage = () => {
  return (
    <div className="discussion_image">
      <img
        src={require("./Images/group discussion.png")}
        className="discussion_image__img"
        alt="Group 16 Image"
      />
    </div>
  );
};

export default DiscussionImage;
