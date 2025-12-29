const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const notificationAPI = {
  getAll: async (token) => {
    const response = await fetch(`${API_URL}/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch notifications');
    }
    
    return response.json();
  },

  create: async (notificationData, token) => {
    const response = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(notificationData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create notification');
    }
    
    return response.json();
  },

  update: async (id, notificationData, token) => {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(notificationData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update notification');
    }
    
    return response.json();
  },

  delete: async (id, token) => {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete notification');
    }
    
    return response.json();
  },

  getStats: async (token) => {
    const response = await fetch(`${API_URL}/notifications/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch stats');
    }
    
    return response.json();
  },
};
