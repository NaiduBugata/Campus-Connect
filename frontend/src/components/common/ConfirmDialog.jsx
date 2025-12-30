import '../../styles/confirmDialog.css';

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-content">
          <div className="confirm-icon">⚠️</div>
          <div className="confirm-message">{message}</div>
          <div className="confirm-buttons">
            <button className="confirm-btn confirm-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button className="confirm-btn confirm-delete" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
