import React from "react";
import "./css/Request.css";

const Request = () => {
  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const requests = [
    {
      id: 1,
      fullName: "John Doe",
      roomName: "Luxury Apartment in District 1",
      address: "District 1, City Center",
      status: "Pending",
      phone: "123-456-7890",
      role: "Tenant",
      gender: "Male",
      email: "johndoe@example.com",
      image: "https://via.placeholder.com/50",
    },
    {
      id: 2,
      fullName: "Jane Smith",
      roomName: "Affordable Room in District 7",
      address: "District 7, Suburban Area",
      status: "Approved",
      phone: "987-654-3210",
      role: "Tenant",
      gender: "Female",
      email: "janesmith@example.com",
      image: "https://via.placeholder.com/50",
    },
    {
      id: 3,
      fullName: "Michael Johnson",
      roomName: "Room near University",
      address: "District 5, Near University",
      status: "Rented",
      phone: "555-555-5555",
      role: "Tenant",
      gender: "Male",
      email: "michaeljohnson@example.com",
      image: "https://via.placeholder.com/50",
    },
  ];

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
      <table className="request-table">
        <thead>
          <tr>
            <th>Tenant Name</th>
            <th>Room Name</th>
            <th>Address</th>
            <th>Status</th>
            <th>View Room</th> {/* Thêm cột View Details */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>
                <div className="request-info">
                  <img
                    src={request.image}
                    alt={request.fullName}
                    className="request-image"
                    onClick={() => handleImageClick(request)}
                  />
                  <span>{request.fullName}</span>
                </div>
              </td>
              <td>{request.roomName}</td>
              <td>{request.address}</td>
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

      {/* Modal */}
      {isModalOpen && selectedRequest && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-image-container">
              <img
                src={selectedRequest.image}
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