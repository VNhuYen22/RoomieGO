// FilterBar.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faExpand,
  faFile,
  faPrint,
  faTrash,
  faPlus
} from "@fortawesome/free-solid-svg-icons"; // Import component form
import "./css/FilterBar.css"; // Import CSS file for styling
import RegisterForm from "./RegisterForm";

const FilterBar = ({ onAddClick }) =>{

  return (
    <div className="filter-bar">
        <input
        className="search-input"
        type="text"
        placeholder="Search documents"
        />
        <div className="filter-actions">
        <button className="icon-btn"><FontAwesomeIcon icon={faClipboard} /></button>
        <button className="icon-btn"><FontAwesomeIcon icon={faExpand} /></button>
        <button className="icon-btn"><FontAwesomeIcon icon={faFile} /></button>
        <button className="icon-btn"><FontAwesomeIcon icon={faPrint} /></button>
        <button className="icon-btn"><FontAwesomeIcon icon={faTrash} /></button>
        </div>
        <select className="dropdown">
        <option>Booking</option>
        <option>Reservation</option>
        <option>Completed</option>
        </select>
        <select className="dropdown">
        <option>Refund</option>
        <option>Pending</option>
        <option>Processed</option>
        </select>
        <button className="add-btn" onClick={onAddClick}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
};

export default FilterBar;
