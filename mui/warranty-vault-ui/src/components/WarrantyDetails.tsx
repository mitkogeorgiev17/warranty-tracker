import { FC, useState, useRef, useEffect } from "react";
import { WarrantyDTO, WarrantyStatus } from "../constants/Warranty";
import { UpdateWarrantyCommand } from "../constants/Warranty";
import { DEFAULT_WARRANTY_CATEGORIES } from "../constants/warrantyCategories";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

// Import Capacitor Camera plugin
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

// MUI imports
import {
  Box,
  Typography,
  TextField,
  Grid,
  Paper,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import {
  Description as DocumentIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
  PictureAsPdf as PdfIcon,
  TableChart as SpreadsheetIcon,
  Delete as DeleteIcon,
  UploadFile as UploadFileIcon,
  PhotoCamera as PhotoCameraIcon,
} from "@mui/icons-material";
import { toast } from "sonner";

// Interface for component props
interface WarrantyDetailsProps {
  warranty: WarrantyDTO;
  isEditMode?: boolean;
  onSave?: (updatedWarranty: UpdateWarrantyCommand) => Promise<void>;
  onCancel?: () => void;
}

// Helper function to get file icon based on content type
const getFileIcon = (contentType: string | undefined) => {
  if (!contentType) {
    return <FileIcon />;
  }

  if (contentType.includes("pdf")) {
    return <PdfIcon />;
  } else if (contentType.includes("image")) {
    return <ImageIcon />;
  } else if (contentType.includes("word")) {
    return <DocumentIcon />;
  } else if (contentType.includes("excel") || contentType.includes("sheet")) {
    return <SpreadsheetIcon />;
  }
  return <FileIcon />;
};

// Status chip component
interface StatusChipProps {
  status: WarrantyStatus;
}

const StatusChip: FC<StatusChipProps> = ({ status }) => {
  const getChipProps = () => {
    switch (status) {
      case WarrantyStatus.ACTIVE:
        return {
          color: "success" as const,
          sx: { fontWeight: "bold" },
        };
      case WarrantyStatus.EXPIRED:
        return {
          color: "error" as const,
          sx: { fontWeight: "bold" },
        };
      case WarrantyStatus.CLAIMED_ACTIVE:
        return {
          color: "primary" as const,
          sx: { fontWeight: "bold" },
        };
      case WarrantyStatus.CLAIMED_EXPIRED:
        return {
          color: "default" as const,
          sx: { fontWeight: "bold" },
        };
      default:
        return {
          color: "default" as const,
          sx: { fontWeight: "bold" },
        };
    }
  };

  // Format the status for display (replace underscore with space)
  return (
    <Chip label={status.replace("_", " ")} size="small" {...getChipProps()} />
  );
};

// Main WarrantyDetails component
const WarrantyDetails: FC<WarrantyDetailsProps> = ({
  warranty,
  isEditMode = false,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [currentWarranty, setCurrentWarranty] = useState<WarrantyDTO>(warranty);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [filesToDelete, setFilesToDelete] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    warranty.category || ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when warranty prop changes
  useEffect(() => {
    setCurrentWarranty(warranty);
    setSelectedCategory(warranty.category || "");
    setNewFiles([]);
    setFilesToDelete([]);
  }, [warranty]);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      try {
        // Create an UpdateWarrantyCommand from the current state
        const updateCommand: UpdateWarrantyCommand = {
          warrantyId: Number(currentWarranty.id),
          name: currentWarranty.name,
          startDate: currentWarranty.startDate || "",
          endDate: currentWarranty.endDate || "",
          status: currentWarranty.status,
          note: currentWarranty.metadata?.note || null,
          category: selectedCategory, // Use the selected category
          filesToAdd: newFiles,
          filesToDelete: filesToDelete,
        };

        // Validate the command before sending
        if (updateCommand.name.length < 2 || updateCommand.name.length > 64) {
          throw new Error(t("validation.nameLengthError"));
        }

        if (
          updateCommand.note &&
          (updateCommand.note.length < 2 || updateCommand.note.length > 2048)
        ) {
          throw new Error(t("validation.noteLengthError"));
        }

        console.log("About to send update command:", updateCommand);
        await onSave(updateCommand);
      } catch (error) {
        console.error("Error in handleSave:", error);
        toast.error(t("createWarranty.failedToCreate"));
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleFieldChange = (field: keyof WarrantyDTO, value: any) => {
    setCurrentWarranty((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleNoteChange = (value: string) => {
    setCurrentWarranty((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        note: value,
      },
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const addedFiles = Array.from(event.target.files);
      setNewFiles((prevFiles) => [...prevFiles, ...addedFiles]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Function to handle camera capture with Capacitor
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

          setNewFiles((prevFiles) => [...prevFiles, file]);
          toast.success(t("warranty.photoAdded"));
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

  const handleRemoveNewFile = (index: number) => {
    setNewFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveExistingFile = (fileId: number) => {
    setFilesToDelete((prev) => [...prev, fileId]);
  };

  // Get the list of current files, excluding those marked for deletion
  const currentFiles =
    currentWarranty.files?.filter((file) => !filesToDelete.includes(file.id)) ||
    [];

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        backgroundColor: "background.paper",
        p: 3,
        pt: 3,
        pb: 3,
        mt: 3,
        width: "90%",
        height: "85vh",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label={t("createWarranty.warrantyName")}
            fullWidth
            value={currentWarranty.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            disabled={!isEditMode}
            slotProps={{
              inputLabel: { sx: { color: "primary.main" } },
            }}
            variant="outlined"
            size="medium"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" size="medium">
            <InputLabel
              id="category-select-label"
              sx={{ color: "primary.main" }}
            >
              {t("createWarranty.category")}
            </InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              label={t("createWarranty.category")}
              disabled={!isEditMode}
            >
              {DEFAULT_WARRANTY_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label={t("createWarranty.startDate")}
              type="date"
              sx={{ flex: 1 }}
              value={formatDate(currentWarranty.startDate)}
              onChange={(e) => handleFieldChange("startDate", e.target.value)}
              disabled={!isEditMode}
              slotProps={{
                inputLabel: { sx: { color: "primary.main" } },
              }}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              size="medium"
            />
            <TextField
              label={t("createWarranty.endDate")}
              type="date"
              sx={{ flex: 1 }}
              value={formatDate(currentWarranty.endDate)}
              onChange={(e) => handleFieldChange("endDate", e.target.value)}
              disabled={!isEditMode}
              slotProps={{
                inputLabel: { sx: { color: "primary.main" } },
              }}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              size="medium"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label={t("warranty.createdAt")}
              sx={{ flex: 1 }}
              value={
                currentWarranty.metadata?.createdAt
                  ? formatDate(currentWarranty.metadata.createdAt)
                  : "N/A"
              }
              disabled={true}
              slotProps={{
                inputLabel: { sx: { color: "primary.main" } },
              }}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              size="medium"
            />
            <TextField
              label={t("warranty.lastUpdated")}
              sx={{ flex: 1 }}
              value={
                currentWarranty.metadata?.updatedAt
                  ? formatDate(currentWarranty.metadata.updatedAt)
                  : "N/A"
              }
              disabled={true}
              slotProps={{
                inputLabel: { sx: { color: "primary.main" } },
              }}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              size="medium"
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ mr: 1, fontWeight: 500 }}>
              {t("warranty.status")}:
            </Typography>
            <StatusChip status={currentWarranty.status} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label={t("createWarranty.notes")}
            fullWidth
            multiline
            rows={3}
            value={currentWarranty.metadata?.note || ""}
            onChange={(e) => handleNoteChange(e.target.value)}
            disabled={!isEditMode}
            slotProps={{
              inputLabel: { sx: { color: "primary.main" } },
            }}
            variant="outlined"
            size="medium"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
        {t("createWarranty.attachments")}
      </Typography>

      {currentFiles.length === 0 && newFiles.length === 0 ? (
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          {t("warranty.noFiles")}
        </Typography>
      ) : (
        <List dense sx={{ width: "100%", bgcolor: "background.paper", mb: 2 }}>
          {currentFiles.map((file) => (
            <ListItem
              key={file.id}
              secondaryAction={
                isEditMode ? (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveExistingFile(file.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                ) : null
              }
            >
              <ListItemIcon>{getFileIcon(file.contentType)}</ListItemIcon>
              <ListItemText
                primary={file.name || t("warranty.unnamedFile")}
                secondary={`${
                  file.size
                    ? (file.size / 1024).toFixed(1) + " KB"
                    : t("warranty.unknownSize")
                } • ${
                  file.uploadDate
                    ? format(new Date(file.uploadDate), "MM/dd/yyyy")
                    : t("warranty.unknownDate")
                }`}
              />
              {file.filePath && (
                <Button
                  size="small"
                  color="primary"
                  href={file.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ ml: 2 }}
                >
                  {t("warranty.viewFile")}
                </Button>
              )}
            </ListItem>
          ))}

          {newFiles.map((file, index) => (
            <ListItem
              key={`new-${index}`}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveNewFile(index)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemIcon>{getFileIcon(file.type)}</ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={`${(file.size / 1024).toFixed(1)} KB (${t(
                  "warranty.newFile"
                )})`}
              />
            </ListItem>
          ))}
        </List>
      )}

      {isEditMode && (
        <>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
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
        </>
      )}

      {isEditMode && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 6,
            pb: 4,
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            size="large"
            onClick={handleCancel}
            disabled={isSaving}
          >
            {t("warrantyCardList.cancel")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSave}
            disabled={isSaving}
            sx={{
              px: 4,
              backgroundColor: "#81c784",
              "&:hover": {
                backgroundColor: "#66bb6a",
              },
            }}
            startIcon={isSaving ? <CircularProgress size={20} /> : null}
          >
            {isSaving ? t("common.loading") : t("common.save")}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default WarrantyDetails;
