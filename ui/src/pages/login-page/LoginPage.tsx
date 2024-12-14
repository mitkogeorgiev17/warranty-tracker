import "../../App.css";
import "./LoginPage.css";
import logo from "../../assets/vault-logo-simplistic.svg";

function LoginPage() {
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
        <button className="mt-2 px-5 btn btn-light btn-lg lexend-bold">
          Sign in
        </button>
      </div>
    </>
  );
}

export default LoginPage;
