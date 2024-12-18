import "./CreateWarrantyModal.css";
import addIcon from "../../assets/add-icon.svg";

function CreateWarrantyModal() {
  return (
    <>
      <div className="container d-flex flex-column justify-content-center align-items-center pt-4 warranty-form">
        <div>
          <div className="mb-3">
            <label className="form-label text-bold">Name</label>
            <input
              type="text"
              className="form-control text-normal mb-3"
              id="name"
              placeholder="Name your warranty"
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-bold">Start Date</label>
            <input type="date" className="form-control" id="startDate" />
          </div>

          <div className="mb-3">
            <label className="form-label text-bold">End Date</label>
            <input type="date" className="form-control" id="endDate" />
          </div>

          <div className="mb-3">
            <label className="form-label text-bold">Notes</label>
            <textarea
              className="form-control"
              id="notes"
              style={{ height: "10vh" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-bold">Category</label>
            <input
              type="text"
              className="form-control text-normal mb-3"
              id="category"
              placeholder="Choose category (Optional)"
            />
          </div>

          <div className="d-flex justify-content-center pt-5">
            <img src={addIcon} style={{ height: "20vh" }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateWarrantyModal;
