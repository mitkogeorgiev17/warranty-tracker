import { useEffect } from "react";
import "../../App.css";
import "./LoginPage.css";
import logo from "../../assets/vault-logo-simplistic.svg";
import axiosApi from "../../config/axiosApiConfig";
import { API_BASE_URL, ENDPOINTS } from "../../config/apiConstants";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("jwt")) {
      console.log("Token found in session storage. Redirecting to home page.");

      navigate("/home");
    }
  }, []);

  const getCodeUrl = () => {
    const endpoint = ENDPOINTS.CODE_URL;

    axiosApi({
      method: endpoint.method,
      url: `${API_BASE_URL}${endpoint.path}`,
      responseType: "text",
    })
      .then((response) => {
        window.location.href = response.data;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetchTokenWithCode(code);
    }
  }, []);

  const fetchTokenWithCode = (code: string) => {
    const endpoint = ENDPOINTS.AUTHENTICATE;

    axiosApi({
      method: endpoint.method,
      url: `${API_BASE_URL}${endpoint.path}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        code: code,
      },
    })
      .then((tokenResponse) => {
        const jwt = tokenResponse.data.token;
        if (jwt) {
          sessionStorage.setItem("jwt", jwt);
          console.log("Token stored in sessionStorage.");
          navigate("/home");
        }
      })
      .catch((error) => {
        console.error("Error fetching token:", error);
      });
  };

  return (
    <>
      <div
        className="container d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <img
          src={logo}
          alt="Vault Logo"
          className="mb-5"
          style={{ width: "150px" }}
        />
        <h1 className="mb-3 mt-4 text-center text-bold">
          Welcome to <br />
          Warranty Vault!
        </h1>
        <button
          className="mt-2 px-5 btn btn-light btn-lg text-bold"
          onClick={getCodeUrl}
        >
          Sign in
        </button>
      </div>
    </>
  );
}

export default LoginPage;
