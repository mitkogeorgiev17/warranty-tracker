import axiosApi from "../config/axiosApiConfig";
import { API_BASE_URL, ENDPOINTS } from "../constants/apiConstants";
import { Container, Paper, Box } from "@mui/material";
import UserGreeting from "../components/UserGreeting";
import HomePageMenu from "../components/HomePageMenu";
import ExpiringSoonSection from "../components/ExpiringSoonSection";
import SearchSection from "../components/SearchSection";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../constants/UserContext.tsx";

function HomePage() {
  const navigate = useNavigate();
  const { user, setUser, isLoading, setIsLoading } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      // Skip if we already have user data
      if (user) return;

      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate, setUser, user, setIsLoading]);

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
          lessThanOneMonth={user?.warrantyCountsProjection.lessThanOneMonth}
          oneToTwelveMonths={user?.warrantyCountsProjection.oneToTwelveMonths}
          moreThanOneYear={user?.warrantyCountsProjection.moreThanOneYear}
        />
      </Paper>
    </Container>
  );
}

export default HomePage;
