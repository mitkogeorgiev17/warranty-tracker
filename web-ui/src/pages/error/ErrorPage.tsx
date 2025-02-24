import "../../App.css";
import errorImg from "../../assets/error.png";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();
  const handleRetryButton = () => {
    navigate("/home");
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
            src={errorImg}
          />
          <h1 className="text-bold pt-2">Something went wrong.</h1>
          <p className="col-lg-6 mx-auto mb-4 text-normal">
            Please try again later.
          </p>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-light text-normal px-5 mt-3"
              onClick={handleRetryButton}
            >
              Homepage
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ErrorPage;
