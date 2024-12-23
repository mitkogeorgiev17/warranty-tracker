import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../../config/axiosApiConfig";
import { API_BASE_URL, ENDPOINTS } from "../../config/apiConstants";
import "../../App.css";
import "./LoginPage.css";
import logo from "../../assets/vault-logo-simplistic.svg";

function LoginPage() {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const authAttempted = useRef(false);

  useEffect(() => {
    if (sessionStorage.getItem("jwt")) {
      navigate("/home");
      return;
    }

    const handleAuthCode = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code && !authAttempted.current) {
        authAttempted.current = true;
        setIsLoggingIn(true);

        try {
          const endpoint = ENDPOINTS.AUTHENTICATE;
          const response = await axiosApi({
            method: endpoint.method,
            url: `${API_BASE_URL}${endpoint.path}`,
            headers: {
              "Content-Type": "application/json",
            },
            data: { code },
          });

          const jwt = response.data.token;
          if (jwt) {
            sessionStorage.setItem("jwt", jwt);
            navigate("/home");
          }
        } catch (error: any) {
          if (error.status === 401) {
            navigate("/unauthorized");
          }
          console.error("Authentication error:", error);
        } finally {
          setIsLoggingIn(false);
        }
      }
    };

    handleAuthCode();
  }, []);

  const initiateLogin = async () => {
    try {
      const endpoint = ENDPOINTS.CODE_URL;
      const response = await axiosApi({
        method: endpoint.method,
        url: `${API_BASE_URL}${endpoint.path}`,
        responseType: "text",
      });

      window.location.href = response.data;
    } catch (error: any) {
      if (error.status === 401) {
        navigate("/unauthorized");
      }
      console.error("Error initiating login:", error);
    }
  };

  return (
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
        onClick={initiateLogin}
        disabled={isLoggingIn}
      >
        {isLoggingIn ? "Signing in..." : "Sign in"}
      </button>
    </div>
  );
}

export default LoginPage;
