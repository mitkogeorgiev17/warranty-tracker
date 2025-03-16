import React from "react";
import { Grid, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ListAltIcon from "@mui/icons-material/ListAlt";

const HomePageMenu: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateWarranty = () => {
    navigate("/create");
  };

  const handleScanWarranty = () => {
    navigate("/scan");
  };

  const handleManageWarranties = () => {
    navigate("/manage");
  };

  // Common button styles with purple theme
  const buttonStyle = {
    backgroundColor: "rgba(169, 133, 240, 0.1)", // Light muted purple background
    border: "2px solid",
    color: "#81c784", // Green text/icon color (from previous button background)
    py: 3,
    borderRadius: 2,
    flexDirection: "column",
    gap: 1.5,
  };

  return (
    <Box sx={{ py: 1, width: "90%", mx: "auto" }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleCreateWarranty}
            sx={{
              ...buttonStyle,
              color: "#81c784", // Green text/icon (same as the previous button background)
            }}
          >
            <AddCircleOutlineIcon sx={{ fontSize: 48 }} />
            <Typography variant="h6" color="inherit">
              Create Warranty
            </Typography>
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleScanWarranty}
            sx={{
              ...buttonStyle,
              color: "#64b5f6", // Blue text/icon (same as the previous button background)
            }}
          >
            <QrCodeScannerIcon sx={{ fontSize: 48 }} />
            <Typography variant="h6" color="inherit">
              Scan Warranty
            </Typography>
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleManageWarranties}
            sx={{
              ...buttonStyle,
              color: "#ffb74d", // Orange text/icon (same as the previous button background)
            }}
          >
            <ListAltIcon sx={{ fontSize: 48 }} />
            <Typography variant="h6" color="inherit">
              Manage Warranties
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePageMenu;
