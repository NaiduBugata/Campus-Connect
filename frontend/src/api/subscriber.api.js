const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const subscriberAPI = {
  subscribe: async (email) => {
    const response = await fetch(`${API_URL}/subscribers/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to subscribe');
    }
    
    return response.json();
  },

  unsubscribe: async (email) => {
    const response = await fetch(`${API_URL}/subscribers/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to unsubscribe');
    }
    
    return response.json();
  },

  getAll: async (token) => {
    const response = await fetch(`${API_URL}/subscribers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch subscribers');
    }
    
    return response.json();
  },
};
