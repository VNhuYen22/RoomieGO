import React from "react";
import "./css/ReportDetailModal.css";

const ReportDetailModal = ({ report, onClose, onViPham, onKhongViPham }) => {
  console.log("Selected report:", report); // Thêm log ở đây để kiểm tra
  if (!report) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal2">
        <h3>Chi tiết báo cáo</h3>
        <p><b>Bài viết:</b> {report.postTitle}</p>
        <p><b>Người báo cáo:</b> {report.reporter}</p>
        <p><b>Lý do:</b> {report.reason}</p>
        <p><b>Thời gian:</b> {report.time}</p>
        <div style={{ marginTop: 20 }}>
          <button className="danger" onClick={() => onViPham(report.id)}>Vi phạm</button>
          <button style={{ marginLeft: 10 }} onClick={() => onKhongViPham(report.id)}>Không vi phạm</button>
          <button style={{ marginLeft: 10 }} onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};


export default ReportDetailModal;
