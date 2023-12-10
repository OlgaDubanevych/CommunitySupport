// ResultItem.js
import React from "react";
import "./ResultItem.css";

export default function ResultItem({ category, text, hasComments, comments }) {
  return (
    <li className="result-item">
      <div className="result-text">
        <strong></strong> {text}
      </div>
      <div className="result-comments">
        {hasComments ? (
          <span className="has-comments">Has Comments: ✓</span>
        ) : (
          <span className="no-comments">No comments yet ✕</span>
        )}
      </div>
      {hasComments && (
        <div className="result-comments-list">
          <strong className="commntsList">Comments:</strong>
          <ul className="comment">
            {comments.map((comment, index) => (
              <li key={index}>{comment}</li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
