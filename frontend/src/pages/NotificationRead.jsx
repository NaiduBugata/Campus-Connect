import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getNotificationById, markAsRead } from '../api/notification.api';
import Loader from '../components/common/Loader';
import { formatDateTime } from '../utils/helpers';

function NotificationRead() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const notificationId = searchParams.get('id');
    
    if (!notificationId) {
      setError('No notification ID provided');
      setLoading(false);
      return;
    }

    fetchNotification(notificationId);
  }, [searchParams]);

  const fetchNotification = async (id) => {
    try {
      setLoading(true);
      
      // Fetch notification details
      const response = await getNotificationById(id);
      
      if (response.success) {
        setNotification(response.data);
        
        // Mark as read
        if (response.data.readStatus === 'UNREAD') {
          await markAsRead(id);
        }
      } else {
        setError(response.message || 'Notification not found');
      }
    } catch (err) {
      setError('Failed to load notification');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading notification..." />;
  }

  if (error) {
    return (
      <div className="notification-read-error">
        <h2>❌ {error}</h2>
        <button onClick={() => navigate('/student')} className="btn-primary">
          Go to Notifications
        </button>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="notification-read-error">
        <h2>Notification not found</h2>
        <button onClick={() => navigate('/student')} className="btn-primary">
          Go to Notifications
        </button>
      </div>
    );
  }

  return (
    <div className="notification-read-container">
      <div className="notification-read-card">
        <div className="notification-header">
          <span className={`type-badge ${notification.type}`}>
            {notification.type}
          </span>
          <span className={`priority-badge ${notification.priority}`}>
            {notification.priority} priority
          </span>
        </div>

        <h1>{notification.title}</h1>
        
        <div className="notification-meta">
          <span>📅 {formatDateTime(notification.createdAt)}</span>
          <span>👤 {notification.createdBy?.username || 'Admin'}</span>
          <span className={notification.readStatus === 'READ' ? 'status-read' : 'status-unread'}>
            {notification.readStatus === 'READ' ? '✅ Read' : '🔵 Unread'}
          </span>
        </div>

        <div className="notification-content">
          <p>{notification.message}</p>
        </div>

        <div className="notification-stats">
          <div className="stat-item">
            <span className="stat-label">Sent</span>
            <span className="stat-value">{notification.send_count} time(s)</span>
          </div>
          {notification.last_sent_at && (
            <div className="stat-item">
              <span className="stat-label">Last Sent</span>
              <span className="stat-value">{formatDateTime(notification.last_sent_at)}</span>
            </div>
          )}
        </div>

        <div className="notification-actions">
          <button onClick={() => navigate('/student')} className="btn-primary">
            Back to Notifications
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationRead;
