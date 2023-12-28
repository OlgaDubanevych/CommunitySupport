import React from "react";
function CategoriesOfDonations(props) {
  const { onCategoryChange } = props;
  return (
    <>
      <label htmlFor="donationCategory">Select one:</label>
      <select
        className="text"
        value={props.donationCategory}
        onChange={onCategoryChange}
        name="donationCategory"
        id="donationCategory"
        required
      >
        <option value="">--Please choose a category--</option>
        <option value="Appliances">Appliances</option>
        <option value="CLOTHING">CLOTHING</option>
        <option value="ELECTRONICS">ELECTRONICS</option>
        <option value="FURNITURE">FURNITURE</option>
        <option value="BOOKS">BOOKS</option>
        <option value="OTHER">OTHER</option>
      </select>
    </>
  );
}

export default CategoriesOfDonations;
