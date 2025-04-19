import { useState } from "react";
import '../styles/Login.css';
import vidBeach from "../assets/beach.mp4";
import axios from "axios";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu đầu vào
    if (username.trim() === "" || password.length < 6) {
      setError("Username không được để trống và mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    try {
      // Gửi yêu cầu POST đến API
      const response = await axios.post("http://localhost:8080/auth/login", {
        username,
        password,
      });

      // Xử lý phản hồi từ API
      if (response.status === 200) {
        const { token } = response.data;
        setError("");
        alert("Đăng nhập thành công!");
        console.log("Token:", token);

        // Lưu token vào localStorage (hoặc sessionStorage)
        localStorage.setItem("authToken", token);

        // Chuyển hướng người dùng đến trang chính
        window.location.href = "/home";
      }
    } catch (err) {
      // Xử lý lỗi
      setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };
  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log("Reset password for:", email);
    alert("Một email đặt lại mật khẩu đã được gửi đến " + email);
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
                <form onSubmit={handleForgotPassword}>
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
                      type="text" 
                      placeholder="Username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
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
                  <button onClick={() => alert("Redirect to signup page")}>
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
