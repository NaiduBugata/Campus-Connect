import { useState, useEffect } from 'react';
import { getNotifications } from '../../api/notification.api';

function AnnouncementList() {
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await getNotifications({ status: 'active' });
      
      if (response.success) {
        // Map backend data to frontend format
        const mappedData = response.data.map(n => ({
          id: n._id,
          notification_id: n.notification_id,
          title: n.title,
          message: n.message,
          type: n.type,
          priority: n.priority,
          date: new Date(n.createdAt).toLocaleDateString(),
          time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isNew: new Date(n.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000) // New if less than 24h old
        }));
        setAnnouncements(mappedData);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnnouncements, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredAnnouncements = filter === 'all'
    ? announcements
    : announcements.filter(a => a.priority === filter);

  const getTypeEmoji = (type) => {
    switch(type) {
      case 'announcement': return '📢';
      case 'alert': return '⚠️';
      case 'info': return 'ℹ️';
      case 'warning': return '🚨';
      default: return '📢';
    }
  };

  if (loading) {
    return (
      <div className="announcement-list">
        <div className="loading">Loading announcements...</div>
      </div>
    );
  }

  return (
    <div className="announcement-list">
      <div className="list-header">
        <h2>📬 All Announcements</h2>
        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({announcements.length})
          </button>
          <button
            className={filter === 'high' ? 'active' : ''}
            onClick={() => setFilter('high')}
          >
            High Priority ({announcements.filter(a => a.priority === 'high').length})
          </button>
          <button
            className={filter === 'normal' ? 'active' : ''}
            onClick={() => setFilter('normal')}
          >
            Normal ({announcements.filter(a => a.priority === 'normal').length})
          </button>
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="no-announcements">
          <p>No announcements available at the moment.</p>
        </div>
      ) : (
        <div className="announcements-grid">
          {filteredAnnouncements.length === 0 ? (
            <div className="no-announcements">
              <p>📤 No announcements match your filter</p>
            </div>
          ) : (
            filteredAnnouncements.map(announcement => (
              <div key={announcement.id} className={`announcement-card ${announcement.isNew ? 'new' : ''}`}>
                {announcement.isNew && <span className="new-badge">NEW</span>}
                <div className="announcement-header">
                  <div className="announcement-type">
                    <span className="type-emoji">{getTypeEmoji(announcement.type)}</span>
                    <span className={`type-label type-${announcement.type}`}>
                      {announcement.type}
                    </span>
                  </div>
                  <span className={`priority-badge priority-${announcement.priority}`}>
                    {announcement.priority}
                  </span>
                </div>
                <h3>{announcement.title}</h3>
                <p>{announcement.message}</p>
                <div className="announcement-footer">
                  <span className="date">📅 {announcement.date}</span>
                  <span className="time">🕒 {announcement.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AnnouncementList;