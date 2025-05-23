// Sidebar.jsx
import back from "../../assets/back.png";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/Sidebar.css";
import { Link } from "react-router-dom";

const menuItems = [
  { label: "Bookings", key: "bookings" },
  { label: "Requests", key: "requests" },
  { label: "Report", key: "report" },
  { label: "Invoices", key: "invoices" },
  { label: "Setting", key: "invoices" },

];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const current = location.pathname.split("/").pop(); // Lấy phần sau cùng của path

  return (
    <div className="sidebar1">
      <div className="back-sidebar"><a href="http://localhost:5173/room"><img className="back-sidebar" src={back} alt="" /></a></div>
      <div className="logo-sideBar"><br /><h1 className="logo-text1">ROOMIEGO</h1></div>
      <ul>
        {menuItems.map(item => (
          <li
            key={item.key}
            className={current === item.key ? "active" : ""}
            onClick={() => navigate(`/dashboard/${item.key}`)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
