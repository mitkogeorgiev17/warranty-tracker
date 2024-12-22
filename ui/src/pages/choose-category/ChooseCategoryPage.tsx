import MenuHeader from "../../components/menu-header/MenuHeader";
import CategoryList from "../../components/category-list/CategoryList";
import { useEffect, useState } from "react";
import { Category } from "../../types/Warranty";
import axiosApi from "../../config/axiosApiConfig";
import { ENDPOINTS, API_BASE_URL } from "../../config/apiConstants";
import { useNavigate } from "react-router-dom";

const defaultCategoryList: Category[] = [];

function ChooseCategoryPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(defaultCategoryList);
  const [showUserCategories, setShowUserCategories] = useState<boolean>(true);

  const handleUserCategoriesClick = () => {
    if (showUserCategories) return;
    setShowUserCategories(true);
  };
  const handleMostUsedCategoriesClick = () => {
    if (!showUserCategories) return;
    setShowUserCategories(false);
  };

  useEffect(() => {
    const endpoint = showUserCategories
      ? ENDPOINTS.GET_USER_CATEGORIES
      : ENDPOINTS.GET_MOST_USED_CATEGORIES;

    axiosApi({
      method: endpoint.method,
      url: `${API_BASE_URL}${endpoint.path}`,
    })
      .then((response) => {
        setCategories(response.data);
        console.log(categories);
      })
      .catch((error) => {
        switch (error.status) {
          case 401:
            navigate("/unauthorized");
        }
      });
  }, [showUserCategories]);

  return (
    <>
      <MenuHeader text="Choose category" backButtonRedirect="/warranties/add" />
      <CategoryList
        items={categories}
        showUserCategories={showUserCategories}
        handleMostUsedCategoriesClick={handleMostUsedCategoriesClick}
        handleUserCategoriesClick={handleUserCategoriesClick}
      />
    </>
  );
}

export default ChooseCategoryPage;
