// import "./App.css";
// import Navbar from "./components/NavBar";
// import Home from "./pages/Home";
// import SearchBar from "./components/SearchBar";
// import Footer from './components/Footer';
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Room from "./pages/Room";
// import About from "./pages/About";
// import ResultRoom from "./pages/Result_Room";
// function App() {
//   return (
//     <div className="App">
//       <Router>
//         <Navbar />
//         <SearchBar />
        
//         <Routes>
//           <Route path="home" element={<Home/>} />
//           <Route path="about" element={<About/>} />
//           <Route path="room" element={<Room/>} />
//           <Route path="ResultRoom" element={<ResultRoom/>} />
//           <Route path="./pages/Login.js" element={<Login />} />
//         </Routes>
//         <Footer />
//       </Router>
//     </div>
//   );
// }

// export default App;
import Navbar from "./components/Navbar";


import SettingsPage from "./pages/SettingsPage";
import Chatbox from "./pages/Chatbox";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import SearchBar from "./components/SearchBar";
import Footer from './components/Footer';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Room from "./pages/Room";
import About from "./pages/About";
import ResultRoom from "./pages/Result_Room";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login.js";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Router>
          <Navbar />
          <SearchBar />

      <Routes>
        <Route path="home" element={<Home/>} />
        <Route path="about" element={<About/>} />
        <Route path="room" element={<Room/>} />
        <Route path="ResultRoom" element={<ResultRoom/>} />
        <Route path="login" element={<Login />} />
        <Route path="/chat" element={<Chatbox />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>

      <Toaster />
          <Footer />
      </Router>
    </div>
  );
};
export default App;

