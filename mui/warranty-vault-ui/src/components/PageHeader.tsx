import { Box, IconButton, Typography, Paper } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  borderColor?: string; // Made optional with default value
}

/**
 * Page header component with a back button and title
 *
 * @param title - The title to display in the header
 * @param borderColor - The color of the border (defaults to "primary.main" if not provided)
 */
const PageHeader = ({
  title,
  borderColor = "primary.main",
}: PageHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/home");
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        backgroundColor: "background.paper",
        p: 1,
        mt: 10,
        width: "90%",
        mx: "auto",
        border: "2px solid",
        borderColor: borderColor,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
          px: 2,
        }}
      >
        <IconButton onClick={handleBack} aria-label="back">
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            flex: 1,
            textAlign: "right",
            pr: 2,
          }}
        >
          {title}
        </Typography>
      </Box>
    </Paper>
  );
};

export default PageHeader;
