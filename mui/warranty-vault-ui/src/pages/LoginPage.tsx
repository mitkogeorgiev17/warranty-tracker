import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, Box, Typography } from "@mui/material";
import axiosApi from "../config/axiosApiConfig";
import { API_BASE_URL, ENDPOINTS } from "../constants/apiConstants";
import logo from "../assets/vault-logo-simplistic.svg";
import useKeycloakUrl from "../hooks/useKeycloakUrl";
import { useTranslation } from "react-i18next";

function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const authAttempted = useRef(false);
  const keycloakUrl = useKeycloakUrl();
  const { t } = useTranslation();

  useEffect(() => {
    // Check if user is already logged in
    if (sessionStorage.getItem("jwt")) {
      navigate("/home");
      return;
    }
    // Check for auth code in URL (after redirect back from Keycloak)
    const handleAuthCode = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      // Only proceed if we have a code and haven't attempted auth yet
      if (code && !authAttempted.current) {
        authAttempted.current = true; // Mark that we've attempted authentication
        setIsLoading(true);
        try {
          const endpoint = ENDPOINTS.AUTHENTICATE;
          const response = await axiosApi({
            method: endpoint.method,
            url: `${API_BASE_URL}${endpoint.path}`,
            headers: {
              "Content-Type": "application/json",
            },
            data: { code },
          });
          const jwt = response.data.token;
          if (jwt) {
            sessionStorage.setItem("jwt", jwt);
            navigate("/home");
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            navigate("/unauthorized");
          } else {
            console.error("Authentication error:", error);
            navigate("/error");
          }
        } finally {
          setIsLoading(false);
        }
      }
    };
    handleAuthCode();
  }, [navigate]);

  const handleSignIn = async () => {
    setIsLoading(true);
    if (keycloakUrl) {
      window.location.href = keycloakUrl;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" component="h1" fontWeight="normal" mb={4}>
        {t("login.welcomeText")}
        <br />
        <Typography
          variant="h4"
          component="span"
          fontWeight="bold"
          display="inline"
        >
          {t("login.appName")}
        </Typography>
      </Typography>
      <img
        src={logo}
        alt="Vault Logo"
        style={{ width: "50vw", maxWidth: "300px", marginBottom: "3.5rem" }}
      />
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          mb: 4,
          maxWidth: "600px",
        }}
      >
        {t("login.description")}
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={handleSignIn}
        disabled={isLoading}
        sx={{
          px: 8,
          py: 1.5,
          fontSize: "1.1rem",
        }}
      >
        {isLoading ? (
          <>
            <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
            {t("common.signingIn")}
          </>
        ) : (
          t("common.signIn")
        )}
      </Button>
      <Button
        variant="text"
        size="small"
        sx={{
          mt: 3,
          color: "text.secondary",
          textDecoration: "underline",
          fontSize: "0.9rem",
        }}
        onClick={() => navigate("/how-it-works")}
      >
        {t("common.faq")}
      </Button>
    </Box>
  );
}

export default LoginPage;
