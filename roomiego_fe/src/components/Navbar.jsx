import React, { useEffect, useState } from "react";
import axios from "axios"; // Import Axios
import Logo from "../assets/beach.jpg";
import { Link } from "react-router-dom";
import chatbox from "../assets/chatbox.png";
import "../styles/Navbar.css";
import user from "../assets/user.png";
import { useLocation } from "react-router-dom";

import { Bell } from "lucide-react"; // nếu chưa cài thì: npm install lucide-react

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [notiOpen, setNotiOpen] = useState(false);
  const location = useLocation();

  // Lấy thông tin người dùng
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8080/renterowner/get-profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const { user } = response.data;
      setFullName(user.fullName);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Lấy report/request từ hệ thống
  const fetchNotifications = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8080/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(response.data); // Định dạng: [{ title, description }]
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setFullName("");
    window.location.reload();
  };

  useEffect(() => {
    fetchUserProfile();
    fetchNotifications();
  }, []);

  if (location.pathname === "/Login" || location.pathname === "/Register") {
    return null;
  }

  return (
    <div className="navbar">
      <div className="center">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="leftside">
        <Link to="/home">Home</Link>
        <Link to="/roommates">Roommates</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/about">About</Link>
        <Link to="/room">Rooms</Link>
      </div>

      <div className="rightSide">
        {/* 🔔 Chuông thông báo */}
        <div className="notification-bell" style={{ position: "relative", marginRight: "15px" }}>
          <div onClick={() => setNotiOpen(!notiOpen)} style={{ cursor: "pointer" }}>
            <Bell size={24} />
            {notifications.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "red",
                  color: "white",
                  fontSize: "10px",
                  borderRadius: "50%",
                  padding: "2px 6px",
                }}
              >
                {notifications.length}
              </span>
            )}
          </div>
          {notiOpen && (
            <div
              style={{
                position: "absolute",
                top: "30px",
                right: "0",
                width: "250px",
                background: "white",
                border: "1px solid #ccc",
                padding: "10px",
                zIndex: 100,
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              }}
            >
              <h4 style={{ marginBottom: "10px" }}>Thông báo</h4>
              {notifications.length === 0 ? (
                <p>Không có thông báo mới</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {notifications.map((item, idx) => (
                    <li key={idx} style={{ borderBottom: "1px solid #eee", marginBottom: "8px" }}>
                      <strong>{item.title}</strong>
                      <p style={{ fontSize: "12px", color: "#666" }}>{item.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Chatbox */}
        <Link to="/chatbox">
          <img src={chatbox} alt="" className="user-icon" />
        </Link>

        {/* Người dùng */}
        {isLoggedIn ? (
          <div className="user-info">
            <span className="username">Welcome, {fullName}!</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <button className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <span className="menu-icon">☰</span>
              <img src={user} alt="" className="user-icon" />
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/Login">Login</Link>
                <Link to="/Register">Signup</Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;