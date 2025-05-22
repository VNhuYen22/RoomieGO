import React from "react";
import axios from "axios";
import "./css/Request.css";
import { useParams, Link } from "react-router-dom";

const Request = () => {
  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [rooms, setRooms] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);





  const [fullName, setFullName] = React.useState("");
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    // Payload chứa id của phòng được truyền từ URL
  
  
console.log("Room ID from URL:", id);
    // Gọi API để lấy danh sách yêu cầu đặt phòng (rent requests)
    fetch("http://localhost:8080/api/rent-requests", {
      method: "POST", // Phương thức POST theo yêu cầu API
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        roomId: id, // ID của phòng được truyền từ URL
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok, status: " + res.status);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Expected JSON but received: " + contentType);
        }
        return res.json();
      })
      .then((data) => {
        // Giả sử API trả về { status, message, data: [...] }
        setRooms(data.data); // Giả sử server trả về { status, message, data: [...] }
        setRentRequests(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Gọi API để lấy profile người dùng
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8080/renterowner/get-profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const { user } = response.data;
        setFullName(user.fullName);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchProfile();
  }, [id]);

  const handleImageClick = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="request-container">
      <h2 className="request-title">Room Rental Requests</h2>
      {isLoggedIn && <p className="greeting">Welcome, {fullName}</p>}

      {loading && <p>Loading requests...</p>}
      {error && <p className="error">Error: {error}</p>}


      {!loading && !error && rentRequests && rentRequests.length > 0 ? (
        <table className="request-table">
          <thead>
            <tr>
              <th>Tenant Name</th>
              <th>Room Name</th>
              <th>Address</th>
              <th>Status</th>
              <th>View Room</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rentRequests.map((request) => (
              <tr key={request.id}>
                <td>
                  <div className="request-info">
                    <img
                      src={request.image || "https://via.placeholder.com/50"}
                      alt={request.fullName}
                      className="request-image"
                      onClick={() => handleImageClick(request)}
                    />

                    <span>{fullName}</span>

                    <span>{request.fullName}</span>

                  </div>
                </td>
                <td>{request.title}</td>
                <td>{request.addressDetails}</td>
                <td>{request.status}</td>
                <td>
                  <button
                    className="view-details-btn"
                    onClick={() => handleImageClick(request)}
                  >
                    View Room
                  </button>
                </td>
                <td>
                  <button className="accept-btn">Accept</button>
                  <button className="reject-btn">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && !error && <p>No rent requests found.</p>
      )}

      {/* Modal hiển thị chi tiết người gửi yêu cầu */}
      {isModalOpen && selectedRequest && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-image-container">
              <img
                src={selectedRequest.image || "https://via.placeholder.com/100"}
                alt={selectedRequest.fullName}
                className="modal-image"
              />
            </div>
            <h3>{selectedRequest.fullName}</h3>
            <div className="modal-details">
              <p>
                <strong>Phone:</strong> {selectedRequest.phone}
              </p>
              <p>
                <strong>Role:</strong> {selectedRequest.role}
              </p>
              <p>
                <strong>Gender:</strong> {selectedRequest.gender}
              </p>
              <p>
                <strong>Email:</strong> {selectedRequest.email}
              </p>
            </div>
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
