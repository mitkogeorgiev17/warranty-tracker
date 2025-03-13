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
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/home" element={<HomePage />} />

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
