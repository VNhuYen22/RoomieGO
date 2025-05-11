import React, { useState } from "react";
import './RoommateForm.css';
import { useNavigate } from 'react-router-dom';
import clean1 from '../../assets/room1.jpeg';
import clean2 from '../../assets/room2.jpeg';
import clean3 from '../../assets/room3.jpeg';
import clean4 from '../../assets/room4.jpeg';

const RoommateForm = () => {
  const navigate = useNavigate();
  // Khởi tạo state cho form data với các giá trị mặc định
  const [formData, setFormData] = useState({
    sex: "Nam", // Giới tính mặc định là Nam, lấy từ token , từ token => user => gender
    hometown: "", // Quê quán
    city: "", // Nơi bạn muốn thuê (thành phố)
    district: "", // Nơi bạn muốn thuê (quận)
    dob: "", // Năm sinh
    job: "", // Nghề nghiệp
    hobbies: [], // Sở thích (là một mảng)
    rateImage: "", // Mức đọ sạch sẽ
    more: "",
    userId: "", // Mô tả thêm
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
    } else if (type === "radio") {
      setFormData((prev) => ({
        ...prev,
        rateImage: value, // Cập nhật giá trị duy nhất cho hobbies
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
    e.preventDefault();
  
    try {
      const dataToSend = {
        // gender: formData.sex, api create roommates không cần truyền gender, cần truyền thêm token
        hometown: formData.hometown,
        city: formData.city,
        district: formData.district,
        yob: formData.dob,
        job: formData.job,
        hobbies: formData.hobbies.join(', '),
        rateImage: formData.rateImage,
        more: formData.more,
        userId: formData.userId ? parseInt(formData.userId) : null, // lấy từ token truyền, bỏ trên UI // đảm bảo là số
      };
  
      console.log('Payload being sent:', dataToSend);
      const token = localStorage.getItem("authToken");
      const createResponse = await fetch('http://localhost:8080/api/roommates', {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!createResponse.ok) {
        throw new Error(`Create roommates failed: ${createResponse.status}`);
      }
  
      const createResult = await createResponse.json();
      console.log('Roommate created:', createResult);
  
      // Step 2: Call Export to file JSON API
      const exportResponse = await fetch('http://localhost:8080/api/roommates/export-to-file', {
        method: 'GET',
        headers: {
         "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!exportResponse.ok) {
        throw new Error(`Export to file JSON failed: ${exportResponse.status}`);
      }
  
      const exportResult = await exportResponse.json();
      console.log('Export result:', exportResult.message, exportResult.filePath);
  
      // Step 3: Call Submit search roommates API
      const formDataToSend = new FormData();
      // formDataToSend.append('gender', formData.sex); không còn lọc ở python nữa vì đã filter ở api export to file của java
      formDataToSend.append('hometown', formData.hometown);
      formDataToSend.append('yob', formData.dob);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('district', formData.district);
      formDataToSend.append('job', formData.job);
      formData.hobbies.forEach(hobby => formDataToSend.append('hobbies', hobby));
      formDataToSend.append('rateImage', formData.rateImage);
      formDataToSend.append('more', formData.more);
  
      const submitResponse = await fetch('http://127.0.0.1:8000/submit', {
        method: 'POST',
        body: formDataToSend,
      });
  
      if (!submitResponse.ok) {
        throw new Error(`Submit search roommates failed: ${submitResponse.status}`);
      }
  
      const responseJson = await submitResponse.json(); // Đảm bảo API trả về JSON
      setMatch(responseJson); // Lưu kết quả JSON vào state
      navigate('/match', { state: { match: responseJson } });
    } catch (error) {
      console.error('Error during API calls:', error);
    }
  };
  
  
  const cities = [
    "Hà Nội", "Hồ Chí Minh", "Hải Phòng", "Đà Nẵng", "Cần Thơ", "An Giang", "Bà Rịa - Vũng Tàu",
    "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương",
    "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông", "Điện Biên",
    "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang",
    "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn",
    "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên",
    "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La",
    "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang",
    "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
  ];
  const cleanImages = [
    { id: "1", src: clean1 },
    { id: "2", src: clean2 },
    { id: "3", src: clean3 },
    { id: "4", src: clean4 },
  ];
  return (
    <div className="roommate-form">
      <h2>Thông tin Roommate</h2>
      <form onSubmit={handleSubmit}> {/* Gọi hàm handleSubmit khi submit form */}
        <label>Giới tính:</label>
        <select name="sex" value={formData.sex} onChange={handleChange}>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>

        <label>Quê quán của bạn:</label>
        <select name="hometown" value={formData.hometown} onChange={handleChange} required>
          <option value="">-- Chọn tỉnh/thành phố --</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
          <label>Nơi bạn muốn thuê (Thành Phố):</label>
          <select name="city" value={formData.city} onChange={handleChange} required>
            <option value="">-- Chọn tỉnh/thành phố --</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

        <label>Nơi bạn muốn thuê (Quận):</label>
        <input
          type="text"
          name="district"
          value={formData.district}
          onChange={handleChange}
          required
        />

        <label>Năm sinh:</label>
        <input
          type="number"
          name="dob"
          value={formData.dob}
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

        <label>Thói quen sinh hoạt:</label>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="hobbies"
              value="Nuôi thú cưng"
              checked={formData.hobbies.includes("Nuôi thú cưng")}
              onChange={handleChange}
            />
            Nuôi thú cưng
          </label>
          <label>
            <input
              type="checkbox"
              name="hobbies"
              value="Hút thuốc"
              checked={formData.hobbies.includes("Hút thuốc")}
              onChange={handleChange}
            />
            Hút thuốc
          </label>
          <label>
            <input
              type="checkbox"
              name="hobbies"
              value="Ăn Chay"
              checked={formData.hobbies.includes("Ăn Chay")}
              onChange={handleChange}
            />
            Ăn Chay
          </label>
        </div>

        <label>Hãy chọn mức độ sạch sẽ bạn mong muốn:</label>
          <div className="radio-group clean-levels">
            {cleanImages.map(({ id, src }) => (
              <label key={id} className={`clean-option ${formData.rateImage === id ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="rateImage"
                  value={id}
                  checked={formData.rateImage === id}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <img
                  src={src}
                  alt={`Mức độ sạch sẽ ${id}`}
                  className="clean-image"
                />
              </label>
            ))}
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

    </div>
  );
};

export default RoommateForm;
