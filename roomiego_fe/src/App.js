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
  );
}

export default App;
