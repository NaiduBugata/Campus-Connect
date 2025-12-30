import { useState, useEffect } from 'react';

function SubscribeButton() {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscriberId, setSubscriberId] = useState(null);

  const handleSubscribe = async () => {
    setLoading(true);

    try {
      // Enhanced Webpushr readiness check
      if (typeof window.webpushr !== 'function') {
        console.error('❌ Webpushr SDK not loaded or not a function');
        alert('❌ Notification service not loaded. Please refresh the page and try again.');
        setLoading(false);
        return;
      }

      // Request permission and subscribe
      window.webpushr('subscribe', (result) => {
        console.log('Webpushr subscribe result:', result);
        
        if (result === 'subscribed') {
          // Get subscriber ID
          window.webpushr('fetch_id', (sid) => {
            if (sid) {
              setSubscribed(true);
              setSubscriberId(sid);
              console.log('✅ Subscribed successfully! ID:', sid);
              alert(`✅ Successfully subscribed to notifications!\n\nYou will now receive campus announcements.`);
            } else {
              console.error('❌ Subscribed but no SID received');
              alert('⚠️ Subscription successful but could not retrieve subscriber ID. Please try refreshing the page.');
            }
            setLoading(false);
          });
        } else if (result === 'denied') {
          console.warn('⚠️ User denied notification permission');
          alert('❌ Notification permission denied. Please enable notifications in your browser settings to receive campus updates.');
          setLoading(false);
        } else if (result === 'already-subscribed') {
          console.log('ℹ️ Already subscribed');
          window.webpushr('fetch_id', (sid) => {
            if (sid) {
              setSubscribed(true);
              setSubscriberId(sid);
            }
            setLoading(false);
          });
        } else {
          console.error('Unexpected subscription result:', result);
          alert(`⚠️ Subscription status: ${result}. Please check your browser settings.`);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('❌ Subscription error:', error);
      alert(`❌ Failed to subscribe. Please try again.`);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait for Webpushr to be fully ready
    const initializeWebpushr = () => {
      if (typeof window.webpushr === 'function') {
        // Check if already subscribed
        try {
          window.webpushr('fetch_id', (sid) => {
            if (sid) {
              setSubscribed(true);
              setSubscriberId(sid);
              console.log('Already subscribed:', sid);
            }
          });
        } catch (error) {
          console.error('Error checking subscription status:', error);
        }
      } else {
        // Webpushr not ready yet, wait and retry
        setTimeout(initializeWebpushr, 500);
      }
    };

    // Start initialization after a short delay
    const timer = setTimeout(initializeWebpushr, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="subscribe-section">
      <button
        className={`subscribe-btn ${subscribed ? 'subscribed' : 'unsubscribed'}`}
        onClick={handleSubscribe}
        disabled={loading || subscribed}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            <span>Processing...</span>
          </>
        ) : subscribed ? (
          <>
            <span className="icon">✅</span>
            <span>Subscribed to Notifications</span>
          </>
        ) : (
          <>
            <span className="icon">🔔</span>
            <span>Subscribe to Notifications</span>
          </>
        )}
      </button>
      {subscriberId && (
        <p className="subscriber-info">
          Subscriber ID: {subscriberId.substring(0, 20)}...
        </p>
      )}
    </div>
  );
}

export default SubscribeButton;