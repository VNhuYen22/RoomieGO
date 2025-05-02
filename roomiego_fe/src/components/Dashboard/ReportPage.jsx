import React, { useState } from "react";
import ReportTable from "./ReportTable";
import ReportDetailModal from "./ReportDetailModal";
import "./css/ReportPage.css";
import Header from "./Header";

const mockReports = [
  {
    id: 1,
    reporter: "Nguyễn Văn A",
    postTitle: "Bài viết 1",
    reason: "Nội dung không phù hợp",
    time: "29/04/2025 10:00",
    status: "Chờ xử lý"
  },
  {
    id: 2,
    reporter: "Trần Thị B",
    postTitle: "Bài viết 2",
    reason: "Spam",
    time: "29/04/2025 09:30",
    status: "Chờ xử lý"
  }
];

const ReportPage = () => {
  const [reports, setReports] = useState(mockReports);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleView = (report) => {
    console.log("Clicked report:", report);
    setSelectedReport(report);
  };    

  const handleClose = () => setSelectedReport(null);

  const handleViPham = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Đã xử lý" } : r))
    );
    alert("Đã xóa bài và gửi thông báo cho chủ bài viết.");
    handleClose();
  };

  const handleKhongViPham = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Đã xử lý" } : r))
    );
    alert("Đã phản hồi cho người báo cáo.");
    handleClose();
  };

  return (
    <div className="report-page-container">
      <div className="main1">
        <Header />
        <div className="content1">
          <div className="content-header1">
            <h2 style={{ color: "#1976d2" }}>Danh sách báo cáo bài viết</h2>
            <input className="search1" placeholder="Tìm kiếm báo cáo" />
          </div>
          <ReportTable reports={reports} onView={handleView} />
        </div>
      </div>
      <ReportDetailModal
        report={selectedReport}
        onClose={handleClose}
        onViPham={handleViPham}
        onKhongViPham={handleKhongViPham}
      />
    </div>
  );
};

export default ReportPage;
