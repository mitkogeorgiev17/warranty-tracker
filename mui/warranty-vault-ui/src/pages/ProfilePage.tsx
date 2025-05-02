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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import { useUser } from "../constants/UserContext.tsx";
import { toast } from "sonner";
import axiosApi from "../config/axiosApiConfig";
import { API_BASE_URL, ENDPOINTS } from "../constants/apiConstants";
import PageHeader from "../components/PageHeader.tsx";
import { useTranslation } from "react-i18next";

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
  const [isLanguageChanged, setIsLanguageChanged] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // If user is not loaded yet, navigate to home to trigger the fetch
    if (!user && !isLoading) {
      navigate("/home");
    } else if (user) {
      // Set language from user data
      setLanguage(user.language);

      // Initialize i18n with the user's language preference
      if (user.language) {
        i18n.changeLanguage(user.language.toLowerCase());
      }
    }
  }, [user, navigate, isLoading, i18n]);

  const handleLanguageChange = (event: any) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    setIsLanguageChanged(newLanguage !== user?.language);
  };

  const handleSaveLanguage = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Replace with your actual API endpoint
      const endpoint = ENDPOINTS.UPDATE_ACCOUNT;

      const updatedUser = {
        ...user,
        updatedLanguage: language,
      };

      await axiosApi({
        method: endpoint.method,
        url: `${API_BASE_URL}${endpoint.path}`,
        data: updatedUser,
        responseType: "json",
      });

      // First change the language in i18next
      await i18n.changeLanguage(language.toLowerCase());

      // Then update the user in context with the new language
      // This is important to update in correct order
      updateUser({
        ...user,
        language: language, // Update user object with the new language
      });

      toast.success(t("profile.languageUpdated"));
      setIsLanguageChanged(false);
    } catch (error) {
      console.error("Failed to update language preference:", error);
      toast.error(t("profile.failedToUpdate"));
      // Reset to original language on error
      setLanguage(user.language);
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
      <Box sx={{ py: 2, width: "90%", mx: "auto" }}>
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
                    width: 90,
                    height: 90,
                    bgcolor: "rgba(169, 133, 240, 0.7)",
                  }}
                >
                  <PersonIcon sx={{ fontSize: 48 }} />
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
            <Typography variant="h6" sx={{ mb: 1 }}>
              {t("profile.languageSettings")}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
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

              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveLanguage}
                  disabled={!isLanguageChanged}
                  size="medium"
                >
                  {t("common.save")}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default ProfilePage;
