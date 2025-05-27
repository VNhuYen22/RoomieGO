import React, { useState } from "react";
import "./css/BookingCard.css";

const BookingCard = ({ initialHotel, onEditClick, onDeleteClick }) => {
  const [hotelInfo] = useState(initialHotel);

  return (
    <div className="booking-card">
      <div className="booking-image">
        <img
            src={
              hotelInfo.imageUrls?.length
                ? `http://localhost:8080/images/${hotelInfo.imageUrls[0]}`
                : "/default-room.jpg"
            }
            alt={hotelInfo.title}
          />
        <div className="price-tag">{hotelInfo.price} VND/Tháng</div>
      </div>
      <div className="booking-info">
        <div className="hotel-name">{hotelInfo.title}</div>
        <div className="hotel-location">{hotelInfo.location}</div>
        <div>Có sẵn từ: {hotelInfo.availableFrom}</div>
        <div>Diện tích: {hotelInfo.roomSize}m²</div>
        <div>Phòng ngủ: {hotelInfo.numBedrooms} | Phòng tắm: {hotelInfo.numBathrooms}</div>
        <div>{hotelInfo.addressDetails}</div>
        <div>Mô tả: {hotelInfo.description}</div>
        <div className="card-actions">
          <button className="edit-btn" onClick={() => onEditClick(hotelInfo)}>✏️</button>
          <button className="delete-btn" onClick={onDeleteClick}>🗑️</button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
