import { useState, useEffect } from "react";
import "../create-warranty-modal/CreateWarrantyModal.css";
import { useNavigate } from "react-router-dom";
import { WarrantyExtended } from "../../types/Warranty";

interface WarrantyFormProps {
  warranty: WarrantyExtended;
  isReadOnly?: boolean;
  onChange: (updatedWarranty: WarrantyExtended) => void;
}

function WarrantyForm({ warranty, isReadOnly, onChange }: WarrantyFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<WarrantyExtended>(warranty);
  const { name, startDate, endDate, metadata, category } = formData;

  useEffect(() => {
    setFormData(warranty);
  }, [warranty]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedData = {
      ...formData,
      [e.target.id]: e.target.value,
    };

    setFormData(updatedData);
    onChange(updatedData);
  };

  const handleCategoryClick = () => {
    if (isReadOnly) return;

    navigate("/categories", {
      state: {
        createWarrantyCommand: {
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
          notes: formData.metadata?.note,
          category: formData.category,
          files: formData.files,
        },
      },
    });
  };

  // Format date to YYYY-MM-DD for input date field
  const formatDateForInput = (date: Date): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return "";
    }
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center pt-4 warranty-form">
      <div>
        <div className="mb-3">
          <label className="form-label text-bold">
            Name {!isReadOnly && <span className="required-field">*</span>}
          </label>
          <input
            type="text"
            className="form-control text-normal mb-3"
            id="name"
            value={name}
            onChange={handleInputChange}
            placeholder="Name your warranty"
            disabled={isReadOnly}
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-bold">
            Start Date{" "}
            {!isReadOnly && <span className="required-field">*</span>}
          </label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            value={formatDateForInput(new Date(startDate))}
            onChange={handleInputChange}
            disabled={isReadOnly}
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-bold">
            End Date {!isReadOnly && <span className="required-field">*</span>}
          </label>
          <input
            type="date"
            className="form-control"
            id="endDate"
            value={formatDateForInput(new Date(endDate))}
            onChange={handleInputChange}
            disabled={isReadOnly}
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-bold">Category</label>
          <input
            type="text"
            placeholder="Choose category (Optional)"
            className="form-control text-normal mb-3"
            id="category"
            value={category.name || ""}
            onChange={handleInputChange}
            onClick={handleCategoryClick}
            disabled={isReadOnly}
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-bold">Notes</label>
          <textarea
            className="form-control"
            id="notes"
            style={{ height: "10vh" }}
            value={metadata?.note || ""}
            onChange={handleInputChange}
            disabled={isReadOnly}
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-bold">Created on</label>
          <input
            type="date"
            className="form-control"
            value={formatDateForInput(metadata?.createdAt as Date)}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-bold">Last updated</label>
          <input
            type="date"
            className="form-control"
            value={formatDateForInput(metadata?.updatedAt as Date)}
            onChange={handleInputChange}
            disabled
          />
        </div>
      </div>
    </div>
  );
}

export default WarrantyForm;
