import { useState } from "react";
import '../styles/Login.css';
import vidBeach from "../assets/beach.mp4";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); 
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu đầu vào
    if (email.trim() === "" || password.length < 6) {
      setError("Username không được để trống và mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    try {
      let data = {
        email: email,
        password: password,
      };
      console.log("Dữ liệu gửi đến API:", data);
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
     
        // Kiểm tra nếu phản hồi không thành công
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Đăng nhập thất bại.");
    }
     // Xử lý phản hồi từ API
     const responseData = await response.json();
     
     const { token } = responseData; // Lấy token và full_name từ phản hồi
      // Lấy token từ phản hồi
      console.log("Response data:", responseData);
    if (token) {
      setError("");
      
      alert("Đăng nhập thành công!");
      console.log("Token:", token); 
     // Lưu vào localStorage
     localStorage.setItem("authToken", token);
     localStorage.setItem("Email", email);
    

     // Điều hướng sang trang chính hoặc dashboard
     window.location.href = "/room";
     // Điều hướng sang trang chính hoặc dashboard
    } else {
      setError("Đăng nhập thất bại. Vui lòng thử lại.");
    } 
  }catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setError('Sai tài khoản hoặc mật khẩu');
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
            {forgotPassword ? (
              <>
                <h2>Quên mật khẩu</h2>
                <form onSubmit={forgotPassword}>
                  <div className="form-group">
                    <label>Nhập email của bạn</label>
                    <input 
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <button type="submit" className="login-btn">Gửi yêu cầu</button>
                </form>
                <button className="back-btn" onClick={() => setForgotPassword(false)}>
                  Quay lại đăng nhập
                </button>
              </>
            ) : (
              <>
                <h2>Đăng nhập tài khoản</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Tên đăng nhập</label>
                    <input 
                      type="email" 
                      placeholder="Email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group password-wrapper">
                    <label>Mật khẩu</label>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Pass" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                    <i 
                      className="toggle-password fas fa-eye" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer" }}
                    ></i>
                  </div>
                  <div className="forgot-password">
                    <a href="#quenmatkhau" onClick={() => setForgotPassword(true)}>
                      Quên mật khẩu?
                    </a>
                  </div>
                  <button type="submit" className="login-btn">Đăng nhập</button>
                </form>
                <div className="create-account">
                <button onClick={() => navigate("/Register")}> {/* Chuyển hướng đến /Register */}
                  Đăng ký tài khoản
                </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}