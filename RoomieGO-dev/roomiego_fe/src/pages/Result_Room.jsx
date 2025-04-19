import React from 'react'
import '../styles/Result_Room.css'
import { Link } from "react-router-dom";
import room1 from "../assets/room1.jpeg";
import room2 from "../assets/room2.jpeg";
import room3 from "../assets/room3.jpeg";

function Result_Room  () {
  return (
    <div className='result-room'>
      
       <div className="breadcrumb">
       <Link to="/Room">Room</Link> / <span>Room Details</span>
        <img src="" alt="" className='logo' />
      </div>

      {/* Title */}
      <h1 className="hotel-title">Blue Origin Fams</h1>

      {/* Image Gallery */}
      <div className="image-gallery">
        <div className="main-image">
          <img src={room3} alt="Main Room" />
        </div>
        <div className="side-images">
          <img src={room1} alt="Room 1" />
          <img src={room2} alt="Room 2" />
        </div>
        <div className="contact-information">
        <div className="contact-avatar">
            <h3>Contact Information</h3>
          <img src={room1} alt="Landlord" />
          <span>Landlord's name</span>
        </div>
        <div className="contact-details">
          <div className="contact-buttons">
            <button className='contact-info_phone'>Phone Number</button>
            <button className='contact-info_phone'>Facebook</button>
          </div>
          <button className='contact-info_chatnow'><Link to="/chatbox">Chat Now !</Link> </button>
          <span className="posting-date">Date of posting:</span>
        </div>
      </div>
      </div>
      
      <div className="detail-room">
        <div className='detail_about-place'>
        <ul className='hotel-details'>
        <li><strong>RENT</strong> $1,000 / mo</li>
        <li><strong>AVAILABLE</strong> Apr 14, 2025 - Fixed</li>
        <li><strong>TYPE</strong> Private Room · Apartment</li>
        <li><strong>LAYOUT</strong> 4 Bedrooms · 2 Bath</li>
        <li><strong>DEPOSIT</strong> $500</li>
        </ul>
            <p className="hotel-location">Galle, Sri Lanka</p>
            <h2>About this place</h2>
            <p>
                Blue Origin Fams is a beautiful hotel located in the heart of Galle.
                The hotel offers a variety of rooms and suites to suit your needs.
                The hotel is located close to the beach and offers stunning views of the ocean.
                The hotel also has a restaurant and bar where you can enjoy delicious meals and drinks.
            </p>
        </div>
        
        <div className="detail_price-booking">
            <h4>Start Booking</h4>
            <span>$200 per Day</span>
                <button>Book Now!</button>
        </div>
      </div>
        {/* Contact Information */}
       
    
      <div className="reviews-section">
        <h2>Treasure to Choose</h2>
        <div className="rating-summary">
          <div className="rating-overview">
            <h3>4 out of 5</h3>
            <div className="stars">
              ★★★★☆
            </div>
            <p>Top Rating</p>
          </div>
          <div className="rating-breakdown">
            <div className="rating-bar">
              <span>5 Stars</span>
              <div className="bar"><div className="fill" style={{ width: "80%" }}></div></div>
            </div>
            <div className="rating-bar">
              <span>4 Stars</span>
              <div className="bar"><div className="fill" style={{ width: "60%" }}></div></div>
            </div>
            <div className="rating-bar">
              <span>3 Stars</span>
              <div className="bar"><div className="fill" style={{ width: "40%" }}></div></div>
            </div>
            <div className="rating-bar">
              <span>2 Stars</span>
              <div className="bar"><div className="fill" style={{ width: "20%" }}></div></div>
            </div>
            <div className="rating-bar">
              <span>1 Star</span>
              <div className="bar"><div className="fill" style={{ width: "10%" }}></div></div>
            </div>
          </div>
        </div>

        {/* Individual Reviews */}
        {/* <div className="review">
          <img src={room1} alt="Reviewer" />
          <div className="review-content">
            <h4>Lina</h4>
            <div className="stars">★★★★★</div>
            <p>Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively...</p>
          </div>
          <span className="review-time">3 months</span>
        </div>
        <div className="review">
          <img src={room2} alt="Reviewer" />
          <div className="review-content">
            <h4>Lina</h4>
            <div className="stars">★★★★★</div>
            <p>Class, launched less than a year ago by Blackboard co-founder Michael Chasen, integrates exclusively...</p>
          </div>
          <span className="review-time">3 months</span>
        </div> */}
      </div>
    </div>
  )
}

export default Result_Room
