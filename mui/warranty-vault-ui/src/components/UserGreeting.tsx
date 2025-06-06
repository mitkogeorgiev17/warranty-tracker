import React, { useState } from "react";
import { Typography, Box, Avatar, Stack, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { User } from "../constants/User";
import { useTranslation } from "react-i18next";
import { Capacitor } from "@capacitor/core";
// FCM imports
import { getToken, isSupported } from "firebase/messaging";
import { messaging, VAPID_KEY } from "../config/firebaseConfig";
import { PushNotifications } from "@capacitor/push-notifications";
import axiosApi from "../config/axiosApiConfig";
import { API_BASE_URL, ENDPOINTS } from "../constants/apiConstants";

// TypeScript types
type DeviceType = "web" | "android" | "ios";

interface UserGreetingProps {
  user: User;
}

const UserGreeting: React.FC<UserGreetingProps> = ({ user }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState<
    "success" | "error" | "info"
  >("info");

  const isNative = Capacitor.isNativePlatform();

  // Check if notifications are supported in current environment
  const notificationsSupported =
    isNative || (typeof window !== "undefined" && "Notification" in window);

  // Show notification helper
  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" = "info"
  ) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setShowNotification(true);
  };

  // Register token with backend
  const registerTokenWithBackend = async (
    token: string,
    deviceType: DeviceType
  ): Promise<void> => {
    try {
      const endpoint = ENDPOINTS.REGISTER_TOKEN;
      const response = await axiosApi({
        method: endpoint.method,
        url: `${API_BASE_URL}${endpoint.path}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
        data: { token, deviceType },
      });
      if (response.data) {
        showSnackbar("Push notifications enabled successfully!", "success");
      }
    } catch (error) {
      console.error("Error registering FCM token:", error);
      showSnackbar("Failed to enable push notifications", "error");
    }
  };

  // Simplified FCM token registration
  const registerFCMToken = async (): Promise<void> => {
    try {
      if (!notificationsSupported) {
        showSnackbar(
          "Push notifications not supported on this platform",
          "error"
        );
        return;
      }

      const deviceType: DeviceType = isNative ? "android" : "web";

      if (isNative) {
        // Native platform handling
        const permResult = await PushNotifications.requestPermissions();
        if (permResult.receive !== "granted") {
          showSnackbar("Push notification permission denied", "error");
          return;
        }

        await PushNotifications.register();

        // Set up listener for token
        PushNotifications.addListener("registration", async (token) => {
          await registerTokenWithBackend(token.value, deviceType);
        });

        PushNotifications.addListener("registrationError", () => {
          showSnackbar("Failed to register for push notifications", "error");
        });
      } else {
        // Web platform handling
        if (!messaging) {
          showSnackbar("Firebase messaging not available", "error");
          return;
        }

        if (!(await isSupported())) {
          showSnackbar(
            "Push notifications not supported in this browser",
            "error"
          );
          return;
        }

        // Ensure service worker is registered
        if (!(await navigator.serviceWorker.getRegistration())) {
          await navigator.serviceWorker.register("/firebase-messaging-sw.js");
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Check permission - only call Notification API if it exists
        if (typeof window !== "undefined" && "Notification" in window) {
          if (Notification.permission !== "granted") {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
              showSnackbar("Notification permission denied", "error");
              return;
            }
          }
        } else {
          showSnackbar("Notification API not available", "error");
          return;
        }

        // Get FCM token
        const fcmToken = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration:
            await navigator.serviceWorker.getRegistration(),
        });

        if (fcmToken) {
          await registerTokenWithBackend(fcmToken, deviceType);
        } else {
          showSnackbar("Could not get notification token", "error");
        }
      }
    } catch (error: any) {
      console.error("FCM registration error:", error);
      showSnackbar("Error setting up notifications", "error");
    }
  };

  const handleProfileClick = async () => {
    // Only register if notifications are supported and permission not denied
    if (notificationsSupported) {
      if (isNative) {
        // For native, always try to register
        await registerFCMToken();
      } else if (typeof window !== "undefined" && "Notification" in window) {
        // For web, check permission first
        if (Notification.permission !== "denied") {
          await registerFCMToken();
        }
      }
    }
    navigate("/profile");
  };

  // Helper function to check if notifications are granted
  const notificationsGranted = () => {
    if (isNative) {
      // For native, we'll assume granted if supported (actual check happens during registration)
      return notificationsSupported;
    } else {
      // For web, check actual permission
      return (
        notificationsSupported &&
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      );
    }
  };

  return (
    <>
      <Box
        sx={{
          pt: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "rgba(169, 133, 240, 0.05)",
          },
          transition: "background-color 0.3s",
          mx: "auto",
          mt: 2,
          mb: 1,
        }}
        onClick={handleProfileClick}
      >
        <Stack direction="row" spacing={2.5} alignItems="center">
          <Avatar
            sx={{
              bgcolor: "rgba(169, 133, 240, 0.7)",
              width: 48,
              height: 48,
            }}
          >
            <PersonIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              component="h1"
              sx={{ lineHeight: 1.2, fontWeight: 500 }}
            >
              {t("greeting.welcome", { name: user.firstName })}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.2 }}
            >
              {t("greeting.viewEditProfile")}
            </Typography>
          </Box>
          {notificationsGranted() && (
            <NotificationsIcon
              sx={{
                color: "rgba(169, 133, 240, 0.7)",
                fontSize: 20,
                ml: 1,
              }}
            />
          )}
        </Stack>
      </Box>
      <Snackbar
        open={showNotification}
        autoHideDuration={4000}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowNotification(false)}
          severity={notificationSeverity}
          sx={{ width: "100%" }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserGreeting;
