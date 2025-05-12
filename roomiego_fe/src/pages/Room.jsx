import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import room1 from "../assets/room1.jpeg";
import room2 from "../assets/room2.jpeg";
import room3 from "../assets/room3.jpeg";
import SearchBar from "../components/SearchBar";
import "../styles/Room.css";
function Room() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const fetchRooms = () => {
    fetch("http://localhost:8080/api/rooms")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        setRooms(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const getValidImageUrl = (url) => {
    if (!url || typeof url !== "string" || url.trim() === "") {
      const defaultImages = [room1, room2, room3];
      const randomIndex = Math.floor(Math.random() * defaultImages.length);
      return defaultImages[randomIndex];
    }
    return url;
  };

  const sortedRooms = [...rooms];
  if (sortOrder === "asc") {
    sortedRooms.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "desc") {
    sortedRooms.sort((a, b) => b.price - a.price);
  }

  if (loading) return <p>Loading rooms...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="body">
      
      
      <SearchBar onSortChange={handleSortChange} />
      <div className="text_title"><h3>Phòng phù hợp </h3> </div>
      <div className="room-grid">
      
        {sortedRooms.length === 0 ? (
          <p>No rooms found.</p>
        ) : (
          sortedRooms.map((room) => (
            <Link to={`/ResultRoom/${room.id}`} className="card-link" key={room.id}>
              <div className="card">
                <div className="card-header">
                  <img
                    src={getValidImageUrl(room.imageUrls[0])}
                    alt="User"
                    className="card-image"
                    onError={(e) => {
                      e.target.src = getValidImageUrl("");
                    }}
                  />
                  <div className="card-info">
                    <h3>{room.title}</h3>
                    <span>{new Date(room.availableFrom).toLocaleDateString()}</span>
                  </div>
                </div>

                <img
                  src={getValidImageUrl(room.imageUrls[0])}
                  alt="Room"
                  className="card-image_big"
                  onError={(e) => {
                    e.target.src = getValidImageUrl("");
                  }}
                />

                <div className="card-body">
                  <p>{room.description}</p>
                  <h2>{room.price?.toLocaleString() ?? "Giá không có sẵn"} vnđ / Tháng</h2>
                  <p>{room.roomSize} m²</p>

                  <div className="additional-images">
                    {Array.from(new Set(room.imageUrls)).map((url, index) => (
                      <img
                        key={index}
                        src={getValidImageUrl(url)}
                        alt={`room additional ${index}`}
                        className="additional-room-image"
                        onError={(e) => {
                          e.target.src = getValidImageUrl("");
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Room;
