import "./WarrantiesPage.css";
import WarrantyList from "../../components/warranty-list/WarrantyList";
import MenuHeader from "../../components/menu-header/MenuHeader";
import { Warranty } from "../../types/Warranty";

function WarrantiesPage() {
  const warrantyList: Warranty[] = [
    {
      id: 1,
      name: "Samsung TV Warranty",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2025-12-31"),
      status: "Active",
      category: "Electronics",
    },
    {
      id: 2,
      name: "Ikea Sofa Warranty",
      startDate: new Date("2022-06-01"),
      endDate: new Date("2023-06-15"),
      status: "Expired",
      category: "Furniture",
    },
    {
      id: 3,
      name: "LG Refrigerator Warranty",
      startDate: new Date("2024-02-01"),
      endDate: new Date("2026-03-01"),
      status: "Active",
      category: "Appliances",
    },
    {
      id: 4,
      name: "Toyota Car Warranty",
      startDate: new Date("2022-11-15"),
      endDate: new Date("2024-11-30"),
      status: "Pending",
      category: "Automotive",
    },
  ];

  return (
    <>
      <MenuHeader text="Your warranties" />
      <WarrantyList items={warrantyList} />
    </>
  );
}

export default WarrantiesPage;
