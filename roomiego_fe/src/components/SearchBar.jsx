import React, { useState } from "react";
import "../styles/SearchBar.css";
import home from "../assets/home.jpg"; // Your background image
import room5 from "../assets/room5.avif"; // Your default room image
const SearchBar = ({ onSortChange }) => {
  const [locationQuery, setLocationQuery] = useState("");
  // Removed checkIn and checkOut states as they are being replaced
  const [guestQuery, setGuestQuery] = useState(""); // For "Find your roomie?"

  const handleSearch = () => {
    alert(
      `Searching for: Location - ${locationQuery}, Guests - ${guestQuery}`
      // Add sorting parameter to search logic if needed
    );
  };

  return (
    <div className="search-container_total ">
    <div className="search-container-background">
      <img
        src={room5}
        alt="Background"
        className="background-image-full"
      />
      <div className="search-content-overlay">
        <h1>Enjoy your Dream Vacation</h1>
        <p>Book Hotels, Flights and Stay packages at lowest price</p>
      </div>
      <div className="search-widget">
        <div className="search-options">
          <div className="search-option">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Where are you going?"
            />
          </div>

          {/* This is where the Min/Max buttons will go, styled as a search-option */}
          <div className="search-option sort-buttons-container">
            <label>Sort by Price</label> {/* Optional: Add a label for clarity */}
            <div className="sort-buttons-inline">
              <button className="sort-button" onClick={() => onSortChange("asc")}>
                Min
              </button>
              <button className="sort-button" onClick={() => onSortChange("desc")}>
                Max
              </button>
            </div>
          </div>

          <div className="search-option">
            <label htmlFor="roomie">Guests</label>
            <input
              type="text"
              id="roomie"
              value={guestQuery}
              onChange={(e) => setGuestQuery(e.target.value)}
              placeholder="Find your roomie?"
            />
          </div>
        </div>
        <button className="search-button-main" onClick={handleSearch}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        </button>
      </div>
      {/* The original .sort-controls div is now removed from here as its content is integrated above */}
    </div>
    </div>
  );
};

export default SearchBar;