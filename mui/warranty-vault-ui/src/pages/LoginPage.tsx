import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, Box, Typography } from "@mui/material";
import axiosApi from "../config/axiosApiConfig";
import { API_BASE_URL, ENDPOINTS } from "../constants/apiConstants";
import logo from "../assets/vault-logo-simplistic.svg";
import useKeycloakUrl from "../hooks/useKeycloakUrl";
import { useTranslation } from "react-i18next";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";

function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const authAttempted = useRef(false);
  const keycloakUrl = useKeycloakUrl();
  const { t } = useTranslation();

  const isNative = Capacitor.isNativePlatform();

  // Set up deep link handler for native platforms
  useEffect(() => {
    if (!isNative) return;

    // Create a variable to store the listener handles
    let urlOpenListenerHandle: any = null;
    let appStateChangeListenerHandle: any = null;

    // Set up the listeners
    const setupListeners = async () => {
      // Listen for deep links
      urlOpenListenerHandle = await App.addListener("appUrlOpen", ({ url }) => {
        console.log("Deep link received:", url);

        try {
          // Parse the URL to extract code and state
          const urlObj = new URL(url);
          const params = new URLSearchParams(urlObj.search);
          const code = params.get("code");
          const state = params.get("state");

          if (code) {
            // Close the browser if it's still open
            Browser.close().catch((e) =>
              console.log("Error closing browser:", e)
            );

            // Process the authentication code
            handleAuthCode(code, state);
          }
        } catch (e) {
          console.error("Error parsing deep link URL:", e);
        }
      });

      // Listen for app state changes to detect when browser is closed without authentication
      appStateChangeListenerHandle = await App.addListener(
        "appStateChange",
        ({ isActive }) => {
          // When app comes back to foreground
          if (isActive && isLoading) {
            // Check if authentication is still in progress after a delay
            // This delay allows deep link handler to process first if auth was successful
            setTimeout(() => {
              if (isLoading && !authAttempted.current) {
                console.log(
                  "App returned to foreground without authentication completion"
                );
                setIsLoading(false);
              }
            }, 1000);
          }
        }
      );
    };

    // Call the async setup function
    setupListeners();

    // Clean up listeners on component unmount
    return () => {
      if (urlOpenListenerHandle) {
        urlOpenListenerHandle.remove();
      }
      if (appStateChangeListenerHandle) {
        appStateChangeListenerHandle.remove();
      }
    };
  }, [isLoading]);

  // Process authentication code
  const handleAuthCode = async (code: string, state: string | null) => {
    if (authAttempted.current) return;

    // Verify state parameter if present
    const storedState = sessionStorage.getItem("keycloak_state");
    if (state && storedState && state !== storedState) {
      console.error("State mismatch in authentication response");
      navigate("/error");
      return;
    }

    // Clear state after use
    sessionStorage.removeItem("keycloak_state");

    authAttempted.current = true;
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
  };

  // Check for auth code in URL (for web browser flow)
  useEffect(() => {
    // Check if user is already logged in
    if (sessionStorage.getItem("jwt")) {
      navigate("/home");
      return;
    }

    // Check for auth code in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code && !authAttempted.current) {
      handleAuthCode(code, state);
    }
  }, [navigate]);

  // For browser flow, add a timeout to reset loading state
  useEffect(() => {
    let timeoutId: number | undefined;

    if (isLoading && isNative) {
      // Set a timeout to reset loading state after a reasonable period (30 seconds)
      timeoutId = window.setTimeout(() => {
        if (isLoading && !authAttempted.current) {
          console.log("Login timeout - resetting loading state");
          setIsLoading(false);
        }
      }, 30000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, isNative]);

  // Handler for browser's "close" event for web platforms
  useEffect(() => {
    if (isNative) return; // Skip for native platforms

    // For web platforms, listen for browser focus events
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        isLoading &&
        !authAttempted.current
      ) {
        // User came back to the app without completing authentication
        setTimeout(() => {
          if (isLoading && !authAttempted.current) {
            console.log(
              "Browser visibility changed without authentication completion"
            );
            setIsLoading(false);
          }
        }, 1000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isLoading, isNative]);

  // Handle sign-in button click
  const handleSignIn = async () => {
    if (!keycloakUrl) {
      console.error("Keycloak URL not available");
      return;
    }

    // Reset auth attempted flag
    authAttempted.current = false;
    setIsLoading(true);

    try {
      if (isNative) {
        // For mobile, use Capacitor Browser
        await Browser.open({
          url: keycloakUrl,
          toolbarColor: "#262626",
          presentationStyle: "fullscreen",
        });
      } else {
        // For web, navigate directly to the keycloak URL
        // This will redirect back to your app after login
        window.location.href = keycloakUrl;
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      setIsLoading(false);
    }
  };

  // Your existing UI code remains the same
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
    </Box>
  );
}

export default LoginPage;
