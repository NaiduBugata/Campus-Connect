const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getNotifications = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/notifications${queryString ? `?${queryString}` : ''}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const getNotificationById = async (notificationId) => {
  try {
    const response = await fetch(`${API_URL}/notifications/by-id/${notificationId}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching notification:', error);
    throw error;
  }
};

export const createNotification = async (data, token) => {
  try {
    const response = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const markAsRead = async (notificationId) => {
  try {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'PUT'
    });
    return await response.json();
  } catch (error) {
    console.error('Error marking as read:', error);
    throw error;
  }
};

export const getNotificationStats = async (token) => {
  try {
    const response = await fetch(`${API_URL}/notifications/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export const triggerResend = async (token) => {
  try {
    const response = await fetch(`${API_URL}/notifications/resend-check`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error triggering resend:', error);
    throw error;
  }
};

export const deleteNotification = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

export const updateNotification = async (id, data, token) => {
  try {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Error updating notification:', error);
    throw error;
  }
};

export const notificationAPI = {
  getAll: getNotifications,
  getById: getNotificationById,
  create: createNotification,
  markAsRead: markAsRead,
  getStats: getNotificationStats,
  triggerResend: triggerResend,
  delete: deleteNotification,
  update: updateNotification
};

export default notificationAPI;
