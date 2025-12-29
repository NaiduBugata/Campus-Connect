class WebpushrService {
  constructor() {
    this.webpushr = null;
    this.isInitialized = false;
    this.subscriberId = null;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Load Webpushr SDK
      await this.loadWebpushrSDK();

      // Initialize Webpushr
      this.webpushr = window.webpushr;

      if (!this.webpushr) {
        console.error('Webpushr SDK not loaded');
        return false;
      }

      // Setup Webpushr
      this.webpushr('setup', {
        key: import.meta.env.VITE_WEBPUSHR_PUBLIC_KEY || 'your-webpushr-public-key',
        sw: '/webpushr-sw.js',
        autoDismiss: true
      });

      this.isInitialized = true;
      console.log('Webpushr initialized successfully');
      return true;
    } catch (error) {
      console.error('Webpushr initialization error:', error);
      return false;
    }
  }

  loadWebpushrSDK() {
    return new Promise((resolve, reject) => {
      if (window.webpushr) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.webpushr.com/app.min.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async subscribe() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      return new Promise((resolve, reject) => {
        this.webpushr('fetch_id', (sid) => {
          if (sid) {
            this.subscriberId = sid;
            this.saveSubscription(sid);
            resolve(sid);
          } else {
            reject(new Error('Failed to get subscriber ID'));
          }
        });
      });
    } catch (error) {
      console.error('Subscription error:', error);
      throw error;
    }
  }

  async saveSubscription(subscriberId) {
    try {
      const browserInfo = this.getBrowserInfo();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscriber_id: subscriberId,
          device_type: 'web',
          browser: browserInfo.browser,
          os: browserInfo.os
        })
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('webpushr_subscriber_id', subscriberId);
        console.log('Subscription saved to backend');
      }

      return data;
    } catch (error) {
      console.error('Error saving subscription:', error);
      throw error;
    }
  }

  async unsubscribe() {
    try {
      const subscriberId = this.getSubscriberId();
      if (!subscriberId) {
        throw new Error('No active subscription found');
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/subscribers/${subscriberId}`,
        { method: 'DELETE' }
      );

      const data = await response.json();
      
      if (data.success) {
        localStorage.removeItem('webpushr_subscriber_id');
        this.subscriberId = null;
      }

      return data;
    } catch (error) {
      console.error('Unsubscribe error:', error);
      throw error;
    }
  }

  getSubscriberId() {
    return this.subscriberId || localStorage.getItem('webpushr_subscriber_id');
  }

  isSubscribed() {
    return !!this.getSubscriberId();
  }

  getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let os = 'Unknown';

    // Detect browser
    if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
    else if (ua.indexOf('Chrome') > -1) browser = 'Chrome';
    else if (ua.indexOf('Safari') > -1) browser = 'Safari';
    else if (ua.indexOf('Edge') > -1) browser = 'Edge';

    // Detect OS
    if (ua.indexOf('Win') > -1) os = 'Windows';
    else if (ua.indexOf('Mac') > -1) os = 'MacOS';
    else if (ua.indexOf('Linux') > -1) os = 'Linux';
    else if (ua.indexOf('Android') > -1) os = 'Android';
    else if (ua.indexOf('iOS') > -1) os = 'iOS';

    return { browser, os };
  }
}

export default new WebpushrService();