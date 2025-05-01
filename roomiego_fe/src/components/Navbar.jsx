import React, { useEffect, useState } from "react";
import axios from "axios"; // Import Axios
import Logo from "../assets/beach.jpg";
import { Link } from "react-router-dom";
import chatbox from "../assets/chatbox.png";
import "../styles/Navbar.css";
import user from "../assets/user.png";
import { useLocation } from "react-router-dom";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState(""); // State để lưu tên người dùng
  const location = useLocation();

  // Hàm lấy thông tin người dùng
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8080/renterowner/get-profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
        },
      });

      // Lấy fullName từ phản hồi và cập nhật state
      const { user} = response.data;
      const { fullName } = user;
      console.log("Full Name:", fullName); // Kiểm tra fullName trong console
      setFullName(fullName); // Cập nhật tên người dùng
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setFullName("");
    window.location.reload(); // Reload trang để cập nhật giao diện
  };

  // Gọi API lấy thông tin người dùng khi component được mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Ẩn Navbar trên các trang Login và Register
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
        <Link to="/about">About</Link>
        <Link to="/room">Rooms</Link>
      </div>
      <div className="rightSide">
        <Link to="/chatbox">
          <img src={chatbox} alt="" className="user-icon" />
        </Link>
        {isLoggedIn ? (
          <div className="user-info">
            <span className="username">Welcome, {fullName}!</span> {/* Hiển thị tên người dùng */}
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