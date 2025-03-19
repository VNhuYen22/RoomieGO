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
  );
}

export default App;
