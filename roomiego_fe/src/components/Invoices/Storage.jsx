import React, { useState } from "react";
import "./Storage.css";
import room1 from "../../assets/room1.jpeg";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import InvoiceDetails from "./InvoiceDetails";
import InvoiceForm from "./InvoiceForm";

/**
 * Component chính quản lý danh sách hóa đơn và các chức năng liên quan.
 */
const Storage = () => {
  const [searchSender, setSearchSender] = useState(""); // Tìm kiếm theo người gửi
  const [startDate, setStartDate] = useState(""); // Ngày bắt đầu tìm kiếm
  const [endDate, setEndDate] = useState(""); // Ngày kết thúc tìm kiếm
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null); // ID hóa đơn đang xem
  const [isCreatingNew, setIsCreatingNew] = useState(false); // State để kiểm soát việc hiển thị form tạo mới
  const [emails, setEmails] = useState([
    {
      id: 1,
      render: "yenhh@softdreams.vn",
      subject: "FW: Hóa đơn điện tử số: 0000254...",
      status: "Đã xử lý",
      notification: "",
      receivedDate: "25/06/2021 09:47:41",
      image: room1,
    },
    ...Array.from({ length: 100 }, (_, i) => ({
      id: i + 2,
      render: `sender${i + 2}@example.com`,
      subject: `Subject ${i + 2}`,
      status: i % 2 === 0 ? "Đã xử lý" : "Lỗi",
      notification: i % 3 === 0 ? "Important" : "",
      receivedDate: `25/06/2021 09:${40 + (i % 20)}:41`,
      image: room1,
    })),
  ]);

  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 10; // Số mục trên mỗi trang

  /**
   * Lọc danh sách hóa đơn dựa trên tìm kiếm.
   */
  const filteredEmails = emails.filter((email) => {
    const isSenderMatch = email.render.includes(searchSender);
    const isDateMatch =
      (!startDate || new Date(email.receivedDate) >= new Date(startDate)) &&
      (!endDate || new Date(email.receivedDate) <= new Date(endDate));
    return isSenderMatch && isDateMatch;
  });

  const totalPages = Math.ceil(filteredEmails.length / itemsPerPage); // Tổng số trang
  const startIndex = (currentPage - 1) * itemsPerPage; // Chỉ mục bắt đầu của trang hiện tại
  const currentEmails = filteredEmails.slice(
    startIndex,
    startIndex + itemsPerPage
  ); // Danh sách hóa đơn trên trang hiện tại

  /**
   * Xóa hóa đơn khỏi danh sách.
   * 
   * @param {number} id - ID của hóa đơn cần xóa.
   */
  const handleDelete = (id) => {
    // **Ghi chú:** Ở đây bạn nên gọi API để xóa hóa đơn trên server.
    // Ví dụ:
    // fetch(`https://example.com/api/invoices/${id}`, {
    //   method: 'DELETE',
    // })
    // .then(response => response.json())
    // .then(data => console.log(data))
    // .catch(error => console.error('Error:', error));
    setEmails(emails.filter((email) => email.id !== id));
  };

  /**
   * Chuyển trang.
   * 
   * @param {number} page - Số trang cần chuyển đến.
   */
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  /**
   * Lấy danh sách số trang.
   * 
   * @returns {array} Danh sách số trang.
   */
  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  /**
   * Xem chi tiết hóa đơn.
   * 
   * @param {number} id - ID của hóa đơn cần xem.
   */
  const handleViewInvoice = (id) => {
    setSelectedInvoiceId(id);
  };

  /**
   * Đóng chi tiết hóa đơn.
   */
  const handleCloseInvoiceDetails = () => {
    setSelectedInvoiceId(null);
  };

  /**
   * Mở form tạo mới hóa đơn.
   */
  const handleCreateNewInvoice = () => {
    console.log("handleCreateNewInvoice is called");
    setIsCreatingNew(true);
  };

  /**
   * Lưu hóa đơn mới.
   * 
   * @param {object} newInvoice - Dữ liệu hóa đơn mới.
   */
  const handleSaveInvoice = (newInvoice) => {
    const newId =
      emails.length > 0 ? Math.max(...emails.map((e) => e.id)) + 1 : 1;

    // **Ghi chú:** Ở đây bạn nên gọi API để lưu hóa đơn mới vào server.
    // Ví dụ:
    // fetch('https://example.com/api/invoices', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newInvoice),
    // })
    // .then(response => response.json())
    // .then(data => console.log(data))
    // .catch(error => console.error('Error:', error));
    setEmails([
      ...emails,
      {
        id: newId,
        render: newInvoice.render,
        subject: newInvoice.subject,
        status: "Chưa xử lý",
        notification: "",
        receivedDate: newInvoice.date,
        image: room1,

        // ✅ Thêm các trường cần thiết từ form
        address: newInvoice.address,
        owner: newInvoice.owner,
        taxCode: newInvoice.taxCode,
        amount: newInvoice.amount,
        signatureRender: newInvoice.signatureRender,
        signatureOwner: newInvoice.signatureOwner,
      },
    ]);

    setIsCreatingNew(false);
  };

  /**
   * Hủy tạo mới hóa đơn.
   */
  const handleCancelCreate = () => {
    setIsCreatingNew(false);
  };

  return (
    <div className="Storage-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Người gửi"
          value={searchSender}
          onChange={(e) => setSearchSender(e.target.value)}
        />
        <input
          type="date"
          placeholder="Từ ngày"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="Đến ngày"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button className="search-btn">Tìm kiếm</button>
        <button
          className="refresh-btn"
          onClick={() => {
            setSearchSender("");
            setStartDate("");
            setEndDate("");
          }}
        >
          Làm mới
        </button>
      </div>

      <button className="create-new-btn" onClick={handleCreateNewInvoice}>
        Tạo mới
      </button>

      <table className="email-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Người thuê</th>
            <th>Nội dung</th>
            <th>Trạng thái</th>
            <th>Thông báo</th>
            <th>Ngày nhận</th>
            <th>Xem</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {currentEmails.map((email, index) => (
            <tr key={email.id}>
              <td>{startIndex + index + 1}</td>
              <td>{email.render}</td>
              <td>{email.subject}</td>
              <td
                className={
                  email.status === "Đã xử lý" ? "processed" : "error"
                }
              >
                {email.status}
              </td>
              <td>{email.notification}</td>
              <td>{email.receivedDate}</td>
              <td>
                <button
                  className="view-btn"
                  onClick={() => handleViewInvoice(email.id)}
                >
                  Xem
                </button>
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(email.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </button>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`pagination-btn ${
              currentPage === page ? "active" : ""
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight size={16} />
        </button>
      </div>
      {isCreatingNew && (
        <div className="form-overlay">
          <InvoiceForm onSave={handleSaveInvoice} onCancel={handleCancelCreate} />
        </div>
      )}

      {selectedInvoiceId && (
        <InvoiceDetails
          invoiceId={selectedInvoiceId}
          onClose={handleCloseInvoiceDetails}
          invoices={emails} // Truyền danh sách hóa đơn vào prop invoices
        />
      )}
    </div>
  );
};

export default Storage;
