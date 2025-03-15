import React from "react";
import { Typography, Box, Avatar, Stack } from "@mui/material";
import { User } from "../constants/User";

interface UserGreetingProps {
  user: User;
}

const UserGreeting: React.FC<UserGreetingProps> = ({ user }) => {
  // Get first letter of name for the avatar
  const firstLetter = user.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : "";

  // Get current time to determine greeting
  const hours = new Date().getHours();
  let greeting = "Hello";
  if (hours < 12) {
    greeting = "Good morning";
  } else if (hours < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pt: 1,
        maxWidth: "360px",
        mx: "auto",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        {" "}
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 40,
            height: 40,
          }}
        >
          {firstLetter}
        </Avatar>
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="subtitle1" component="h1">
            {" "}
            {greeting}, {user.firstName}!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back to Warranty Vault
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default UserGreeting;
