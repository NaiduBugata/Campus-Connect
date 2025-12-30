import { useState } from 'react';
import { createNotification } from '../../api/notification.api';

function CreateNotification() {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'announcement',
    priority: 'normal'
  });
  const [loading, setLoading] = useState(false);

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
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('❌ You must be logged in to create notifications');
        return;
      }

      // Call actual API
      const response = await createNotification(formData, token);
      
      if (response.success) {
        console.log('Notification created:', response.data);
        alert(`✅ Notification created successfully!\n\nID: ${response.data.notification_id}\nPush sent: ${response.data.send_count > 0 ? 'Yes' : 'Pending'}`);
        
        // Reset form
        setFormData({
          title: '',
          message: '',
          type: 'announcement',
          priority: 'normal'
        });
      } else {
        alert(`❌ Failed to create notification: ${response.message}`);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      alert('❌ Failed to create notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-notification">
      <h2>Create New Notification</h2>

      <form onSubmit={handleSubmit} className="notification-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter notification title"
            required
          />
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter notification message"
            rows="5"
            required
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="announcement">Announcement</option>
              <option value="alert">Alert</option>
              <option value="info">Information</option>
              <option value="warning">Warning</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Notification'}
          </button>
          <button type="button" className="cancel-btn" onClick={() => setFormData({
            title: '',
            message: '',
            type: 'announcement',
            priority: 'normal'
          })}>
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateNotification;