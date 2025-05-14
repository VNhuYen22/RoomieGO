import React, { useState } from "react";
import "../styles/SearchBar.css";
import home from "../assets/home.jpg"; // Background image
import room5 from "../assets/room5.avif"; // Default room image

const SearchBar = ({ onSortChange }) => {
  const [locationQuery, setLocationQuery] = useState("");
  const [guestQuery, setGuestQuery] = useState(""); // For "Find your roomie?" (nếu cần)

  const handleSearch = () => {
    alert(
      `Searching for: City - ${locationQuery}, Guests - ${guestQuery}`
      // Có thể tích hợp thêm tham số sắp xếp (sorting) nếu cần
    );
  };

  return (
    <div className="search-container_total">
      <div className="search-container-background">
        <img
          src={room5}
          alt="Background"
          className="background-image-full"
        />
        <div className="search-content-overlay">
          <h1></h1>
          <p></p>
        </div>
        <div className="search-widget">
          <div className="search-options">
            <div className="search-option">
              <label htmlFor="city">Chọn thành phố</label>
              <select
                id="city"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              >
                <option value="">Chọn thành phố</option>
                <option value="Hanoi">Hà Nội</option>
                <option value="HoChiMinh">Hồ Chí Minh</option>
                <option value="Danang">Đà Nẵng</option>
                <option value="CanTho">Cần Thơ</option>
              </select>
            </div>

            <div className="search-option sort-buttons-container">
              <label>Sort by Price</label>
              <div className="sort-buttons-inline">
                <button
                  className="sort-button"
                  onClick={() => onSortChange("asc")}
                >
                  Min
                </button>
                <button
                  className="sort-button"
                  onClick={() => onSortChange("desc")}
                >
                  Max
                </button>
              </div>
            </div>

            {/*
            Nếu cần, có thể thêm input hoặc các lựa chọn khác cho "Guests"
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
            */}
          </div>
          <button className="search-button-main" onClick={handleSearch}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="white"
            >
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
