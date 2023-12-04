import React, { useState } from 'react';
import './Donations.css';
import donationData from './DonationSearch/Donations.json';
import RecommendationForm from './DonationRecommendation';
import '../Pages/DonationsPage.css'

const Donations = () => {
  const [donations, setDonations] = useState(donationData);
  const [comments, setComments] = useState([]);
  const [selectedDonationId, setSelectedDonationId] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  
  const handleCommentSubmit = (donationId) => {
    const newComment = {
      donationId: donationId,
      text: commentInput
    };
    setComments([...comments, newComment]);
    setCommentInput('');
  };
  
  const handleRecommendationClick = (donationId) => {
    setSelectedDonationId(donationId);
  };

  return (
    <div>
      <h1 className="donations-header">Donations</h1>
      <hr />
      <div className="donations-container">
        {donations.map((donation, index) => (
          <div key={index} className="donation-card">
            <h3 className="category text">{donation.donation_category}</h3>
            <h4 className="item-name text">{donation.donated_items_name}</h4>
            <p className="item-description">{donation.items_description}</p>
            <p className="pickup-instructions">{donation.pick_up_instructions}</p>
            <div className="like-comment-container">
              <h4 className="comment-header text">Comments:</h4>
              <div className="comment-section">
                {comments.map((comment, index) => {
                  if (comment.donationId === donation.id) {
                    return (
                      <p key={index} className="comment-text">{comment.text}</p>
                    );
                  }
                  return null;
                })}
                <form onSubmit={(e) => {e.preventDefault(); handleCommentSubmit(donation.id)}}>
                  <input type="text" className="text" placeholder="Leave your comment" value={commentInput} onChange={(e) => setCommentInput(e.target.value)} />
                  <p></p>
                  <button type="submit" className='submit'>Submit</button>
                </form>
              </div>
            </div>
            {selectedDonationId === donation.id && (
              <div className="recommendation-form-container">
                <RecommendationForm />
              </div>
            )}
            <p></p>
            <button onClick={() => handleRecommendationClick(donation.id)} className="recommendation-button">Recommend this donation</button>
          <hr />
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default Donations;

  
    

