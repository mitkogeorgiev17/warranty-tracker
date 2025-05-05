import axiosApi from "../config/axiosApiConfig";
import { API_BASE_URL, ENDPOINTS } from "../constants/apiConstants";
import { Container, Paper } from "@mui/material";
import UserGreeting from "../components/UserGreeting";
import HomePageMenu from "../components/HomePageMenu";
import ExpiringSoonSection from "../components/ExpiringSoonSection";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../constants/UserContext.tsx";
import { useTranslation } from "react-i18next";

function HomePage() {
  const navigate = useNavigate();
  const { user, setUser, setIsLoading } = useUser();
  const { i18n } = useTranslation();

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
          await i18n.changeLanguage(response.data.language.toLowerCase());
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
          mb: 3,
          mt: 6,
          width: "90%",
          mx: "auto",
        }}
      >
        {user && <UserGreeting user={user} />}
      </Paper>
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
