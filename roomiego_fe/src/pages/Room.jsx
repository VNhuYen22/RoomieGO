import React, { useEffect, useState } from "react";
import "../styles/Room.css";
import { Link } from "react-router-dom";
import room1 from "../assets/room1.jpeg";
import room2 from "../assets/room2.jpeg";
import room3 from "../assets/room3.jpeg";

function Room() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/rooms")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Expected JSON but received: " + contentType);
        }
        return res.json();
      })
      .then((data) => {
        setRooms(data.data); // giả định { status, message, data }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getValidImageUrl = (url) => {
    // Nếu URL không hợp lệ hoặc trống, trả về một ảnh mặc định ngẫu nhiên từ các ảnh có sẵn
    if (!url || typeof url !== "string" || url.trim() === "") {
      const defaultImages = [room1, room2, room3];
      const randomIndex = Math.floor(Math.random() * defaultImages.length);
      return defaultImages[randomIndex]; // Trả về ảnh ngẫu nhiên từ danh sách mặc định
    }
    return url;
  };

  if (loading) return <p>Loading rooms...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="body">
      <div className="filter-section">
        <h3>Filter</h3>
        <form>
          <div className="filter-group">
            <label htmlFor="price">Price Range:</label>
            <input type="range" id="price" name="price" min="0" max="500" />
          </div>

          <div className="filter-group">
            <label htmlFor="location">Location:</label>
            <select id="location" name="location">
              <option value="all">All</option>
              <option value="city">City</option>
              <option value="suburb">Suburb</option>
              <option value="rural">Rural</option>
            </select>
          </div>

          <div className="room-for">
            <h3>Rooms for</h3>
            <ul className="room-for-list">
              <li>
                <input type="radio" id="any-room" name="room-for" value="any-room" />
                <label htmlFor="any-room">Any room</label>
              </li>
              <li>
                <input type="radio" id="large-room" name="room-for" value="large-room" />
                <label htmlFor="large-room">Large room</label>
              </li>
              <li>
                <input type="radio" id="small-room" name="room-for" value="small-room" />
                <label htmlFor="small-room">Small room</label>
              </li>
            </ul>
          </div>

          <button type="submit" className="filter-button">
            Apply Filter
          </button>
        </form>
      </div>

      {rooms.length === 0 ? (
        <p>No rooms found.</p>
      ) : (
        rooms.map((room) => (
          <Link to="/ResultRoom" className="card-link" key={room.id}>
            <div className="card">
              <div className="card-header">
                <img
                  src={getValidImageUrl(room.imageUrl)}
                  alt={room.title}
                  className="card-image"
                  onError={(e) => {
                    e.target.src = getValidImageUrl(""); // Fallback to random default image if error occurs
                  }}
                />
                <div className="card-info">
                  <h3>{room.title}</h3>
                  <span>{room.availableDate}</span>
                </div>
              </div>
              <div className="card-body">
                <h2>${room.price} / mo</h2>
                <p>{room.description}</p>
                <p>{room.rentalPeriod}</p>
                <p>{room.location}</p>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export default Room;
