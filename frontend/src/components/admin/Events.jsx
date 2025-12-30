import { useState, useEffect } from 'react';
import { eventAPI } from '../../api/event.api';
import AlertBox from '../common/AlertBox';
import ConfirmDialog from '../common/ConfirmDialog';
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
  const [alert, setAlert] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAll();
      
      if (response.success) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setAlert({ message: 'Failed to load events', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
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
      const token = localStorage.getItem('token');
      
      if (!token) {
        setAlert({ message: 'You must be logged in to create events', type: 'error' });
        return;
      }

      const response = await eventAPI.create(formData, token);
      
      if (response.success) {
        setAlert({ message: 'Event created successfully!', type: 'success' });
        
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
        
        // Refresh events list
        fetchEvents();
      } else {
        setAlert({ message: response.message || 'Failed to create event', type: 'error' });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setAlert({ message: error.message || 'Failed to create event', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmDelete(id);
  };

  const confirmDeleteAction = async () => {
    const id = confirmDelete;
    setConfirmDelete(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await eventAPI.delete(id, token);
      
      if (response.success) {
        setAlert({ message: 'Event deleted', type: 'success' });
        fetchEvents();
      } else {
        setAlert({ message: 'Failed to delete event', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setAlert({ message: 'Failed to delete event', type: 'error' });
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const event = events.find(e => e._id === id || e.id === id);
      const newStatus = event.status === 'upcoming' ? 'completed' : 'upcoming';
      
      const response = await eventAPI.update(id, { status: newStatus }, token);
      
      if (response.success) {
        setAlert({ message: `Event marked as ${newStatus}`, type: 'success' });
        fetchEvents();
      } else {
        setAlert({ message: 'Failed to update event', type: 'error' });
      }
    } catch (error) {
      console.error('Error updating event:', error);
      setAlert({ message: 'Failed to update event', type: 'error' });
    }
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
                    onClick={() => handleToggleStatus(event._id || event.id)}
                    title="Toggle Status"
                  >
                    {event.status === 'upcoming' ? '✅' : '🔄'} Toggle
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(event._id || event.id)}
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

      {alert && (
        <AlertBox
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          message="Are you sure you want to delete this event?"
          onConfirm={confirmDeleteAction}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

export default Events;
