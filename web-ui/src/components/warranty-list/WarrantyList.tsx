import editImg from "../../assets/edit-icon.svg";
import deleteImg from "../../assets/delete-icon.svg";
import "./WarrantyList.css";
import { Warranty } from "../../types/Warranty";
import axiosApi from "../../config/axiosApiConfig";
import { API_BASE_URL, ENDPOINTS } from "../../config/apiConstants";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import ConfirmationDialog from "../confirmation-dialog/ConfirmationDialog";
import { useNavigate } from "react-router-dom";

interface WarrantyListProps {
  items: Warranty[];
}

function WarrantyList(props: WarrantyListProps) {
  const navigate = useNavigate();
  const [warranties, setWarranties] = useState(props.items);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    setWarranties(props.items);
  }, [props.items]);

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setIsDeleting(true);
  };

  const handleDeleteAccept = (id: number) => {
    if (selectedId === null) return;

    const endpoint = ENDPOINTS.DELETE_WARRANTY;

    axiosApi({
      method: endpoint.method,
      url: `${API_BASE_URL}${endpoint.path}${id}`,
    })
      .then((response) => {
        if (response.status === 204) {
          setWarranties(warranties.filter((w) => w.id !== id));
          toast.success("Warranty deleted successfully.");
        }
      })
      .catch((error) => {
        if (error.status === 401) {
          navigate("/unauthorized");
        }

        console.error("Error deleting warranty:", error);
        toast.error("Warranty could not be deleted.");
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  const handleDeleteDecline = () => {
    setIsDeleting(false);
    setSelectedId(null);
  };

  const handleUpdateClick = (id: number) => {
    navigate(`/warranties/edit/${id}`);
  };

  const warrantyList = warranties.map((warranty) => (
    <li key={warranty.id}>
      <div className="card shadow-sm position-relative mb-3">
        {(!isDeleting || selectedId != warranty.id) && (
          <>
            <div className="d-flex justify-content-between mt-2 mx-2">
              <h5 className="warranty-header px-2 mb-0">{warranty.name}</h5>
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-update"
                  onClick={() => handleUpdateClick(warranty.id)}
                >
                  <img src={editImg} height="25px" />
                </button>
                <button
                  className="btn btn-sm btn-delete"
                  onClick={() => handleDeleteClick(warranty.id)}
                >
                  <img src={deleteImg} height="20px" />
                </button>
              </div>
            </div>
            <div className="card-body py-1">
              {warranty.category != null && (
                <p className="pb-0 mb-0">Category: {warranty.category.name}</p>
              )}
              <p className="pb-0 mb-0">Status: {warranty.status}</p>
              <p className="pb-0 mb-1">
                Expires: {new Date(warranty.endDate).toLocaleDateString()}
              </p>
            </div>
          </>
        )}

        {isDeleting && selectedId == warranty.id && (
          <ConfirmationDialog
            dialogText="Are you sure you want to delete this warranty?"
            acceptButtonText="Yes"
            declineButtonText="No"
            show={isDeleting}
            onAccept={() => handleDeleteAccept(selectedId!)}
            onDecline={handleDeleteDecline}
          />
        )}
      </div>
    </li>
  ));

  return (
    <>
      <div className="container my-3 text-normal">
        {warrantyList.length === 0 && (
          <div
            className="container-fluid d-flex flex-column justify-content-center align-items-center"
            style={{ height: "calc(100vh - 200px)" }}
          >
            <h3 className="text-thin opacity-50 text-center">
              No warranties available. <br />
              Please add a warranty to get started.
            </h3>
          </div>
        )}
        <ul>{warrantyList}</ul>
      </div>
    </>
  );
}

export default WarrantyList;
