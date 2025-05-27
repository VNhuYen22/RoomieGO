import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import "../styles/Navbar.css";
import trash from "../assets/trash.png";
// import chatbox from "../assets/chatbox.png";
// import user from "../assets/user.png";
import logout from "../assets/logout.png";
import dashboard from "../assets/dashboard.png";
import user2 from "../assets/user2.png";
import friends from "../assets/high-five.png";
import living from "../assets/living.png";
// import home_icon from "../assets/house.png";
import bell from "../assets/bell.png";

function Navbar() {
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [notifications, setNotifications] = useState([]); // Danh sách thông báo động
  const [userId, setUserId] = useState(null); // Store userId
  const location = useLocation();
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const stompClientRef = useRef(null);

  // Function to translate notification type to Vietnamese
  const translateNotificationType = (type) => {
    const translations = {
      'RENT_REQUEST_CREATED': 'Yêu cầu thuê phòng mới',
      'RENT_REQUEST_APPROVED': 'Yêu cầu thuê phòng được chấp nhận',
      'RENT_REQUEST_REJECTED': 'Yêu cầu thuê phòng bị từ chối',
      'VIEW_CONFIRMED': 'Xác nhận xem phòng',
      'CONTRACT_CREATED': 'Hợp đồng mới được tạo',
      'ROOM_HIDDEN': 'Phòng đã bị ẩn',
      'TENANT_CONFIRMED_VIEWING': 'Người thuê đã xác nhận xem phòng',
      'RENT_REQUEST_VIEW_ROOM': 'Yêu cầu xem phòng',
      'OWNER_REJECTED': 'Chủ nhà đã từ chối',
      'OWNER_APPROVED': 'Chủ nhà đã chấp nhận',
      'BREACH': 'Vi phạm hợp đồng',
      'NON_BREACH': 'Không vi phạm hợp đồng'
    };
    return translations[type] || type;
  };


  // delete notification function
const handleDeleteNotification = (indexToDelete) => {
  setNotifications((prev) =>
    prev.filter((_, index) => index !== indexToDelete)
  );
};

  // Fetch historical notifications
  const fetchNotifications = async (userId) => {
    const token = localStorage.getItem("authToken");
    if (!token || !userId) return;

    try {
      const response = await axios.get("http://localhost:8080/api/notifications", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedNotifications = response.data.map((notification) => ({
        message: notification.message || "No message",
        type: notification.type || "Unknown",
        userId: notification.userId || "Unknown",
        timestamp: new Date().toLocaleTimeString(), // You can adjust this based on the BE response
      }));
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Lấy thông tin người dùng và userId để đăng ký WebSocket
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8080/renterowner/get-profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const { user } = response.data;
      const { fullName, role, id } = user;
      console.log("Current user ID:", id);
      setFullName(fullName);
      setRole(role);
      setUserId(id); // Save userId
      setIsLoggedIn(true);

      // Fetch historical notifications
      fetchNotifications(id);

      // Kết nối WebSocket sau khi lấy userId
      connectWebSocket(id);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Kết nối WebSocket và đăng ký topic thông báo
  const connectWebSocket = (userId) => {
    if (typeof window === "undefined" || !userId) return;

    try {
      const socket = new SockJS("http://localhost:8080/api/socket");
      const stompClient = Stomp.over(socket);

      stompClient.connect(
        {},
        (frame) => {
          console.log("Connected to WebSocket with frame:", frame);
          stompClientRef.current = stompClient;

          stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
            console.log("Received raw message:", message);
            try {
              const notification = JSON.parse(message.body || "{}");
              console.log("Parsed notification:", notification);
              setNotifications((prev) => [
                ...prev,
                {
                  message: notification.message || "No message",
                  type: notification.type || "Unknown",
                  userId: notification.userId || "Unknown",
                  timestamp: new Date().toLocaleTimeString(),
                },
              ]);
            } catch (parseError) {
              console.error("Error parsing WebSocket message:", parseError, "Body:", message.body);
            }
          });
        },
        (error) => {
          console.error("WebSocket connection error:", error);
          // Reconnection logic
          setTimeout(() => connectWebSocket(userId), 5000); // Retry after 5 seconds
        }
      );
    } catch (error) {
      console.error("Error initializing WebSocket:", error);
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    if (stompClientRef.current) {
      stompClientRef.current.disconnect(() => {
        console.log("Disconnected from WebSocket");
      });
    }
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setFullName("");
    setNotifications([]);
    setUserId(null);
    window.location.href = "http://localhost:5173/";
  };

  // useEffect để lấy profile và xử lý click ngoài
  useEffect(() => {
    fetchUserProfile();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => {
          console.log("Disconnected from WebSocket on unmount");
        });
      }
    };
  }, []);

  // Ẩn Navbar trên trang Login và Register
  if (location.pathname === "/Login" || location.pathname === "/Register") {
    return null;
  }

  return (
    <div className="navbar-container">
      <div className="leftside">
        <Link to="/">
          <h1 className="logo-text">ROOMIEGO</h1>
        </Link>
      </div>
      <div className="rightside">
        <Link to="/Room">
          <img src={living} alt="" className="img-living" />
          <a href="">Phòng trọ</a>
        </Link>
        <Link to="/Roommates">
          <img src={friends} alt="" className="img-living" />
          <a href="">Bạn cùng phòng</a>
        </Link>

        {isLoggedIn ? (
          <>
            {/* Bell notification */}
            <div className="notification-wrapper" ref={notificationRef}>
              <div className="notification-bell" onClick={() => setNotificationOpen(!notificationOpen)}>
                 <img src={bell} alt="Notifications" />
                  <span>{notifications.length}</span> 
              </div>
              {notificationOpen && (
                <div className="notification-bell_dropdown">
                  
                  <div className="notification-header">
                    <h3>Thông báo</h3>
                  </div>
                  {notifications.length > 0 ? (
                    notifications.map((note, index) => (
                      <div key={index} className="notification-card">
                        <div className="notification-avatar">
                          <img src={user2} alt="avatar" />
                        </div>
                        <div className="notification-content">
                          <p className="notification-title">{translateNotificationType(note.type)}</p>
                          <p className="notification-message">{note.message}</p>
                          <div className="notification-footer">
                            <span className="notification-time">{note.timestamp}</span>
                          </div>
                        </div>
                         <button
                       className="notification-delete-button"
                        onClick={() => handleDeleteNotification(index)}>
                          <span className="notification-delete-icon"><img src={trash} alt="" /></span> </button>
                      </div>
                    ))
                  ) : (
                    <p>Không có thông báo mới</p>
                  )}
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="user-menu">
              <div className="user-avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img src={user2} alt="User Avatar" />
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu" ref={dropdownRef}>
                  <a href="#">{fullName}</a>
                  <button onClick={() => window.location.href = "/profile"}>
                    <img src={user2} alt="" /> Hồ sơ
                  </button>
                {(role === "OWNER" || role === "ADMIN")  && (
                    <button onClick={() => window.location.href = "/dashboard"}>
                      <img src={dashboard} alt="" className="dashboard-user" /> Bảng điều khiển
                    </button>
                  )}
                  <button onClick={handleLogout}>
                    <img src={logout} alt="" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/Register">Đăng ký</Link>
            <Link to="/Login">
              <button className="get-started-btn">Đăng Nhập</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;