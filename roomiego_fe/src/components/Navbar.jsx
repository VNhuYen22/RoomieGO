import React,{useEffect, useState} from "react";
import Logo from "../assets/beach.jpg";
import { Link } from "react-router-dom";
import chatbox from "../assets/chatbox.png"
import "../styles/Navbar.css";
import user from "../assets/user.png";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState(""); // State để lưu tên người dùng

  // Hàm lấy thông tin người dùng
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8080/owner/get-all-users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      
      const { fullName } = data; // Lấy fullName từ phản hồi
      console.log("Full Name:", fullName); // In ra fullName để kiểm tra
      // Lấy fullName từ phản hồi và cập nhật state
      setIsLoggedIn(true);
      
      
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setFullName("");
    window.location.reload(); // Reload trang để cập nhật giao diện
  };

  useEffect(() => {
    fetchUserProfile(); // Gọi API khi component được mount
  }, []);

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