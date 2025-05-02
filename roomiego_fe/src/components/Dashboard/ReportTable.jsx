import React from "react";
import "./css/ReportTable.css";

const ReportTable = ({ reports, onView }) => (
  <table className="report-table">
    <thead>
      <tr>
        <th>Người báo cáo</th>
        <th>Bài viết</th>
        <th>Lý do</th>
        <th>Thời gian</th>
        <th>Trạng thái</th>
        <th>Hành động</th>
      </tr>
    </thead>
    <tbody>
      {reports.length === 0 ? (
        <tr>
          <td colSpan={6} style={{ textAlign: "center" }}>
            Chưa có báo cáo nào.
          </td>
        </tr>
      ) : (
        reports.map((r) => (
          <tr key={r.id}>
            <td>{r.reporter}</td>
            <td>{r.postTitle}</td>
            <td>{r.reason}</td>
            <td>{r.time}</td>
            <td>
              <span className={r.status === "Chờ xử lý" ? "pending" : "resolved"}>
                {r.status}
              </span>
            </td>
            <td>
              <button className="view-btn" onClick={() => onView(r)}>
                Xem chi tiết
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);

export default ReportTable;
