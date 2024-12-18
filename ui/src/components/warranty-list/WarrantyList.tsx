import editImg from "../../assets/edit-icon.svg";
import deleteImg from "../../assets/delete-icon.svg";
import "./WarrantyList.css";
import * as PropTypes from "prop-types";
import { Warranty } from "../../types/Warranty";

interface WarrantyListProps {
  items: Warranty[];
}

function WarrantyList(props: WarrantyListProps) {
  const warrantyList = props.items.map((warranty) => (
    <li key={warranty.id}>
      <div className="card shadow-sm position-relative mb-3">
        <div className="d-flex justify-content-between mt-2 mx-2">
          <h5 className="warranty-header px-2 mb-0">{warranty.name}</h5>
          <div className="btn-group">
            <button className="btn btn-sm btn-update">
              <img src={editImg} height="25px" />
            </button>
            <button className="btn btn-sm btn-delete">
              <img src={deleteImg} height="20px" />
            </button>
          </div>
        </div>
        <div className="card-body py-1">
          {warranty.category != null && (
            <p className="pb-0 mb-0">Category: {warranty.category}</p>
          )}
          <p className="pb-0 mb-0">Status: {warranty.status}</p>
          <p className="pb-0 mb-1">
            Expires: {new Date(warranty.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </li>
  ));

  return (
    <>
      <div className="container my-3 text-normal">
        <ul>{warrantyList}</ul>
      </div>
    </>
  );
}

WarrantyList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      startDate: PropTypes.instanceOf(Date),
      endDate: PropTypes.instanceOf(Date),
      status: PropTypes.string.isRequired,
      metadata: PropTypes.shape({
        note: PropTypes.string,
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
      }),
      files: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          file: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
};

export default WarrantyList;
