import MenuHeader from "../../components/menu-header/MenuHeader";
import CreateWarrantyModal from "../../components/create-warranty-modal/CreateWarrantyModal";

function AddWarrantyPage() {
  return (
    <>
      <MenuHeader text="Add warranty" backButtonRedirect="/home" />
      <CreateWarrantyModal />
    </>
  );
}

export default AddWarrantyPage;
