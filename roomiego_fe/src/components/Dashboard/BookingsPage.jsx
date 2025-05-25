import React, { useState, useEffect } from "react";
import BookingCard from "./BookingCard";
import FilterBar from "./FilterBar";
import RegisterForm from "./RegisterForm";
import EditForm from "./EditForm";
import "./css/BookingsPage.css";

const BookingsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null); // <--- Thêm state này

  // ...fetch hotels như cũ
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) return;

    const fetchMyRooms = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/rooms/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Không thể lấy danh sách phòng");
        const result = await response.json();
        console.log("Dữ liệu lấy được từ API:", result);
        // Lưu dữ liệu từ 'data' vào state 'hotels'
        setHotels(Array.isArray(result?.data) ? result.data : []);
      } catch (err) {
        console.error("Lỗi khi fetch danh sách phòng:", err);
      }
    };

    fetchMyRooms();
  }, [token]);
  const handleAddHotel = (newHotel) => {
    setHotels((prev) => [...prev, newHotel]);
    setShowRegisterForm(false);
  };

  const handleEditClick = (hotel) => setEditingHotel(hotel); // <--- Hàm này để truyền xuống BookingCard

  const handleUpdateHotel = (updatedHotel) => {
    setHotels((prev) =>
      prev.map((h) => (h.id === updatedHotel.id ? updatedHotel : h))
    );
    setEditingHotel(null);
  };
  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm("Bạn có chắc muốn xóa phòng này?")) return;
  
    try {
      const response = await fetch(`http://localhost:8080/api/rooms/${hotelId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Xóa phòng thất bại");
      }
  
      setHotels((prev) => prev.filter((hotel) => hotel.id !== hotelId));
    } catch (err) {
      alert("Lỗi khi xóa phòng: " + err.message);
    }
  };
  return (
    <div className="BookingsPage-content">
      <FilterBar onAddClick={() => setShowRegisterForm(true)} />
      {showRegisterForm && (
        <RegisterForm
          onClose={() => setShowRegisterForm(false)}
          onRegister={handleAddHotel}
        />
      )}
      {editingHotel && (
        <EditForm
          hotel={editingHotel}
          onClose={() => setEditingHotel(null)}
          onUpdate={handleUpdateHotel}
        />
      )}
      <div className="booking-list">
        {hotels?.length > 0 ? (
          hotels.map((hotel) => (
            <BookingCard
              key={hotel.id}
              initialHotel={hotel}
              onEditClick={handleEditClick}
              onDeleteClick={() => handleDeleteHotel(hotel.id)}
            />
          ))
        ) : (
          <p>Chưa có phòng nào được đăng.</p>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
