import React from "react";
import { Typography, Box, Avatar, Stack } from "@mui/material";

interface UserGreetingProps {
  name: string;
}

const UserGreeting: React.FC<UserGreetingProps> = ({ name }) => {
  // Get first letter of name for the avatar
  const firstLetter = name ? name.charAt(0).toUpperCase() : "";

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
        maxWidth: "360px", // Add max-width constraint
        mx: "auto", // Center the component
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        {" "}
        {/* Reduced spacing from 2 to 1.5 */}
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 40, // Reduced from 48px
            height: 40, // Reduced from 48px
          }}
        >
          {firstLetter}
        </Avatar>
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="subtitle1" component="h1">
            {" "}
            {/* Changed from h6 to subtitle1 for narrower text */}
            {greeting}, {name}!
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
