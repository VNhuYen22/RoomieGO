import React, { useState } from "react";
import './RoommateForm.css';
import { useNavigate } from 'react-router-dom';

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
  
      const createResponse = await fetch('http://localhost:8080/api/roommates', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5ZW5xdWFvMjJAZ21haWwuY29tIiwiaWF0IjoxNzQ1MjU0MDA3LCJleHAiOjE3NDUzNDA0MDd9.MoZJDkEiHbqUooPmSbcZjsExptpZL0eQVIzcVMV0y86-aVs5VjTu3oK_H2wFStoZRSVNvnTUmcHGCVF3RAM-iw`,
          'Content-Type': 'application/json' 
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
          'Authorization': `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5ZW5xdWFvMjJAZ21haWwuY29tIiwiaWF0IjoxNzQ1MjU0MDA3LCJleHAiOjE3NDUzNDA0MDd9.MoZJDkEiHbqUooPmSbcZjsExptpZL0eQVIzcVMV0y86-aVs5VjTu3oK_H2wFStoZRSVNvnTUmcHGCVF3RAM-iw`, // Thêm header Authorization với token
          'Content-Type': 'application/json', // Thêm Content-Type nếu cần thiết
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
        <input
          type="text"
          name="hometown"
          value={formData.hometown}
          onChange={handleChange}
          required
        />

        <label>Nơi bạn muốn thuê (Thành Phố):</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />

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

        <label>Hãy chọn căn phòng mà bạn mong muốn?</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="rateImage"
              value="1"
              checked={formData.rateImage === "1"}
              onChange={handleChange}
            />
            1
          </label>
          <label>
            <input
              type="radio"
              name="rateImage"
              value="2"
              checked={formData.rateImage === "2"}
              onChange={handleChange}
            />
            2
          </label>
          <label>
            <input
              type="radio"
              name="rateImage"
              value="3"
              checked={formData.rateImage === "3"}
              onChange={handleChange}
            />
            3
          </label>
          <label>
            <input
              type="radio"
              name="rateImage"
              value="4"
              checked={formData.rateImage === "4"}
              onChange={handleChange}
            />
            4
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
        <label>User ID:</label>
        <input
          type="number"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          required
        />


        <button type="submit">Tìm người phù hợp</button>
      </form>

    </div>
  );
};

export default RoommateForm;
