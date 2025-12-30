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
