import logo from "../../assets/vault-logo-simplistic.svg";
import addImg from "../../assets/add.svg";
import scanImg from "../../assets/scan.svg";
import folderImg from "../../assets/folder.svg";

function ManageWarranties() {
  return (
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
            <p className="card-text">My warranties</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageWarranties;
