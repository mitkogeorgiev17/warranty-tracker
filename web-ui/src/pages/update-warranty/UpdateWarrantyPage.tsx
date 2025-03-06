import "./UpdateWarrantyPage.css";
import MenuHeader from "../../components/menu-header/MenuHeader";
import { useParams } from "react-router-dom";

function UpdateWarrantyPage() {
  const { warrantyId } = useParams();

  return (
    <>
      <MenuHeader text="Edit warranty" backButtonRedirect="/warranties" />
    </>
  );
}

export default UpdateWarrantyPage;
