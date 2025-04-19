import React, { useState, useEffect } from "react";
import moment from "moment"; // Import moment.js
import "./Storage.css"; // Import CSS styles for the component

/**
 * Component hiển thị chi tiết hóa đơn.
 * 
 * @param {string} invoiceId - ID của hóa đơn cần hiển thị.
 * @param {function} onClose - Hàm đóng modal.
 * @param {array} invoices - Danh sách hóa đơn.
 */
const InvoiceDetails = ({ invoiceId, onClose, invoices }) => {
  const [invoice, setInvoice] = useState(null); // Trạng thái hóa đơn hiện tại
  const [loading, setLoading] = useState(true); // Trạng thái đang tải

  useEffect(() => {
    console.log("Fetching details for Invoice ID:", invoiceId);

    /**
     * Hàm lấy chi tiết hóa đơn dựa trên ID.
     * 
     * @param {string} id - ID của hóa đơn.
     */
    const fetchInvoiceDetails = async (id) => {
      setLoading(true);

      // Tìm hóa đơn trong danh sách invoices dựa trên invoiceId
      // **Ghi chú:** Ở đây bạn nên gọi API để lấy dữ liệu hóa đơn nếu không có sẵn trong danh sách invoices.
      // Ví dụ:
      // const response = await fetch(`https://example.com/api/invoices/${id}`);
      // const foundInvoice = await response.json();
      const foundInvoice = invoices.find((invoice) => invoice.id === id);

      if (foundInvoice) {
        setInvoice(foundInvoice);
      } else {
        // Nếu không tìm thấy hóa đơn, hiển thị thông báo lỗi
        console.log("Invoice not found");
        setInvoice(null);
      }

      setLoading(false);
    };

    fetchInvoiceDetails(invoiceId);
  }, [invoiceId, invoices]);

  if (loading) {
    return <p>Loading invoice details...</p>;
  }

  if (!invoice) {
    return <p>Could not load invoice details.</p>;
  }

  return (
    <div className="modal1">
      <div className="modal-content1">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Chi Tiết Hóa Đơn</h2>

        <div className="invoice-header">
          <p>Địa chỉ: {invoice.address || "Chưa nhập địa chỉ"}</p>
          <p>Ngày lập: {moment(invoice.date).format("DD/MM/YYYY") || "Chưa chọn ngày"}</p>
        </div>

        <div className="invoice-details">
          <p>
            <strong>Người Thuê:</strong> {invoice.render}
          </p>
          <p>
            <strong>Người cho thuê:</strong> {invoice.owner}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {invoice.address}
          </p>
          <p>
            <strong>Mã số thuế:</strong> {invoice.taxCode || "Không có"}
          </p>
          <p>
            <strong>Nội dung:</strong> {invoice.subject}
          </p>
          <p>
            <strong>Số tiền:</strong> {invoice.amount}
          </p>
          <div className="signature-section">
            <div className="signature">
              <p>Người thuê</p>
              {invoice.signatureRender ? (
                <img
                  src={invoice.signatureRender}
                  alt="Chữ ký người thuê"
                  style={{ width: "150px" }}
                />
              ) : (
                <p>(Ký và ghi rõ họ tên)</p>
              )}
            </div>
            <div className="signature">
              <p>Người cho thuê</p>
              {invoice.signatureOwner ? (
                <img
                  src={invoice.signatureOwner}
                  alt="Chữ ký người cho thuê"
                  style={{ width: "150px" }}
                />
              ) : (
                <p>(Ký và ghi rõ họ tên)</p>
              )}
            </div>
          </div>
        </div>
        <button type="button" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetails;
