import { useEffect, useState, Fragment } from "react";
import PageHeader from "../components/PageHeader";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarrantyCardList from "../components/WarrantyCardList";
import { WarrantyDTO } from "../constants/Warranty";
import axiosApi from "../config/axiosApiConfig";
import { API_BASE_URL, ENDPOINTS } from "../constants/apiConstants";
import { useNavigate } from "react-router-dom";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CategoryIcon from "@mui/icons-material/Category";

const EXPIRATION_FILTERS = {
  LESS_THAN_MONTH: "Less than a month",
  ONE_TO_TWELVE_MONTHS: "1-12 months",
  MORE_THAN_YEAR: "1 year +",
};

const UNCATEGORIZED = "Uncategorized";

function ManageWarrantiesPage() {
  const navigate = useNavigate();
  const [warranties, setWarranties] = useState<WarrantyDTO[]>([]);
  const [filteredWarranties, setFilteredWarranties] = useState<WarrantyDTO[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const [expirationFilter, setExpirationFilter] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [hasUncategorized, setHasUncategorized] = useState(false);

  const [expirationMenuAnchor, setExpirationMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [categoryMenuAnchor, setCategoryMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);

  useEffect(() => {
    fetchWarranties();
  }, []);

  useEffect(() => {
    if (warranties.length > 0) {
      // Check if there are any warranties without categories
      const hasNullCategories = warranties.some(
        (w) => !w.category || !w.category.name
      );
      setHasUncategorized(hasNullCategories);

      // Extract unique categories and handle null or undefined categories
      const categories = Array.from(
        new Set(
          warranties
            .map((w) =>
              w.category && w.category.name ? w.category.name : null
            )
            .filter((name) => name !== null) as string[]
        )
      );
      setAvailableCategories(categories);
    }
  }, [warranties]);

  useEffect(() => {
    let filtered = [...warranties];
    const now = new Date();

    if (expirationFilter) {
      filtered = filtered.filter((warranty) => {
        const expiryDate = new Date(warranty.endDate);
        const monthsDifference =
          (expiryDate.getFullYear() - now.getFullYear()) * 12 +
          (expiryDate.getMonth() - now.getMonth());

        switch (expirationFilter) {
          case EXPIRATION_FILTERS.LESS_THAN_MONTH:
            return monthsDifference < 1;
          case EXPIRATION_FILTERS.ONE_TO_TWELVE_MONTHS:
            return monthsDifference >= 1 && monthsDifference <= 12;
          case EXPIRATION_FILTERS.MORE_THAN_YEAR:
            return monthsDifference > 12;
          default:
            return true;
        }
      });
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((warranty) => {
        // Handle uncategorized warranties
        if (
          selectedCategories.includes(UNCATEGORIZED) &&
          (!warranty.category || !warranty.category.name)
        ) {
          return true;
        }

        // Handle categorized warranties
        return (
          warranty.category &&
          warranty.category.name &&
          selectedCategories.includes(warranty.category.name)
        );
      });
    }

    setFilteredWarranties(filtered);
  }, [warranties, expirationFilter, selectedCategories]);

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const response = await axiosApi.get(
        `${API_BASE_URL}${ENDPOINTS.GET_WARRANTIES.path}`
      );
      setWarranties(response.data || []);
    } catch (err: any) {
      navigate(err.response?.status === 401 ? "/unauthorized" : "/error");
    } finally {
      setLoading(false);
    }
  };

  const renderFilterContent = () => {
    if (!filtersVisible) {
      return (
        <Fragment>
          <FilterAltIcon sx={{ marginRight: "8px" }} />
          <Typography>Filter</Typography>
        </Fragment>
      );
    }

    return (
      <Stack
        direction="row"
        spacing={4}
        alignItems="center"
        sx={{ width: "100%", justifyContent: "center" }}
      >
        <IconButton
          onClick={(e) => setExpirationMenuAnchor(e.currentTarget)}
          sx={{
            color: expirationFilter ? "#ff9800" : "#aaa",
            padding: "12px",
          }}
        >
          <AccessTimeIcon />
        </IconButton>
        <Menu
          anchorEl={expirationMenuAnchor}
          open={!!expirationMenuAnchor}
          onClose={() => setExpirationMenuAnchor(null)}
        >
          {Object.values(EXPIRATION_FILTERS).map((option) => (
            <MenuItem
              key={option}
              onClick={() => {
                setExpirationFilter(
                  expirationFilter === option ? null : option
                );
                setExpirationMenuAnchor(null);
              }}
              selected={expirationFilter === option}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>

        <IconButton
          onClick={(e) => setCategoryMenuAnchor(e.currentTarget)}
          sx={{
            color: selectedCategories.length > 0 ? "#ff9800" : "#aaa",
            padding: "12px",
          }}
        >
          <CategoryIcon />
        </IconButton>
        <Menu
          anchorEl={categoryMenuAnchor}
          open={!!categoryMenuAnchor}
          onClose={() => setCategoryMenuAnchor(null)}
        >
          {/* Add Uncategorized option if there are uncategorized warranties */}
          {hasUncategorized && (
            <MenuItem
              key={UNCATEGORIZED}
              onClick={() =>
                setSelectedCategories((prev) =>
                  prev.includes(UNCATEGORIZED)
                    ? prev.filter((c) => c !== UNCATEGORIZED)
                    : [...prev, UNCATEGORIZED]
                )
              }
            >
              <Checkbox checked={selectedCategories.includes(UNCATEGORIZED)} />
              <ListItemText primary={UNCATEGORIZED} />
            </MenuItem>
          )}

          {/* Regular categories */}
          {availableCategories.map((category) => (
            <MenuItem
              key={category}
              onClick={() =>
                setSelectedCategories((prev) =>
                  prev.includes(category)
                    ? prev.filter((c) => c !== category)
                    : [...prev, category]
                )
              }
            >
              <Checkbox checked={selectedCategories.includes(category)} />
              <ListItemText primary={category} />
            </MenuItem>
          ))}
        </Menu>

        <IconButton
          onClick={() => {
            setExpirationFilter(null);
            setSelectedCategories([]);
            setFiltersVisible(false);
          }}
          sx={{
            padding: "12px",
          }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
    );
  };

  return (
    <>
      <PageHeader title="Manage warranties" borderColor="#ffb74d" />
      <Box
        onClick={!filtersVisible ? () => setFiltersVisible(true) : undefined}
        sx={{
          width: "90vw",
          margin: "2vh auto",
          padding: "12px 24px",
          backgroundColor: "#1e1e1e",
          display: "flex",
          justifyContent: !filtersVisible ? "center" : "flex-start",
          alignItems: "center",
          borderRadius: "8px",
          marginBottom: "0",
          cursor: !filtersVisible ? "pointer" : "default",
        }}
      >
        {renderFilterContent()}
      </Box>

      <Box
        sx={{
          padding: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <Typography align="center" color="text.secondary">
            Loading warranties...
          </Typography>
        ) : filteredWarranties.length === 0 &&
          (expirationFilter || selectedCategories.length > 0) ? (
          <Typography align="center" color="text.secondary">
            No warranties match the selected filters.
          </Typography>
        ) : (
          <WarrantyCardList
            warranties={
              filteredWarranties.length > 0 ? filteredWarranties : warranties
            }
            onWarrantyDeleted={fetchWarranties}
          />
        )}
      </Box>
    </>
  );
}

export default ManageWarrantiesPage;
