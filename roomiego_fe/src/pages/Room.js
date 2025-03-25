import React from "react";
import "../styles/Room.css";
import { Link } from "react-router-dom";
import room1 from "../assets/room1.jpeg";
import room2 from "../assets/room2.jpeg";
import room3 from "../assets/room3.jpeg";
function Room() {
  return (
    <div className="body">
      <div className="filter-section">
        <h3>Filter</h3>
        <form>
          <div className="filter-group">
            <label htmlFor="price">Price Range:</label>
            <input type="range" id="price" name="price" min="0" max="500" />
          </div>
          <div className="filter-group">
            <label htmlFor="location">Location:</label>
            <select id="location" name="location">
              <option value="all">All</option>
              <option value="city">City</option>
              <option value="suburb">Suburb</option>
              <option value="rural">Rural</option>
            </select>
          </div>
          <div className="room-for">
            <h3>Rooms for</h3>

            <ul className="room-for-list">
              <li>
                <input type="radio"
id="any-room"
                  name="room-for"
                  value="any-room"
                />
                <label htmlFor="any-room">Any room</label>
              </li>
              <li>
                <input type="radio" id="large-room" name="room-for" value="large-room"
                />
                <label htmlFor="large-room">Large room</label>
              </li>
              <li>
                <input type="radio"id="small-room"name="room-for"value="small-room"
                />
                <label htmlFor="small-room">Small room</label>
              </li>
            </ul>
          </div>
          <button type="submit" className="filter-button">
            Apply Filter
          </button>
        </form>
      </div>
      <Link to="/ResultRoom" className="card-link">
        <div className="card">
          <div className="card-header">
            <img src={room1} alt="Sydney" className="card-image" />
            <div className="card-info">
              <h3>Sydney @ 29</h3>
              <span>TODAY</span>
            </div>
          </div>
          <div className="card-body">
            <img src={room1} alt="" className="card-image_body" />
            <h2>$3,300 / mo</h2>
            <p>Entire Place · 1 Bedroom · Apartment</p>
            <p>Jun 1, 2025 - 12 Months</p>
            <p>Upper East Side, Manhattan</p>
          </div>
        </div>
      </Link>
      <Link to="/ResultRoom" className="card-link">
        <div className="card">
          <div className="card-header">
            <img src={room1} alt="Sydney" className="card-image" />
            <div className="card-info">
              <h3>Sydney @ 29</h3>
              <span>TODAY</span>
            </div>
          </div>
          <div className="card-body">
            <img src={room1} alt="" className="card-image_body" />
            <h2>$3,300 / mo</h2>
            <p>Entire Place · 1 Bedroom · Apartment</p>
            <p>Jun 1, 2025 - 12 Months</p>
            <p>Upper East Side, Manhattan</p>
          </div>
        </div>
      </Link>
      <Link to="/ResultRoom" className="card-link">
        <div className="card">
          <div className="card-header">
            <img src={room1} alt="Sydney" className="card-image" />
            <div className="card-info">
              <h3>Sydney @ 29</h3>
              <span>TODAY</span>
            </div>
          </div>
          <div className="card-body">
            <img src={room1} alt="" className="card-image_body" />
            <h2>$3,300 / mo</h2>
            <p>Entire Place · 1 Bedroom · Apartment</p>
            <p>Jun 1, 2025 - 12 Months</p>
            <p>Upper East Side, Manhattan</p>
          </div>
        </div>
      </Link>
      {/* <Link to="/" className="card-link">
           <div className="card">
             <div className="card-header">
               <img src={room1} alt="Sydney" className="card-image" />
               <div className="card-info">
                 <h3>Sydney @ 29</h3>
                 <span>TODAY</span>
               </div>
             </div>
             <div className="card-body">
               <img src={room1} alt="" className="card-image_body" />
               <h2>$3,300 / mo</h2>
               <p>Entire Place · 1 Bedroom · Apartment</p>
               <p>Jun 1, 2025 - 12 Months</p>
               <p>Upper East Side, Manhattan</p>
             </div>
           </div>
         </Link> */}
    </div>
  );
}

export default Room;
