import { useState, useEffect } from 'react';

function NotificationStatus({ isSubscribed }) {
  const [stats, setStats] = useState({
    totalReceived: 0,
    unread: 0,
    read: 0,
    recentNotifications: []
  });

  useEffect(() => {
    // Simulate fetching notification stats (replace with actual API call)
    setStats({
      totalReceived: 15,
      unread: 3,
      read: 12,
      recentNotifications: [
        { id: 1, title: 'Welcome to CSE Web', status: 'read', date: '2025-12-28' },
        { id: 2, title: 'System Maintenance', status: 'unread', date: '2025-12-27' },
        { id: 3, title: 'New Feature Released', status: 'read', date: '2025-12-26' },
        { id: 4, title: 'Holiday Notice', status: 'read', date: '2025-12-25' },
        { id: 5, title: 'Important: Exam Schedule', status: 'unread', date: '2025-12-24' }
      ]
    });
  }, []);

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

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-info">
            <h3>{stats.totalReceived}</h3>
            <p>Total Received</p>
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
      </div>

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