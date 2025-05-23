import { Box, Button, Typography, Container } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";
import logo from "../assets/vault-logo-simplistic.svg";
import { useTranslation } from "react-i18next";

function ErrorPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleTryAgain = () => {
    navigate(-1); // Go back one step in history
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
          pt: 1, // Minimal top padding
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
      {/* Error content in the center */}
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
          mt: -8, // Larger negative margin to pull content up more
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: 100, // Slightly smaller icon
            color: "#ba3c3c",
            mb: 2, // Reduced margin
          }}
        />
        <Typography variant="h5" component="h1" gutterBottom>
          {t("error.title")}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{ mb: 2 }} // Reduced margin
        >
          {t("error.message")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="medium" // Smaller button
          onClick={handleTryAgain}
          sx={{
            borderRadius: 2,
            px: 3, // Less padding
          }}
        >
          {t("common.tryAgain")}
        </Button>
      </Box>
    </Container>
  );
}

export default ErrorPage;
