import React from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import BookingsPage from "../components/Dashboard/BookingsPage";
import "../styles/Dashboard.css";
function Dashboard() {
  return (
    <div className="Dashboard-container">
      <Sidebar />
      <BookingsPage />
    </div>
  );
}

export default Dashboard;
