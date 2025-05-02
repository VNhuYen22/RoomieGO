import React from "react";
import "./css/Sidebar.css";

const menuItems = [
  { label: "Bookings", key: "bookings" },
  { label: "Requests", key: "requests" },
  { label: "Report", key: "report" },
  { label: "Invoices", key: "invoices" },
  { label: "Setting", key: "setting" },
];

const Sidebar = ({ active, onChange }) => (
  <div className="sidebar1">
    <div className="logo"><br />Logo</div>
    <ul>
      {menuItems.map(item => (
        <li
          key={item.key}
          className={active === item.key ? "active" : ""}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </li>
      ))}
    </ul>
  </div>
);

export default Sidebar;
