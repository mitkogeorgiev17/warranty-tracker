import React, { useState, useRef } from "react";
import {
  Paper,
  Box,
  Button,
  Stack,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import axiosApi from "../config/axiosApiConfig";
import { API_BASE_URL, ENDPOINTS } from "../constants/apiConstants";
import { toast } from "sonner";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ScannerIcon from "@mui/icons-material/Scanner";
import DescriptionIcon from "@mui/icons-material/Description";
import { useTranslation } from "react-i18next";
import Lottie from "lottie-react"; // Import Lottie

// Import the animation data from your JSON file or paste it here
import animationData from "../assets/animations/scanning-animation.json"; // Update path as needed

function ScanWarrantyPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const [files, setFiles] = useState<File[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // Only take the first file
      setFiles([event.target.files[0]]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = () => {
    setFiles([]);
  };

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleOpenCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*";
      fileInputRef.current.capture = "environment";
      fileInputRef.current.click();
    }
  };

  const handleScan = async () => {
    if (files.length === 0) {
      toast.error(t("scanWarranty.noFilesSelected"));
      return;
    }

    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      const endpoint = ENDPOINTS.SCAN_WARRANTY;
      const response = await axiosApi({
        method: endpoint.method,
        url: `${API_BASE_URL}${endpoint.path}`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 && response.data) {
        // Pass both the warranty data and the scanned file to the create page
        navigate("/create", {
          state: {
            warrantyCommand: response.data,
            scannedFile: files[0], // Pass the scanned file to CreateWarrantyPage
          },
        });
      }
    } catch (error: any) {
      console.error("Error creating warranty:", error);
      setIsScanning(false);
      if (error.response && error.response.status === 401) {
        navigate("/unauthorized");
      } else {
        toast.error(t("createWarranty.failedToCreate"));
        navigate("/error");
      }
    }
  };

  return (
    <>
      <PageHeader title={t("pages.scanWarranty")} borderColor="#64b5f6" />
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          backgroundColor: "background.paper",
          p: 3,
          mt: 3,
          width: "90%",
          minHeight: "70vh",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          position: "relative", // Added to position the loader properly
        }}
      >
        {/* Scanning Loader Overlay */}
        {isScanning && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "background.paper",
              zIndex: 10,
              borderRadius: 3,
            }}
          >
            <Box
              sx={{
                width: "300px",
                height: "300px",
                mb: 2,
                background: "transparent",
              }}
            >
              <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              {t("scanWarranty.scanning")}
            </Typography>
          </Box>
        )}

        <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 500 }}>
          {t("scanWarranty.uploadInstruction")}
        </Typography>

        <Stack spacing={2} sx={{ mb: 4, alignItems: "center" }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<PhotoCameraIcon />}
            onClick={handleOpenCamera}
            sx={{
              py: 1.5,
              maxWidth: "300px",
              backgroundColor: "#4fc3f7",
              "&:hover": {
                backgroundColor: "#29b6f6",
              },
            }}
          >
            {t("scanWarranty.openCamera")}
          </Button>

          <Button
            variant="contained"
            fullWidth
            startIcon={<UploadFileIcon />}
            onClick={handleOpenFileDialog}
            sx={{
              py: 1.5,
              maxWidth: "300px",
              backgroundColor: "#81c784",
              "&:hover": {
                backgroundColor: "#66bb6a",
              },
            }}
          >
            {t("scanWarranty.uploadFile")}
          </Button>

          <input
            type="file"
            accept="image/*,.pdf"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* File List Section */}
        {files.length > 0 ? (
          <>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              {t("scanWarranty.selectedFile")}
            </Typography>

            <List
              dense
              sx={{
                width: "100%",
                bgcolor: "background.paper",
              }}
            >
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={handleRemoveFile}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <InsertDriveFileIcon />
                </ListItemIcon>
                <ListItemText
                  primary={files[0].name}
                  secondary={`${(files[0].size / 1024).toFixed(1)} KB`}
                />
              </ListItem>
            </List>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                variant="contained"
                startIcon={<ScannerIcon />}
                onClick={handleScan}
                disabled={isScanning}
                sx={{
                  px: 6,
                  py: 1.5,
                  backgroundColor: "#64b5f6",
                  "&:hover": {
                    backgroundColor: "#42a5f5",
                  },
                }}
              >
                {isScanning
                  ? t("scanWarranty.scanning")
                  : t("scanWarranty.scanButton")}
              </Button>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              my: 4,
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            <Alert
              severity="info"
              icon={<DescriptionIcon />}
              sx={{ mb: 3, width: "100%" }}
            >
              {t("scanWarranty.infoAlert")}
            </Alert>

            <Typography variant="body1" sx={{ mb: 2, textAlign: "center" }}>
              {t("scanWarranty.ocrExplanation")}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              {t("scanWarranty.uploadInstructions")}
            </Typography>
          </Box>
        )}
      </Paper>
    </>
  );
}

export default ScanWarrantyPage;
