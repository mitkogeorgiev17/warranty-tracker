import "./CategoryList.css";
import { Category } from "../../types/Warranty";
import { CreateWarrantyCommand } from "../create-warranty-modal/CreateWarrantyModal";

interface CategoryListProps {
  createWarrantyCommand: CreateWarrantyCommand;
  items: Category[];
  showUserCategories: boolean;
  handleUserCategoriesClick: () => void;
  handleMostUsedCategoriesClick: () => void;
}

function CategoryList(props: CategoryListProps) {
  const categoriesList = props.items.map((category) => (
    <li key={category.name}>
      <div className="container category-container my-2 d-flex justify-content-left align-items-center">
        <h2 className="mb-0">{category.name}</h2>
      </div>
    </li>
  ));

  return (
    <>
      <div className="container d-flex justify-content-center gap-2 pb-3 align-items-center text-bold">
        <button
          className={`btn category-btn btn-light py-3 d-flex justify-content-center px-5 ${
            props.showUserCategories ? "btn-selected" : ""
          }`}
          onClick={props.handleUserCategoriesClick}
        >
          Your categories
        </button>
        <button
          className={`btn category-btn btn-light py-3 d-flex justify-content-center px-5 ${
            !props.showUserCategories ? "btn-selected" : ""
          }`}
          onClick={props.handleMostUsedCategoriesClick}
        >
          Most used
        </button>
      </div>
      <div className="container d-flex justify-content-center pt-4 text-bold">
        <ul>{categoriesList}</ul>
      </div>
    </>
  );
}

export default CategoryList;
