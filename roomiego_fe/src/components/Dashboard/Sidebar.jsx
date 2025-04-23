import React from "react";
import "./css/Sidebar.css";

const Sidebar = () => (
  <div className="sidebar1">
    <div className="logo"><br />Logo</div>
    <ul>
      <li className="active">Bookings</li>
      <li>Requests</li>
      <li>Message</li>
      <li>Help</li>
      <li>Setting</li>
    </ul>
  </div>
);

export default Sidebar;
