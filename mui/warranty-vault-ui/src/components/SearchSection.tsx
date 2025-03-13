import React from "react";
import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchSection: React.FC = () => {
  // Placeholder for search functionality
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Future implementation for search functionality
    console.log("Search query:", event.target.value);
  };

  return (
    <Box sx={{ mt: 3, mb: 3, width: "100%", mx: "auto" }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search your warranties..."
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 2,
            backgroundColor: "background.paper",
            "&:hover": {
              backgroundColor: "action.hover",
            },
            boxShadow: 1,
          },
        }}
      />
    </Box>
  );
};

export default SearchSection;
