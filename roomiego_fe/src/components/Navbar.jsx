
import Logo from "../assets/beach.jpg";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
function Navbar() {
  
  return (
    <div className="navbar">
      <div className="leftside">
        <Link to="/"> Home </Link>
        <Link to="/about"> About </Link>
        <Link to="/room"> Rooms </Link>
      </div>
      <div className="center">
        <img src={Logo} alt="" />
      </div>
      {/* <div className="rightside">
        <Link to="/room"> Rooms </Link>
        <Link to="/services"> Services </Link>
        <Link to="/pricing"> Pricing </Link>
      </div> */}
    
    </div>

  );
}

export default Navbar;
