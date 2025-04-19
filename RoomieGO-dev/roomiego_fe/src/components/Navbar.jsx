import React,{useState} from "react";
import Logo from "../assets/beach.jpg";
import { Link } from "react-router-dom";
import chatbox from "../assets/chatbox.png"
import "../styles/Navbar.css";
import user from "../assets/user.png";
function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  return (
    <div className="navbar">
       <div className="center">
        <img src="" alt="" />
      </div>
      <div className="leftside">
        <Link to="/home"> Home </Link>
        <Link to="/about"> About </Link>
        <Link to="/room"> Rooms </Link>
      
      </div>
      
      <div className="rightSide">
     <Link to="/chatbox"><img src={chatbox} alt="" className="user-icon" /></Link> 
        <button className="dropdown-toggle" onClick={toggleDropdown}>
          <span className="menu-icon">☰</span>
          
       <img src={user} alt="" className="user-icon" />
       
        </button>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/Login">Login</Link>
            <Link to="/Register">Signup</Link>
          </div>
        )}
        
      </div>
      
      {/* <div className="rightside">
        <Link to="/room"> Rooms </Link>
        <Link to="/services"> Services </Link>
        <Link to="/pricing"> Pricing </Link>
      </div> */}
    </div>
  );
}

export default Navbar;
