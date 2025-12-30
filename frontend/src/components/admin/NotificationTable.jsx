import { useState, useEffect } from 'react';
import { getNotifications, deleteNotification, updateNotification } from '../../api/notification.api';

function NotificationTable() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications();
      
      if (response.success) {
        // Map backend data to frontend format
        const mappedData = response.data.map(n => ({
          id: n._id,
          notification_id: n.notification_id,
          title: n.title,
          message: n.message,
          type: n.type,
          priority: n.priority,
          status: n.status,
          date: new Date(n.createdAt).toLocaleDateString(),
          send_count: n.send_count,
          delivered_count: n.delivered_count,
          read_count: n.read_count
        }));
        setNotifications(mappedData);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      alert('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await deleteNotification(id, token);
        
        if (response.success) {
          setNotifications(notifications.filter(n => n.id !== id));
          alert('✅ Notification deleted');
        } else {
          alert('❌ Failed to delete notification');
        }
      } catch (error) {
        console.error('Error deleting notification:', error);
        alert('❌ Failed to delete notification');
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const notification = notifications.find(n => n.id === id);
      const newStatus = notification.status === 'active' ? 'inactive' : 'active';
      
      const response = await updateNotification(id, { status: newStatus }, token);
      
      if (response.success) {
        setNotifications(notifications.map(n => 
          n.id === id ? { ...n, status: newStatus } : n
        ));
      } else {
        alert('❌ Failed to update notification status');
      }
    } catch (error) {
      console.error('Error updating notification:', error);
      alert('❌ Failed to update notification status');
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.status === filter);

  if (loading) {
    return (
      <div className="notification-table">
        <div className="loading">Loading notifications...</div>
      </div>
    );
  }

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