import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import HomePage from "./pages/home/HomePage";
import UnauthorizedPage from "./pages/unauthorized/UnauthorizedPage";
import ErrorPage from "./pages/error/ErrorPage";
import WarrantiesPage from "./pages/warranties/WarrantiesPage";
import AddWarrantyPage from "./pages/add-warranty/AddWarrantyPage";
import ChooseCategoryPage from "./pages/choose-category/ChooseCategoryPage";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster className="sonner-toast" position="bottom-center" richColors />
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/warranties" element={<WarrantiesPage />} />
          <Route path="/warranties/add" element={<AddWarrantyPage />} />
          <Route path="/categories" element={<ChooseCategoryPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
