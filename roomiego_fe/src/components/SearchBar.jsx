import React, { useState } from "react";
import "../styles/SearchBar.css";

const SearchBar = ({ onSortChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className="search-container_total">
      <div className="floating-button-container">
        {/* Nút duy nhất để toggle */}
        <button className="circle-button" onClick={toggleDropdown}>
          <span className={showDropdown ? "close-x" : "arrow-up"}></span>
        </button>

        {/* Dropdown Min / Max */}
        {showDropdown && (
          <div className="circle-dropdown-menu-inside">
            <button className="circle-min"
              onClick={() => {
                onSortChange("asc");
                setShowDropdown(false);
              }}
            >
              Min
            </button>
            <button className="circle-max"
              onClick={() => {
                onSortChange("desc");
                setShowDropdown(false);
              }}
            >
              Max
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
