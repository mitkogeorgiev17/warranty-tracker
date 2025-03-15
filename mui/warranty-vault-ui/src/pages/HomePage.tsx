import axiosApi from "../config/axiosApiConfig";
import { API_BASE_URL, ENDPOINTS } from "../constants/apiConstants";
import logo from "../assets/vault-logo-simplistic.svg";
import { Container, Paper, Box, Divider } from "@mui/material";
import UserGreeting from "../components/UserGreeting";
import HomePageMenu from "../components/HomePageMenu";
import ExpiringSoonSection from "../components/ExpiringSoonSection";
import SearchSection from "../components/SearchSection";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { User } from "../constants/User";

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const endpoint = ENDPOINTS.ACCOUNT;
        const response = await axiosApi({
          method: endpoint.method,
          url: `${API_BASE_URL}${endpoint.path}`,
          responseType: "json",
        });
        if (response.data) {
          setUser(response.data);
        } else {
          navigate("/error");
        }
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          navigate("/unauthorized");
        } else {
          navigate("/error");
        }
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          backgroundColor: "background.paper",
          pb: 1,
          mt: 3,
          width: "90%",
          mx: "auto",
        }}
      >
        {user && <UserGreeting user={user} />}
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
          width: "90%",
          mx: "auto",
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
