import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/Result_Room.css";
import { axiosInstance } from "../lib/axios";
import sink from "../assets/sink.png";
import bedrooms from "../assets/bedroom.png";
function Result_Room() {
  const { id } = useParams(); // Lấy id từ URL

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [hasBooked, setHasBooked] = useState(false); // Trạng thái đã gửi yêu cầu
  
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

  const handleBookNow = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Bạn cần đăng nhập để đặt phòng.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/rent-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId: room.id,
        }),
      });
      // Log the response object
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Yêu cầu đặt phòng đã được gửi thành công!");
      setHasBooked(true); // Ngăn gửi trùng
    } catch (error) {
      console.error("Error sending booking request:", error);
      alert("Đặt phòng thất bại. Vui lòng thử lại.");
    }
  };

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
  if (loading) return <p>Loading room details...</p>;
  if (error) return <p>{error}</p>;
  if (!room) return <p>Không tìm thấy phòng.</p>;
  const baseURL = "http://localhost:8080/images/";
  const mainImageUrl =
    room.imageUrls?.length > 0
      ? baseURL + room.imageUrls[0]
      : "/default-room.jpg";

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
            <span><img src={bedrooms} alt="" /><strong>Bedrooms:</strong> {room.numBedrooms}</span>
            <span><img src={sink} alt="" /><strong>Bathrooms:</strong> {room.numBathrooms}</span>
          </div>
          <p><strong>Available From:</strong> {new Date(room.availableFrom).toLocaleDateString()}</p>
          <p><strong>Is Available:</strong> {room.isRoomAvailable ? "Yes" : "No"}</p>
        </div>

        <div className="detail_price-booking">
          <h4>Start Booking</h4>
          <span>${room.price.toLocaleString()} per Month</span>
          <div className="contact-button">
            <button>Chat Now!</button>
            <button onClick={handleBookNow} disabled={hasBooked}>
              {hasBooked ? "Đã gửi yêu cầu" : "Book Now!"}
            </button>
          </div>
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
      </div>
    </div>
  );
}
}
export default Result_Room;
