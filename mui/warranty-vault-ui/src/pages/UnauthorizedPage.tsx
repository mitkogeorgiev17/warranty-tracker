import { Box, Button, Typography, Container } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import logo from "../assets/vault-logo-simplistic.svg";

function UnauthorizedPage() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    // Clear session storage and local storage
    sessionStorage.clear();
    localStorage.clear();

    // Navigate to login page
    navigate("/login");
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Logo at the top */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          pt: 2,
        }}
      >
        <img
          src={logo}
          alt="Vault Logo"
          style={{
            width: "60px",
            height: "auto",
          }}
        />
      </Box>

      {/* Unauthorized content in the center */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          textAlign: "center",
          pt: 0,
          pb: 2,
          mt: -10,
        }}
      >
        <LockOutlinedIcon
          sx={{
            fontSize: 120,
            color: "#ba3c3c", // Muted red instead of bright red
            mb: 3,
          }}
        />

        <Typography variant="h4" component="h1" gutterBottom>
          Unauthorized Access
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{ mb: 3 }}
        >
          You don't have permission to access this page or your session has
          expired. Please log in again to continue.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGoToLogin}
          sx={{
            borderRadius: 2,
            px: 4,
          }}
        >
          Go to Login
        </Button>
      </Box>
    </Container>
  );
}

export default UnauthorizedPage;
