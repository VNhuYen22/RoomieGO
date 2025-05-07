import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../styles/Home.css";
import Room from "../assets/room1.jpeg";
import Room2 from "../assets/room2.jpeg";
import Room3 from "../assets/room3.jpeg";
import Room4 from "../assets/room4.jpeg";
import Arrow from "../assets/right-arrow.png";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

export default function App() {
  return (
    <div className="home">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={false}
        modules={[Autoplay, Pagination, Navigation]}
        
      >
          <SwiperSlide><img src={Room} alt="" /></SwiperSlide>
          <SwiperSlide><img src={Room2} alt="" /></SwiperSlide>
          <SwiperSlide><img src={Room3} alt="" /></SwiperSlide>
          <SwiperSlide><img src={Room4} alt="" /></SwiperSlide>
        
      </Swiper>
      <div className="home-content">
        <h1>
          Go from <span className="highlight">solo</span> to{" "}
          <span className="highlight">social</span>, in just a few taps!
        </h1>
        <p>Join Linkups to explore and hang out with travellers.</p>
       <Link to="/Room"><button className="home-arrow">Find your room</button></Link> 
      </div>
    </div>
  );
}
