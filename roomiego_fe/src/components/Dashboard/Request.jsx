import { useState, useEffect } from "react";
import { showErrorToast, showInfoToast } from "../toast";
import { useNavigate } from "react-router-dom";
// import { useNotifications } from "../NotificationComponent/NotificationContext";
import "./css/Request.css";

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRenterInfo, setSelectedRenterInfo] = useState(null);
  const [requestType, setRequestType] = useState("VIEW");
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  // const { sendNotification } = useNotifications();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Check authentication state
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const userData = JSON.parse(localStorage.getItem("userData"));
      
      console.log("Auth check - Token:", token);
      console.log("Auth check - User data:", userData);
      
      if (token) {  // Chỉ cần kiểm tra token
        if (userData) {
          setUserRole(userData.role);
          setIsAuthenticated(true);
          console.log("User authenticated with role:", userData.role);
        } else {
          // Nếu có token nhưng không có userData, thử lấy thông tin user từ token
          fetch("http://localhost:8080/renterowner/get-profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log("Got user profile:", data);
            if (data && data.user && data.user.role) {
              localStorage.setItem("userData", JSON.stringify(data.user));
              setUserRole(data.user.role);
              setIsAuthenticated(true);
              console.log("User authenticated with role:", data.user.role);
            } else {
              throw new Error("Invalid user data received");
            }
          })
          .catch(error => {
            console.error("Error fetching user data:", error);
            // Nếu lỗi kết nối, thử sử dụng token để xác thực
            if (token) {
              setIsAuthenticated(true);
              console.log("Using token for authentication");
            } else {
              setIsAuthenticated(false);
            }
          });
        }
      } else {
        console.log("No token found");
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

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
      console.log("Room data:", data.data);

      // Fetch owner information
      if (data.data.ownerId) {
        try {
          const ownerResponse = await fetch(`http://localhost:8080/owner/get-users/${data.data.ownerId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });

          if (ownerResponse.ok) {
            const ownerData = await ownerResponse.json();
            const ownerInfo = ownerData.usersList?.[0];
            if (ownerInfo) {
              data.data.ownerName = ownerInfo.fullName;
            }
          }
        } catch (error) {
          console.error("Error fetching owner info:", error);
        }
      }

      return data.data;
    } catch (error) {
      console.error("Error fetching room details:", error);
      return null;
    }
  };

  // Fetch requests when authenticated
  useEffect(() => {
    console.log("Auth state changed:", isAuthenticated);
    if (isAuthenticated) {
      console.log("Fetching requests...");
      fetchRequests();
    }
  }, [isAuthenticated]);

  const fetchRequests = async () => {
    if (!isAuthenticated) {
      console.log("Not authenticated, skipping fetch");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const userData = JSON.parse(localStorage.getItem("userData"));
      
      console.log("Fetching with token:", token);
      console.log("User data:", userData);

      if (!token) {
        console.log("No token found, redirecting to login");
        setIsAuthenticated(false);
        window.location.href = "/login";
        return;
      }

      // Fetch view requests
      const viewResponse = await fetch("http://localhost:8080/api/view-requests/owner", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("View response status:", viewResponse.status);

      if (!viewResponse.ok) {
        if (viewResponse.status === 401 || viewResponse.status === 403) {
          console.log("Token expired or invalid, redirecting to login");
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          setIsAuthenticated(false);
          window.location.href = "/login";
          return;
        }
        throw new Error("Failed to fetch view requests");
      }

      const viewData = await viewResponse.json();
      console.log("View requests data:", viewData);
      const viewRequests = await Promise.all(viewData.map(async req => {
        // Fetch renter information
        try {
          const renterResponse = await fetch(`http://localhost:8080/owner/get-users/${req.renterId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (renterResponse.ok) {
            const renterData = await renterResponse.json();
            const renterInfo = renterData.usersList?.[0];
            if (renterInfo) {
              return { ...req, type: "VIEW", renterName: renterInfo.fullName };
            }
          }
        } catch (error) {
          console.error("Error fetching renter info:", error);
        }
        return { ...req, type: "VIEW" };
      }));

      // Fetch rental requests only if user is OWNER or ADMIN
      let rentalRequests = [];
      if (userRole === "OWNER" || userRole === "ADMIN") {
        try {
          console.log("Fetching rental requests for role:", userRole);
          const rentalResponse = await fetch("http://localhost:8080/api/rent-requests/owner", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("Rental response status:", rentalResponse.status);

          if (rentalResponse.ok) {
            const rentalData = await rentalResponse.json();
            console.log("Rental requests data:", rentalData);
            rentalRequests = await Promise.all(rentalData.map(async req => {
              console.log("Processing rental request:", req);
              // Fetch renter information
              try {
                const renterResponse = await fetch(`http://localhost:8080/owner/get-users/${req.tenantId}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                if (renterResponse.ok) {
                  const renterData = await renterResponse.json();
                  const renterInfo = renterData.usersList?.[0];
                  if (renterInfo) {
                    return {
                      ...req,
                      type: "RENTAL",
                      renterId: req.tenantId,
                      renterName: renterInfo.fullName
                    };
                  }
                }
              } catch (error) {
                console.error("Error fetching renter info:", error);
              }
              return {
                ...req,
                type: "RENTAL",
                renterId: req.tenantId
              };
            }));
          } else if (rentalResponse.status === 403) {
            console.log("User does not have permission to view rental requests");
          } else {
            console.error("Failed to fetch rental requests:", rentalResponse.status);
          }
        } catch (rentalError) {
          console.error("Error fetching rental requests:", rentalError);
        }
      }

      // Combine both types of requests
      const allRequests = [...viewRequests, ...rentalRequests];
      console.log("Total requests:", {
        view: viewRequests.length,
        rental: rentalRequests.length,
        total: allRequests.length
      });

      // Fetch room details for each request
      const requestsWithRoomDetails = await Promise.all(
        allRequests.map(async (request) => {
          if (request.roomId) {
            const roomData = await fetchRoomDetails(request.roomId);
            if (roomData) {
              return { ...request, room: roomData };
            }
          }
          return request;
        })
      );

      console.log("Final requests with room details:", requestsWithRoomDetails);
      setRequests(requestsWithRoomDetails);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = requests
    .filter(req => req.type === requestType)
    .slice(startIndex, endIndex);

  // Reset to first page when changing request type
  useEffect(() => {
    setCurrentPage(1);
  }, [requestType]);

  // Show renter info modal
  const showRenterInfo = async (renterId, request) => {
    try {
      console.log("Showing renter info for request:", request);
      console.log("Renter ID:", renterId);

      if (!renterId) {
        console.error("No renter ID provided");
        showErrorToast("Không tìm thấy thông tin người thuê");
        return;
      }

      console.log("Fetching renter info for ID:", renterId);
      
      const response = await fetch(`http://localhost:8080/owner/get-users/${renterId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch renter information");
      }

      const renterData = await response.json();
      console.log("Raw renter data:", renterData);

      const userData = renterData.usersList?.[0] || {};
      console.log("User data:", userData);

      if (!userData || Object.keys(userData).length === 0) {
        throw new Error("No user data found");
      }

      const renterInfo = {
        fullName: userData.fullName || "Chưa cập nhật",
        email: userData.email || "Chưa cập nhật",
        phone: userData.phone || "Chưa cập nhật",
        dateOfBirth: userData.dob ? new Date(userData.dob).toLocaleDateString() : "Chưa cập nhật",
        gender: userData.gender || "Chưa cập nhật"
      };
      
      console.log("Processed renter info:", renterInfo);
      
      setSelectedRenterInfo(renterInfo);
      setSelectedRequest(request);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error showing renter info:", error);
      showErrorToast("Không thể hiển thị thông tin người thuê");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    setSelectedRenterInfo(null);
  };

  // Handle view request response
  const handleViewRequestRespond = async (requestId, accept, adminNote = null) => {
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

      if (!response.ok) {
        throw new Error("Failed to respond to view request");
      }

      showInfoToast(accept ? "Đã chấp nhận yêu cầu xem phòng" : "Đã từ chối yêu cầu xem phòng");
      await fetchRequests();
    } catch (error) {
      console.error("Error responding to view request:", error);
      showErrorToast(error.message || "Có lỗi xảy ra khi xử lý yêu cầu");
    }
  };

  // Handle rental request response
  const handleRentalRequestRespond = async (requestId, accept, adminNote = null) => {
    try {
      const response = await fetch(`http://localhost:8080/api/rent-requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          accept: accept,
          adminNote: adminNote || "",
          status: accept ? "APPROVED" : "REJECTED",
          ownerFinalize: accept
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to respond to rental request");
      }

      showInfoToast(accept ? "Đã chấp nhận yêu cầu thuê phòng" : "Đã từ chối yêu cầu thuê phòng");
      
      if (accept) {
        // Chuyển hướng đến trang invoices trong dashboard
        navigate(`/dashboard/invoices?requestId=${requestId}`);
      }
      
      await fetchRequests();
    } catch (error) {
      console.error("Error responding to rental request:", error);
      showErrorToast(error.message || "Có lỗi xảy ra khi xử lý yêu cầu");
    }
  };

  // Handle cancel rental request
  const handleCancelRental = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/rent-requests/${requestId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        }
      });

      if (!response.ok) {
        throw new Error("Failed to cancel rental request");
      }

      showInfoToast("Đã hủy cho thuê phòng thành công");
      await fetchRequests();
    } catch (error) {
      console.error("Error canceling rental:", error);
      showErrorToast(error.message || "Có lỗi xảy ra khi hủy cho thuê phòng");
    }
  };

  // Show loading or error state if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="request-container">
        <h2>Yêu cầu phòng trọ</h2>
        <p>Vui lòng đăng nhập để xem yêu cầu của bạn.</p>
      </div>
    );
  }

  return (
    <div className="request-container">
      <h2>Yêu cầu phòng trọ</h2>
      <div className="request-type-selector">
        <button 
          className={requestType === "VIEW" ? "active" : ""} 
          onClick={() => setRequestType("VIEW")}
        >
          Yêu cầu xem phòng
        </button>
        <button 
          className={requestType === "RENTAL" ? "active" : ""} 
          onClick={() => setRequestType("RENTAL")}
        >
          Yêu cầu thuê phòng
        </button>
      </div>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : currentRequests.length === 0 ? (
        <p>Không có yêu cầu nào.</p>
      ) : (
        <>
          <table className="requests-table">
            <thead>
              <tr>
                <th>Phòng</th>
                <th>Người thuê</th>
                {requestType === "VIEW" && <th>Tin nhắn</th>}
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.map((req) => (
                <tr key={req.id}>
                  <td>
                    <span 
                      className="room-name" 
                      title={req.room?.title || "Unknown Room"}
                      onClick={() => showRenterInfo(req.renterId, req)}
                    >
                      {req.room?.title || "Unknown Room"}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500, color: '#333' }}>
                      {req.renterName || "Chưa có thông tin"}
                    </span>
                  </td>
                  {requestType === "VIEW" && <td>{req.message}</td>}
                  <td>
                    {req.status === "PENDING" ? (
                      <span className="status-pending">Đang chờ</span>
                    ) : req.status === "APPROVED" ? (
                      <span className="status-approved">Đã chấp nhận</span>
                    ) : req.status === "REJECTED" ? (
                      <span className="status-rejected">Đã từ chối</span>
                    ) : req.status === "BOTH_FINALIZED" ? (
                      <span className="status-finalized">Đã hoàn tất</span>
                    ) : (
                      <span className="status-message">
                        {req.status}
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
                            if (req.type === "VIEW") {
                              handleViewRequestRespond(req.id, true);
                            } else {
                              handleRentalRequestRespond(req.id, true);
                            }
                          }}
                        >
                          Chấp nhận
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => {
                            const adminNote = prompt("Lý do từ chối:");
                            if (adminNote !== null) {
                              if (req.type === "VIEW") {
                                handleViewRequestRespond(req.id, false, adminNote);
                              } else {
                                handleRentalRequestRespond(req.id, false, adminNote);
                              }
                            }
                          }}
                        >
                          Từ chối
                        </button>
                      </div>
                    )}
                    {(req.status === "APPROVED" || req.status === "BOTH_FINALIZED") && req.type === "RENTAL" && (
                      <button
                        className="cancel-rental-btn"
                        onClick={() => handleCancelRental(req.id)}
                      >
                        Hủy cho thuê phòng
                      </button>
                    )}
                  </td>
                </tr>
              ))}
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
              <div className="renter-info">
                <div className="info-section">
                  <h4>Thông tin cá nhân</h4>
                  <p><strong>Họ và tên:</strong> {selectedRenterInfo.fullName}</p>
                  <p><strong>Email:</strong> {selectedRenterInfo.email}</p>
                  <p><strong>Số điện thoại:</strong> {selectedRenterInfo.phone}</p>
                  <p><strong>Ngày sinh:</strong> {selectedRenterInfo.dateOfBirth}</p>
                  <p><strong>Giới tính:</strong> {selectedRenterInfo.gender}</p>
                </div>
                <div className="info-section">
                  <h4>Thông tin yêu cầu</h4>
                  <p><strong>Loại yêu cầu:</strong> {selectedRequest.type === "VIEW" ? "Xem phòng" : "Thuê phòng"}</p>
                  <p><strong>Phòng:</strong> {selectedRequest.room?.title || "Không xác định"}</p>
                  <p><strong>Địa chỉ:</strong> {selectedRequest.room?.addressDetails || "Không xác định"}</p>
                  <p><strong>Chủ phòng:</strong> {selectedRequest.room?.ownerName || "Không xác định"}</p>
                  <p><strong>Nội dung bài viết:</strong> {selectedRequest.room?.description || "Không có mô tả"}</p>
                  <p><strong>Trạng thái:</strong> {
                    selectedRequest.status === "PENDING" ? "Đang chờ" :
                    selectedRequest.status === "APPROVED" ? "Đã chấp nhận" :
                    selectedRequest.status === "REJECTED" ? "Đã từ chối" :
                    selectedRequest.status === "BOTH_FINALIZED" ? "Đã hoàn tất" :
                    selectedRequest.status
                  }</p>
                  {selectedRequest.adminNote && (
                    <p><strong>Ghi chú:</strong> {selectedRequest.adminNote}</p>
                  )}
                </div>
              </div>
            ) : (
              <p>Đang tải thông tin người thuê...</p>
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


