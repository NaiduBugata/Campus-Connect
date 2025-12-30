import { useState, useEffect } from 'react';

function SubscribeButton() {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscriberId, setSubscriberId] = useState(null);

  useEffect(() => {
    // Check if already subscribed
    checkSubscriptionStatus();
    
    // Auto-prompt for permission after 2 seconds if not subscribed
    const timer = setTimeout(() => {
      if (!subscribed && window.webpushr) {
        console.log('🔔 Auto-prompting for notification permission...');
        handleSubscribe();
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const checkSubscriptionStatus = () => {
    if (window.webpushr) {
      window.webpushr('fetch_id', (sid) => {
        if (sid) {
          setSubscribed(true);
          setSubscriberId(sid);
          console.log('Already subscribed:', sid);
        }
      });
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);

    try {
      if (!window.webpushr) {
        alert('❌ Webpushr not loaded. Please refresh the page.');
        return;
      }

      // Request permission and subscribe
      window.webpushr('subscribe', (result) => {
        if (result === 'subscribed') {
          // Get subscriber ID
          window.webpushr('fetch_id', (sid) => {
            if (sid) {
              setSubscribed(true);
              setSubscriberId(sid);
              console.log('✅ Subscribed successfully! ID:', sid);
              alert(`✅ Successfully subscribed to notifications!\n\nYou will now receive campus announcements.`);
            }
          });
        } else if (result === 'denied') {
          alert('❌ Notification permission denied. Please enable notifications in your browser settings.');
        } else {
          console.log('Subscription result:', result);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Subscription error:', error);
      alert('❌ Failed to subscribe. Please try again.');
      setLoading(false);
    }
  };

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