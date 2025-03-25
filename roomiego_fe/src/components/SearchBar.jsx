import React, { useState } from "react";
import "../styles/SearchBar.css";
import User from "../assets/user.png";
import Find from "../assets/find.png";
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    alert(`Tìm kiếm: ${searchQuery}`);
  };

  return (
    <div className="search-bar">
        <img src={Find} alt="Find Icon" className="find-icon" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Find your roomie ?"
      />
      <div className="search-top">
        <ul>
          <li>
            <img src='' alt="" className="location-icon" />
            Check In
          </li>
          <li>
            <img src='' alt="" className="location-icon" />
            Check Out
          </li>
          <li>
            <img src="" alt="" className="user-icon" />
            Guests
          </li>
        </ul>
        <button onClick={handleSearch}>Let's go!</button>
      </div>
    </div>
  );
};

export default SearchBar;
