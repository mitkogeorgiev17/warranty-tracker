import { useEffect, useState, Fragment, useMemo } from "react";
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
import { useTranslation } from "react-i18next";

function ManageWarrantiesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [warranties, setWarranties] = useState<WarrantyDTO[]>([]);
  const [filteredWarranties, setFilteredWarranties] = useState<WarrantyDTO[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Memoize these translation values to prevent re-renders
  const EXPIRATION_FILTERS = useMemo(
    () => ({
      LESS_THAN_MONTH: t("manageWarranties.filters.lessThanMonth"),
      ONE_TO_TWELVE_MONTHS: t("manageWarranties.filters.oneToTwelveMonths"),
      MORE_THAN_YEAR: t("manageWarranties.filters.moreThanYear"),
    }),
    [t]
  );

  const UNCATEGORIZED = useMemo(
    () => t("manageWarranties.filters.uncategorized"),
    [t]
  );

  const [expirationFilter, setExpirationFilter] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [hasUncategorized, setHasUncategorized] = useState(false);

  const [expirationMenuAnchor, setExpirationMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [categoryMenuAnchor, setCategoryMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Initial load of warranties only on mount
  useEffect(() => {
    fetchWarranties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch warranties function
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

  // Extract available categories from warranties
  useEffect(() => {
    if (warranties.length === 0) return;

    // Check if there are any warranties without categories
    const hasNullCategories = warranties.some(
      (w) => !w.category || w.category === ""
    );
    setHasUncategorized(hasNullCategories);

    // Extract unique categories
    const categories = Array.from(
      new Set(
        warranties
          .map((w) => (w.category && w.category !== "" ? w.category : null))
          .filter((name) => name !== null) as string[]
      )
    );
    setAvailableCategories(categories);
  }, [warranties]);

  // Apply filters to warranties - now with memoized filters
  useEffect(() => {
    if (warranties.length === 0) return;

    let filtered = [...warranties];
    const now = new Date();

    // Apply expiration filter
    if (expirationFilter) {
      filtered = filtered.filter((warranty) => {
        const expiryDate = new Date(warranty.endDate);
        const monthsDifference =
          (expiryDate.getFullYear() - now.getFullYear()) * 12 +
          (expiryDate.getMonth() - now.getMonth());

        if (expirationFilter === EXPIRATION_FILTERS.LESS_THAN_MONTH) {
          return monthsDifference < 1;
        } else if (
          expirationFilter === EXPIRATION_FILTERS.ONE_TO_TWELVE_MONTHS
        ) {
          return monthsDifference >= 1 && monthsDifference <= 12;
        } else if (expirationFilter === EXPIRATION_FILTERS.MORE_THAN_YEAR) {
          return monthsDifference > 12;
        }
        return true;
      });
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((warranty) => {
        // Handle uncategorized warranties
        if (
          selectedCategories.includes(UNCATEGORIZED) &&
          (!warranty.category || warranty.category === "")
        ) {
          return true;
        }

        // Handle categorized warranties
        return (
          warranty.category &&
          warranty.category !== "" &&
          selectedCategories.includes(warranty.category)
        );
      });
    }

    setFilteredWarranties(filtered);
  }, [
    warranties,
    expirationFilter,
    selectedCategories,
    EXPIRATION_FILTERS,
    UNCATEGORIZED,
  ]);

  // Toggle filters visibility
  const handleToggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  // Handle expiration filter selection
  const handleExpirationFilterSelect = (option: string) => {
    setExpirationFilter(expirationFilter === option ? null : option);
    setExpirationMenuAnchor(null);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setExpirationFilter(null);
    setSelectedCategories([]);
    setFiltersVisible(false);
  };

  // Render filter content
  const renderFilterContent = () => {
    if (!filtersVisible) {
      return (
        <Fragment>
          <FilterAltIcon sx={{ marginRight: "8px" }} />
          <Typography>{t("manageWarranties.filter")}</Typography>
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
          open={Boolean(expirationMenuAnchor)}
          onClose={() => setExpirationMenuAnchor(null)}
        >
          {Object.values(EXPIRATION_FILTERS).map((option) => (
            <MenuItem
              key={option}
              onClick={() => handleExpirationFilterSelect(option)}
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
          open={Boolean(categoryMenuAnchor)}
          onClose={() => setCategoryMenuAnchor(null)}
        >
          {/* Add Uncategorized option if there are uncategorized warranties */}
          {hasUncategorized && (
            <MenuItem
              key={UNCATEGORIZED}
              onClick={() => handleCategorySelect(UNCATEGORIZED)}
            >
              <Checkbox checked={selectedCategories.includes(UNCATEGORIZED)} />
              <ListItemText primary={UNCATEGORIZED} />
            </MenuItem>
          )}

          {/* Regular categories */}
          {availableCategories.map((category) => (
            <MenuItem
              key={category}
              onClick={() => handleCategorySelect(category)}
            >
              <Checkbox checked={selectedCategories.includes(category)} />
              <ListItemText primary={category} />
            </MenuItem>
          ))}
        </Menu>

        <IconButton
          onClick={handleResetFilters}
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
      <PageHeader title={t("pages.manageWarranties")} borderColor="#ffb74d" />
      <Box
        onClick={!filtersVisible ? handleToggleFilters : undefined}
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
            {t("manageWarranties.loadingWarranties")}
          </Typography>
        ) : filteredWarranties.length === 0 &&
          (expirationFilter || selectedCategories.length > 0) ? (
          <Typography align="center" color="text.secondary">
            {t("manageWarranties.noMatchingWarranties")}
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
