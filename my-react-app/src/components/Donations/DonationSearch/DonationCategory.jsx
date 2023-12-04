import React, { useState } from 'react';
import donations from './Donations.json';
import './DonationsPage.css'

function DonationCategory() {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredDonations = selectedCategory
    ? donations.filter((donation) => donation.donation_category === selectedCategory)
    : [];

  return (
    <div>
    <h2 className="header">Search Donations by Category:</h2>
    <div className="text">
      <select classsName = "text" value={selectedCategory} onChange={handleChange} name="donationCategory">
        <option value="">Select a category</option>
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
      
      {filteredDonations.length > 0 && (
        <div>
          {filteredDonations.map((donation) => (
            <div className="donation" key={donation.donated_items_name}>
              <h3>{donation.donated_items_name}</h3>
              <p className= "other_text">{donation.items_description}</p>
              <p className= "other_text">{donation.pick_up_instructions}</p>
            </div>
          ))}
        </div>
      )}
      {filteredDonations.length === 0 && selectedCategory !== '' && (
        <p className = "other_text">This category currently does not have any donated items.</p>
      )}
    </div>
    </div>
  );
}

export default DonationCategory;

