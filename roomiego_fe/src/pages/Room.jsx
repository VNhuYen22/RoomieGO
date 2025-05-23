import React, { useEffect, useState } from "react";
import "../styles/Room.css";
import { Link } from "react-router-dom";
import room1 from "../assets/room1.jpeg";
import room2 from "../assets/room2.jpeg";
import room3 from "../assets/room3.jpeg";

const baseURL = "http://localhost:8080/images/";

function Room() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    price: 500,
    location: "all",
    roomFor: "any-room"
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const applyFilters = () => {
    fetch(`http://localhost:8080/api/rooms?price=${filters.price}&location=${filters.location}&roomFor=${filters.roomFor}`)
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
        setRooms(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    applyFilters(); // Run once on mount
  }, []);

  const getValidImageUrl = (url) => {
    if (!url || typeof url !== "string" || url.trim() === "") {
      const defaultImages = [room1, room2, room3];
      const randomIndex = Math.floor(Math.random() * defaultImages.length);
      return defaultImages[randomIndex];
    }
    return baseURL + url;
  };

  if (loading) return <p>Loading rooms...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="body">
      <div className="filter-section">
        <h3>Filter</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyFilters();
          }}
        >
          <div className="filter-group">
            <label htmlFor="price">Price Range:</label>
            <input
              type="range"
              id="price"
              name="price"
              min="0"
              max="500"
              value={filters.price}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="location">Location:</label>
            <select
              id="location"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
            >
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
                <input
                  type="radio"
                  id="any-room"
                  name="roomFor"
                  value="any-room"
                  checked={filters.roomFor === "any-room"}
                  onChange={handleFilterChange}
                />
                <label htmlFor="any-room">Any room</label>
              </li>
              <li>
                <input
                  type="radio"
                  id="large-room"
                  name="roomFor"
                  value="large-room"
                  checked={filters.roomFor === "large-room"}
                  onChange={handleFilterChange}
                />
                <label htmlFor="large-room">Large room</label>
              </li>
              <li>
                <input
                  type="radio"
                  id="small-room"
                  name="roomFor"
                  value="small-room"
                  checked={filters.roomFor === "small-room"}
                  onChange={handleFilterChange}
                />
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
        rooms.map((room) => {
        const mainImageUrl =
        room.imageUrls?.length > 0 ? getValidImageUrl(room.imageUrls[0]) : getValidImageUrl("");
        const sideImageUrls = [mainImageUrl]; 
          return (
            <Link to={`/ResultRoom/${room.id}`} className="card-link" key={room.id}>
              <div className="card">
                <div className="card-header">
                  <img
                    src={mainImageUrl}
                    alt={room.title}
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

                <div className="card-body">

                  <div className="additional-images">
                  {sideImageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${room.title} additional ${index}`}
                      className="additional-room-image"
                      onError={(e) => {
                        e.target.src = getValidImageUrl("");
                      }}
                    />
                  ))}
                  <h2>{room.price} VND / Tháng</h2>
                  <p>{room.roomSize} m²</p>
                  <p>{room.location}</p>
                  <p>{room.description}</p>

                </div>
                </div>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
}

export default Room;
