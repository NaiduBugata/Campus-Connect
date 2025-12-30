import { useState, useEffect } from 'react';
import { notificationAPI } from '../../api/notification.api';

function NotificationStatus({ isSubscribed }) {
  const [stats, setStats] = useState({
    totalReceived: 0,
    unread: 0,
    read: 0,
    recentNotifications: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotificationStats();
  }, []);

  const fetchNotificationStats = async () => {
    try {
      setLoading(true);
      // Fetch all notifications
      const response = await notificationAPI.getAll();
      const notifications = response.data || [];

      // Calculate stats
      const activeNotifications = notifications.filter(n => n.status === 'active');
      const unreadCount = activeNotifications.filter(n => n.readStatus === 'UNREAD').length;
      const readCount = activeNotifications.filter(n => n.readStatus === 'READ').length;

      // Get recent 5 notifications
      const recent = activeNotifications
        .slice(0, 5)
        .map(n => ({
          id: n._id,
          title: n.title,
          status: n.readStatus.toLowerCase(),
          date: new Date(n.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })
        }));

      setStats({
        totalReceived: activeNotifications.length,
        unread: unreadCount,
        read: readCount,
        recentNotifications: recent
      });
    } catch (error) {
      console.error('Error fetching notification stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notification-status">
      <div className="status-header">
        <h2>📊 Notification Statistics</h2>
        <div className="subscription-status">
          {isSubscribed ? (
            <span className="status-badge subscribed">
              ✅ Subscribed
            </span>
          ) : (
            <span className="status-badge unsubscribed">
              ❌ Not Subscribed
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading-state" style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner" style={{ margin: '0 auto 20px' }}></div>
          <p>Loading statistics...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📧</div>
              <div className="stat-info">
                <h3>{stats.totalReceived}</h3>
                <p>Total Notifications</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔵</div>
              <div className="stat-info">
                <h3>{stats.unread}</h3>
                <p>Unread</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{stats.read}</h3>
                <p>Read</p>
              </div>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="recent-notifications">
            <h3>Recent Notifications</h3>
            {stats.recentNotifications.length > 0 ? (
              <div className="notification-list">
                {stats.recentNotifications.map(notification => (
                  <div key={notification.id} className="notification-item">
                    <div className="notification-content">
                      <span className={`status-dot ${notification.status}`}></span>
                      <div>
                        <p className="notification-title">{notification.title}</p>
                        <span className="notification-date">{notification.date}</span>
                      </div>
                    </div>
                    <span className={`status-label ${notification.status}`}>
                      {notification.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: '#666' }}>No notifications yet</p>
              </div>
            )}
          </div>
        </>
      )}

      {!isSubscribed && (
        <div className="subscription-reminder">
          <div className="reminder-icon">🔔</div>
          <div className="reminder-content">
            <h4>Subscribe to Stay Updated</h4>
            <p>You're currently not subscribed to notifications. Subscribe to receive important announcements and updates.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationStatus;