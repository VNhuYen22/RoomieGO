import React, { useState } from "react";
import "./Storage.css"; // Import CSS styles for the invoice

/**
 * Component tạo mới hóa đơn.
 * 
 * @param {function} onSave - Hàm lưu hóa đơn khi submit.
 * @param {function} onCancel - Hàm hủy tạo hóa đơn.
 */
const InvoiceForm = ({ onSave, onCancel }) => {
  const [render, setRender] = useState(""); // Tên người thuê
  const [owner, setOwner] = useState(""); // Tên người cho thuê
  const [address, setAddress] = useState(""); // Địa chỉ
  const [taxCode, setTaxCode] = useState(""); // Mã số thuế
  const [subject, setSubject] = useState(""); // Nội dung hóa đơn
  const [amount, setAmount] = useState(""); // Số tiền
  const [date, setDate] = useState(""); // Ngày lập hóa đơn
  const [signatureImageRender, setSignatureImageRender] = useState(null); // Hình ảnh chữ ký người thuê
  const [signatureImageOwner, setSignatureImageOwner] = useState(null); // Hình ảnh chữ ký người cho thuê

  /**
   * Hàm xử lý khi submit form.
   * 
   * @param {Event} e - Sự kiện submit.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const newInvoice = {
      render,
      owner,
      address,
      taxCode,
      subject,
      amount,
      date,
      signatureRender: signatureImageRender, // Lưu trữ chữ ký người thuê trong hóa đơn
      signatureOwner: signatureImageOwner, // Lưu trữ chữ ký người cho thuê trong hóa đơn
    };
    console.log("Submitting New Invoice:", newInvoice); // Debugging log
    // **Ghi chú:** Ở đây bạn nên gọi API để lưu hóa đơn vào server.
    // Ví dụ:
    // fetch('https://example.com/api/invoices', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newInvoice),
    // })
    // .then(response => response.json())
    // .then(data => console.log(data))
    // .catch(error => console.error('Error:', error));
    onSave(newInvoice); // Call the onSave function passed as a prop
  };

  /**
   * Hàm xử lý khi tải lên hình ảnh chữ ký người thuê.
   * 
   * @param {Event} event - Sự kiện tải lên hình ảnh.
   */
  const handleImageUploadRender = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureImageRender(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Hàm xử lý khi tải lên hình ảnh chữ ký người cho thuê.
   * 
   * @param {Event} event - Sự kiện tải lên hình ảnh.
   */
  const handleImageUploadOwner = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureImageOwner(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <p>CHI TIẾT HÓA ĐƠN</p>
        <p>Địa chỉ: {address || "Chưa nhập địa chỉ"}</p>
        <p>Ngày lập: {date || "Chưa chọn ngày"}</p>
      </div>
      <form className="invoice-form" onSubmit={handleSubmit}>
        <div className="invoice-section">
          <label>
            Người Thuê:
            <input
              type="text"
              value={render}
              onChange={(e) => setRender(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="invoice-section">
          <label>
            Người cho thuê:
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="invoice-section">
          <label>
            Địa chỉ:
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="invoice-section">
          <label>
            Mã số thuế (nếu có):
            <input
              type="text"
              value={taxCode}
              onChange={(e) => setTaxCode(e.target.value)}
            />
          </label>
        </div>
        <div className="invoice-section">
          <label>
            Nội dung:
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="invoice-section">
          <label>
            Số tiền:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="invoice-section">
          <label>
            Ngày:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button type="submit" className="save-button">
            Lưu
          </button>
          <button type="button" className="cancel-button" onClick={onCancel}>
            Hủy
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="invoice-footer">
        <div className="signature-section">
          <div className="signature">
            <p>Người thuê</p>
            {signatureImageRender ? (
              <img
                src={signatureImageRender}
                alt="Chữ ký người thuê"
                style={{ width: "150px" }}
              />
            ) : (
              <p>(Ký và ghi rõ họ tên)</p>
            )}
            <input type="file" accept="image/*" onChange={handleImageUploadRender} />
          </div>
          <div className="signature">
            <p>Người cho thuê</p>
            {signatureImageOwner ? (
              <img
                src={signatureImageOwner}
                alt="Chữ ký người cho thuê"
                style={{ width: "150px" }}
              />
            ) : (
              <p>(Ký và ghi rõ họ tên)</p>
            )}
            <input type="file" accept="image/*" onChange={handleImageUploadOwner} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
