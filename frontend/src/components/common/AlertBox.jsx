import { useEffect } from 'react';
import '../../styles/alertBox.css';

function AlertBox({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="alert-overlay" onClick={onClose}>
      <div className="alert-box" onClick={(e) => e.stopPropagation()}>
        <div className={`alert-content alert-${type}`}>
          <div className="alert-icon">
            {type === 'success' && '✅'}
            {type === 'error' && '❌'}
            {type === 'warning' && '⚠️'}
            {type === 'info' && 'ℹ️'}
          </div>
          <div className="alert-message">{message}</div>
          <button className="alert-close" onClick={onClose}>×</button>
        </div>
      </div>
    </div>
  );
}

export default AlertBox;
