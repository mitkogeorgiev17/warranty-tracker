import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import CreateWarrantyPage from "./pages/CreateWarrantyPage";
import ManageWarrantiesPage from "./pages/ManageWarrantiesPage";
import { Toaster } from "sonner";
import WarrantyDetailsPage from "./pages/WarrantyDetailsPage";
import UpdateWarrantyPage from "./pages/UpdateWarrantyPage";
import ProfilePage from "./pages/ProfilePage";
import { UserProvider } from "./constants/UserContext.tsx";
import ScanWarrantyPage from "./pages/ScanWarrantyPage.tsx";
import "./config/i18n.ts";
import AdvisorPage from "./pages/AdvisorPage.tsx";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9797ff",
    },
    background: {
      default: "#262626",
      paper: "#333333",
    },
    text: {
      primary: "#F5F5F5",
      secondary: "#B0B0B0",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/create" element={<CreateWarrantyPage />} />
            <Route path="/scan" element={<ScanWarrantyPage />} />
            <Route path="/manage" element={<ManageWarrantiesPage />} />
            <Route path="/advisor" element={<AdvisorPage />} />
            <Route
              path="/warranty/:warrantyId"
              element={<WarrantyDetailsPage />}
            />
            <Route
              path="/warranty/update/:warrantyId"
              element={<UpdateWarrantyPage />}
            />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </Router>
        <Toaster richColors position="bottom-center" />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
