import React, { useEffect, useState } from "react";
import "../styles/Room.css";
import { Link } from "react-router-dom";
import room1 from "../assets/room1.jpeg";
import room2 from "../assets/room2.jpeg";
import room3 from "../assets/room3.jpeg";

function Room() {
  // Khai báo state để lưu danh sách phòng, trạng thái loading và lỗi
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true); // true lúc bắt đầu gọi API
  const [error, setError] = useState(null); // lưu lỗi nếu có

  // useEffect để gọi API khi component mount
  useEffect(() => {
    fetch("http://localhost:8080/api/rooms") // Gọi API từ backend
      .then((res) => {
        // Kiểm tra phản hồi từ server có thành công không (status code 200–299)
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        // Kiểm tra header Content-Type có phải JSON không
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Expected JSON but received: " + contentType);
        }

        // Parse JSON nếu hợp lệ
        return res.json();
      })
      .then((data) => {
        // Gán dữ liệu từ API vào state rooms
        // Giả định server trả về dạng { status, message, data: [...] }
        setRooms(data.data);
        setLoading(false); // Ngừng loading
      })
      .catch((err) => {
        // Ghi nhận lỗi nếu có trong quá trình fetch
        setError(err.message);
        setLoading(false);
      });
  }, []); // [] để đảm bảo chỉ gọi API một lần khi component mount

  // Hàm xử lý URL ảnh phòng – nếu không hợp lệ thì chọn ảnh mặc định ngẫu nhiên
  const getValidImageUrl = (url) => {
    if (!url || typeof url !== "string" || url.trim() === "") {
      const defaultImages = [room1, room2, room3];
      const randomIndex = Math.floor(Math.random() * defaultImages.length);
      return defaultImages[randomIndex];
    }
    return url;
  };

  // Nếu đang loading thì hiển thị thông báo
  if (loading) return <p>Loading rooms...</p>;

  // Nếu có lỗi thì hiển thị lỗi
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="body">
      {/* Khu vực bộ lọc – hiện tại chỉ hiển thị UI, chưa xử lý filter */}
      <div className="filter-section">
        <h3>Filter</h3>
        <form>
          {/* Lọc theo giá tiền */}
          <div className="filter-group">
            <label htmlFor="price">Price Range:</label>
            <input type="range" id="price" name="price" min="0" max="500" />
          </div>

          {/* Lọc theo khu vực */}
          <div className="filter-group">
            <label htmlFor="location">Location:</label>
            <select id="location" name="location">
              <option value="all">All</option>
              <option value="city">City</option>
              <option value="suburb">Suburb</option>
              <option value="rural">Rural</option>
            </select>
          </div>

          {/* Lọc theo loại phòng */}
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

      {/* Nếu không có phòng nào */}
      {rooms.length === 0 ? (
        <p>No rooms found.</p>
      ) : (
        // Hiển thị danh sách các phòng
        rooms.map((room) => (
          <Link to={`/ResultRoom/${room.id}`} className="card-link" key={room.id}>
            <div className="card">
              <div className="card-header">
                {/* Hiển thị ảnh đầu tiên trong mảng imageUrls */}
                <img
                  src={getValidImageUrl(room.imageUrls[0])}
                  alt={room.title}
                  className="card-image"
                  onError={(e) => {
                    // Nếu ảnh lỗi thì fallback về ảnh mặc định
                    e.target.src = getValidImageUrl("Anh");
                  }}
                />
                
                <div className="card-info">
                
                  <h3>{room.title}</h3>
                  {/* Định dạng ngày từ trường availableFrom */}
                  <span>{new Date(room.availableFrom).toLocaleDateString()}</span>
                </div>
              </div>
              <img className="card-image_big" src={getValidImageUrl(room.imageUrls[0]) } />

              <div className="card-body">
                
                <p>{room.description}</p>
                <h2>${room.price} / month</h2>
                <p>{room.roomSize} m²</p>
                

                {/* Hiển thị tất cả ảnh trong imageUrls nếu có – loại trùng lặp bằng Set */}
                <div className="additional-images">
                  {Array.from(new Set(room.imageUrls)).map((url, index) => (
                    <img
                      key={index}
                      src={getValidImageUrl(url)}
                      alt={`${room.title} additional ${index}`}
                      className="additional-room-image"
                      onError={(e) => {
                        e.target.src = getValidImageUrl(""); // fallback nếu lỗi ảnh
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
  );
}

export default Room;
