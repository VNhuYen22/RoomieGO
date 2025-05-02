import React, { useState } from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import BookingsPage from "../components/Dashboard/BookingsPage";
import "../styles/Dashboard.css";
import ReportPage from "../components/Dashboard/ReportPage";
import Storage from "../components/Invoices/Storage";

function Dashboard() {
  const [activePage, setActivePage] = useState("bookings");

  const renderPage = () => {
    switch (activePage) {
      case "bookings":
        return <BookingsPage />;
      // case "requests":
      //   return <RequestsPage />;
      case "report":
        return <ReportPage />;
       case "invoices":
         return <Storage />;
      // case "setting":
      //   return <SettingPage />;
      default:
        return <BookingsPage />;
    }
  };

  return (
    <div className="Dashboard-container">
      <Sidebar active={activePage} onChange={setActivePage} />
      {renderPage()}
    </div>
  );
}

export default Dashboard;
