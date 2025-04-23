import React, { useState, useRef, useEffect } from "react";
import "./css/Header.css";

const Header = () => {
  // State cho dropdown profile
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef();

  // State cho dropdown notification
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const notificationRef = useRef();

  // Hàm toggle notification dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Đóng dropdown profile và notification khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Đóng profile dropdown nếu click ngoài
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      // Đóng notification dropdown nếu click ngoài
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="header1">
      <div>
        <div className="greeting">Hello, User</div>
        <div className="sub-greeting">Have a nice day</div>
        <div className="user-name">John Wick</div>
      </div>
      <div className="header-right">
        <div
          className="user-profile"
          onClick={() => setIsProfileOpen((open) => !open)}
          ref={profileRef}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <div className="avatar" />
          <div>
            <div>John Wick</div>
            <div className="user-role">User</div>
          </div>
          {/* Dropdown menu */}
          {isProfileOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-item">Edit Profile</div>
              <div className="dropdown-item">Log out</div>
            </div>
          )}
        </div>

        <div
          className="notification"
          onClick={toggleDropdown}
          ref={notificationRef}
          style={{ position: "relative", cursor: "pointer", marginLeft: "20px" }}
        >
          <div className="bell-icon">🔔</div>
          {isDropdownOpen && (
            <div className="notification-dropdown">
              <div className="notification-item">New message from Admin</div>
              <div className="notification-item">Booking confirmed</div>
              <div className="notification-item">System update available</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
