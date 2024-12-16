import { useEffect, useState } from "react";
import "../../App.css";
import "./HomePage.css";
import logo from "../../assets/vault-logo-simplistic.svg";
import addImg from "../../assets/add.svg";
import scanImg from "../../assets/scan.svg";
import folderImg from "../../assets/folder.svg";
import UserGreeting from "../../components/UserGreeting";
import { API_BASE_URL, ENDPOINTS } from "../../config/apiConstants";
import { useNavigate } from "react-router-dom";
import axiosApi from "../../config/axiosApiConfig";

function getUser(jwt: string) {
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
      console.error("Error fetching account:", error);
      return null;
    });
}

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username: string } | null>(null);

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
      getUser(jwt)
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
      <UserGreeting username={user.username} />
      <nav className="navbar">
        <div className="container-fluid flex-column justify-content-center pt-5">
          <img
            src={logo}
            alt="Vault Logo"
            className="mb-4"
            style={{ width: "5vh" }}
          />
          <h2 className="text-bold fs-1">My warranties</h2>
        </div>
      </nav>

      <div className="container-fluid d-flex flex-column align-items-center text-center mt-5">
        <div className="card add-card mb-4" style={{ width: "70vw" }}>
          <img
            src={addImg}
            className="card-img-top mx-auto pt-3"
            style={{ width: "5vh" }}
          />
          <div className="card-body">
            <p className="card-text">Manually add a warranty</p>
          </div>
        </div>
        <div className="card scan-card mb-4" style={{ width: "70vw" }}>
          <img
            src={scanImg}
            className="card-img-top mx-auto pt-3"
            style={{ width: "5vh" }}
          />
          <div className="card-body">
            <p className="card-text">Scan a warranty</p>
          </div>
        </div>
        <div className="card manage-card mb-4" style={{ width: "70vw" }}>
          <img
            src={folderImg}
            className="card-img-top mx-auto pt-3"
            style={{ width: "5vh" }}
          />
          <div className="card-body">
            <p className="card-text">Manage warranties</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
