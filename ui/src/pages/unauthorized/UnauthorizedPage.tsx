import "../../App.css";
import unauthorizedImg from "../../assets/unauthorized-access.png";
import { useNavigate } from "react-router-dom";

function UnauthorizedPage() {
  const navigate = useNavigate();

  const handleRetryButton = () => {
    sessionStorage.removeItem("jwt");
    navigate("/login");
  };

  return (
    <>
      <div className="container d-flex align-items-center justify-content-center vh-100">
        <div className="position-relative p-5 text-center rounded-5">
          <img
            alt="unauthorized image"
            className="mb-3"
            width="200"
            height="200"
            src={unauthorizedImg}
          />
          <h1 className="text-bold pt-2">Authentication failed.</h1>
          <p className="col-lg-6 mx-auto mb-4 text-normal">Please try again.</p>
          <button
            className="btn btn-light text-normal px-5 mt-3"
            onClick={handleRetryButton}
          >
            Retry
          </button>
        </div>
      </div>
    </>
  );
}

export default UnauthorizedPage;
