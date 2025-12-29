import { createContext, useState, useContext, useEffect } from 'react';
import webpushrService from '../services/webpushr';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberId, setSubscriberId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check subscription status on mount
    const checkSubscription = async () => {
      const subscribed = webpushrService.isSubscribed();
      setIsSubscribed(subscribed);
      if (subscribed) {
        setSubscriberId(webpushrService.getSubscriberId());
      }
    };
    checkSubscription();
  }, []);

  const subscribe = async () => {
    try {
      setLoading(true);
      const sid = await webpushrService.subscribe();
      setSubscriberId(sid);
      setIsSubscribed(true);
      return { success: true, subscriberId: sid };
    } catch (error) {
      console.error('Subscribe error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    try {
      setLoading(true);
      await webpushrService.unsubscribe();
      setSubscriberId(null);
      setIsSubscribed(false);
      return { success: true };
    } catch (error) {
      console.error('Unsubscribe error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isSubscribed,
    subscriberId,
    notifications,
    setNotifications,
    loading,
    subscribe,
    unsubscribe
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;