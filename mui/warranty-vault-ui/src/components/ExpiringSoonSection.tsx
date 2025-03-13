import React from "react";
import { Box, Typography, Stack, Paper } from "@mui/material";

interface ExpiringSoonSectionProps {
  expiringThisMonth: number;
  expiringThisYear: number;
  expiringLater: number;
}

const ExpiringSoonSection: React.FC<ExpiringSoonSectionProps> = ({
  expiringThisMonth,
  expiringThisYear,
  expiringLater,
}) => {
  const baseCircleStyle = {
    p: 1.5,
    borderRadius: "50%",
    width: 80,
    height: 80,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const getCircleStyle = (
    value: number,
    color: string,
    borderColor: string
  ) => ({
    ...baseCircleStyle,
    backgroundColor: value > 0 ? color : "background.paper",
    border: value > 0 ? `2px solid ${borderColor}` : "none",
  });

  return (
    <Box sx={{ mt: 3, mb: 3, width: "90%", mx: "auto" }}>
      <Typography
        variant="h6"
        component="h2"
        sx={{ pt: 2, mb: 2, textAlign: "center" }}
      >
        Expiring Warranties
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        sx={{ flexWrap: { xs: "wrap", sm: "nowrap" } }}
      >
        <Paper
          elevation={2}
          sx={getCircleStyle(expiringThisMonth, "#ffebee", "#ef5350")}
        >
          <Typography
            variant="h6"
            color={expiringThisMonth > 0 ? "error" : "text.primary"}
          >
            {expiringThisMonth}
          </Typography>
          <Typography variant="caption" align="center" color="text.secondary">
            Month
          </Typography>
        </Paper>

        <Paper
          elevation={2}
          sx={getCircleStyle(expiringThisYear, "#fff8e1", "#ffc107")}
        >
          <Typography
            variant="h6"
            color={expiringThisYear > 0 ? "warning.dark" : "text.primary"}
          >
            {expiringThisYear}
          </Typography>
          <Typography variant="caption" align="center" color="text.secondary">
            Year
          </Typography>
        </Paper>

        <Paper
          elevation={2}
          sx={getCircleStyle(expiringLater, "#e8f5e9", "#66bb6a")}
        >
          <Typography
            variant="h6"
            color={expiringLater > 0 ? "success.main" : "text.primary"}
          >
            {expiringLater}
          </Typography>
          <Typography variant="caption" align="center" color="text.secondary">
            1y+
          </Typography>
        </Paper>
      </Stack>
    </Box>
  );
};

export default ExpiringSoonSection;
