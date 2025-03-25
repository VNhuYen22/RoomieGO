import { useState } from "react";
import "../App.css"; // Import SCSS

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === "" || password.length < 6) {
      setError("Username không được để trống và mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    setError("");
    console.log("Logging in with:", { username, password });
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log("Reset password for:", email);
    alert("Một email đặt lại mật khẩu đã được gửi đến " + email);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-image">
          <img src="https://storage.googleapis.com/a1aa/image/pIX598hLKNAAlo-PMfaRY2XfJQXo-I6fQbAqm6H-2T4.jpg" alt="Modern Apartment" />
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
                  <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit" className="login-btn">Gửi yêu cầu</button>
              </form>
              <button className="back-btn" onClick={() => setForgotPassword(false)}>Quay lại đăng nhập</button>
            </>
          ) : (
            <>
              <h2>Đăng nhập tài khoản</h2>
              {error && <p className="error-message">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tên đăng nhập</label>
                  <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="form-group password-wrapper">
                  <label>Mật khẩu</label>
                  <input type={showPassword ? "text" : "password"} placeholder="pass" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <i className="toggle-password fas fa-eye" onClick={() => setShowPassword(!showPassword)}></i>
                </div>
                <div className="forgot-password">
                  <a href="#quenmatkhau" onClick={() => setForgotPassword(true)}>Quên mật khẩu?</a>
                </div>
                <button type="submit" className="login-btn">Đăng nhập</button>
              </form>
              <div className="create-account">
                <button onClick={() => alert("Redirect to signup page")}>Đăng ký tài khoản</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
