import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import Lottie from "lottie-react"; // You'll need to install this package

// Import the animation data
// Make sure you save the animation JSON in your assets folder
const animationData = {
  v: "5.5.7",
  meta: { g: "LottieFiles AE 0.1.20", a: "", k: "", d: "", tc: "#262626" },
  fr: 60,
  ip: 0,
  op: 227,
  w: 600,
  h: 600,
  nm: "Scanning",
  // ... rest of the animation data from your JSON file
};

interface ScanningLoaderProps {
  message?: string;
}

const ScanningLoader: React.FC<ScanningLoaderProps> = ({
  message = "Scanning document. Please wait...",
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        backdropFilter: "blur(10px)",
        zIndex: 10,
        borderRadius: 3,
      }}
    >
      <Box sx={{ width: "200px", height: "200px", mb: 2 }}>
        <Lottie animationData={animationData} loop={true} autoplay={true} />
      </Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {message}
      </Typography>
      <CircularProgress size={24} sx={{ color: "#64b5f6" }} />
    </Box>
  );
};

export default ScanningLoader;
