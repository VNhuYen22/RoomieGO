import React, { useState } from "react";
import "./css/RegisterForm.css";

const RegisterForm = ({ onClose, onRegister }) => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    addressDetails: "",
    price: "",
    roomSize: "",
    numBedrooms: "",
    numBathrooms: "",
    availableFrom: "",
    city: "",
    district: "",
    ward: "",
    street: "",
    imageFile: null,
    description: "",
    isRoomAvailable: true,
  });

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    
    if (name === "image" && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        imageFile: files[0],
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("authToken");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
    try {
      // Always use FormData for consistency
      const form = new FormData();
      form.append("title", formData.title);
      form.append("location", formData.location);
      form.append("addressDetails", formData.addressDetails);
      form.append("price", formData.price);
      form.append("roomSize", formData.roomSize);
      form.append("numBedrooms", formData.numBedrooms);
      form.append("numBathrooms", formData.numBathrooms);
      form.append("availableFrom", formData.availableFrom);
      form.append("city", formData.city);
      form.append("district", formData.district);
      form.append("ward", formData.ward);
      form.append("street", formData.street);
      form.append("description", formData.description);
      form.append("isRoomAvailable", formData.isRoomAvailable);
      
      // Only append image if it exists
      if (formData.imageFile) {
        form.append("image", formData.imageFile);
      }
  
      const response = await fetch("http://localhost:8080/api/rooms", {
        method: "POST",
        headers: headers, // Don't set Content-Type with FormData
        body: form,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create room");
      }
  
      const data = await response.json();
      onRegister(data.data); // Assuming the response structure is { data: roomData }
      onClose(); // Close the form after successful submission
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Tạo phòng thất bại: " + error.message);
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
              { label: "Address", name: "addressDetails" },
              { label: "Price", name: "price" },
              { label: "Room Size", name: "roomSize" },
              { label: "Number Of Bedrooms", name: "numBedrooms" },
              { label: "Number Of Bathrooms", name: "numBathrooms" },
              { label: "Available From", name: "availableFrom", type: "date" },
              { label: "City", name: "city" },
              { label: "District", name: "district" },
              { label: "Ward", name: "ward" },
              { label: "Street", name: "street" },
            ].map(({ label, name, type = "text" }) => (
              <div className="form-field" key={name}>
                <label>{label}</label>
                <input
                  type={type}
                  name={name}
                  placeholder={label}
                  value={formData[name] || ""}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div className="form-field">
              <label>Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
              {/* Preview image */}
              {formData.imageFile && (
                <img
                  src={URL.createObjectURL(formData.imageFile)}
                  alt="Preview"
                  style={{
                    marginTop: "10px",
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>

            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>Room Availability</label>
              <input
                type="checkbox"
                name="isRoomAvailable"
                checked={formData.isRoomAvailable}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
            <button type="submit" className="register-btn1">
              Register
            </button>
            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;