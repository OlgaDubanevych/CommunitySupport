import React from "react";
import "./SideMenu.css";

const menuToggleButton= ({ click }) => (
  <button className="toggle-button" onClick={click}>
    <div className="toggle-button-line" />
    <div className="toggle-button-line" />
    <div className="toggle-button-line" />
  </button>
);

export default menuToggleButton;