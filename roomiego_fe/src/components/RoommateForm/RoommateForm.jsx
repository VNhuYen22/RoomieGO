import React, { useState } from "react";
import './RoommateForm.css';

const RoommateForm = () => {
  // Khởi tạo state cho form data với các giá trị mặc định
  const [formData, setFormData] = useState({
    sex: "Nam", // Giới tính mặc định là Nam
    dob: "", // Năm sinh
    hometown: "", // Quê quán
    job: "", // Nghề nghiệp
    hobbies: [], // Sở thích (là một mảng)
    more: "", // Mô tả thêm
  });

  // State để lưu trữ kết quả match từ API
  const [match, setMatch] = useState(null);

  // Hàm xử lý sự kiện thay đổi trên các input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Nếu là checkbox (sở thích)
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        hobbies: checked // Nếu checkbox được chọn
          ? [...prev.hobbies, value] // Thêm value vào mảng hobbies
          : prev.hobbies.filter((h) => h !== value), // Ngược lại, lọc bỏ value khỏi mảng hobbies
      }));
    }
    // Nếu không phải checkbox
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Cập nhật giá trị của input vào state
      }));
    }
  };

  // Hàm xử lý sự kiện submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form (reload trang)

    // Kết nối API để tìm người phù hợp
    try {
      const response = await fetch("/submit", { // Gửi POST request đến endpoint /submit
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Thiết lập header để báo cho server biết đang gửi dữ liệu JSON
        body: JSON.stringify(formData), // Chuyển đổi formData thành chuỗi JSON và gửi đi
      });

      // Kiểm tra nếu response trả về lỗi
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // Đọc dữ liệu JSON từ response
      setMatch(result.match); // Cập nhật state match với kết quả trả về từ API
    } catch (error) {
      console.error("Có lỗi xảy ra khi gọi API:", error);
      // Xử lý lỗi, ví dụ: hiển thị thông báo cho người dùng
    }
  };

  return (
    <div className="roommate-form">
      <h2>Thông tin Roommate</h2>
      <form onSubmit={handleSubmit}> {/* Gọi hàm handleSubmit khi submit form */}
        <label>Giới tính:</label>
        <select name="sex" value={formData.sex} onChange={handleChange}>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>

        <label>Năm sinh:</label>
        <input
          type="number"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />

        <label>Quê quán:</label>
        <input
          type="text"
          name="hometown"
          value={formData.hometown}
          onChange={handleChange}
          required
        />

        <label>Nghề nghiệp:</label>
        <input
          type="text"
          name="job"
          value={formData.job}
          onChange={handleChange}
          required
        />

        <label>Sở thích:</label>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="hobbies"
              value="pets"
              checked={formData.hobbies.includes("pets")}
              onChange={handleChange}
            />
            Nuôi thú cưng
          </label>
          <label>
            <input
              type="checkbox"
              name="hobbies"
              value="smoke"
              checked={formData.hobbies.includes("smoke")}
              onChange={handleChange}
            />
            Hút thuốc
          </label>
        </div>

        <label>Mô tả thêm:</label>
        <textarea
          name="more"
          rows="4"
          maxLength="500"
          value={formData.more}
          onChange={handleChange}
        />

        <button type="submit">Tìm người phù hợp</button>
      </form>

      {/* Hiển thị kết quả match nếu có */}
      {match && (
        <>
          <hr />
          <h3>Người phù hợp nhất:</h3>
          <pre>{JSON.stringify(match, null, 2)}</pre> {/* Hiển thị kết quả dưới dạng JSON có format */}
        </>
      )}
    </div>
  );
};

export default RoommateForm;
