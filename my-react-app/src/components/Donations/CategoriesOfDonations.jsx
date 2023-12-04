import React from 'react';
function CategoriesOfDonations(props) {
  const { onCategoryChange } = props;
  return (
    <>
      <label htmlFor="donationCategory">Select one:</label>
      <select
        className='text'
        value={props.donationCategory}
        onChange={onCategoryChange}
        name="donationCategory"
        id="donationCategory"
        required
      >
        <option value="">--Please choose a category--</option>
        <option value="Appliances">Appliances</option>
        <option value="Baby products">Baby products</option>
        <option value="Books">Books</option>
        <option value="Clothes">Clothes</option>
        <option value="Electronics">Electronics</option>
        <option value="Food">Food</option>
        <option value="Furniture">Furniture</option>
        <option value="Kitchen utilities and appliances">Kitchen utilities and appliances</option>
        <option value="Toys and Games">Toys and Games</option>
        <option value="Other">Other</option>
      </select>
    </>
  );
}

export default CategoriesOfDonations;
