import React, { useState } from "react";
import ".//DonationsPage.css";

function DonationCategory({ category, onCategoryChange }) {
  return (
    <label>
      <span>Donation Category:</span>
      <select value={category} onChange={onCategoryChange}>
        <option value="CLOTHING">CLOTHING</option>
        <option value="ELECTRONICS">ELECTRONICS</option>
        <option value="FURNITURE">FURNITURE</option>
        <option value="BOOKS">BOOKS</option>
        <option value="OTHER">OTHER</option>
      </select>
    </label>
  );
}

export default DonationCategory;
