import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Result_Room.css";

function Result_Room() {
  const { id } = useParams(); // Lấy id từ URL
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/rooms/${id}`);
        setRoom(response.data.data); // Gán dữ liệu phòng vào state
        setLoading(false);
      } catch (err) {
        console.error("Error fetching room details:", err.message);
        setError("Failed to fetch room details.");
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  if (loading) return <p>Loading room details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="result-room">
      <div className="breadcrumb">
        <Link to="/Room">Room</Link> / <span>Room Details</span>
      </div>

      <h1 className="hotel-title">{room.title}</h1>
      <p className="hotel-location">{room.addressDetails}</p>

      <div className="image-gallery">
        <div className="main-image">
          {room.imageUrls.length > 0 ? (
            <img src={room.imageUrls[0]} alt="Main Room" />
          ) : (
            <p>No images available</p>
          )}
        </div>
        <div className="side-images">
          {room.imageUrls.slice(1).map((url, index) => (
            <img key={index} src={url} alt={`Room ${index + 1}`} />
          ))}
        </div>
      </div>

      <div className="detail-room">
        <div className="detail_about-place">
          <h2>About this place</h2>
          <p>{room.description}</p>
          <div className="room-details">
            <span>
              <strong>Room Size:</strong> {room.roomSize} m²
            </span>
            <span>
              <strong>Bedrooms:</strong> {room.numBedrooms}
            </span>
            <span>
              <strong>Bathrooms:</strong> {room.numBathrooms}
            </span>
          </div>
         
          <p>
            <strong>Available From:</strong>{" "}
            {new Date(room.availableFrom).toLocaleDateString()}
          </p>
          <p>
            <strong>Is Available:</strong>{" "}
            {room.isRoomAvailable ? "Yes" : "No"}
          </p>
        </div>
        <div className="detail_price-booking">
          <h4>Start Booking</h4>
          <span>${room.price.toLocaleString()} per Month</span>
          <button>Book Now!</button>
        </div>
      </div>
    </div>
  );
}

export default Result_Room;