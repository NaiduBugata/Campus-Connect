import { useState, useEffect } from 'react';
import { eventAPI } from '../../api/event.api';
import '../../styles/eventList.css';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAll();
      
      if (response.success) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.status === filter);

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'seminar': return '📚';
      case 'workshop': return '🛠️';
      case 'conference': return '🎤';
      case 'career': return '💼';
      default: return '📅';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'seminar': return '#1976d2';
      case 'workshop': return '#388e3c';
      case 'conference': return '#f57c00';
      case 'career': return '#c62828';
      default: return '#666';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="event-list-container">
        <div className="loading">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="event-list-container">
      {/* Filter Buttons */}
      <div className="event-filters">
        <button
          className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming ({events.filter(e => e.status === 'upcoming').length})
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Past Events ({events.filter(e => e.status === 'completed').length})
        </button>
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({events.length})
        </button>
      </div>

      {/* Events Grid */}
      <div className="events-grid">
        {filteredEvents.map(event => (
          <div 
            key={event._id} 
            className={`event-card ${event.status}`}
          >
            <div className="event-category" style={{ backgroundColor: getCategoryColor(event.category) }}>
              {getCategoryIcon(event.category)} {event.category}
            </div>
            
            <h3 className="event-title">{event.title}</h3>
            <p className="event-description">{event.description}</p>
            
            <div className="event-details">
              <div className="event-detail">
                <span className="icon">📅</span>
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="event-detail">
                <span className="icon">🕒</span>
                <span>{event.time}</span>
              </div>
              <div className="event-detail">
                <span className="icon">📍</span>
                <span>{event.location}</span>
              </div>
              {event.attendees > 0 && (
                <div className="event-detail">
                  <span className="icon">👥</span>
                  <span>{event.attendees} attendees</span>
                </div>
              )}
            </div>

            {event.status === 'upcoming' && (
              <div className="event-status upcoming-badge">
                ⏰ Upcoming
              </div>
            )}
            {event.status === 'completed' && (
              <div className="event-status completed-badge">
                ✅ Completed
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="no-events">
          <p>📭 No {filter === 'all' ? '' : filter} events found</p>
        </div>
      )}
    </div>
  );
}

export default EventList;
