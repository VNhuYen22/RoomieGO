import React, { useState } from "react";
import "../styles/SearchBar.css";
import Coin from "../assets/coin.png";
import User from "../assets/user.png";
import Location from "../assets/location.png";
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    alert(`Tìm kiếm: ${searchQuery}`);
  };
  return (
    <div>
      <div className="search-bar">
        <div className="search-top">
            <h3>Find Room</h3>
            <ul>
                <li><img src={Coin} alt="" className="coin-icon"/>Price</li>
                <li><img src={User} alt="" className="user-icon" />Person</li>
                <li><img src={Location} alt="" className="location-icon" />Select Location</li>
                <button onClick={handleSearch}>Search</button>
            </ul>
        </div>
        <div className="search-bottom">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
          
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
