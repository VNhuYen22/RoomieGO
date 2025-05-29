import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import room1 from "../assets/room1.jpeg";
import room2 from "../assets/room2.jpeg";
import room3 from "../assets/room3.jpeg";
import SearchBar from "../components/SearchBar";
import "../styles/Room.css";
import blueStar from "../assets/circle.png";
// Import Swiper styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Virtual } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Radius } from "lucide-react";
import sink from "../assets/sink.png";
import bedrooms from "../assets/bedroom.png";
import split_1 from "../assets/split_0_0.png";
import split_2 from "../assets/split_0_1.png";
import split_3 from "../assets/split_0_2.png";
import dot from "../assets/more.png";
import { getProvinces, getDistrictsByProvinceCode } from "sub-vn";

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
/>;

const baseURL = "http://localhost:8080/images/";

function Room() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const slides = [
    { image: room1, alt: "Phòng 1" },
    { image: room1, alt: "Phòng 2" },
    { image: room1, alt: "Phòng 3" },
    { image: room1, alt: "Phòng 4" },
    { image: room1, alt: "Phòng 5" },
    { image: room1, alt: "Phòng 6" },
    { image: room1, alt: "Phòng 7" },
    { image: room1, alt: "Phòng 8" },
    { image: room1, alt: "Phòng 9" },
    { image: room1, alt: "Phòng 10" },
    { image: room1, alt: "Phòng 11" },
    { image: room1, alt: "Phòng 12" },
  ];
  const splitImages = [
    { image: split_1, alt: "Split Image 1" },
    { image: split_2, alt: "Split Image 2" },
    { image: split_3, alt: "Split Image 3" },
  ];
  const [activeTab, setActiveTab] = useState("Tất Cả"); 

  const handleSortChange = (order) => {
    setSortOrder(order);
  };
  const [showDistricts, setShowDistricts] = useState(false);
const [districts, setDistricts] = useState([]);
const handleShowDistricts = () => {
  const danang = getProvinces().find((p) => p.name.includes("Đà Nẵng"));
  if (danang) {
    const danangDistricts = getDistrictsByProvinceCode(danang.code);
    setDistricts(danangDistricts);
    setShowDistricts(!showDistricts); 
  }
};


  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/rooms");
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();

      // Fetch owner information for each room
      const roomsWithOwnerInfo = await Promise.all(
        data.data.map(async (room) => {
          try {
            const ownerResponse = await fetch(
              `http://localhost:8080/owner/get-users/${room.ownerId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
              }
            );

            if (ownerResponse.ok) {
              const ownerData = await ownerResponse.json();
              const ownerInfo = ownerData.usersList?.[0];
              if (ownerInfo) {
                return {
                  ...room,
                  ownerName: ownerInfo.fullName,
                  ownerPhone: ownerInfo.phone,
                };
              }
            }
          } catch (error) {
            console.error("Error fetching owner info:", error);
          }
          return room;
        })
      );

      setRooms(roomsWithOwnerInfo);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const getValidImageUrl = (url) => {
    if (!url || typeof url !== "string" || url.trim() === "") {
      const defaultImages = [room1, room2, room3];
      const randomIndex = Math.floor(Math.random() * defaultImages.length);
      return defaultImages[randomIndex];
    }
    return baseURL + url;
  };
  // loc theo thanh pho
  const tabs = ["Tất Cả", "Đà Nẵng", "Thành phố Hồ Chí Minh", "Hà Nội"];
  const filteredRooms =
    activeTab === "Tất Cả"
      ? rooms
      : rooms.filter((room) =>
          room.city?.toLowerCase().includes(activeTab.toLowerCase())
        );
  const sortedRooms = [...filteredRooms];
  if (sortOrder === "asc") {
    sortedRooms.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "desc") {
    sortedRooms.sort((a, b) => b.price - a.price);
  }

  if (loading) return <p>Đang tải phòng trọ...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="body">
      <SearchBar onSortChange={handleSortChange} />

      <div className="swiper-container1">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          // autoplay={{
          //   delay: 2500,
          //   disableOnInteraction: false,
          // }}
          pagination={{
            clickable: true,
          }}
          loop={true}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} virtualIndex={index}>
              <img
                src={slide.image}
                alt={slide.alt}
                style={{ width: "90%", borderRadius: "10px" }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="swiper-container">
        {/* <h3 ><img src={blueStar} alt="" className="img-living" />Chọn phòng theo phong cách của bạn  </h3>    */}
        <Swiper
          modules={[Virtual]}
          virtual
          spaceBetween={30}
          slidesPerView={3}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
        >
          {splitImages.map((slide, index) => (
            <SwiperSlide key={index} virtualIndex={index}>
              <img
                className="splitImages"
                src={slide.image}
                alt={slide.alt}
                style={{ width: "100%", borderRadius: "10px" }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="button-group_city">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`button-tab_city ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
            style={{ cursor: "pointer" }}
          >
            {tab}
          </div>
          
        ))}
        <div className="district_find " onClick={handleShowDistricts}>
          <img src={dot} alt="" />
        </div>
        {showDistricts && (
  <div className="district-list">
    <ul>
      {districts.map((district) => (
        <li key={district.code}>{district.name}</li>
      ))}
    </ul>
  </div>
)}
      </div>
      <div className="text_title">
        <h3>Phòng đặc trưng </h3>{" "}
      </div>
      <div className="room-grid">
        {sortedRooms.length === 0 ? (
          <p>Không tìm thấy phòng trọ.</p>
        ) : (
          sortedRooms.map((room) => (
            <Link
              to={`/ResultRoom/${room.id}`}
              className="card-link"
              key={room.id}
            >
              <div className="card">
                <img
                  src={getValidImageUrl(room.imageUrls[0])}
                  alt="Room"
                  className="card-image_big"
                  onError={(e) => {
                    e.target.src = getValidImageUrl("");
                  }}
                />

                <div className="card-body">
                  <div className="card-top">
                    <h2>{room.price?.toLocaleString() ?? "N/A"} vnđ</h2>
                    <div className="status-badge">Cho thuê</div>
                  </div>

                  <div className="card-address">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{room.city}</span>{" "}
                    <span>{room.district}</span>
                    <span>{room.addressDetails ?? "Địa chỉ không có sẵn"}</span>
                  </div>

                  <div className="card-features">
                    <div className="card-feature-item">
                      <i className="fas fa-expand-arrows-alt"></i>
                      <span>{room.roomSize} m²</span>
                    </div>
                    <div className="card-feature-item">
                      <span>
                        <img src={bedrooms} alt="" />
                        {room.numBedrooms ?? "?"} <b>Giường</b>{" "}
                      </span>
                    </div>
                    <div className="card-feature-item">
                      <span>
                        <img src={sink} alt="" />
                        {room.numBathrooms ?? "?"} <b>Bồn tắm</b>{" "}
                      </span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <img
                      src={getValidImageUrl(room.imageUrls[1])}
                      alt="user"
                      onError={(e) => {
                        e.target.src = getValidImageUrl("");
                      }}
                    />
                    <div className="contact-info">
                      <div className="owner-name">
                        {room.ownerName || "Chủ phòng"}
                      </div>
                      <div className="owner-phone">
                        {room.ownerPhone || "Chưa có số điện thoại"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Room;
