import "./WarrantiesPage.css";
import WarrantyList from "../../components/warranty-list/WarrantyList";
import MenuHeader from "../../components/menu-header/MenuHeader";
import { Warranty } from "../../types/Warranty";
import { API_BASE_URL, ENDPOINTS } from "../../config/apiConstants";
import axiosApi from "../../config/axiosApiConfig";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function WarrantiesPage() {
  const navigate = useNavigate();
  const [warranties, setWarranties] = useState<Warranty[]>([]);

  useEffect(() => {
    const endpoint = ENDPOINTS.GET_WARRANTIES;
    axiosApi({
      method: endpoint.method,
      url: `${API_BASE_URL}${endpoint.path}`,
    })
      .then((response) => setWarranties(response.data))
      .catch((error) => {
        if (error.status === 401) {
          navigate("/unauthorized");
        }
        console.error("Error fetching warranties:", error);
      });
  }, []);

  console.log(warranties);

  return (
    <>
      <MenuHeader text="Your warranties" backButtonRedirect="/home" />
      <WarrantyList items={warranties} />
    </>
  );
}

export default WarrantiesPage;
