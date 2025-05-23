import { useState, useEffect } from "react";
// import { useNotifications } from "../NotificationComponent/NotificationContext";
import "./css/Request.css";

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRenterInfo, setSelectedRenterInfo] = useState(null);
  const [roomDetails, setRoomDetails] = useState({});
  // const { sendNotification } = useNotifications();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Function to fetch room details
  const fetchRoomDetails = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch room details");
      }

      const data = await response.json();
      return data.data; // Return the room data
    } catch (error) {
      console.error("Error fetching room details:", error);
      return null;
    }
  };

  // Fetch all requests for the owner
  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/api/view-requests/owner", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        throw new Error("Failed to fetch requests");
      }

      const data = await response.json();
      console.log("Fetched requests data:", data);

      // Fetch room details for each request
      const requestsWithRoomDetails = await Promise.all(
        data.map(async (request) => {
          if (request.roomId) {
            const roomData = await fetchRoomDetails(request.roomId);
            if (roomData) {
              return { ...request, room: roomData };
            }
          }
          return request;
        })
      );

      console.log("Requests with room details:", requestsWithRoomDetails);
      setRequests(requestsWithRoomDetails);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = requests.slice(startIndex, endIndex);

  // Show renter info modal
  const showRenterInfo = async (renterId, request) => {
    try {
      // Gọi API để lấy thông tin người thuê
      const response = await fetch(`http://localhost:8080/owner/get-users/${renterId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch renter information");
      }

      const renterData = await response.json();
      console.log("Raw renter data:", renterData); // Debug log

      // Lấy thông tin người dùng từ mảng usersList
      const userData = renterData.usersList?.[0] || {};
      console.log("User data:", userData); // Debug log

      const renterInfo = {
        fullName: userData.fullName || userData.name || userData.username || "Chưa cập nhật",
        email: userData.email || "Chưa cập nhật",
        phone: userData.phone || userData.phoneNumber || "Chưa cập nhật",
        dateOfBirth: userData.dateOfBirth || userData.birthDate || "Chưa cập nhật",
        gender: userData.gender || "Chưa cập nhật"
      };
      
      console.log("Processed renter info:", renterInfo); // Debug log
      
      setSelectedRenterInfo(renterInfo);
      setSelectedRequest(request);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error showing renter info:", error);
      alert("Failed to show renter information");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    setSelectedRenterInfo(null);
  };

  // Respond to a view request (accept/reject)
  const handleRespond = async (requestId, accept, adminNote = null) => {
    console.log("Handling response:", { requestId, accept, adminNote }); // Debug log
    try {
      const response = await fetch("http://localhost:8080/api/view-requests/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          requestId: requestId,
          accept: accept,
          adminNote: adminNote || ""
        }),
      });

      console.log("Response status:", response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData); // Debug log
        throw new Error(errorData.message || "Failed to respond to request");
      }

      const responseData = await response.json();
      console.log("Response data:", responseData); // Debug log

      // Refresh requests list to update status
      await fetchRequests();

      // Close modal if it was open
      setSelectedRequest(null);
      setIsModalOpen(false);
      setSelectedRenterInfo(null);

      // Show success message
      alert(accept ? "Đã chấp nhận yêu cầu" : "Đã từ chối yêu cầu");
    } catch (error) {
      console.error("Error responding to request:", error);
      alert(error.message || "Có lỗi xảy ra khi xử lý yêu cầu");
    }
  };

  return (
    <div className="request-container">
      <h2>Room View Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <>
          <table className="requests-table">
            <thead>
              <tr>
                <th>Room</th>
                <th>Renter</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.map((req) => {
                console.log("Rendering request:", req); // Debug log
                return (
                  <tr key={req.id}>
                    <td>{req.room?.title || "Unknown Room"}</td>
                    <td>
                      <button 
                        className="view-renter-btn"
                        onClick={() => showRenterInfo(req.renterId, req)}
                      >
                        View Renter
                      </button>
                    </td>
                    <td>{req.message}</td>
                    <td>
                      {req.status === "PENDING" ? (
                        <span className="status-pending">Pending</span>
                      ) : (
                        <span className="status-message">
                          {req.status === "ACCEPTED" ? "Đã chấp nhận" : "Đã từ chối"}
                          {req.adminNote && ` - ${req.adminNote}`}
                        </span>
                      )}
                    </td>
                    <td>
                      {req.status === "PENDING" && (
                        <div className="action-buttons">
                          <button
                            className="accept-btn"
                            onClick={() => {
                              console.log("Accept button clicked for request:", req.id); // Debug log
                              handleRespond(req.id, true);
                            }}
                          >
                            Accept
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => {
                              console.log("Reject button clicked for request:", req.id); // Debug log
                              const adminNote = prompt("Lý do từ chối:");
                              if (adminNote !== null) {
                                handleRespond(req.id, false, adminNote);
                              }
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Trang đầu
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Trước
              </button>
              {[...Array(totalPages).keys()].map((i) => (
                <button
                  key={i + 1}
                  className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Tiếp
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Trang cuối
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal for showing renter info */}
      {isModalOpen && selectedRequest && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Thông tin người thuê</h3>
            {selectedRenterInfo ? (
              <>
                <p>
                  <strong>Họ và tên:</strong> {selectedRenterInfo.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedRenterInfo.email}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {selectedRenterInfo.phone}
                </p>
                <p>
                  <strong>Giới tính:</strong> {selectedRenterInfo.gender}
                </p>
              </>
            ) : (
              <p>Đang tải thông tin người thuê...</p>
            )}
            <hr />
            <p>
              <strong>Tin nhắn yêu cầu:</strong> {selectedRequest.message}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedRequest.status}
            </p>
            {selectedRequest.adminNote && (
              <p>
                <strong>Ghi chú:</strong> {selectedRequest.adminNote}
              </p>
            )}
            <button className="close-modal-btn" onClick={closeModal}>
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Request;
