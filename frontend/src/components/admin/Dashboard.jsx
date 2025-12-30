import { useState, useEffect } from 'react';
import { getNotificationStats, triggerResend } from '../../api/notification.api';

function DashboardOverview({ onNavigate }) {
  const [stats, setStats] = useState({
    totalNotifications: 0,
    activeNotifications: 0,
    totalSubscribers: 0,
    totalSent: 0,
    totalDelivered: 0,
    totalRead: 0
  });
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);

  const handleManualResend = async () => {
    if (!confirm('Trigger manual resend check for all unread notifications?')) {
      return;
    }

    try {
      setResending(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('❌ Authentication required');
        return;
      }

      const response = await triggerResend(token);
      
      if (response.success) {
        alert(`✅ Resend check completed!\n\n` +
              `Total checked: ${response.data.total_checked}\n` +
              `Successfully resent: ${response.data.results.filter(r => r.success).length}\n` +
              `Failed: ${response.data.results.filter(r => !r.success).length}`);
        
        // Refresh stats after resend
        fetchStats();
      } else {
        alert(`❌ Failed to trigger resend: ${response.message}`);
      }
    } catch (error) {
      console.error('Error triggering resend:', error);
      alert('❌ Failed to trigger resend check');
    } finally {
      setResending(false);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (token) {
        const response = await getNotificationStats(token);
        
        if (response.success) {
          // Map the actual API response structure
          setStats({
            totalNotifications: response.stats?.total || 0,
            activeNotifications: response.stats?.active || 0,
            inactiveNotifications: response.stats?.inactive || 0,
            totalRead: response.stats?.read || 0,
            totalUnread: response.stats?.unread || 0,
            totalSubscribers: 0, // Will be updated when subscriber API is added
            pendingResends: response.stats?.resend?.pendingResends || 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="dashboard-overview"><div className="loading">Loading dashboard...</div></div>;
  }

  return (
    <div className="dashboard-overview">
      <h2>Overview</h2>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-info">
            <h3>{stats.totalNotifications || 0}</h3>
            <p>Total Notifications</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.activeNotifications || 0}</h3>
            <p>Active Notifications</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalSubscribers || 0}</h3>
            <p>Total Subscribers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📤</div>
          <div className="stat-info">
            <h3>{stats.totalUnread || 0}</h3>
            <p>Unread</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📬</div>
          <div className="stat-info">
            <h3>{stats.totalRead || 0}</h3>
            <p>Read</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <h3>{stats.pendingResends || 0}</h3>
            <p>Pending Resends</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => onNavigate('create')}>
            <span className="icon">➕</span>
            <span>Create Notification</span>
          </button>
          <button 
            className="action-btn" 
            onClick={handleManualResend}
            disabled={resending}
            style={{ opacity: resending ? 0.6 : 1 }}
          >
            <span className="icon">🔄</span>
            <span>{resending ? 'Resending...' : 'Trigger Resend Check'}</span>
          </button>
          <button className="action-btn" onClick={() => alert('Analytics feature coming soon!')}>
            <span className="icon">📊</span>
            <span>View Analytics</span>
          </button>
          <button className="action-btn" onClick={() => alert('Subscriber management coming soon!')}>
            <span className="icon">👥</span>
            <span>Manage Subscribers</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;