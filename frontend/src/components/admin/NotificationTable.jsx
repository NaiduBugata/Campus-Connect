import { useState, useEffect } from 'react';

function NotificationTable() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate fetching notifications (replace with actual API call)
    setNotifications([
      {
        id: 1,
        title: 'Welcome to CSE Web',
        message: 'Stay updated with latest announcements',
        type: 'announcement',
        priority: 'high',
        status: 'active',
        date: '2025-12-28'
      },
      {
        id: 2,
        title: 'System Maintenance',
        message: 'Scheduled maintenance on Jan 1, 2026',
        type: 'alert',
        priority: 'high',
        status: 'active',
        date: '2025-12-27'
      },
      {
        id: 3,
        title: 'New Feature Released',
        message: 'Check out our new notification system',
        type: 'info',
        priority: 'normal',
        status: 'inactive',
        date: '2025-12-26'
      }
    ]);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(notifications.filter(n => n.id !== id));
      alert('✅ Notification deleted');
    }
  };

  const handleToggleStatus = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, status: n.status === 'active' ? 'inactive' : 'active' } : n
    ));
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.status === filter);

  return (
    <div className="notification-table">
      <div className="table-header">
        <h2>All Notifications</h2>
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button 
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active ({notifications.filter(n => n.status === 'active').length})
          </button>
          <button 
            className={filter === 'inactive' ? 'active' : ''}
            onClick={() => setFilter('inactive')}
          >
            Inactive ({notifications.filter(n => n.status === 'inactive').length})
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredNotifications.map(notification => (
              <tr key={notification.id}>
                <td>
                  <div className="notification-title">
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                  </div>
                </td>
                <td>
                  <span className={`badge badge-${notification.type}`}>
                    {notification.type}
                  </span>
                </td>
                <td>
                  <span className={`priority priority-${notification.priority}`}>
                    {notification.priority}
                  </span>
                </td>
                <td>
                  <span className={`status status-${notification.status}`}>
                    {notification.status}
                  </span>
                </td>
                <td>{notification.date}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="toggle-btn"
                      onClick={() => handleToggleStatus(notification.id)}
                      title={notification.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {notification.status === 'active' ? '⏸' : '▶'}
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(notification.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredNotifications.length === 0 && (
          <div className="no-data">
            <p>No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationTable;