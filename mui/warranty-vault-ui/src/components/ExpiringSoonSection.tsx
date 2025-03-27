import React from "react";
import { Box, Typography, Stack, Paper } from "@mui/material";

interface ExpiringSoonSectionProps {
  lessThanOneMonth: number | undefined;
  oneToTwelveMonths: number | undefined;
  moreThanOneYear: number | undefined;
}

const ExpiringSoonSection: React.FC<ExpiringSoonSectionProps> = ({
  lessThanOneMonth,
  oneToTwelveMonths,
  moreThanOneYear,
}) => {
  // Function to create muted version of colors
  const getMutedColor = (color: string): string => {
    // For standard hex colors like #ef5350
    if (color.startsWith("#") && color.length === 7) {
      // Convert to RGB, reduce intensity, and convert back to hex
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      // Mix with white to create muted version (70% original, 30% white)
      const mutedR = Math.round(r * 0.7 + 255 * 0.3)
        .toString(16)
        .padStart(2, "0");
      const mutedG = Math.round(g * 0.7 + 255 * 0.3)
        .toString(16)
        .padStart(2, "0");
      const mutedB = Math.round(b * 0.7 + 255 * 0.3)
        .toString(16)
        .padStart(2, "0");

      return `#${mutedR}${mutedG}${mutedB}`;
    }
    return color; // Return original if not standard format
  };
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
    value: number | undefined,
    color: string,
    borderColor: string
  ) => ({
    ...baseCircleStyle,
    backgroundColor: (value ?? 0) > 0 ? color : "background.paper",
    border: `2px solid ${
      (value ?? 0) > 0 ? borderColor : getMutedColor(borderColor)
    }`, // Muted version of color when value is 0
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
          sx={getCircleStyle(lessThanOneMonth, "#ffebee", "#ef5350")}
        >
          <Typography
            variant="h6"
            color={(lessThanOneMonth ?? 0) > 0 ? "error" : "text.primary"}
          >
            {lessThanOneMonth ?? 0}
          </Typography>
          <Typography variant="caption" align="center" color="text.secondary">
            Month
          </Typography>
        </Paper>
        <Paper
          elevation={2}
          sx={getCircleStyle(oneToTwelveMonths, "#fff8e1", "#ffc107")}
        >
          <Typography
            variant="h6"
            color={
              (oneToTwelveMonths ?? 0) > 0 ? "warning.dark" : "text.primary"
            }
          >
            {oneToTwelveMonths ?? 0}
          </Typography>
          <Typography variant="caption" align="center" color="text.secondary">
            Year
          </Typography>
        </Paper>
        <Paper
          elevation={2}
          sx={getCircleStyle(moreThanOneYear, "#e8f5e9", "#66bb6a")}
        >
          <Typography
            variant="h6"
            color={(moreThanOneYear ?? 0) > 0 ? "success.main" : "text.primary"}
          >
            {moreThanOneYear ?? 0}
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
