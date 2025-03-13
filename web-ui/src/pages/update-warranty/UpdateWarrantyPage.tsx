import "./UpdateWarrantyPage.css";
import MenuHeader from "../../components/menu-header/MenuHeader";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../config/apiConstants";
import { ENDPOINTS } from "../../config/apiConstants";
import { useEffect, useState } from "react";
import axiosApi from "../../config/axiosApiConfig";
import { useNavigate } from "react-router-dom";
import WarrantyFormExtended from "../../components/warranty/WarrantyForm";
import { Warranty } from "../../types/Warranty";

function UpdateWarrantyPage() {
  const navigate = useNavigate();
  const { warrantyId } = useParams();
  const [warranty, setWarranty] = useState<Warranty | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!warrantyId) {
      navigate("/error");
      return;
    }

    setIsLoading(true);
    const endpoint = ENDPOINTS.GET_WARRANTIES;

    axiosApi({
      method: endpoint.method,
      url: `${API_BASE_URL}${endpoint.path}${warrantyId}`,
    })
      .then((response) => {
        setWarranty(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.status === 401) {
          navigate("/unauthorized");
        } else {
          navigate("/error");
        }
        console.error("Error fetching warranties:", error);
      });
  }, [warrantyId, navigate]);

  // Add the onChange handler that's required by WarrantyForm
  const handleWarrantyChange = (updatedWarranty: Warranty) => {
    setWarranty(updatedWarranty);
  };

  return (
    <>
      <MenuHeader text="Edit warranty" backButtonRedirect="/warranties" />
      {isLoading ? (
        <div className="d-flex justify-content-center mt-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : warranty ? (
        <WarrantyFormExtended
          warranty={warranty}
          isReadOnly={false}
          onChange={() => handleWarrantyChange}
        />
      ) : (
        <div className="alert alert-danger mt-4 mx-3">Warranty not found</div>
      )}
    </>
  );
}

export default UpdateWarrantyPage;
