import React, { useState, useEffect } from "react";
import moment from "moment"; // Import moment.js
import "./Storage.css"; // Import CSS styles for the component

const InvoiceDetails = ({ invoiceId, onClose, invoices }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching details for Invoice ID:", invoiceId);

    const fetchInvoiceDetails = async (id) => {
      setLoading(true);

      // Tìm hóa đơn trong danh sách invoices dựa trên invoiceId
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
