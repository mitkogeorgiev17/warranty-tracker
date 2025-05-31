import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Divider,
  MenuItem,
  CircularProgress,
  Container,
  Select,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Fab,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LanguageIcon from "@mui/icons-material/Language";
import { useUser } from "../constants/UserContext.tsx";
import { toast } from "sonner";
import axiosApi from "../config/axiosApiConfig";
import { API_BASE_URL, ENDPOINTS } from "../constants/apiConstants";
import PageHeader from "../components/PageHeader.tsx";
import { useTranslation } from "react-i18next";
import { Capacitor } from "@capacitor/core";
import { PushNotifications, Token } from "@capacitor/push-notifications";
import { getToken } from "firebase/messaging";
import { messaging, VAPID_KEY } from "../config/firebaseConfig";

export interface ExpiringWarranties {
  expired: number;
  expiringSoon: number;
  valid: number;
}

const GB_FLAG = "🇬🇧";
const BG_FLAG = "🇧🇬";

const ProfilePage: React.FC = () => {
  const { user, updateUser, isLoading, setIsLoading } = useUser();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const { t, i18n } = useTranslation();

  // Track if any changes have been made
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // If user is not loaded yet, navigate to home to trigger the fetch
    if (!user && !isLoading) {
      navigate("/home");
    } else if (user) {
      // Set language from user data
      setLanguage(user.language);

      // Set email notifications from user data
      setEmailNotifications(user.emailNotifications || false);

      // Set push notifications from user data
      setPushNotifications(user.pushNotifications || false);

      // Initialize i18n with the user's language preference
      if (user.language) {
        i18n.changeLanguage(user.language.toLowerCase());
      }
    }
  }, [user, navigate, isLoading, i18n]);

  // Check if any changes were made to update the hasChanges state
  useEffect(() => {
    if (!user) return;

    const languageChanged = language !== user.language;
    const emailNotificationsChanged =
      emailNotifications !== user.emailNotifications;
    const pushNotificationsChanged =
      pushNotifications !== user.pushNotifications;

    setHasChanges(
      languageChanged || emailNotificationsChanged || pushNotificationsChanged
    );
  }, [language, emailNotifications, pushNotifications, user]);

  // Auto-register for push notifications if enabled
  useEffect(() => {
    const autoRegisterIfEnabled = async () => {
      if (user?.pushNotifications) {
        try {
          await registerForNotifications();
        } catch (error) {
          console.error("Auto-registration failed:", error);
        }
      }
    };

    if (user) {
      autoRegisterIfEnabled();
    }
  }, [user]);

  const registerForNotifications = async (): Promise<string | null> => {
    try {
      let token: string;

      if (Capacitor.isNativePlatform()) {
        token = await registerCapacitorToken();
      } else {
        token = await registerWebToken();
      }

      await sendTokenToBackend(token);
      return token;
    } catch (error) {
      console.error("Failed to register for notifications:", error);
      throw error;
    }
  };

  const registerCapacitorToken = async (): Promise<string> => {
    const permissionResult = await PushNotifications.requestPermissions();

    if (permissionResult.receive !== "granted") {
      throw new Error("Push notification permission denied");
    }

    await PushNotifications.register();

    return new Promise((resolve, reject) => {
      PushNotifications.addListener("registration", (token: Token) => {
        console.log("Capacitor token:", token.value);
        resolve(token.value);
      });

      PushNotifications.addListener("registrationError", (error: any) => {
        console.error("Capacitor registration error:", error);
        reject(error);
      });

      setTimeout(() => reject(new Error("Token registration timeout")), 10000);
    });
  };

  const registerWebToken = async (): Promise<string> => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Push notification permission denied");
    }

    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      console.log("Firebase web token:", token);
      return token;
    } else {
      throw new Error("Service Worker not supported");
    }
  };

  const sendTokenToBackend = async (token: string): Promise<void> => {
    const platform = Capacitor.isNativePlatform()
      ? Capacitor.getPlatform()
      : "web";

    await axiosApi({
      method: "POST",
      url: `${API_BASE_URL}/notifications/token`,
      data: {
        token: token,
        deviceType: platform,
        deviceInfo: {
          platform: platform,
          isNative: Capacitor.isNativePlatform(),
        },
      },
    });
  };

  const unregisterToken = async (token: string): Promise<void> => {
    await axiosApi({
      method: "DELETE",
      url: `${API_BASE_URL}/api/notifications/unregister-token`,
      data: { token },
    });

    if (Capacitor.isNativePlatform()) {
      PushNotifications.removeAllListeners();
    }
  };

  const handleLanguageChange = (event: any) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
  };

  const handleEmailNotificationsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.checked;
    setEmailNotifications(newValue);
  };

  const handlePushNotificationsChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.checked;

    try {
      if (newValue) {
        console.log("Registering for push notifications...");
        await registerForNotifications();
        setPushNotifications(newValue);
        toast.success("Push notifications enabled");
      } else {
        console.log("Unregistering push notifications...");
        // We don't have the token stored locally, so we'll let the backend handle cleanup
        // when the user setting is saved
        setPushNotifications(newValue);
        toast.success("Push notifications disabled");
      }
    } catch (error) {
      console.error("Failed to update push notification settings:", error);
      toast.error("Failed to update push notification settings");
      // Don't update state on error
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const endpoint = ENDPOINTS.UPDATE_ACCOUNT;

      // Only include fields that have changed
      const updatedData: any = { ...user };

      if (language !== user.language) {
        updatedData.updatedLanguage = language;
      }

      if (emailNotifications !== user.emailNotifications) {
        updatedData.updatedEmailNotifications = emailNotifications;
      }

      if (pushNotifications !== user.pushNotifications) {
        updatedData.updatedPushNotifications = pushNotifications;
      }

      await axiosApi({
        method: endpoint.method,
        url: `${API_BASE_URL}${endpoint.path}`,
        data: updatedData,
        responseType: "json",
      });

      // If language changed, update i18n first
      if (language !== user.language) {
        await i18n.changeLanguage(language.toLowerCase());
      }

      // Update user in context with all changes
      updateUser({
        ...user,
        language: language,
        emailNotifications: emailNotifications,
        pushNotifications: pushNotifications,
      });

      toast.success(t("profile.settingsSaved"));
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to update user settings:", error);
      toast.error(t("profile.failedToUpdate"));

      // Reset to original values on error
      setLanguage(user.language);
      setEmailNotifications(user.emailNotifications || false);
      setPushNotifications(user.pushNotifications || false);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-compute available languages each render to ensure translations are current
  const availableLanguages = [
    { value: "EN", label: t("languages.english"), flag: GB_FLAG },
    { value: "BG", label: t("languages.bulgarian"), flag: BG_FLAG },
  ];

  // Common card styles with purple theme matching the HomePageMenu
  const cardStyle = {
    backgroundColor: "background.paper",
    border: "1px solid rgba(169, 133, 240, 0.2)",
    borderRadius: 2,
    mb: 2,
  };

  if (isLoading) {
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <>
        <PageHeader title={t("pages.profile")} />
        <Container>
          <Box sx={{ textAlign: "center", py: 5 }}>
            <Typography variant="h5">
              {t("profile.userDataNotAvailable")}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/home")}
              sx={{ mt: 2 }}
            >
              {t("profile.goToHome")}
            </Button>
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <PageHeader title={t("pages.profile")} />
      <Box sx={{ py: 2, width: "90%", mx: "auto", pb: 10 }}>
        {/* Personal Info Card */}
        <Card sx={cardStyle}>
          <CardContent sx={{ pt: 2, pb: 2 }}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sm={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "rgba(169, 133, 240, 0.7)",
                  }}
                >
                  <PersonIcon sx={{ fontSize: 50 }} />
                </Avatar>
              </Grid>

              <Grid item xs={12} sm={9}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      {t("profile.firstName")}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {user.firstName}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      {t("profile.lastName")}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {user.lastName}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      {t("profile.username")}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {user.username}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      {t("profile.email")}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {user.email}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Language Settings Card */}
        <Card sx={cardStyle}>
          <CardContent sx={{ pt: 2, pb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LanguageIcon sx={{ mr: 1, color: "rgba(169, 133, 240, 0.9)" }} />
              <Typography variant="h6">
                {t("profile.languageSettings")}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="language-select-label">
                    {t("common.language")}
                  </InputLabel>
                  <Select
                    labelId="language-select-label"
                    id="language-select"
                    value={language}
                    onChange={handleLanguageChange}
                    label={t("common.language")}
                    renderValue={(selected) => {
                      const selectedLang = availableLanguages.find(
                        (lang) => lang.value === selected
                      );
                      return (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography sx={{ mr: 1, fontSize: "1.2rem" }}>
                            {selectedLang?.flag}
                          </Typography>
                          <Typography>{selectedLang?.label}</Typography>
                        </Box>
                      );
                    }}
                  >
                    {availableLanguages.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <ListItemIcon sx={{ minWidth: "auto", mr: 2 }}>
                          <Typography sx={{ fontSize: "1.2rem" }}>
                            {option.flag}
                          </Typography>
                        </ListItemIcon>
                        <ListItemText primary={option.label} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Notification Settings Card */}
        <Card sx={cardStyle}>
          <CardContent sx={{ pt: 2, pb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <NotificationsIcon
                sx={{ mr: 1, color: "rgba(169, 133, 240, 0.9)" }}
              />
              <Typography variant="h6">
                {t("profile.notificationSettings")}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailNotifications}
                        onChange={handleEmailNotificationsChange}
                        color="primary"
                      />
                    }
                    label={t("profile.warrantyNotifications")}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {t("profile.warrantyNotificationsDescription")}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={pushNotifications}
                        onChange={handlePushNotificationsChange}
                        color="primary"
                      />
                    }
                    label={t("profile.pushNotifications")}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {t("profile.pushNotificationsDescription")}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Floating save button that appears only when changes are detected */}
      {hasChanges && (
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 0,
            left: 0,
            display: "flex",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <Fab
            variant="extended"
            color="primary"
            onClick={handleSaveChanges}
            sx={{
              px: 4,
              boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            <SaveIcon sx={{ mr: 1 }} />
            {t("common.save")}
          </Fab>
        </Box>
      )}
    </>
  );
};

export default ProfilePage;
