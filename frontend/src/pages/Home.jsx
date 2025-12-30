import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnnouncementList from '../components/user/AnnouncementList';
import EventList from '../components/user/EventList';
import SubscribeButton from '../components/user/SubscribeButton';
import NotificationStatus from '../components/user/NotificationStatus';
import '../styles/studentDashboard.css';

function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('announcements');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    alert('✅ Logged out successfully');
    navigate('/');
  };

  const handleSubscriptionChange = (status) => {
    setIsSubscribed(status);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'announcements':
        return <AnnouncementList />;
      case 'events':
        return <EventList />;
      case 'status':
        return <NotificationStatus isSubscribed={isSubscribed} />;
      default:
        return <AnnouncementList />;
    }
  };

  return (
    <div className="student-dashboard">
      {/* Header */}
      <header className="student-header">
        <div className="header-content">
          <div className="logo">
            CSE<span>Web</span>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span>🎓 Student</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="student-main">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <h1>Welcome to Student Dashboard</h1>
          <p>Stay updated with the latest announcements and notifications</p>
        </div>

        {/* Subscription Card */}
        <div className="subscription-card">
          <div className="subscription-info">
            <h3>🔔 Notification Subscription</h3>
            <p>Subscribe to receive important announcements and updates</p>
          </div>
          <SubscribeButton 
            isSubscribed={isSubscribed} 
            onSubscriptionChange={handleSubscriptionChange}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            📢 Announcements
          </button>
          <button
            className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            📅 Events
          </button>
          <button
            className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            📊 Notification Status
          </button>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
