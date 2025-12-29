import { useState, useEffect } from 'react';
import '../../styles/events.css';

function Events() {
  const [activeView, setActiveView] = useState('list'); // 'list' or 'create'
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'seminar',
    status: 'upcoming'
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate fetching events (replace with actual API call)
    setEvents([
      {
        id: 1,
        title: 'Tech Conference 2026',
        description: 'Annual technology conference featuring latest innovations and trends',
        date: '2026-02-15',
        time: '09:00 AM',
        location: 'Main Auditorium',
        category: 'conference',
        status: 'upcoming',
        attendees: 150
      },
      {
        id: 2,
        title: 'AI Workshop',
        description: 'Hands-on workshop on Artificial Intelligence and Machine Learning',
        date: '2026-01-20',
        time: '02:00 PM',
        location: 'Lab 301',
        category: 'workshop',
        status: 'upcoming',
        attendees: 50
      },
      {
        id: 3,
        title: 'Web Development Seminar',
        description: 'Learn modern web development techniques and best practices',
        date: '2025-12-20',
        time: '10:30 AM',
        location: 'Conference Hall',
        category: 'seminar',
        status: 'completed',
        attendees: 80
      },
      {
        id: 4,
        title: 'Career Fair',
        description: 'Meet recruiters from top tech companies',
        date: '2026-03-10',
        time: '11:00 AM',
        location: 'Campus Ground',
        category: 'career',
        status: 'upcoming',
        attendees: 200
      }
    ]);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call (replace with actual backend call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEvent = {
        id: events.length + 1,
        ...formData,
        attendees: 0
      };
      
      setEvents([newEvent, ...events]);
      alert('✅ Event created successfully!');
      
      // Reset form and switch to list view
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'seminar',
        status: 'upcoming'
      });
      setActiveView('list');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('❌ Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== id));
      alert('✅ Event deleted');
    }
  };

  const handleToggleStatus = (id) => {
    setEvents(events.map(e => 
      e.id === id 
        ? { ...e, status: e.status === 'upcoming' ? 'completed' : 'upcoming' } 
        : e
    ));
  };

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.status === filter);

  const getCategoryColor = (category) => {
    switch(category) {
      case 'seminar': return '#1976d2';
      case 'workshop': return '#388e3c';
      case 'conference': return '#f57c00';
      case 'career': return '#c62828';
      default: return '#666';
    }
  };

  return (
    <div className="events-container">
      {/* Header with Toggle */}
      <div className="events-header">
        <h2>📅 Event Management</h2>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${activeView === 'list' ? 'active' : ''}`}
            onClick={() => setActiveView('list')}
          >
            📋 View Events
          </button>
          <button
            className={`toggle-btn ${activeView === 'create' ? 'active' : ''}`}
            onClick={() => setActiveView('create')}
          >
            ➕ Create Event
          </button>
        </div>
      </div>

      {/* Create Event Form */}
      {activeView === 'create' && (
        <div className="event-form-section">
          <h3>Create New Event</h3>
          <form onSubmit={handleSubmit} className="event-form">
            <div className="form-row">
              <div className="form-group">
                <label>Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="seminar">Seminar</option>
                  <option value="workshop">Workshop</option>
                  <option value="conference">Conference</option>
                  <option value="career">Career Fair</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter event description"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Event location"
                  required
                />
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Creating...' : 'Create Event'}
              </button>
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={() => setActiveView('list')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Event List */}
      {activeView === 'list' && (
        <div className="event-list-section">
          <div className="list-controls">
            <h3>All Events ({filteredEvents.length})</h3>
            <div className="filter-buttons">
              <button
                className={filter === 'all' ? 'active' : ''}
                onClick={() => setFilter('all')}
              >
                All ({events.length})
              </button>
              <button
                className={filter === 'upcoming' ? 'active' : ''}
                onClick={() => setFilter('upcoming')}
              >
                Upcoming ({events.filter(e => e.status === 'upcoming').length})
              </button>
              <button
                className={filter === 'completed' ? 'active' : ''}
                onClick={() => setFilter('completed')}
              >
                Completed ({events.filter(e => e.status === 'completed').length})
              </button>
            </div>
          </div>

          <div className="events-grid">
            {filteredEvents.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-card-header">
                  <span 
                    className="category-badge" 
                    style={{ backgroundColor: getCategoryColor(event.category) }}
                  >
                    {event.category}
                  </span>
                  <span className={`status-badge status-${event.status}`}>
                    {event.status}
                  </span>
                </div>

                <h3>{event.title}</h3>
                <p className="event-description">{event.description}</p>

                <div className="event-details">
                  <div className="detail-item">
                    <span className="icon">📅</span>
                    <span>{event.date}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">🕒</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">📍</span>
                    <span>{event.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">👥</span>
                    <span>{event.attendees} attendees</span>
                  </div>
                </div>

                <div className="event-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleToggleStatus(event.id)}
                    title="Toggle Status"
                  >
                    {event.status === 'upcoming' ? '✅' : '🔄'} Toggle
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(event.id)}
                    title="Delete Event"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="no-events">
              <p>📭 No events found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Events;
