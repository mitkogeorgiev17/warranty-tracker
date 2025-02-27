import { useEffect, useState } from "react";
import axiosApi from "../../config/axiosApiConfig";
import { API_BASE_URL, ENDPOINTS } from "../../config/apiConstants";
import { User } from "../../types/User";
import "../../App.css";
import "./HomePage.css";
import UserGreeting from "../../components/user-greeting/UserGreeting";

import logo from "../../assets/vault-logo-simplistic.svg";
import addImg from "../../assets/add-icon.svg";
import scanImg from "../../assets/scan.svg";
import folderImg from "../../assets/folder.svg";
import { useNavigate } from "react-router-dom";
import HomePageButton from "../../components/menu-navigation/HomePageButton";

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

  const handleWarrantiesClick = () => {
    navigate("/warranties");
  };

  const handleAddClick = () => {
    navigate("/warranties/add");
  };

  const handleScanClick = () => {
    navigate("/warranties/scan");
  };

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
      <>
        <nav className="navbar">
          <div className="container-fluid flex-column justify-content-center pt-5">
            <img
              src={logo}
              alt="Vault Logo"
              className="mb-4"
              style={{ width: "5vh" }}
            />
            <h2 className="text-bold fs-1">Manage warranties</h2>
          </div>
        </nav>

        <div className="container-fluid d-flex flex-column align-items-center text-center mt-5">
          <HomePageButton img={addImg} handleClick={handleAddClick} />
          <HomePageButton img={scanImg} handleClick={handleScanClick} />
          <HomePageButton img={folderImg} handleClick={handleWarrantiesClick} />
        </div>
      </>
    </>
  );
}

export default HomePage;
