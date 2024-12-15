import { useEffect } from "react";
import "../../App.css";
import "./LoginPage.css";
import logo from "../../assets/vault-logo-simplistic.svg";
import axios from "axios";
import { API_BASE_URL, ENDPOINTS } from "../../config/apiConstants";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      console.log("Token found in session storage. Redirecting to home page.");

      navigate("/home");
    }
  });

  const getCodeUrl = async () => {
    try {
      const endpoint = ENDPOINTS.CODE_URL;
      const response = await axios({
        method: endpoint.method,
        url: `${API_BASE_URL}${endpoint.path}`,
        responseType: "text",
      });
      window.location.href = response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetchTokenWithCode(code);
    }
  }, []);

  const fetchTokenWithCode = async (code: string) => {
    try {
      const endpoint = ENDPOINTS.AUTHENTICATE;

      const tokenResponse = await axios({
        method: endpoint.method,
        url: `${API_BASE_URL}${endpoint.path}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          code: code,
        },
      });

      const token = tokenResponse.data.token;
      if (token) {
        sessionStorage.setItem("token", token);
        console.log("Token stored in sessionStorage.");

        navigate("/home");
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
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
        <h1 className="mb-3 mt-4 text-center lexend-bold">
          Welcome to <br />
          Warranty Vault!
        </h1>
        <button
          className="mt-2 px-5 btn btn-light btn-lg lexend-bold"
          onClick={getCodeUrl}
        >
          Sign in
        </button>
      </div>
    </>
  );
}

export default LoginPage;
