import React from "react";                                            
import { useEffect, useState } from "react";
// import { useNotifications } from "../NotificationComponent/NotificationContext";

import "./css/Request.css";

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRenterInfo, setSelectedRenterInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lấy thông tin user (chủ phòng)
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch("http://localhost:8080/renterowner/get-profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const { user } = data;
        setFullName(user.fullName);
        setIsLoggedIn(true);
      })
      .catch((err) => console.error("Error fetching user profile:", err));
  }, []);

  // Lấy danh sách yêu cầu xem phòng

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8080/api/view-requests/owner", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Lỗi khi lấy danh sách yêu cầu");

        const data = await res.json();
        setRequests(data);
      } catch (err) {
        setError("Lỗi khi lấy danh sách yêu cầu");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Chấp nhận hoặc từ chối yêu cầu
const handleRespond = async (requestId, accept) => {
  const token = localStorage.getItem("authToken");
  let adminNote = "";

  if (!accept) {
    adminNote = prompt("Lý do từ chối:");
    if (adminNote === null) return;
  }

  try {
    const res = await fetch("http://localhost:8080/api/view-requests/respond", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        requestId,
        accept,
        adminNote,
      }),
    });

    if (!res.ok) throw new Error("Phản hồi thất bại");

    // alert("Phản hồi thành công.");
    showSuccessToast(accept ? "Đã chấp nhận yêu cầu" : "Đã từ chối yêu cầu");

    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? { ...req, status: accept ? "ACCEPTED" : "REJECTED", adminNote }
          : req
      )
    );
  } catch (error) {
    console.error("Error responding to request:", error);
    alert(error.message || "Có lỗi xảy ra khi xử lý yêu cầu");
  }
};


  // Xem thông tin người thuê
  const handleImageClick = async (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);

    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:8080/owner/get-users/${request.renterId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Lỗi khi lấy thông tin người thuê");

    const data = await res.json();
    console.log("Raw renter info response:", data);

      // Kiểm tra nếu có dữ liệu trong usersList
      if (data.usersList && data.usersList.length > 0) {
        const renterInfo = data.usersList[0]; // Lấy thông tin người thuê đầu tiên
        setSelectedRenterInfo(renterInfo);
      } else {
        console.error("Không tìm thấy người thuê.");
        setSelectedRenterInfo(null);
      }
    } catch (err) {
      console.error("Lỗi khi lấy thông tin người thuê:", err);
      setSelectedRenterInfo(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    setSelectedRenterInfo(null);
  };

  return (
    <div className="request-container">
      <h2 className="request-title">Room Rental Requests</h2>
      {isLoggedIn && <p className="greeting">Welcome, {fullName}</p>}

      {loading ? (
        <p>Loading requests...</p>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : (
        <table className="request-table">
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Room ID</th>
              <th>Message</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>
                  <button className="link-btn" onClick={() => handleImageClick(req)}>
                    View Info
                  </button>
                </td>
                <td>{req.roomId}</td>
                <td>{req.message}</td>
                <td>{req.status}</td>
                <td>
                  {req.status === "PENDING" && (
                    <>
                      <button className="accept-btn" onClick={() => handleRespond(req.id, true)}>Accept</button>
                      <button className="reject-btn" onClick={() => handleRespond(req.id, false)}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal hiển thị người thuê */}
      {isModalOpen && selectedRequest && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Tenant Info</h3>
           {selectedRenterInfo ? (
  <>
                <p><strong>Full Name:</strong> {selectedRenterInfo.fullName}</p>
                <p><strong>Email:</strong> {selectedRenterInfo.email}</p>
                <p><strong>Phone:</strong> {selectedRenterInfo.phone || "Không có số điện thoại"}</p> {/* Thêm điều kiện nếu không có số điện thoại */}
              </>
            ) : (
              <p>Đang tải thông tin người thuê...</p>
            )}
            <hr />
            <p><strong>Request Message:</strong> {selectedRequest.message}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>
            {selectedRequest.adminNote && (
              <p><strong>Admin Note:</strong> {selectedRequest.adminNote}</p>
            )}
            <button className="close-modal-btn" onClick={closeModal}>&times;</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Request;
