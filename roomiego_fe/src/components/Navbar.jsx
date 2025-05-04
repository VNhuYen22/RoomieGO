import React, { useEffect, useState } from "react";
import axios from "axios"; // Import Axios
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import chatbox from "../assets/chatbox.png";
import user from "../assets/user.png";
import { useLocation } from "react-router-dom";
import logout from "../assets/logout.png";
import dashboard from "../assets/dashboard.png";
import user2 from "../assets/user2.png";
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
      const { user } = response.data;
      const { fullName } = user;
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
      <div className="leftside">
        <h1 className="logo-text">ROOMIEGO</h1>
      </div>
      <div className="rightside">
        <Link to="/home">Our Story</Link>
        <Link to="/membership">Membership</Link>
        <Link to="/write">Write</Link>
        {isLoggedIn ? (
             <div className="user-menu">
             <div
               className="user-avatar"
               onClick={() => setDropdownOpen(!dropdownOpen)}
             >
               <img src={user} alt="User Avatar" />
               
             </div>
             {dropdownOpen && (
               <div className="dropdown-menu">
                
                <span>Welcome! {fullName}</span>
                 <button onClick={() => window.location.href = "/profile"}>
                 <img src={user2} alt="" /> Profile
                 </button>
                  <button onClick={() => window.location.href = "/dashboard"}>
                   <img src={dashboard} alt="" className="dashboard-user"/> Dashboard
                  </button>
                 <button onClick={handleLogout}>
                  <img src={logout} alt="" />Logout</button>
               </div>
             )}
           </div>
        ) : (
          <>
            <Link to="/Register">Sign In</Link>
           <Link to="Login"><button className="get-started-btn">Login</button></Link> 
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;