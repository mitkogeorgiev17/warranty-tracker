import React, { useState, useRef } from "react";
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
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { DEFAULT_WARRANTY_CATEGORIES } from "../constants/warrantyCategories";
import { useTranslation } from "react-i18next";

function CreateWarrantyPage() {
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
              onChange={(event, newValue) => {
                setCategory(newValue);
              }}
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

              <Button
                variant="outlined"
                startIcon={<UploadFileIcon />}
                onClick={handleOpenFileDialog}
                sx={{ mb: 2 }}
              >
                {t("createWarranty.selectFiles")}
              </Button>

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
