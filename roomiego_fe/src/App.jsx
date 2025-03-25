import Navbarchatbox from "./components/Navbarchatbox";
import SettingsPage from "./pages/SettingsPage";
import Chatbox from "./pages/Chatbox";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SearchBar from "./components/SearchBar";
import Footer from "./components/Footer";
import Room from "./pages/Room";
import About from "./pages/About";
import ResultRoom from "./pages/Result_Room";
import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom"; // ❌ Không import Router
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();
  const location = useLocation(); // ✅ Sử dụng được vì App đã nằm trong BrowserRouter (index.js)

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

  // Xác định route hiển thị Navbarchatbox
  const showNavbarchatbox = ["/chatbox", "/settings"].includes(location.pathname);

  return (
    <div data-theme={theme}>
      {showNavbarchatbox ? (
        <Navbarchatbox />
      ) : (
        <>
          <Navbar />
          <SearchBar />
        </>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/room" element={<Room />} />
        <Route path="/ResultRoom" element={<ResultRoom />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chatbox" element={<Chatbox />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>

      <Toaster />
      <Footer />
    </div>
  );
};

export default App;
