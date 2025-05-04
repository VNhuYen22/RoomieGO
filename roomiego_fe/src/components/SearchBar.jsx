import React, { useState } from "react";
import "../styles/SearchBar.css";
import User from "../assets/user.png";
import Find from "../assets/find.png";
import { useLocation } from "react-router-dom";
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const handleSearch = () => {
    alert(`Tìm kiếm: ${searchQuery}`);
  };
  if (location.pathname === "/Login" || location.pathname === "/Register" || location.pathname === "/dashboard/*") {
    return null;
  }
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
