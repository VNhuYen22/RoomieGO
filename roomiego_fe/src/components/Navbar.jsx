import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import chatbox from "../assets/chatbox.png";
import user from "../assets/user.png";
import { Bell } from "lucide-react";
import logout from "../assets/logout.png";
import dashboard from "../assets/dashboard.png";
import user2 from "../assets/user2.png";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [notiOpen, setNotiOpen] = useState(false);
  const location = useLocation();

  // Optimized fetchUserProfile function
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("Token không tồn tại. Người dùng chưa đăng nhập.");
      setIsLoggedIn(false); 
      return;
    }
  
    try {
      const response = await axios.get("http://localhost:8080/renterowner/get-profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data?.statusCode === 200 && response.data?.user) {
        const { fullName, role, id } = response.data.user;
  
        setFullName(fullName || "Unknown User");
        setRole(role || "Unknown Role");
        setIsLoggedIn(true);
  
        localStorage.setItem("fullName", fullName || "Unknown User");
        localStorage.setItem("userRole", role);
        localStorage.setItem("userId", id.toString());
  
        console.log("User profile loaded successfully:", fullName);
      } else {
        console.error("Unexpected API response format:", response.data);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error.response?.data || error.message);
      setIsLoggedIn(false);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("authToken");
      }
    }
  };

  // Fetch notifications from API
  const fetchNotifications = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8080/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setNotifications(response.data);
      } else {
        console.warn("Unexpected notification format:", response.data);
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error.response?.data || error.message);
      setNotifications([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("fullName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setFullName("");
    setRole("");
    window.location.href = "/";
  };

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken");
    const storedName = localStorage.getItem("fullName");
    const storedRole = localStorage.getItem("userRole");
    
    if (token && storedName && storedRole) {
      // Use stored values if available
      setIsLoggedIn(true);
      setFullName(storedName);
      setRole(storedRole);
      
      // Still fetch profile in background to ensure data is fresh
      fetchUserProfile();
    } else if (token) {
      // If we have token but not other data, fetch profile
      fetchUserProfile();
    }
    
    // Fetch notifications if logged in
    if (token) {
      fetchNotifications();
    }
  }, []);

  // Don't render navbar on login/register pages
  if (location.pathname === "/Login" || location.pathname === "/Register") {
    return null;
  }

  return (
    <div className="navbar">
      <div className="leftside">
        <h1 className="logo-text">ROOMIEGO</h1>
        <Link to="/home">Home</Link>
        <Link to="/roommates">Roommates</Link>
        {/* Only show Dashboard for ADMIN or OWNER roles */}
        {(role === "ADMIN" || role === "OWNER") && (
          <Link to="/dashboard">Dashboard</Link>
        )}
        <Link to="/about">About</Link>
        <Link to="/room">Rooms</Link>
      </div>
      <div className="rightside">
        {/* Notification bell */}
        {isLoggedIn && (
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
                  borderRadius: "4px",
                }}
              >
                <h4 style={{ marginBottom: "10px" }}>Thông báo</h4>
                {notifications.length === 0 ? (
                  <p>Không có thông báo mới</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {notifications.map((item, idx) => (
                      <li key={idx} style={{ borderBottom: "1px solid #eee", marginBottom: "8px", paddingBottom: "8px" }}>
                        <strong>{item.title}</strong>
                        <p style={{ fontSize: "12px", color: "#666", margin: "3px 0 0" }}>{item.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation links */}
        <Link to="/home">Our Story</Link>
        <Link to="/membership">Membership</Link>
        <Link to="/write">Write</Link>

        {/* User menu or login buttons */}
        {isLoggedIn ? (
          <div className="user-menu">
            <div className="user-avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <img src={user} alt="User Avatar" />
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <span>Welcome! {fullName}</span>
                <button onClick={() => window.location.href = "/profile"}>
                  <img src={user2} alt="Profile" /> Profile
                </button>
                {(role === "ADMIN" || role === "OWNER") && (
                  <button onClick={() => window.location.href = "/dashboard"}>
                    <img src={dashboard} alt="Dashboard" className="dashboard-user" /> Dashboard
                  </button>
                )}
                <button onClick={handleLogout}>
                  <img src={logout} alt="Logout" /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/Register">Sign Up</Link>
            <Link to="/Login">
              <button className="get-started-btn">Login</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;