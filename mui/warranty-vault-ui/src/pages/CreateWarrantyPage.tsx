import React, { useState, useRef, useEffect } from "react";
import {
  Paper,
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { CreateWarrantyCommand } from "../constants/Warranty";
import axiosApi from "../config/axiosApiConfig";
import { API_BASE_URL, ENDPOINTS } from "../constants/apiConstants";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { DEFAULT_WARRANTY_CATEGORIES } from "../constants/warrantyCategories";
import { useTranslation } from "react-i18next";

// Import Capacitor Camera plugin
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

function CreateWarrantyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const getDefaultStartDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getDefaultEndDate = () => {
    const today = new Date();
    const year = today.getFullYear() + 2;
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [warrantyName, setWarrantyName] = useState("");
  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [note, setNote] = useState("");
  const [category, setCategory] = useState<string | null>("");
  const [files, setFiles] = useState<File[]>([]);

  // Check if we have warranty data from the scan page
  useEffect(() => {
    const incomingData = location.state?.warrantyCommand;
    const scannedFile = location.state?.scannedFile;

    if (incomingData) {
      if (incomingData.name) setWarrantyName(incomingData.name);
      if (incomingData.startDate) {
        setStartDate(incomingData.startDate);
      } else {
        setStartDate(getDefaultStartDate());
      }
      if (incomingData.endDate) {
        setEndDate(incomingData.endDate);
      } else {
        setEndDate(getDefaultEndDate());
      }
      if (incomingData.note) setNote(incomingData.note);
      if (incomingData.category) setCategory(incomingData.category);

      toast.success(t("createWarranty.dataExtractedSuccess"));
    }

    // If a scanned file was passed, add it to the files array
    if (scannedFile) {
      setFiles([scannedFile]);
    }
  }, [location.state]);

  const isFormValid = () => {
    return warrantyName.trim() !== "" && startDate !== "" && endDate !== "";
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // New function to handle camera capture
  const handleOpenCamera = async () => {
    try {
      // Request camera permissions
      const permissionStatus = await Camera.requestPermissions();

      if (permissionStatus.camera === "granted") {
        // Take photo with the camera
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
        });

        // Convert the image URI to a File object
        if (image.webPath) {
          const response = await fetch(image.webPath);
          const blob = await response.blob();

          // Create a File from the blob
          const fileName = `photo_${new Date().getTime()}.${
            image.format || "jpeg"
          }`;
          const file = new File([blob], fileName, {
            type: `image/${image.format || "jpeg"}`,
          });

          setFiles((prevFiles) => [...prevFiles, file]);
        }
      } else {
        toast.error(t("scanWarranty.cameraPermissionDenied"));
      }
    } catch (error) {
      console.error("Camera error:", error);
      toast.error(t("scanWarranty.cameraError"));

      // Fallback to file input if camera fails
      if (fileInputRef.current) {
        fileInputRef.current.accept = "image/*";
        fileInputRef.current.click();
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const warrantyCommand: CreateWarrantyCommand = {
      name: warrantyName,
      startDate: startDate,
      endDate: endDate,
      category: category ? category : null,
    };

    if (note.trim() !== "") {
      warrantyCommand.note = note;
    }

    console.log("Warranty Command:", warrantyCommand);
    console.log("Files to upload:", files);
    createWarranty(warrantyCommand, files);
  };

  const createWarranty = async (
    createWarrantyCommand: CreateWarrantyCommand,
    attachments: File[]
  ) => {
    try {
      const endpoint = ENDPOINTS.CREATE_WARRANTY;
      const response = await axiosApi({
        method: endpoint.method,
        url: `${API_BASE_URL}${endpoint.path}`,
        responseType: "json",
        data: createWarrantyCommand,
      });

      if (response.status === 201) {
        if (attachments.length > 0 && response.data && response.data.id) {
          const warrantyId = response.data.id;
          uploadFiles(warrantyId, attachments);
        }
        toast.success(t("createWarranty.successMessage"));
        navigate("/manage");
      } else {
        toast.error(t("createWarranty.actionNotSuccessful"));
        navigate(-1);
      }
    } catch (error: any) {
      console.error("Error creating warranty:", error);
      if (error.response && error.response.status === 401) {
        navigate("/unauthorized");
      } else {
        toast.error(t("createWarranty.failedToCreate"));
        navigate("/error");
      }
    }
  };

  const uploadFiles = async (warrantyId: number, files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("filePath", file);
      });

      const endpoint = ENDPOINTS.ADD_WARRANTY_FILES;
      const response = await axiosApi({
        method: endpoint.method,
        url: `${API_BASE_URL}${endpoint.path}${warrantyId}`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status == 201) {
        toast.success(t("createWarranty.fileUploadSuccess"));
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error(t("createWarranty.fileUploadFailed"));
    }
  };

  return (
    <>
      <PageHeader title={t("createWarranty.pageTitle")} borderColor="#81c784" />
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          backgroundColor: "background.paper",
          p: 3,
          pt: 3,
          pb: 0,
          mt: 3,
          width: "90%",
          minHeight: "85vh",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            // Add padding bottom to ensure content doesn't get hidden behind the button
            pb: 10,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, fontWeight: 500 }}
          >
            {t("createWarranty.details")}
          </Typography>
          <Stack spacing={3} sx={{ mb: 2 }}>
            <TextField
              required
              fullWidth
              id="name"
              label={t("createWarranty.warrantyName")}
              name="name"
              value={warrantyName}
              onChange={(e) => setWarrantyName(e.target.value)}
            />
            <TextField
              fullWidth
              id="note"
              label={t("createWarranty.notes")}
              name="note"
              multiline
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <Autocomplete
              id="category"
              freeSolo
              options={DEFAULT_WARRANTY_CATEGORIES}
              value={category}
              onChange={(_, newValue) => setCategory(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("createWarranty.category")}
                  fullWidth
                  helperText={t("createWarranty.categoryHelperText")}
                />
              )}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                required
                sx={{ flex: 1 }}
                id="startDate"
                label={t("createWarranty.startDate")}
                name="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: "9999-12-31",
                }}
              />
              <TextField
                required
                sx={{ flex: 1 }}
                id="endDate"
                label={t("createWarranty.endDate")}
                name="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: "9999-12-31",
                }}
              />
            </Box>
            <Divider sx={{ my: 2 }} />
            {/* File Upload Section */}
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {t("createWarranty.attachments")}
            </Typography>
            <Box>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<UploadFileIcon />}
                  onClick={handleOpenFileDialog}
                >
                  {t("createWarranty.selectFiles")}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PhotoCameraIcon />}
                  onClick={handleOpenCamera}
                  sx={{
                    borderColor: "#4fc3f7",
                    color: "#0288d1",
                    "&:hover": {
                      borderColor: "#29b6f6",
                      backgroundColor: "rgba(3, 169, 244, 0.04)",
                    },
                  }}
                >
                  {t("scanWarranty.openCamera")}
                </Button>
              </Stack>
              {files.length > 0 && (
                <List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
                  {files.map((file, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <InsertDriveFileIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={file.name}
                        secondary={`${(file.size / 1024).toFixed(1)} KB`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Stack>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 3,
              borderTop: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!isFormValid()}
              sx={{
                px: 6,
                backgroundColor: "#81c784",
                "&:hover": {
                  backgroundColor: "#66bb6a",
                },
              }}
            >
              {t("createWarranty.createButton")}
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
}

export default CreateWarrantyPage;
