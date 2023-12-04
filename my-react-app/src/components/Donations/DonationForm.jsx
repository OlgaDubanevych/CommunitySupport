import React, { useState } from 'react';
import CategoriesOfDonations from './CategoriesOfDonations';
import '../Pages/DonationsPage.css'

function DonationForm() {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [picture, setPicture] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [donationCategory, setDonationCategory] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCategoryChange = (event) => {
    setDonationCategory(event.target.value);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4 * 1000); 
  };

  return (
    <div>
    <h2 className="header">Submit your Donation</h2>
    <form className = "text" onSubmit={handleSubmit}>
    <div className='input-text'>
      <CategoriesOfDonations donationCategory={donationCategory} onCategoryChange={handleCategoryChange} />
      </div>
      <p></p>
      <div className='input-text'>
      <label>
        Item Name:
        <input  className='input-text'type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
      </label>
      </div>
      <p></p>
      <div className='input-text'>
      <label>
       Description
        <textarea  className='input-text' value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} required />
      </label>
      </div>
      <p></p>
      <div className='input-text'>
      <label className='picture_upload'>
        Upload Picture:
       <br/>
       <p></p>
        <input className='picture_upload' type="file" onChange={(e) => setPicture(e.target.value)} />
      </label>
      </div>
      <p></p>
      <div className='input-text'>
      <label>
        First Name:
        <input  className='input-text' type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      </label>
      </div>
      <p></p>
      <div className='input-text'>
      <label>
        Last Name:
        <input  className='input-text' type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
      </label>
      </div>
      <p></p>
      <div className='input-text'>
      <label>
        Your Email:
        <input  className='input-text' type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      </div>
      <p></p>
      <div className='input-text'>
      <label>
        Cell Phone:
        <input  className='input-text'type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </label>
      </div>
      <p></p>
      <button type="submit" className = "submit_button" >Submit</button>
      {isSubmitted && <p>Your submission is under review and will be posted shortly.</p>}
      <p></p>
    </form>
    </div>
  );
}

export default DonationForm;
