import "./ConfirmationDialog.css";

interface DialogProps {
  dialogText: string;
  acceptButtonText: string;
  declineButtonText: string;
  onAccept: () => void;
  onDecline: () => void;
  show: boolean;
}

function ConfirmationDialog(props: DialogProps) {
  if (!props.show) {
    return null;
  }

  return (
    <>
      <div className="confirmation-dialog d-flex justify-content-center mt-2 mx-2">
        <div className="modal-content px-3 mb-0 text-center">
          <div className="modal-header">
            <h5 className="modal-title">Confirmation</h5>
          </div>
          <div className="modal-body">
            <p>{props.dialogText}</p>
          </div>
          <div className="d-flex justify-content-center gap-3 pb-3">
            <button
              className="btn btn-secondary py-2 d-flex justify-content-center px-5"
              onClick={props.onDecline}
            >
              {props.declineButtonText}
            </button>
            <button
              className="btn btn-danger py-2 d-flex justify-content-center px-5"
              onClick={props.onAccept}
            >
              {props.acceptButtonText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmationDialog;
