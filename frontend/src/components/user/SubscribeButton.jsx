import { useState } from 'react';

function SubscribeButton({ isSubscribed, onSubscriptionChange }) {
  const [loading, setLoading] = useState(false);

  const handleToggleSubscription = async () => {
    setLoading(true);

    try {
      // Simulate API call (replace with actual backend call)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newStatus = !isSubscribed;
      onSubscriptionChange(newStatus);
      
      if (newStatus) {
        alert('✅ Successfully subscribed to notifications!');
      } else {
        alert('✅ Successfully unsubscribed from notifications');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('❌ Failed to update subscription status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`subscribe-btn ${isSubscribed ? 'subscribed' : 'unsubscribed'}`}
      onClick={handleToggleSubscription}
      disabled={loading}
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          <span>Processing...</span>
        </>
      ) : (
        <>
          <span className="icon">{isSubscribed ? '✅' : '🔔'}</span>
          <span>{isSubscribed ? 'Unsubscribe' : 'Subscribe'}</span>
        </>
      )}
    </button>
  );
}

export default SubscribeButton;