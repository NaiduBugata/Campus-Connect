import { useState, useEffect } from 'react';
import { getNotificationStats } from '../../api/notification.api';

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (token) {
          const response = await getNotificationStats(token);
          
          if (response.success) {
            setStats(response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

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
            <h3>{stats.totalSent || 0}</h3>
            <p>Total Sent</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📬</div>
          <div className="stat-info">
            <h3>{stats.totalDelivered || 0}</h3>
            <p>Delivered</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-info">
            <h3>{stats.totalRead || 0}</h3>
            <p>Read</p>
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