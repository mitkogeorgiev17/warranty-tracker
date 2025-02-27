import { useState, useRef } from "react";
import "./CreateWarrantyModal.css";
import addIcon from "../../assets/add-icon.svg";
import axiosApi from "../../config/axiosApiConfig";
import { ENDPOINTS, API_BASE_URL } from "../../config/apiConstants";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import uploadFileIcon from "../../assets/file-upload.svg";
import WarrantyForm from "../warranty/WarrantyForm";

export interface Warranty {
  name: string;
  startDate: Date;
  endDate: Date;
  notes: string | null;
  category: string | null;
  files: File[];
}

function CreateWarrantyModal() {
  const location = useLocation();
  const navigate = useNavigate();

  const createWarrantyCommand = location.state
    ?.createWarrantyCommand as Warranty;

  const defaultFormData: Warranty = createWarrantyCommand
    ? createWarrantyCommand
    : {
        name: "",
        startDate: new Date(),
        endDate: new Date(),
        notes: "",
        category: "",
        files: [],
      };

  const [formData, setFormData] = useState(defaultFormData);
  const { name, startDate, endDate, notes, category, files } = formData;

  const addBtn = useRef<HTMLImageElement>(null);

  const addWarrantyFiles = async (warrantyId: number, files: File[]) => {
    const endpoint = ENDPOINTS.ADD_WARRANTY_FILES;
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("file", file);
      });

      await axiosApi({
        method: endpoint.method,
        url: `${API_BASE_URL}${endpoint.path}${warrantyId}`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Files uploaded successfully.");
    } catch (error: any) {
      switch (error.status) {
        case 401:
          navigate("/unauthorized");
          break;
        case 400:
        case 500:
        default:
          toast.error("Failed to add warranty files.");
          break;
      }
    }
  };

  const createWarranty = async (createWarrantyCommand: Warranty) => {
    const endpoint = ENDPOINTS.CREATE_WARRANTY;
    try {
      // Send only the warranty data without files
      const warrantyData = {
        name: createWarrantyCommand.name,
        startDate: createWarrantyCommand.startDate.toISOString(),
        endDate: createWarrantyCommand.endDate.toISOString(),
        notes: createWarrantyCommand.notes,
        category: createWarrantyCommand.category,
      };

      const response = await axiosApi({
        method: endpoint.method,
        url: `${API_BASE_URL}${endpoint.path}`,
        data: warrantyData,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        toast.success("Warranty created successfully.");

        // Handle file uploads separately if there are files
        if (createWarrantyCommand.files.length > 0) {
          const warrantyId = response.data.id;

          addWarrantyFiles(warrantyId, formData.files);
        }

        navigate("/warranties/");
      }
    } catch (error: any) {
      switch (error.status) {
        case 401:
          navigate("/unauthorized");
          break;
        case 409:
          toast.error("Warranty with that name already exists.");
          break;
        case 400:
        case 500:
        default:
          toast.error("Failed to create warranty.");
          break;
      }
    }
  };

  const updateButtonState = (data: Warranty) => {
    if (data.name && data.startDate && data.endDate) {
      addBtn.current?.classList.remove("btn-requirements-not-met");
    } else {
      addBtn.current?.classList.add("btn-requirements-not-met");
    }
  };

  const handleFormChange = (updatedWarranty: Warranty) => {
    setFormData(updatedWarranty);
    updateButtonState(updatedWarranty);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const newFiles = Array.from(fileList);
      setFormData((prevState) => ({
        ...prevState,
        files: [...prevState.files, ...newFiles],
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData((prevState) => ({
      ...prevState,
      files: prevState.files.filter((_, i) => i !== index),
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const warrantyCommand: Warranty = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      category: formData.category || null,
    };

    if (
      !warrantyCommand.name ||
      !warrantyCommand.startDate ||
      !warrantyCommand.endDate
    ) {
      toast.warning("Please fill in the required fields.");
      return;
    }

    createWarranty(warrantyCommand);
    setFormData(defaultFormData);
  };

  const handleCategoryClick = () => {
    navigate("/categories", {
      state: {
        createWarrantyCommand: {
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
          notes: formData.notes,
          category: formData.category,
          files: formData.files,
        },
      },
    });
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center pt-4 warranty-form">
      <form onSubmit={onSubmit}>
        <WarrantyForm
          warranty={formData}
          onChange={handleFormChange}
          isReadOnly={false}
        />

        <div className="d-flex flex-column justify-content-center align-items-center text-center mt-4">
          <div className="btn btn-secondary px-5 py-2 bg-transparent text-bold d-flex justify-content-center">
            <label className="d-flex justify-content-center align-items-center">
              <img src={uploadFileIcon} style={{ height: "2vh" }} />
              Add files
              <input
                id="files"
                type="file"
                className="d-none"
                onChange={onFileChange}
                multiple
              />
            </label>
          </div>
          {files.length > 0 && (
            <div className="mt-2 text-normal w-100 d-flex flex-column align-items-center">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-between gap-2 mb-1 w-75"
                >
                  <span>
                    {file.name} ({(file.size / 1024).toFixed(0)} KB)
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeFile(index)}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="d-flex justify-content-center pt-4">
          <button type="submit" style={{ background: "none", border: "none" }}>
            <img
              src={addIcon}
              ref={addBtn}
              className="btn-requirements-not-met"
              style={{ height: "15vh" }}
              alt="Add Icon"
            />
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateWarrantyModal;
