import axiosApi from "../config/axiosApiConfig";
import { API_BASE_URL, ENDPOINTS } from "../constants/apiConstants";
import logo from "../assets/vault-logo-simplistic.svg";
import { Container, Paper, Box, Divider } from "@mui/material";
import UserGreeting from "../components/UserGreeting";
import HomePageMenu from "../components/HomePageMenu";
import ExpiringSoonSection from "../components/ExpiringSoonSection";
import SearchSection from "../components/SearchSection";

function HomePage() {
  // No need for componentStyle since we're applying width constraints directly in components
  return (
    <Container maxWidth="lg">
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          backgroundColor: "background.paper",
          pb: 1,
          mt: 3,
          width: "90%", // Match HomePageMenu width
          mx: "auto", // Center the paper
        }}
      >
        <UserGreeting name={"Ludkoto"} />
      </Paper>

      <Box sx={{ width: "90%", mx: "auto" }}>
        <SearchSection />
      </Box>

      <HomePageMenu />

      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          backgroundColor: "background.paper",
          pb: 0.5,
          pt: 0,
          width: "90%", // Match HomePageMenu width
          mx: "auto", // Center the paper
        }}
      >
        <ExpiringSoonSection
          expiringThisMonth={1}
          expiringThisYear={1}
          expiringLater={3}
        />
      </Paper>
    </Container>
  );
}

export default HomePage;
