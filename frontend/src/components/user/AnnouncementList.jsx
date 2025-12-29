import { useState, useEffect } from 'react';

function AnnouncementList() {
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate fetching announcements (replace with actual API call)
    setAnnouncements([
      {
        id: 1,
        title: 'Welcome to CSE Web',
        message: 'Stay updated with latest announcements and notifications from the department.',
        type: 'announcement',
        priority: 'high',
        date: '2025-12-28',
        time: '10:30 AM',
        isNew: true
      },
      {
        id: 2,
        title: 'System Maintenance',
        message: 'Scheduled maintenance on Jan 1, 2026. The system will be unavailable for 2 hours.',
        type: 'alert',
        priority: 'high',
        date: '2025-12-27',
        time: '02:15 PM',
        isNew: true
      },
      {
        id: 3,
        title: 'New Feature Released',
        message: 'Check out our new notification system with real-time updates and push notifications.',
        type: 'info',
        priority: 'normal',
        date: '2025-12-26',
        time: '09:00 AM',
        isNew: false
      },
      {
        id: 4,
        title: 'Holiday Notice',
        message: 'The department will be closed from Dec 31 to Jan 2. Happy New Year!',
        type: 'announcement',
        priority: 'normal',
        date: '2025-12-25',
        time: '11:45 AM',
        isNew: false
      },
      {
        id: 5,
        title: 'Important: Exam Schedule',
        message: 'Mid-term examinations will commence from Jan 15, 2026. Check your timetable.',
        type: 'warning',
        priority: 'high',
        date: '2025-12-24',
        time: '03:30 PM',
        isNew: false
      }
    ]);
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

      <div className="announcements-grid">
        {filteredAnnouncements.map(announcement => (
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
        ))}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="no-announcements">
          <p>📤 No announcements found</p>
        </div>
      )}
    </div>
  );
}

export default AnnouncementList;