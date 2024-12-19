import { useState } from "react";
import "./CreateWarrantyModal.css";
import addIcon from "../../assets/add-icon.svg";
import axiosApi from "../../config/axiosApiConfig";
import { ENDPOINTS, API_BASE_URL } from "../../config/apiConstants";

interface createWarrantyCommand {
  name: string;
  startDate: Date;
  endDate: Date;
  notes: string;
  category: string;
}

const defaultFormData = {
  name: "",
  startDate: "",
  endDate: "",
  notes: "",
  category: "",
};

function createWarranty(createWarrantyCommand: createWarrantyCommand) {
  const endpoint = ENDPOINTS.CREATE_WARRANTY;
  axiosApi({
    method: endpoint.method,
    url: `${API_BASE_URL}${endpoint.path}`,
    data: createWarrantyCommand,
  })
    .then((response) => console.log(response.data))
    .catch((error) => console.error("Error creating warranty:", error));
}

function CreateWarrantyModal() {
  const [formData, setFormData] = useState(defaultFormData);
  const { name, startDate, endDate, notes, category } = formData;

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const warrantyCommand: createWarrantyCommand = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
    };
    createWarranty(warrantyCommand);
    setFormData(defaultFormData);
  };

  return (
    <>
      <div className="container d-flex flex-column justify-content-center align-items-center pt-4 warranty-form">
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label text-bold">Name</label>
            <input
              type="text"
              className="form-control text-normal mb-3"
              id="name"
              value={name}
              onChange={onChange}
              placeholder="Name your warranty"
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-bold">Start Date</label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              value={startDate}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-bold">End Date</label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              value={endDate}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-bold">Notes</label>
            <textarea
              className="form-control"
              id="notes"
              style={{ height: "10vh" }}
              value={notes}
              onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-bold">Category</label>
            <input
              type="text"
              placeholder="Choose category (Optional)"
              className="form-control text-normal mb-3"
              id="category"
              value={category}
              onChange={onChange}
            />
          </div>

          <div className="d-flex justify-content-center pt-5">
            <button
              type="submit"
              style={{ background: "none", border: "none" }}
            >
              <img src={addIcon} style={{ height: "20vh" }} alt="Add Icon" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateWarrantyModal;
