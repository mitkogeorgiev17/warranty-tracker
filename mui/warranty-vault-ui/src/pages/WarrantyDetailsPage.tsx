import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ENDPOINTS, API_BASE_URL } from "../constants/apiConstants";
import axiosApi from "../config/axiosApiConfig";
import { WarrantyDTO } from "../constants/Warranty";
import WarrantyDetails from "../components/WarrantyDetails";
import { Box, Typography, CircularProgress } from "@mui/material";
import PageHeader from "../components/PageHeader";
import { useTranslation } from "react-i18next";

const WarrantyDetailsPage: FC = () => {
  const navigate = useNavigate();
  const { warrantyId } = useParams<{ warrantyId: string }>();
  const warrantyIdNumber = warrantyId ? parseInt(warrantyId, 10) : null;
  const [loading, setLoading] = useState<boolean>(true);
  const [warranty, setWarranty] = useState<WarrantyDTO | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchWarrantyDetails() {
      if (!warrantyIdNumber) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const endpoint = ENDPOINTS.GET_WARRANTIES;
        const response = await axiosApi({
          method: endpoint.method,
          url: `${API_BASE_URL}${endpoint.path}${warrantyIdNumber}`,
        });
        setWarranty(response.data);
      } catch (error: any) {
        console.error("Error fetching warranty details:", error);
        if (error.status == 401) {
          navigate("/unauthorized");
        } else {
          navigate("/error");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchWarrantyDetails();
  }, [warrantyIdNumber, navigate]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="300px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!warranty) {
    return (
      <Box textAlign="center" p={6}>
        <Typography>
          {t("warranty.notFound", { id: warrantyIdNumber })}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <PageHeader title={t("pages.warrantyDetails")} />
      <WarrantyDetails warranty={warranty} isEditMode={false} />
    </>
  );
};

export default WarrantyDetailsPage;
