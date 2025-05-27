import React, { useState } from "react";
import { createPortal } from "react-dom";
import "./css/EditForm.css"; // Ensure the CSS file is imported

const EditForm = ({ hotel, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ ...hotel });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/api/rooms/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update room");
      }

      const data = await response.json();
      onUpdate(data.body); // Pass updated room data to parent
      onClose(); // Close the form after successful update
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Ensure the portal renders only when `document.body` exists
  if (typeof window === "undefined" || !document.body) return null;

  return createPortal(
    <div className="edit-form-overlay">
      <div className="edit-form">
        <h2>Edit Room Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            {[ 
              { label: "Title", name: "title" },
              { label: "Location", name: "location" },
              { label: "Address Details", name: "addressDetails" },
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
              <label>Phòng trọ còn trống</label>
              <input
                type="checkbox"
                name="isRoomAvailable"
                checked={formData.isRoomAvailable}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isRoomAvailable: !prev.isRoomAvailable,
                  }))
                }
              />
            </div>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
            <button type="submit" className="update-btn" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditForm;
