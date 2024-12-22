import MenuHeader from "../../components/menu-header/MenuHeader";
import CategoryList from "../../components/category-list/CategoryList";
import { useState } from "react";
import { Category } from "../../types/Warranty";

const defaultCategoryList: Category[] = [];

function ChooseCategoryPage() {
  const [categories, setCategories] = useState(defaultCategoryList);
  const [showUserCategories, setShowUserCategories] = useState<boolean>(true);

  const handleMostUsedCategoriesClick = () => {};

  const handleUserCategoriesClick = () => {};

  return (
    <>
      <MenuHeader text="Choose category" backButtonRedirect="/warranties/add" />
      <CategoryList
        items={categories}
        handleMostUsedCategoriesClick={() => handleMostUsedCategoriesClick}
        handleUserCategoriesClick={() => handleUserCategoriesClick}
      />
    </>
  );
}

export default ChooseCategoryPage;
