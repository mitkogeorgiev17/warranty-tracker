import "./CategoryList.css";
import { Category } from "../../types/Warranty";

interface CategoryListProps {
  items: Category[];
  handleUserCategoriesClick: () => void;
  handleMostUsedCategoriesClick: () => void;
}

function CategoryList(props: CategoryListProps) {
  return (
    <>
      <div className="container d-flex justify-content-center gap-5 pb-3 align-items-center text-bold">
        <button
          className="btn btn-light py-3 d-flex justify-content-center px-5"
          onClick={props.handleUserCategoriesClick}
        >
          Your categories
        </button>
        <button
          className="btn btn-light py-3 d-flex justify-content-center px-5"
          onClick={props.handleMostUsedCategoriesClick}
        >
          Most used
        </button>
      </div>
    </>
  );
}

export default CategoryList;
