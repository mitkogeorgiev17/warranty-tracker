import React from "react";
import { Typography, Box, Avatar, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import { User } from "../constants/User";
import { useTranslation } from "react-i18next";

interface UserGreetingProps {
  user: User;
}

const UserGreeting: React.FC<UserGreetingProps> = ({ user }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
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
      </Stack>
    </Box>
  );
};

export default UserGreeting;
