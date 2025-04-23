import React, { useState } from "react";
import "./css/RegisterForm.css";

const RegisterForm = ({ onClose, onRegister }) => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    addressDetails: "", // Sửa lại theo dữ liệu API
    price: "",
    roomSize: "",
    numBedrooms: "",
    numBathrooms: "",
    availableFrom: "", // Sửa lại theo dữ liệu API
    imageUrls: [], // Mảng lưu trữ URL hình ảnh
    description: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      // Tạo URL tạm thời cho ảnh được chọn
      const imageURL = URL.createObjectURL(files[0]);
      setFormData((prev) => ({
        ...prev,
        imageUrls: [imageURL], // Lưu vào mảng imageUrls
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("http://localhost:8080/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const data = await response.json();
      onRegister(data.body); // Gọi callback với dữ liệu phòng mới
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Tạo phòng thất bại, vui lòng thử lại.");
    }
  };

  return (
    <div className="register-form-overlay">
      <div className="register-form">
        <h2>Register Your Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            {[ 
              { label: "Title", name: "title" },
              { label: "Location", name: "location" },
              { label: "Address", name: "addressDetails" }, // Đổi thành addressDetails
              { label: "Price", name: "price" },
              { label: "Room Size", name: "roomSize" },
              { label: "Number Of Bedrooms", name: "numBedrooms" },
              { label: "Number Of Bathrooms", name: "numBathrooms" },
              { label: "Available From", name: "availableFrom", type: "date" }, // Thay đổi checkInDate thành availableFrom
            ].map(({ label, name, type = "text" }) => (
              <div className="form-field" key={name}>
                <label>{label}</label>
                <input
                  type={type}
                  name={name}
                  placeholder={label}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div className="form-field">
              <label>Image</label>
              <input type="file" name="image" onChange={handleChange} />
            </div>

            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>Description</label>
              <textarea name="description" placeholder="Description" onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
            <button type="submit" className="register-btn1">Register</button>
            <button type="button" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
