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
    imageFiles: [],
    description: "",
    isRoomAvailable: true,
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    
    if (name === "images" && files.length > 0) {
      const newImageFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        imageFiles: newImageFiles,
      }));

      const newPreviews = newImageFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  React.useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("authToken");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
  
    try {
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
      
        formData.imageFiles.forEach(file => {
        form.append("images", file);
      });
  
      const response = await fetch("http://localhost:8080/api/rooms", {
        method: "POST",
        headers: headers,
        body: form,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create room");
      }
  
      const data = await response.json();
      onRegister(data.data);
      onClose();
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Tạo phòng thất bại: " + error.message);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="register-form-overlay">
      <div className="register-form">
        <h2>Đăng ký phòng trọ của bạn</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            {[ 
              { label: "Tiêu đề", name: "title" },
              { label: "Vị trí", name: "location" },
              { label: "Địa Chỉ", name: "addressDetails" },
              { label: "Giá", name: "price" },
              { label: "Diện tích phòng", name: "roomSize" },
              { label: "Số phòng ngủ", name: "numBedrooms" },
              { label: "Số phòng tắm", name: "numBathrooms" },
              { label: "Có sẵn từ", name: "availableFrom", type: "date" },
              { label: "Thành phố", name: "city" },
              { label: "Quận/Huyện", name: "district" },
              { label: "Phường/Xã", name: "ward" },
              { label: "Đường phố", name: "street" },
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

            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>Hình ảnh (có thể chọn nhiều ảnh)</label>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleChange}
              />
              {imagePreviews.length > 0 && (
                <div className="image-preview-grid">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview-container">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="image-preview"
                      />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>Mô tả</label>
              <textarea
                name="description"
                placeholder="Mô tả chi tiết"
                value={formData.description || ""}
                onChange={handleChange}
              />
            </div>

            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label>Tình trạng phòng trọ</label>
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
              Đăng Ký
            </button>
            <button type="button" onClick={onClose}>
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;