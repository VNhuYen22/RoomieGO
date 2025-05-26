import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import chatbox from "../assets/chatbox.png";
import user from "../assets/user.png";
import logout from "../assets/logout.png";
import dashboard from "../assets/dashboard.png";
import user2 from "../assets/user2.png";
import friends from "../assets/high-five.png";
import living from "../assets/living.png";
import home_icon from "../assets/house.png";
import bell from "../assets/bell.png";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false); // dropdown thông báo
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState("");
  const location = useLocation();
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const [role, setRole] = useState("");

  // Fake danh sách thông báo
  const notifications = [
    "Yêu cầu thuê phòng của bạn đã được chấp nhận!",
    "Có 1 người vừa nhắn tin cho bạn.",
    "Tin mới từ chủ phòng A123.",
  ];

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
      const { fullName, role } = user;
      setFullName(fullName);
      setRole(role);
      setIsLoggedIn(true);

    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setFullName("");
    window.location.href = "http://localhost:5173/";
  };

  useEffect(() => {
    fetchUserProfile();

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }

      if (
        notificationRef.current && !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (location.pathname === "/Login" || location.pathname === "/Register") {
    return null;
  }

  return (
    <div className="navbar-container">
      <div className="leftside">
        <Link to="/"><h1 className="logo-text">ROOMIEGO</h1></Link>
      </div>
      <div className="rightside">
        <Link to="/Room"><img src={living} alt="" className="img-living" /><a href="">Room</a></Link>
        <Link to="/Roommates"><img src={friends} alt="" className="img-living" /><a href="">Roommates</a></Link>

        {isLoggedIn ? (
          <>
            {/* Bell notification */}
            <div className="notification-wrapper" ref={notificationRef}>
              <div className="notification-bell" onClick={() => setNotificationOpen(!notificationOpen)}>
                <img src={bell} alt="Notifications" />
              </div>
              {notificationOpen && (
                <div className="notification-bell_dropdown">
                  <div className="title-notification">
                    <h3>Thông báo</h3>
                   
                  </div>
                  {notifications.map((note, index) => (
                        <div key={index} className="notification-card">
        <div className="notification-avatar">
          <img src={note.avatar} alt="avatar" />
        </div>
        <div className="notification-content">
          <p className="notification-title"><a href="">Tiêu đề thông báo</a></p>
          <p className="notification-message"><a href="">Nội dung thông báo</a></p>
          <span className="notification-icon"><a href="">icon </a></span>
          <div className="notification-footer">
            <span className="notification-time"><a href="">22h30phut ago </a></span>
          </div>
        </div>
        <div className="notification-status-dot"></div>
      </div>
                  ))}
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="user-menu">
              <div
                className="user-avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img src={user2} alt="User Avatar" />
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu" ref={dropdownRef}>
                  <a href="#">{fullName}</a>
                  <button onClick={() => window.location.href = "/profile"}>
                    <img src={user2} alt="" /> Profile
                  </button>
                  {role === "OWNER" && (
                    <button onClick={() => window.location.href = "/dashboard"}>
                      <img src={dashboard} alt="" className="dashboard-user" /> Dashboard
                    </button>
                  )}
                  <button onClick={handleLogout}>
                    <img src={logout} alt="" /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/Register">Sign Up</Link>
            <Link to="/Login"><button className="get-started-btn">Login</button></Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
