import React, { useState, useEffect } from "react";
import "./Storage.css"; // Import CSS styles for the invoice
import { useSearchParams } from "react-router-dom";

/**
 * Component tạo mới hợp đồng.
 * 
 * @param {function} onSave - Hàm lưu hợp đồng khi submit.
 * @param {function} onCancel - Hàm hủy tạo hợp đồng.
 * @param {number} roomId - ID của phòng (optional)
 * @param {number} tenantId - ID của người thuê (optional)
 */
const InvoiceForm = ({ onSave, onCancel, roomId, tenantId }) => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    tenantId: tenantId || "",
    roomId: roomId || "",
    startDate: "",
    endDate: "",
    price_per_month: "",
    status: "ACTIVE"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tenantInfo, setTenantInfo] = useState(null); // Thông tin người thuê
  const [roomInfo, setRoomInfo] = useState(null);

  // Get roomId and tenantId from URL parameters or props
  useEffect(() => {
    const urlRoomId = searchParams.get('roomId');
    const urlTenantId = searchParams.get('tenantId');
    
    // Update form data with provided IDs
    setFormData(prev => ({
      ...prev,
      roomId: roomId || urlRoomId || prev.roomId,
      tenantId: tenantId || urlTenantId || prev.tenantId
    }));

    // Fetch tenant information if we have an ID
    const currentTenantId = tenantId || urlTenantId;
    if (currentTenantId) {
      fetchTenantInfo(currentTenantId);
    }

    // Fetch room information if we have an ID
    const currentRoomId = roomId || urlRoomId;
    if (currentRoomId) {
      fetchRoomInfo(currentRoomId);
    }
  }, [searchParams, roomId, tenantId]);

  // Fetch tenant information
  const fetchTenantInfo = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/owner/get-users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tenant information');
      }

      const data = await response.json();
      if (data.usersList && data.usersList.length > 0) {
        setTenantInfo(data.usersList[0]);
      }
    } catch (err) {
      console.error('Error fetching tenant info:', err);
    }
  };

  // Fetch room information
  const fetchRoomInfo = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch room information');
      }

      const data = await response.json();
      if (data.data) {
        setRoomInfo(data.data);
        // Pre-fill monthly rent with room price
        setFormData(prev => ({
          ...prev,
          price_per_month: data.data.price || ""
        }));
      }
    } catch (err) {
      console.error('Error fetching room info:', err);
    }
  };

  /**
   * Hàm xử lý khi submit form.
   * 
   * @param {Event} e - Sự kiện submit.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.tenantId || !formData.roomId || !formData.startDate || !formData.endDate || !formData.price_per_month) {
        throw new Error("Vui lòng điền đầy đủ thông tin");
      }

      // Validate dates
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start >= end) {
        throw new Error("Ngày kết thúc phải sau ngày bắt đầu");
      }

      const contractData = {
        tenantId: parseInt(formData.tenantId),
        roomId: parseInt(formData.roomId),
        startDate: formData.startDate,
        endDate: formData.endDate,
        pricePerMonth: parseInt(formData.price_per_month),
        status: formData.status
      };

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Vui lòng đăng nhập để tạo hợp đồng");
      }

      const response = await fetch("http://localhost:8080/api/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contractData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Lỗi khi tạo hợp đồng");
      }

      const data = await response.json();
      
      // Reset form and close
      setFormData({
        tenantId: "",
        roomId: "",
        startDate: "",
        endDate: "",
        price_per_month: "",
        status: "ACTIVE"
      });
      onSave(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="invoice-container">
      {error && <div className="error-message">{error}</div>}
      <div className="invoice-header">
        <p>CHI TIẾT HỢP ĐỒNG</p>
        {roomInfo && <p>Phòng: {roomInfo.title}</p>}
      </div>
      <form className="invoice-form" onSubmit={handleSubmit}>
        <div className="invoice-section">
          <label htmlFor="roomId">ID Phòng:</label>
          <input
            type="text"
            id="roomId"
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            required
            disabled={!!roomId}
          />
          {roomInfo && (
            <div className="room-info">
              <p><strong>Địa chỉ:</strong> {roomInfo.addressDetails}</p>
              <p><strong>Giá phòng:</strong> {roomInfo.price?.toLocaleString()} VNĐ</p>
            </div>
          )}
        </div>
        <div className="invoice-section">
          <label htmlFor="tenantId">ID Người thuê:</label>
          <input
            type="text"
            id="tenantId"
            name="tenantId"
            value={formData.tenantId}
            onChange={handleChange}
            required
            disabled={!!tenantId}
          />
        </div>
        {tenantInfo && (
          <div className="tenant-info">
            <p><strong>Tên người thuê:</strong> {tenantInfo.fullName}</p>
            <p><strong>Email:</strong> {tenantInfo.email}</p>
            <p><strong>Số điện thoại:</strong> {tenantInfo.phone}</p>
          </div>
        )}
        <div className="invoice-section">
          <label>
            Ngày bắt đầu:
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="invoice-section">
          <label>
            Ngày kết thúc:
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="invoice-section">
          <label>
            Giá thuê mỗi tháng:
            <input
              type="number"
              name="price_per_month"
              value={formData.price_per_month}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </label>
        </div>

        <div className="button-group">
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>
          <button type="button" className="cancel-button" onClick={onCancel} disabled={loading}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
