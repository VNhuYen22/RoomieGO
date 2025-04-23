import { useState } from "react";
import '../styles/Login.css';
import vidBeach from "../assets/beach.mp4";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Nữ");
  const [dob, setDob] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("OWNER");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form

    // Kiểm tra dữ liệu đầu vào
    if (password.length < 6 || email.trim() === "") {
      setError("Vui lòng nhập đầy đủ thông tin và mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    try {
      // Tạo payload dữ liệu
      let data = {
        email: email,
        role: role,
        gender: gender,
        fullName: fullName,
        password: password,
        phone: phone,
        bio: bio,
        dob: dob
      };

      // Gửi yêu cầu POST đến API
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Kiểm tra phản hồi từ API
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Đăng ký thất bại");
      }

      const result = await response.json();
      console.log("Đăng ký thành công:", result);
      setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
      setError("");

      // Reset form
      setEmail("");
      setPassword("");
      setFullName("");
      setPhone("");
      setGender("Nữ");
      setDob("");
      setBio("");
      setRole("OWNER");
    } catch (err) {
      // Xử lý lỗi
      console.error("Lỗi khi đăng ký:", err);
      setError(err.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại.");
      setSuccess("");
    }
  };

  return (
    <div className="login-wrapper">
      {/* Video nền động */}
      <video autoPlay muted loop id="bg-video">
        <source src={vidBeach} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ video.
      </video>

      {/* Overlay tối nhẹ trên video */}
      <div className="video-overlay"></div>

      {/* Nội dung chính */}
      <div className="login-container">
        <div className="login-box">
          <div className="login-image">
            <img 
              src="https://storage.googleapis.com/a1aa/image/pIX598hLKNAAlo-PMfaRY2XfJQXo-I6fQbAqm6H-2T4.jpg" 
              alt="Modern Apartment" 
            />
            <div className="overlay">
              <h1>RoomieGoo</h1>
            </div>
          </div>
          <div className="login-form">
            <h2>Đăng ký tài khoản</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu</label>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Vai trò</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  required
                >
                  <option className="option-role" value="OWNER">OWNER</option>
                  <option className="option-role" value="RENTER">RENTER</option>
                </select>
              </div>
              <div className="form-group">
                <label>Họ và tên</label>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input 
                  type="text" 
                  placeholder="Phone Number" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Giới tính</label>
                <select 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)} 
                  required
                >
                  <option value="Nữ">Nữ</option>
                  <option value="Nam">Nam</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ngày sinh</label>
                <input 
                  type="date" 
                  value={dob} 
                  onChange={(e) => setDob(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Tiểu sử</label>
                <textarea 
                  placeholder="Bio" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="login-btn">Đăng ký</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}