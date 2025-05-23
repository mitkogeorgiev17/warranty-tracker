import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { WarrantyDTO } from "../constants/Warranty";
import { differenceInDays, parseISO } from "date-fns";
import { useState } from "react";
import axiosApi from "../config/axiosApiConfig";
import { ENDPOINTS, API_BASE_URL } from "../constants/apiConstants";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next"; // Import for translations

interface WarrantyCardListProps {
  warranties: WarrantyDTO[];
  onWarrantyDeleted?: () => void; // Callback to refresh the list after deletion
}

const WarrantyCardList = ({
  warranties,
  onWarrantyDeleted,
}: WarrantyCardListProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize translation hook
  const [deletingWarrantyId, setDeletingWarrantyId] = useState<number | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit warranty handler
  const handleEditWarranty = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Edit warranty", id);
    navigate(`/warranty/update/${id}`);
  };

  // Delete warranty handlers
  const handleDeleteClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    setDeletingWarrantyId(id);
  };

  const handleDeleteCancel = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
    setDeletingWarrantyId(null);
  };

  const handleDeleteConfirm = async (
    warranty: WarrantyDTO,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent card click from triggering

    setIsDeleting(true);

    try {
      const endpoint = ENDPOINTS.DELETE_WARRANTY;
      await axiosApi({
        method: endpoint.method,
        url: `${API_BASE_URL}${endpoint.path}${warranty.id.toString()}`,
      });

      // Show success toast
      toast.success(t("warrantyCardList.deleteSuccess"));

      // Reset state
      setDeletingWarrantyId(null);

      // Call the callback to refresh the warranties list
      if (onWarrantyDeleted) {
        onWarrantyDeleted();
      }
    } catch (error: any) {
      console.error("Error deleting warranty:", error);

      // Show error toast
      toast.error(
        error.response?.data?.message || t("warrantyCardList.deleteError"),
        {
          duration: 5000,
        }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCardClick = (id: number) => {
    console.log("View warranty details", id);
    navigate(`/warranty/${id}`);
  };

  // Calculate remaining time string based on end date
  const getRemainingTimeString = (endDateString: string) => {
    const endDate = parseISO(endDateString);
    const today = new Date();
    const daysRemaining = differenceInDays(endDate, today);

    if (daysRemaining < 0) {
      return t("warrantyCardList.timeRemaining.expired");
    } else if (daysRemaining === 0) {
      return t("warrantyCardList.timeRemaining.expirestoday");
    } else if (daysRemaining === 1) {
      return t("warrantyCardList.timeRemaining.expiresTomorrow");
    } else if (daysRemaining < 30) {
      return t("warrantyCardList.timeRemaining.daysRemaining", {
        days: daysRemaining,
      });
    } else if (daysRemaining < 365) {
      const months = Math.floor(daysRemaining / 30);
      return t("warrantyCardList.timeRemaining.monthRemaining", {
        count: months,
      });
    } else {
      const years = Math.floor(daysRemaining / 365);
      return t("warrantyCardList.timeRemaining.yearRemaining", {
        count: years,
      });
    }
  };

  return (
    <Grid container spacing={1} sx={{ mt: -1 }} width={"92vw"}>
      {warranties.map((warranty) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={warranty.id} mt={0.8}>
          {deletingWarrantyId === warranty.id ? (
            // Delete confirmation card
            <Card
              sx={{
                position: "relative",
                height: "100%",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <CardContent
                sx={{
                  textAlign: "center",
                  py: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {t("warrantyCardList.deleteWarranty")}
                </Typography>
                <Typography sx={{ mb: 3 }}>
                  {/* Using dangerouslySetInnerHTML to render HTML from translations */}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t("warrantyCardList.deleteConfirmation", {
                        name: warranty.name,
                      }),
                    }}
                  />
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    mt: "auto",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleDeleteCancel}
                    disabled={isDeleting}
                    size="medium"
                  >
                    {t("warrantyCardList.cancel")}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={(e) => handleDeleteConfirm(warranty, e)}
                    disabled={isDeleting}
                    size="medium"
                  >
                    {isDeleting
                      ? t("warrantyCardList.deleting")
                      : t("warrantyCardList.delete")}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            // Normal warranty card
            <Card
              sx={{
                position: "relative",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
              onClick={() => handleCardClick(warranty.id)}
            >
              <CardContent
                sx={{
                  py: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  noWrap
                  sx={{ fontWeight: 500, color: "text.primary" }}
                >
                  {warranty.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {getRemainingTimeString(warranty.endDate)}
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-block",
                      backgroundColor: "rgba(0, 0, 0, 0.06)",
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {warranty.category && warranty.category
                        ? warranty.category
                        : t("warrantyCardList.uncategorized")}
                    </Typography>
                  </Box>

                  {/* Buttons aligned with category */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <IconButton
                      onClick={(e) => handleEditWarranty(warranty.id, e)}
                      sx={{
                        color: "#ffb74d",
                        border: "2px solid #ffb74d",
                        padding: "6px",
                        "&:hover": {
                          backgroundColor: "rgba(255, 183, 77, 0.1)",
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => handleDeleteClick(warranty.id, e)}
                      sx={{
                        color: "#f44336",
                        border: "2px solid #f44336",
                        padding: "6px",
                        "&:hover": {
                          backgroundColor: "rgba(244, 67, 54, 0.1)",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default WarrantyCardList;
