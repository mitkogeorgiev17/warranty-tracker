import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ENDPOINTS, API_BASE_URL } from "../constants/apiConstants";
import axiosApi from "../config/axiosApiConfig";
import { WarrantyDTO } from "../constants/Warranty";
import { UpdateWarrantyCommand } from "../constants/Warranty";
import WarrantyDetails from "../components/WarrantyDetails";
import { Box, Typography, CircularProgress } from "@mui/material";
import PageHeader from "../components/PageHeader";
import { useTranslation } from "react-i18next"; // Import for translations

const UpdateWarrantyPage: FC = () => {
  const navigate = useNavigate();
  const { warrantyId } = useParams<{ warrantyId: string }>();
  const warrantyIdNumber = warrantyId ? parseInt(warrantyId, 10) : null;
  const { t } = useTranslation(); // Initialize translation hook

  const [loading, setLoading] = useState<boolean>(true);
  const [warranty, setWarranty] = useState<WarrantyDTO | null>(null);

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
        if (error.status === 401) {
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

  const handleSaveWarranty = async (updateCommand: UpdateWarrantyCommand) => {
    if (!warrantyIdNumber) {
      toast.error(t("updateWarranty.missingId"));
      return;
    }

    try {
      // Use the original updateCommand
      console.log("Update command:", updateCommand);

      // Step 1: Send the update command
      const updateEndpoint = ENDPOINTS.UPDATE_WARRANTY;
      await axiosApi({
        method: updateEndpoint.method,
        url: `${API_BASE_URL}${updateEndpoint.path}`,
        data: updateCommand,
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success(t("updateWarranty.updateSuccess"));

      // Step 2: Handle file uploads if any
      if (updateCommand.filesToAdd && updateCommand.filesToAdd.length > 0) {
        const fileCount = updateCommand.filesToAdd.length;

        // Show loading toast for file upload
        const uploadingToast = toast.loading(
          t("updateWarranty.uploadingFiles", { count: fileCount })
        );

        try {
          const uploadFileEndpoint = ENDPOINTS.ADD_WARRANTY_FILES;

          // Create form data for file upload
          const formData = new FormData();
          updateCommand.filesToAdd.forEach((file: File) => {
            // IMPORTANT: Use "filePath" as the parameter name as specified in the controller
            formData.append("filePath", file);
          });

          // Construct the URL with warrantyId in the path
          const uploadUrl = `${API_BASE_URL}${uploadFileEndpoint.path}${warrantyIdNumber}`;
          console.log("File upload URL:", uploadUrl);

          await axiosApi({
            method: uploadFileEndpoint.method,
            url: uploadUrl,
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          // Dismiss loading toast and show success
          toast.dismiss(uploadingToast);
          toast.success(
            t("updateWarranty.uploadSuccess", { count: fileCount })
          );
        } catch (error: any) {
          // Dismiss loading toast and show error
          toast.dismiss(uploadingToast);
          toast.error(
            t("updateWarranty.uploadError", {
              error: error.message || "Unknown error",
            })
          );
          throw error; // Re-throw to be caught by the outer catch
        }
      }

      // Step 3: Handle file deletion if any
      if (
        updateCommand.filesToDelete &&
        updateCommand.filesToDelete.length > 0
      ) {
        const fileCount = updateCommand.filesToDelete.length;

        // Show loading toast for file deletion
        const deletingToast = toast.loading(
          t("updateWarranty.deletingFiles", { count: fileCount })
        );

        try {
          const deleteFileEndpoint = ENDPOINTS.DELETE_WARRANTY_FILES;

          // Construct the URL with warrantyId in the path and fileIDs as query parameters
          const deleteUrl = `${API_BASE_URL}${
            deleteFileEndpoint.path
          }${warrantyIdNumber}?fileIDs=${updateCommand.filesToDelete.join(
            ","
          )}`;
          console.log("File deletion URL:", deleteUrl);

          await axiosApi({
            method: deleteFileEndpoint.method,
            url: deleteUrl,
          });

          // Dismiss loading toast and show success
          toast.dismiss(deletingToast);
          toast.success(
            t("updateWarranty.deleteSuccess", { count: fileCount })
          );
        } catch (error: any) {
          // Dismiss loading toast and show error
          toast.dismiss(deletingToast);
          toast.error(
            t("updateWarranty.deleteError", {
              error: error.message || "Unknown error",
            })
          );
          throw error; // Re-throw to be caught by the outer catch
        }
      }

      toast.success(t("updateWarranty.warranty_updated"));

      // Navigate back to details page after a short delay
      setTimeout(() => {
        navigate("/manage/");
      }, 1500);
    } catch (error: any) {
      console.error("Error updating warranty:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("updateWarranty.updateError");
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    navigate("/manage/");
  };

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
      <PageHeader title={t("pages.updateWarranty")} borderColor="#ffb74d" />
      <WarrantyDetails
        warranty={warranty}
        isEditMode={true}
        onSave={handleSaveWarranty}
        onCancel={handleCancel}
      />
    </>
  );
};

export default UpdateWarrantyPage;
