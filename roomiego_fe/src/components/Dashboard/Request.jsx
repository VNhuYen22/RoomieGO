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
  // const { sendNotification } = useNotifications();
  
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchRequests = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/view-requests/owner", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }

      const data = await response.json();
      setRequests(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Calculate pagination values
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = requests.slice(startIndex, endIndex);

  const showRenterInfo = async (renterId) => {
    try {
      const response = await fetch(`http://localhost:8080/owner/get-users/${renterId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch renter information");
      }

      const data = await response.json();
      setSelectedRenterInfo(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching renter info:", error);
      alert("Failed to fetch renter information");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    setSelectedRenterInfo(null);
  };

  const handleRespond = async (requestId, accept, adminNote = null) => {
    try {
      const response = await fetch("http://localhost:8080/api/view-requests/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          requestId,
          accept,
          adminNote,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to respond to request");
      }

      const responseData = await response.json();
      
      // Lấy thông tin người thuê
      const renterResponse = await fetch(`http://localhost:8080/owner/get-users/${responseData.renterId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!renterResponse.ok) {
        throw new Error("Failed to fetch renter information");
      }

      const renterData = await renterResponse.json();
      if (!renterData.email) {
        throw new Error("Renter email not found");
      }

      // Gửi thông báo cho người thuê
      const notificationMessage = accept
        ? `Yêu cầu xem phòng của bạn đã được chấp nhận. ${adminNote ? `Lưu ý: ${adminNote}` : ""}`
        : `Yêu cầu xem phòng của bạn đã bị từ chối. ${adminNote ? `Lý do: ${adminNote}` : ""}`;

      // await sendNotification(
      //   responseData.renterId,
      //   notificationMessage,
      //   "VIEW_REQUEST_RESPONSE",
      //   { roomId: responseData.roomId }
      // );

      // Cập nhật danh sách yêu cầu
      fetchRequests();
      
      // Đóng modal
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error responding to request:", error);
      alert(error.message);
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
              {currentRequests.map((req) => (
                <tr key={req.id}>
                  <td>{req.roomTitle}</td>
                  <td>
                    <button onClick={() => showRenterInfo(req.renterId)}>
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
                          onClick={() => handleRespond(req.id, true)}
                        >
                          Accept
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => {
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
              ))}
            </tbody>
          </table>

          {/* Add pagination controls */}
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

      {/* Modal hiển thị người thuê */}
      {isModalOpen && selectedRequest && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Tenant Info</h3>
            {selectedRenterInfo ? (
              <>
                <p><strong>Full Name:</strong> {selectedRenterInfo.fullName}</p>
                <p><strong>Email:</strong> {selectedRenterInfo.email}</p>
                <p><strong>Phone:</strong> {selectedRenterInfo.phone || "Không có số điện thoại"}</p>
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