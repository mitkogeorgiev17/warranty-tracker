import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import HomePage from "./pages/home/HomePage";
import UnauthorizedPage from "./pages/unauthorized/UnauthorizedPage";
import ErrorPage from "./pages/error/ErrorPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
