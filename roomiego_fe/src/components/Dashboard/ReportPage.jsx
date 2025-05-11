import React, { useState, useEffect } from "react";
import ReportTable from "./ReportTable";
import "./css/ReportPage.css";
import { axiosInstance } from "../../lib/axios";


function ModalContent({ report, onClose, onViPham, onKhongViPham }) {
  if (!report) return null;

  const styles = {
    backdrop: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    },
    modal: {
      backgroundColor: "#fff",
      padding: "32px",
      borderRadius: "8px",
      minWidth: "360px",
      maxWidth: "600px",
      width: "90%",
      boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3)",
      border: "1px solid #ddd",
      zIndex: 10000,
      position: "relative",
    },
    contentBox: {
      backgroundColor: "#f9f9f9",
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      whiteSpace: "pre-line",
      marginTop: "8px",
    },
    button: {
      padding: "8px 16px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      backgroundColor: "#1976d2",
      color: "#fff",
      marginLeft: "10px",
    },
    dangerButton: {
      padding: "8px 16px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      backgroundColor: "#e53935",
      color: "#fff",
      marginRight: "10px",
    },
    buttonGroup: {
      marginTop: "20px",
    },
    sectionTitle: {
      marginTop: "12px",
    },
    header: {
      marginBottom: "16px",
    },
  };

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3>Chi tiết báo cáo</h3>
        </div>
        <p><b>Tiêu đề bài viết:</b> {report.roomTitle}</p>
        <p><b>Người đăng bài:</b> {report.roomOwnerName}</p>
        <p><b>Địa chỉ phòng:</b> {report.roomAddress}</p>
        <p><b>Người báo cáo:</b> {report.reporterName}</p>
        <p><b>Lý do:</b> {report.reason}</p>
        <p><b>Thời gian:</b> {new Date(report.createdAt).toLocaleString()}</p>
        <p>
          {report.isHandled ? (
            <><b>Trạng thái:</b> Đã xử lý</>
          ) : (
            <><b>Trạng thái:</b> Chưa xử lý</>
          )}
        </p>

        <p style={styles.sectionTitle}><b>Nội dung bài viết:</b></p>
        <div style={styles.contentBox}>
          {report.roomContent || "Không có nội dung."}
        </div>

        <div style={styles.buttonGroup}>
          <button style={styles.dangerButton} onClick={() => onViPham(report.id)}>Vi phạm</button>
          <button style={styles.button} onClick={() => onKhongViPham(report.id)}>Không vi phạm</button>
          <button style={styles.button} onClick={onClose}>Đóng</button>
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số lượng báo cáo trên mỗi trang

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
          headers: { Authorization: `Bearer ${token}` },
        });

        const reportList = response.data.data?.data || [];
        if (!Array.isArray(reportList)) throw new Error("Dữ liệu trả về không hợp lệ.");

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

  useEffect(() => {
    setShowModal(!!selectedReport);
  }, [selectedReport]);

  const handleView = (report) => {
    console.log("Đang xem báo cáo: ", report);  // Debug log
    setSelectedReport(report);  // Cập nhật selectedReport khi click vào Xem
  };
  const handleClose = () => { setShowModal(false); setSelectedReport(null); };

  const updateStatus = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Đã xử lý" } : r))
    );
  };

  const handleViPham = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axiosInstance.post(`http://localhost:8080/api/reports/${id}/handle`, {
        isViolation: true,
        adminNote: "Đăng tin giả, đã xóa bài.",
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        updateStatus(id);
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
        adminNote: "Không vi phạm.",
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        updateStatus(id);
        alert("Đã phản hồi cho người báo cáo.");
        handleClose();
      }
    } catch (error) {
      console.error("Lỗi xử lý không vi phạm:", error);
      alert("Xử lý thất bại");
    }
  };

  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const currentReports = reports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="report-page-container">
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
          <>
            <ReportTable reports={currentReports} onView={handleView} />
            <div className="pagination">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>Trang đầu</button>
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Trước</button>
              {[...Array(totalPages).keys()].map((i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Tiếp</button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Trang cuối</button>
            </div>
          </>
        )}
      </div>

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