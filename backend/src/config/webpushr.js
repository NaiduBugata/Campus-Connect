const axios = require('axios');

class WebpushrConfig {
  constructor() {
    this.publicKey = process.env.WEBPUSHR_PUBLIC_KEY || '';
    this.restApiKey = process.env.WEBPUSHR_REST_API_KEY || '';
    this.authToken = process.env.WEBPUSHR_AUTH_TOKEN || '';
    this.apiEndpoint = 'https://api.webpushr.com/v1';
  }

  getHeaders() {
    // Webpushr REST API expects these exact header names
    return {
      'webpushrKey': String(this.restApiKey).trim(),
      'webpushrAuthToken': String(this.authToken).trim(),
      'Content-Type': 'application/json'
    };
  }

  async sendNotification(payload) {
    try {
      const response = await axios.post(
        `${this.apiEndpoint}/notification/send/all`,
        payload,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Webpushr API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async sendToSubscriber(subscriberId, payload) {
    try {
      const response = await axios.post(
        `${this.apiEndpoint}/notification/send/sid`,
        {
          ...payload,
          sid: subscriberId
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Webpushr API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getSubscribers() {
    try {
      const response = await axios.get(
        `${this.apiEndpoint}/subscribers`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Webpushr API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getSubscriberCount() {
    try {
      // Note: Webpushr API doesn't provide a direct subscriber count endpoint
      // in the free tier. This would need to be tracked separately or
      // accessed via Webpushr dashboard
      
      // Try to get campaign stats which might include subscriber info
      const response = await axios.get(
        `${this.apiEndpoint}/campaign/list`,
        { 
          headers: this.getHeaders(),
          params: { limit: 1 }
        }
      );
      
      // For now, return 0 - admins can see count in Webpushr dashboard
      return {
        total: 0,
        active: 0,
        note: 'Check Webpushr dashboard for subscriber count'
      };
    } catch (error) {
      console.error('Webpushr subscriber count unavailable:', error.message);
      return { 
        total: 0, 
        active: 0,
        note: 'Check Webpushr dashboard at https://app.webpushr.com'
      };
    }
  }

  async getNotificationStatus(notificationId) {
    try {
      const response = await axios.get(
        `${this.apiEndpoint}/notification/${notificationId}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Webpushr API Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new WebpushrConfig();
