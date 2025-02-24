import { useEffect, useState } from "react";
import axiosApi from "../../config/axiosApiConfig";
import { API_BASE_URL, ENDPOINTS } from "../../config/apiConstants";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/User";
import "../../App.css";
import "./HomePage.css";
import UserGreeting from "../../components/user-greeting/UserGreeting";
import ManageWarranties from "../../components/manage-warranties/ManageWarranties";

function getUser(jwt: string, navigate: ReturnType<typeof useNavigate>) {
  const endpoint = ENDPOINTS.ACCOUNT;

  return axiosApi({
    method: endpoint.method,
    url: `${API_BASE_URL}${endpoint.path}`,
    responseType: "json",
    headers: { Authorization: `Bearer ${jwt}` },
  })
    .then((response) => {
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      if (error.status === 401) {
        navigate("/unauthorized");
      }

      console.error("Error fetching account:", error);
      return null;
    });
}

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const jwt = sessionStorage.getItem("jwt");

  useEffect(() => {
    if (!jwt) {
      console.error("Unauthorized: No JWT token found.");
      navigate("/unauthorized");
      return;
    }

    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const parsedUser = JSON.parse(userString);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        localStorage.removeItem("user");
        navigate("/unauthorized");
      }
    } else {
      getUser(jwt, navigate)
        .then((fetchedUser) => {
          if (fetchedUser) {
            setUser(fetchedUser);
            localStorage.setItem("user", JSON.stringify(fetchedUser));
          } else {
            navigate("/unauthorized");
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user:", error);
          navigate("/unauthorized");
        });
    }
  }, [jwt, navigate]);

  if (!user) {
    navigate("/unauthorized");
    return null;
  }

  return (
    <>
      <UserGreeting username={user.firstName} />
      <ManageWarranties />
    </>
  );
}

export default HomePage;
