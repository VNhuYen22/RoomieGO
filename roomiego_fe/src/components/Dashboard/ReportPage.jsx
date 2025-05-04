import React, { useState, useEffect } from "react";
import ReportTable from "./ReportTable";
import Header from "./Header";
import "./css/ReportPage.css";
import { axiosInstance } from "../../lib/axios";

// Component modal riêng biệt với styles inline
function ModalContent({ report, onClose, onViPham, onKhongViPham }) {
  if (!report) return null;
  
  // Styles inline cho modal
  const modalBackdropStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
  };
  
  const modalStyle = {
    backgroundColor: "#fff",
    padding: "32px",
    borderRadius: "8px",
    minWidth: "360px",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
    border: "1px solid #ddd",
    zIndex: 10000,
    position: "relative"
  };
  
  const buttonStyle = {
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#1976d2",
    color: "#fff",
    marginLeft: "10px"
  };
  
  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#e53935",
    marginLeft: 0
  };
  
  return (
    <div style={modalBackdropStyle} onClick={onClose}>
      <div 
        style={modalStyle} 
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Chi tiết báo cáo</h3>
        <p><b>Bài viết:</b> {report.postTitle}</p>
        <p><b>Người báo cáo:</b> {report.reporter}</p>
        <p><b>Lý do:</b> {report.reason}</p>
        <p><b>Thời gian:</b> {report.time}</p>
        <p><b>Trạng thái:</b> {report.status}</p>
        <div style={{ marginTop: 20 }}>
          <button style={dangerButtonStyle} onClick={() => onViPham(report.id)}>
            Vi phạm
          </button>
          <button style={buttonStyle} onClick={() => onKhongViPham(report.id)}>
            Không vi phạm
          </button>
          <button style={buttonStyle} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          alert("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
          window.location.href = "/login";
          return;
        }
  
        const response = await axiosInstance.get("http://localhost:8080/api/reports/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const reportList = response.data.data?.data; // <-- đúng mảng dữ liệu
        if (!Array.isArray(reportList)) {
          throw new Error("Dữ liệu trả về không hợp lệ.");
        }
  
        setReports(reportList);
        setLoading(false);
      } catch (error) {
        if (error.response?.status === 403) {
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        } else {
          setError(error.response?.data?.message || "Lỗi tải báo cáo.");
        }
        setLoading(false);
      }
    };
  
    fetchReports();
  }, []);

  // Show or hide the modal when a report is selected
  useEffect(() => {
    if (selectedReport) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [selectedReport]);

  const handleView = (report) => {
    setSelectedReport(report);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const handleViPham = async (id) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axiosInstance.post(`http://localhost:8080/api/reports/${id}/handle`, {
        isViolation: true,
        adminNote: "Đăng tin giả, đã xóa bài."
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200) {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "Đã xử lý" } : r))
        );
        alert("Đã xóa bài và gửi thông báo cho chủ bài viết.");
        handleClose();
      }
    } catch (error) {
      console.error("Lỗi xử lý vi phạm:", error);
      alert("Xử lý thất bại");
    }
  };

  const handleKhongViPham = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axiosInstance.post(`http://localhost:8080/api/reports/${id}/handle`, {
        isViolation: false,
        adminNote: "Không vi phạm."
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200) {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "Đã xử lý" } : r))
        );
        alert("Đã phản hồi cho người báo cáo.");
        handleClose();
      }
    } catch (error) {
      console.error("Lỗi xử lý không vi phạm:", error);
      alert("Xử lý thất bại");
    }
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
          {loading ? (
            <p>Đang tải báo cáo...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <ReportTable reports={reports} onView={handleView} />
          )}
        </div>
      </div>
      
      {/* Render modal bên ngoài flow của component chính và sử dụng key để force re-render */}
      {showModal && selectedReport && (
        <ModalContent
          key={`modal-${selectedReport.id}`}
          report={selectedReport}
          onClose={handleClose}
          onViPham={handleViPham}
          onKhongViPham={handleKhongViPham}
        />
      )}
    </div>
  );
};

export default ReportPage;
