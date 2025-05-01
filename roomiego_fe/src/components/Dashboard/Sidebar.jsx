import React from "react";
import "./css/Sidebar.css";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation(); // Lấy đường dẫn hiện tại

  return (
    <div className="sidebar1">
      <div className="logo"><br />Logo</div>
      <ul>
        <li className={location.pathname === "/dashboard/bookings" ? "active" : ""}>
          <Link to="/dashboard/bookings">Bookings</Link>
        </li>
        <li className={location.pathname === "/dashboard/requests" ? "active" : ""}>
          <Link to="/dashboard/requests">Requests</Link>
        </li>
        <li className={location.pathname === "/dashboard/messages" ? "active" : ""}>
          <Link to="/dashboard/messages">Message</Link>
        </li>
        <li className={location.pathname === "/dashboard/help" ? "active" : ""}>
          <Link to="/dashboard/help">Help</Link>
        </li>
        <li className={location.pathname === "/dashboard/settings" ? "active" : ""}>
          <Link to="/dashboard/settings">Setting</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;