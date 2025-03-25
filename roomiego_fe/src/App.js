<<<<<<< HEAD
import "./App.css";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import SearchBar from "./components/SearchBar";
import Footer from './components/Footer';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Room from "./pages/Room";
import About from "./pages/About";
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <SearchBar />
        
        <Routes>
          <Route path="home" element={<Home/>} />
          <Route path="about" element={<About/>} />
          <Route path="room" element={<Room/>} />
        </Routes>
        <Footer />
      </Router>
    </div>
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} /> */}
        <Route path="./pages/Login.js" element={<Login />} />
      </Routes>
    </Router>
>>>>>>> 15b3c45329f754a3ff919b0b44ec1b3c0c43d70e
  );
}

export default App;
