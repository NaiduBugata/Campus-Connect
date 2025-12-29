import { useState, useEffect } from 'react';

function DashboardOverview({ onNavigate }) {
  const [stats, setStats] = useState({
    totalNotifications: 0,
    activeNotifications: 0,
    totalSubscribers: 0,
    recentActivity: []
  });

  useEffect(() => {
    // Simulate fetching stats (replace with actual API call)
    setStats({
      totalNotifications: 12,
      activeNotifications: 8,
      totalSubscribers: 245,
      recentActivity: [
        { id: 1, action: 'New notification created', time: '2 hours ago' },
        { id: 2, action: 'Notification sent to 245 subscribers', time: '5 hours ago' },
        { id: 3, action: 'Admin logged in', time: '1 day ago' }
      ]
    });
  }, []);

  return (
    <div className="dashboard-overview">
      <h2>Overview</h2>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-info">
            <h3>{stats.totalNotifications}</h3>
            <p>Total Notifications</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.activeNotifications}</h3>
            <p>Active Notifications</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalSubscribers}</h3>
            <p>Total Subscribers</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {stats.recentActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-dot"></div>
              <div className="activity-content">
                <p>{activity.action}</p>
                <span>{activity.time}</span>
              </div>
            </div>
          ))}
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