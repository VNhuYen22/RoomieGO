import React from "react";
import "../styles/Room.css";
import { Link } from "react-router-dom";
import room1 from "../assets/room1.jpeg";
import room2 from "../assets/room2.jpeg";
import room3 from "../assets/room3.jpeg";
function Room () {
  return (
   <div className="body">
         <Link to="/" className="card-link">
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
         <Link to="/" className="card-link">
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
       </div>
  );
};

export default Room;
