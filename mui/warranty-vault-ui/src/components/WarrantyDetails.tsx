import { FC, useState, useRef } from "react";
import {
  WarrantyDTO,
  WarrantyStatus,
  WarrantyFileDTO,
} from "../constants/Warranty";
import { format } from "date-fns";

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
} from "@mui/material";
import {
  Description as DocumentIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
  PictureAsPdf as PdfIcon,
  TableChart as SpreadsheetIcon,
  Delete as DeleteIcon,
  UploadFile as UploadFileIcon,
} from "@mui/icons-material";

// Interface for component props
interface WarrantyDetailsProps {
  warranty: WarrantyDTO;
  isEditMode?: boolean;
  onSave?: (updatedWarranty: WarrantyDTO) => Promise<void>;
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

  return (
    <Chip label={status.replace("_", " ")} size="small" {...getChipProps()} />
  );
};

// Main WarrantyDetails component
const WarrantyDetails: FC<WarrantyDetailsProps> = ({
  warranty,
  isEditMode = false,
  onSave,
}) => {
  const [currentWarranty, setCurrentWarranty] = useState<WarrantyDTO>(warranty);
  const [fileInput, setFileInput] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(currentWarranty);
    }
  };

  const handleFieldChange = (field: keyof WarrantyDTO, value: any) => {
    setCurrentWarranty((prev) => ({
      ...prev,
      [field]: value,
    }));
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
      const newFiles = Array.from(event.target.files);
      setFileInput((prevFiles) => [...prevFiles, ...newFiles]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setFileInput((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveExistingFile = (fileId: number) => {
    console.log("Remove existing file", fileId);
    // Here you would implement the logic to remove an existing file
    // This would typically involve updating the warranty object
  };

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
        mx: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Name"
            fullWidth
            value={currentWarranty.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            slotProps={{
              inputLabel: { sx: { color: "primary.main" } },
            }}
            variant={isEditMode ? "outlined" : "outlined"}
            size="medium"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Category"
            fullWidth
            value={currentWarranty.category?.name || "N/A"}
            slotProps={{
              inputLabel: { sx: { color: "primary.main" } },
            }}
            variant="outlined"
            size="medium"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Valid From"
              type="date"
              sx={{ flex: 1 }}
              value={formatDate(currentWarranty.startDate)}
              onChange={(e) => handleFieldChange("startDate", e.target.value)}
              slotProps={{
                inputLabel: { sx: { color: "primary.main" } },
              }}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              size="medium"
            />
            <TextField
              label="Valid Until"
              type="date"
              sx={{ flex: 1 }}
              value={formatDate(currentWarranty.endDate)}
              onChange={(e) => handleFieldChange("endDate", e.target.value)}
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
              label="Created At"
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
              label="Last Updated"
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
              Status:
            </Typography>
            <StatusChip status={currentWarranty.status} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Notes"
            fullWidth
            multiline
            rows={3}
            value={currentWarranty.metadata?.note || ""}
            onChange={(e) => handleNoteChange(e.target.value)}
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
        Attached Files
      </Typography>

      {(!currentWarranty.files || currentWarranty.files.length === 0) &&
      fileInput.length === 0 ? (
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          No files attached
        </Typography>
      ) : (
        <List dense sx={{ width: "100%", bgcolor: "background.paper", mb: 2 }}>
          {currentWarranty.files?.map((file) => (
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
                primary={file.name || "Unnamed file"}
                secondary={`${
                  file.size
                    ? (file.size / 1024).toFixed(1) + " KB"
                    : "Unknown size"
                } • ${
                  file.uploadDate
                    ? format(new Date(file.uploadDate), "MM/dd/yyyy")
                    : "Unknown date"
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
                  View
                </Button>
              )}
            </ListItem>
          ))}

          {fileInput.map((file, index) => (
            <ListItem
              key={`new-${index}`}
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
                <FileIcon />
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={`${(file.size / 1024).toFixed(1)} KB (New)`}
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
          />

          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            onClick={handleOpenFileDialog}
            sx={{ mb: 2, alignSelf: "flex-start" }}
          >
            Select Files
          </Button>
        </>
      )}

      {isEditMode && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 3,
            gap: 2,
          }}
        >
          <Button variant="outlined" size="large">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSave}
            sx={{
              px: 4,
              backgroundColor: "#81c784",
              "&:hover": {
                backgroundColor: "#66bb6a",
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default WarrantyDetails;
