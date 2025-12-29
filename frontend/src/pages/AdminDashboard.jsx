import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardOverview from '../components/admin/Dashboard';
import CreateNotification from '../components/admin/CreateNotification';
import NotificationTable from '../components/admin/NotificationTable';
import Events from '../components/admin/Events';
import '../styles/adminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    alert('✅ Logged out successfully');
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview onNavigate={setActiveTab} />;
      case 'create':
        return <CreateNotification />;
      case 'notifications':
        return <NotificationTable />;
      case 'events':
        return <Events />;
      default:
        return <DashboardOverview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>CSE<span>Web</span></h2>
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="icon">📊</span>
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          <button
            className={`nav-item ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            <span className="icon">➕</span>
            {sidebarOpen && <span>Create Notification</span>}
          </button>

          <button
            className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <span className="icon">🔔</span>
            {sidebarOpen && <span>All Notifications</span>}
          </button>

          <button
            className={`nav-item ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <span className="icon">📅</span>
            {sidebarOpen && <span>Events</span>}
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <span className="icon">🚪</span>
          {sidebarOpen && <span>Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="user-info">
            <span>👨‍💼 Admin</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
