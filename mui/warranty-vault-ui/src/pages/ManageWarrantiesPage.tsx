import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Box, Typography } from "@mui/material";
import WarrantyCardList from "../components/WarrantyCardList";
import { WarrantyDTO } from "../constants/Warranty";
import axiosApi from "../config/axiosApiConfig";
import { API_BASE_URL, ENDPOINTS } from "../constants/apiConstants";
import { useNavigate } from "react-router-dom";

function ManageWarrantiesPage() {
  const navigate = useNavigate();
  const [warranties, setWarranties] = useState<WarrantyDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const response = await getUserWarranties();
      if (response && response.data) {
        setWarranties(response.data);
      } else {
        setWarranties([]);
      }
    } catch (err: any) {
      if (err.status == 401) {
        navigate("/unauthorized");
      } else {
        navigate("/error");
      }
      console.error("Error fetching warranties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  // Implementation for the API call
  const getUserWarranties = async () => {
    try {
      const endpoint = ENDPOINTS.GET_WARRANTIES;
      return axiosApi({
        method: endpoint.method,
        url: `${API_BASE_URL}${endpoint.path}`,
        responseType: "json",
      });
    } catch (error: any) {
      if (error.status == 401) {
        navigate("/unauthorized");
      } else {
        navigate("/error");
      }
      return undefined;
    }
  };

  // Handler for when a warranty is deleted
  const handleWarrantyDeleted = () => {
    fetchWarranties(); // Refresh the list
  };

  return (
    <>
      <PageHeader title="Manage warranties" borderColor="#ffb74d" />
      <Box
        sx={{
          padding: 3,
          display: "flex",
          justifyContent: "center",
          minHeight: "calc(100vh - 64px)", // Adjust based on your header height
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Typography align="center" color="text.secondary">
              Loading warranties...
            </Typography>
          </Box>
        ) : warranties.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Typography align="center" color="text.secondary">
              No warranties found. Add some to get started.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: "100%" }}>
            <WarrantyCardList
              warranties={warranties}
              onWarrantyDeleted={handleWarrantyDeleted}
            />
          </Box>
        )}
      </Box>
    </>
  );
}

export default ManageWarrantiesPage;
