import backArrowImg from "../../assets/back-arrow.svg";
import "../warranty-list/WarrantyList.css";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  text: string;
}

function MenuHeader(props: HeaderProps) {
  const navigate = useNavigate();

  const handleBackArrowClick = () => {
    navigate("/home");
  };

  return (
    <>
      <div className="container pt-4 d-flex  justify-content-between px-4 mb-4 ">
        <img
          onClick={handleBackArrowClick}
          className="back-arrow"
          src={backArrowImg}
          style={{ width: "7vw", maxWidth: "100%", display: "block" }}
        />
        <h2 className="text-bold">{props.text}</h2>
      </div>
    </>
  );
}

export default MenuHeader;
