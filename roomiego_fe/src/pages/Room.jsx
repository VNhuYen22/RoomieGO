import React, { useEffect, useState } from "react";
import "../styles/Room.css";
import { Link } from "react-router-dom";
import room1 from "../assets/room1.jpeg";
import room2 from "../assets/room2.jpeg";
import room3 from "../assets/room3.jpeg";
import SearchBar from "../components/SearchBar";
import "../styles/Room.css";
import blueStar from "../assets/circle.png";
// Import Swiper styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation ,Virtual} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Radius } from "lucide-react";
import sink from "../assets/sink.png";
import bedrooms from "../assets/bedroom.png"; 
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
/>

function Room() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    price: 500,
    location: "all",
    roomFor: "any-room"
  });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const applyFilters = () => {
    fetch(`http://localhost:8080/api/rooms?price=${filters.price}&location=${filters.location}&roomFor=${filters.roomFor}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Expected JSON but received: " + contentType);
        }

  const [sortOrder, setSortOrder] = useState(null);
  const slides = [
  { image: room1, alt: 'Phòng 1' },
  { image: room1, alt: 'Phòng 2' },
  { image: room1, alt: 'Phòng 3' },
  { image: room1, alt: 'Phòng 4' },
  { image: room1, alt: 'Phòng 5' },
  { image: room1, alt: 'Phòng 6' },
  { image: room1, alt: 'Phòng 7' },
  { image: room1, alt: 'Phòng 8' },
  { image: room1, alt: 'Phòng 9' },
  { image: room1, alt: 'Phòng 10' },
  { image: room1, alt: 'Phòng 11' },
  { image: room1, alt: 'Phòng 12' },
];
  const [activeTab, setActiveTab] = useState('Tất Cả'); // mặc định active tab là 'Jacket'


  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const fetchRooms = () => {
    fetch("http://localhost:8080/api/rooms")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        setRooms(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {

    applyFilters(); // Apply initial filters when component mounts
  }, []); // Empty array to ensure it runs only once

    fetchRooms();
  }, []);


  const getValidImageUrl = (url) => {
    if (!url || typeof url !== "string" || url.trim() === "") {
      const defaultImages = [room1, room2, room3];
      const randomIndex = Math.floor(Math.random() * defaultImages.length);
      return defaultImages[randomIndex];
    }
    return url;
  };
  // loc theo thanh pho 
    const tabs = ['Tất Cả' ,'Đà Nẵng', 'Thành phố Hồ Chí Minh', 'Hà Nội'];
 const filteredRooms = activeTab === 'Tất Cả' 
  ? rooms 
  : rooms.filter(room => room.city?.toLowerCase().includes(activeTab.toLowerCase()));
const sortedRooms = [...filteredRooms];
if (sortOrder === "asc") {
  sortedRooms.sort((a, b) => a.price - b.price);
} else if (sortOrder === "desc") {
  sortedRooms.sort((a, b) => b.price - a.price);
}

  if (loading) return <p>Loading rooms...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
  

    <div className="body">
      <SearchBar onSortChange={handleSortChange}
       />
      
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
          <img src={slide.image} alt={slide.alt} style={{ width: '90%' ,
            borderRadius: "10px"
          }} />
        </SwiperSlide>
      ))}
        
      </Swiper>
    </div>
      
      <div className="swiper-container">
   
       <h3 ><img src={blueStar} alt="" className="img-living" />Phòng được yêu thích nhất  </h3>   
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
      {slides.map((slide, index) => (
        <SwiperSlide key={index} virtualIndex={index}>
          <img src={slide.image} alt={slide.alt} style={{ width: '90%' ,
            borderRadius: "10px"
          }} />
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
</div>
      <div className="text_title"><h3>Phòng đặc trưng </h3> </div>
      <div className="room-grid">
      
        {sortedRooms.length === 0 ? (
          <p>No rooms found.</p>
        ) : (
          sortedRooms.map((room) => (
            <Link to={`/ResultRoom/${room.id}`} className="card-link" key={room.id}>
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
        <div className="status-badge">For rent</div>
      </div>

      <div className="card-address">
        <i className="fas fa-map-marker-alt"></i>
       <span>{room.city}</span> <span>{room.addressDetails ?? "Địa chỉ không có sẵn"}</span>
      </div>

      <div className="card-features">
        <div className="card-feature-item">
          <i className="fas fa-expand-arrows-alt"></i>
          <span>{room.roomSize} m²</span>
        </div>
        <div className="card-feature-item">
          <i className="fas fa-bed"></i>
          <span><img src={bedrooms} alt="" />{room.numBedrooms ?? "?"} bed</span>
        </div>
        <div className="card-feature-item">
          <i className="fas fa-bath"></i>
          <span><img src={sink} alt="" />{room.numBathrooms ?? "?"} bath</span>
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
          <span>Jennifer Bloom</span>
          <small>+44 235 123 321</small>
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
}
export default Room;
