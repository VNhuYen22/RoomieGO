import "./App.css";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import SearchBar from "./components/SearchBar";
import Footer from './components/Footer';
import Body from "./components/Body";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <SearchBar />
        <Body />
        <Routes>
          <Route path="/" exact component={Home} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
