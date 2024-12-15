import { useEffect, useState } from "react";
import "../../App.css";
import "./HomePage.css";
import logo from "../../assets/vault-logo-simplistic.svg";
import addImg from "../../assets/add.svg";
import scanImg from "../../assets/scan.svg";
import folderImg from "../../assets/folder.svg";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const jwt = sessionStorage.getItem("jwt");
  const navigate = useNavigate();

  useEffect(() => {
    if (!jwt) {
      console.error("Unauthorized: No JWT token found.");
      navigate("/unauthorized");
    }
  });

  return (
    <>
      <Header />
      <nav className="navbar">
        <div className="container-fluid flex-column justify-content-center pt-5">
          <img
            src={logo}
            alt="Vault Logo"
            className="mb-4"
            style={{ width: "5vh" }}
          />
          <h2 className="lexend-bold fs-1">My warranties</h2>
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
