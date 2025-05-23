import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/Result_Room.css";
import { axiosInstance } from "../lib/axios";
// import { useNotifications } from "../components/NotificationComponent/NotificationContext";

function Result_Room() {
  const { id } = useParams();
  // const { sendNotification, isConnected } = useNotifications(); 

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const [showViewRequestForm, setShowViewRequestForm] = useState(false);
  const [viewRequestMessage, setViewRequestMessage] = useState("");

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:8080/api/rooms/${id}`);
        const roomData = response.data.data;
        if (roomData && roomData.price != null) {
          setRoom(roomData);
        } else {
          setError("Dữ liệu phòng không hợp lệ.");
        }
      } catch (err) {
        console.error("Error fetching room details:", err.message);
        setError("Failed to fetch room details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  const handleReportSubmit = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Bạn cần đăng nhập để gửi báo cáo.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId: room.id,
          reason: reportReason,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Đã gửi báo cáo thành công.");
      setShowReportForm(false);
      setReportReason("");
    } catch (error) {
      alert("Gửi báo cáo thất bại.");
      console.error("Error submitting report:", error);
    }
  };

 const handleSendViewRequest = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Vui lòng đăng nhập để gửi yêu cầu.");
      return;
    }

    if (!viewRequestMessage.trim()) {
      alert("Vui lòng nhập lời nhắn.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/view-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId: room.id,
          message: viewRequestMessage,
        }),
      });

      if (!response.ok) throw new Error("Gửi yêu cầu thất bại");

      alert("Gửi yêu cầu thành công.");
      setShowViewRequestForm(false);
      setViewRequestMessage("");

      // const ownerId = room.ownerId;
      // if (ownerId) {
      //   if (isConnected) {
      //     sendNotification(ownerId, "Bạn có một yêu cầu xem phòng mới từ người thuê.", "VIEW_REQUEST");
      //   } else {
      //     let retryCount = 0;
      //     const maxRetries = 3;
      //     const retryInterval = 2000; // 2 seconds

      //     const attemptNotification = () => {
      //       if (retryCount < maxRetries) {
      //         retryCount++;
      //         console.log(`Attempting to send notification (attempt ${retryCount}/${maxRetries})...`);
              
      //         if (isConnected) {
      //           sendNotification(ownerId, "Bạn có một yêu cầu xem phòng mới từ người thuê.", "VIEW_REQUEST");
      //         } else {
      //           setTimeout(attemptNotification, retryInterval);
      //         }
      //       } else {
      //         console.warn("Failed to send notification after maximum retries");
      //       }
      //     };

      //     attemptNotification();
      //   }
      // }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi gửi yêu cầu.");
    }
  };

  if (loading) return <p>Loading room details...</p>;
  if (error) return <p>{error}</p>;
  if (!room) return <p>Không tìm thấy phòng.</p>;

  const baseURL = "http://localhost:8080/images/";
  const mainImageUrl = room.imageUrls?.length > 0 ? baseURL + room.imageUrls[0] : "/default-room.jpg";
  const sideImageUrls = room.imageUrls?.slice(1).map((url) => baseURL + url);

  return (
    <div className="result-room">
      <div className="breadcrumb">
        <Link to="/Room">Room</Link> / <span>Room Details</span>
      </div>

      <h1 className="hotel-title">{room.title}</h1>
      <p className="hotel-location">{room.addressDetails}</p>

      <div className="image-gallery">
        <div className="main-image">
          <img src={mainImageUrl} alt="Main Room" />
        </div>
        <div className="side-images">
          {sideImageUrls?.map((url, index) => (
            <img key={index} src={url} alt={`Room ${index + 1}`} />
          ))}
        </div>
      </div>

      <div className="detail-room">
        <div className="detail_about-place">
          <h2>About this place</h2>
          <p>{room.description}</p>
          <div className="room-details">
            <span><strong>Room Size:</strong> {room.roomSize} m²</span>
            <span><strong>Bedrooms:</strong> {room.numBedrooms}</span>
            <span><strong>Bathrooms:</strong> {room.numBathrooms}</span>
          </div>
          <p><strong>Available From:</strong> {new Date(room.availableFrom).toLocaleDateString()}</p>
          <p><strong>Is Available:</strong> {room.isRoomAvailable ? "Yes" : "No"}</p>
        </div>

        <div className="detail_price-booking">
          <h4>Gửi yêu cầu xem phòng</h4>
          <span>${room.price.toLocaleString()} per Month</span>
          <button onClick={() => setShowViewRequestForm(true)}>Gửi yêu cầu xem phòng</button>
        </div>

        <button onClick={() => setShowReportForm(true)}>Báo cáo bài viết</button>

        {showReportForm && (
          <div className="report-overlay">
            <div className="report-form">
              <h3>Báo cáo bài viết</h3>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Nhập lý do báo cáo..."
              />
              <div className="report-buttons">
                <button onClick={handleReportSubmit}>Gửi báo cáo</button>
                <button onClick={() => setShowReportForm(false)}>Hủy</button>
              </div>
            </div>
          </div>
        )}

        {showViewRequestForm && (
          <div className="report-overlay">
            <div className="report-form">
              <h3>Yêu cầu xem phòng</h3>
              <textarea
                value={viewRequestMessage}
                onChange={(e) => setViewRequestMessage(e.target.value)}
                placeholder="Nhập lời nhắn cho chủ phòng..."
              />
              <div className="report-buttons">
                <button onClick={handleSendViewRequest}>Gửi yêu cầu</button>
                <button onClick={() => setShowViewRequestForm(false)}>Hủy</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Result_Room;
