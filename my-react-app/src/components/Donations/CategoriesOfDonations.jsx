import React from "react";
function CategoriesOfDonations(props) {
  const { onCategoryChange } = props;
  return (
    <>
      <label htmlFor="donationCategory">Category:</label>
      <p></p>
      <select
        className="category"
        value={props.donationCategory}
        onChange={onCategoryChange}
        name="donationCategory"
        id="donationCategory"
        required
      >
        <option value="">--Please choose a category--</option>
        <option value="APPLIANCES">Appliances</option>
        <option value="BABY_PRODUCTS">Baby Products</option>
        <option value="BOOKS">Books</option>
        <option value="CLOTHES">Clothes</option>
        <option value="ELECTRONICS">Electronics</option>
        <option value="FOOD">Food</option>
        <option value="FURNITURE">Furniture</option>
        <option value="KITCHEN_UTILITIES">Kitchen Utilities</option>
        <option value="TOYS_AND_GAMES">Toys and Games</option>
        <option value="OTHER">Other</option>
      </select>
    </>
  );
}

export default CategoriesOfDonations;
