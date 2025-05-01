import React from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import { Routes, Route } from "react-router-dom";
import BookingsPage from "../components/Dashboard/BookingsPage";
import Request from "../components/Dashboard/Request";
import "../styles/Dashboard.css";
import Header from "../components/Dashboard/Header";
function Dashboard() {
  return (
    <div className="Dashboard-container">
      {/* Sidebar luôn hiển thị */}
      <Sidebar />
     
      <div className="Dashboard-content">
        {/* Nội dung thay đổi dựa trên route */}
        <Routes>
          <Route path="/requests" element={<Request />} />
          <Route path="/dashboard/bookings" element={<BookingsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;