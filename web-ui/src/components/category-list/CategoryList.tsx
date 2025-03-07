import "./CategoryList.css";
import { Category } from "../../types/Warranty";
import { Warranty } from "../create-warranty-modal/CreateWarrantyModal";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import backArrowImg from "../../assets/back-arrow.svg";
import addImg from "../../assets/add-icon.svg";

interface CategoryListProps {
  createWarrantyCommand: Warranty | null;
  items: Category[];
  showUserCategories: boolean;
  handleUserCategoriesClick: () => void;
  handleMostUsedCategoriesClick: () => void;
}

function CategoryList(props: CategoryListProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [categoryInput, setCategoryInput] = useState("");
  const createWarrantyCommand =
    (location.state?.createWarrantyCommand as Warranty) ??
    props.createWarrantyCommand;

  const handleCategoryClick = (categoryName: string) => {
    createWarrantyCommand.category = categoryName;

    navigate("/warranties/add", {
      state: { createWarrantyCommand },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryInput(e.target.value);
  };

  const handleAddCategoryClick = () => {
    if (categoryInput.trim()) {
      createWarrantyCommand.category = categoryInput;
      navigate("/warranties/add", {
        state: { createWarrantyCommand: createWarrantyCommand },
      });
    }
  };

  const categoriesList = props.items.map((category) => (
    <li key={category.name}>
      <div
        className="container category-container my-2 d-flex justify-content-left align-items-center"
        onClick={() => handleCategoryClick(category.name)}
      >
        <h5 className="mb-0 text-normal">{category.name}</h5>
      </div>
    </li>
  ));

  const handleBackArrowClick = () => {
    navigate(-1 as any, {
      state: { createWarrantyCommand: createWarrantyCommand },
    });
  };

  return (
    <>
      <div className="container pt-4 d-flex  justify-content-between px-4 mb-4 ">
        <img
          onClick={handleBackArrowClick}
          className="back-arrow"
          src={backArrowImg}
          style={{ width: "7vw", maxWidth: "100%", display: "block" }}
        />
        <h2 className="text-bold">Choose category</h2>
      </div>
      <div className="container d-flex justify-content-center gap-2 pb-3 align-items-center">
        <button
          className={`btn category-btn btn-light py-3 d-flex justify-content-center px-5 text-bold ${
            props.showUserCategories ? "btn-selected" : ""
          }`}
          onClick={props.handleUserCategoriesClick}
        >
          Your categories
        </button>
        <button
          className={`btn category-btn btn-light py-3 d-flex justify-content-center px-5 text-bold ${
            !props.showUserCategories ? "btn-selected" : ""
          }`}
          onClick={props.handleMostUsedCategoriesClick}
        >
          Most used
        </button>
      </div>
      <div className="container d-flex justify-content-center pt-4">
        <ul>
          <div className="container category-container my-2 d-flex justify-content-left align-items-center">
            <input
              type="text"
              className="text-normal px-0"
              placeholder="Enter category"
              id="categoryInput"
              value={categoryInput}
              onChange={handleInputChange}
            />
            <img
              src={addImg}
              className={categoryInput.trim() ? "" : "btn-requirements-not-met"}
              style={{ height: "5vh" }}
              onClick={handleAddCategoryClick}
            />
          </div>
          {categoriesList}
        </ul>
      </div>
    </>
  );
}

export default CategoryList;
