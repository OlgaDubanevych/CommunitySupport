import React, { useState, useEffect } from "react";
import "../Pages/DonationsPage.css";

const DonationSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    const hasSearchCriteria =
      searchTerm.trim() !== "" || selectedCategory.trim() !== "";
    setShowResults(hasSearchCriteria);

    const filteredResults = donations.filter((donation) => {
      const searchTermMatch = donation.itemDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const categoryMatch =
        selectedCategory.trim() === "" ||
        donation.category.toLowerCase() === selectedCategory.toLowerCase();
      return searchTermMatch && categoryMatch;
    });

    setFilteredDonations(filteredResults);
  };

  useEffect(() => {
    // Fetch donations data from the backend
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:7000/api/donations");
        if (response.ok) {
          const data = await response.json();
          setDonations(data);
        } else {
          console.error(
            "Error fetching donations:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching donations:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 className="header">Search by donation category or keyword</h2>
      <div className="text">
        <div>
          <input
            type="text"
            placeholder="Search donations by item description or item name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={handleSearch}
          />
        </div>
        <div>
          <h3>Search by donation category </h3>
          <p></p>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            onBlur={handleSearch}
          >
            <option value="">Select Category</option>
            <option value="Clothing">Clothing</option>
            <option value="Electronics">Electronics</option>
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
        </div>
        <p></p>
        <button onClick={handleSearch}>Search</button>

        {/* Render the list of donations */}
        {showResults && (
          <div className="donation-list">
            {filteredDonations.length === 0 ? (
              <p>Nothing was found.</p>
            ) : (
              <>
                <h3>Search Results</h3>
                <ul>
                  {filteredDonations.map((donation) => (
                    <li key={donation.id}>
                      <p>Item Name: {donation.itemName}</p>
                      <p>Item Description: {donation.itemDescription}</p>
                      <p>Category: {donation.category}</p>
                      <p>Email: {donation.email}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationSearch;
