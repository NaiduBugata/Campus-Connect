import AnnouncementList from '../components/user/AnnouncementList';
import '../styles/studentDashboard.css';

function StudentDashboard() {
  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>📚 Student Dashboard</h1>
        <p>Stay updated with the latest announcements and notifications</p>
        <p className="webpushr-notice">🔔 Webpushr will prompt you to subscribe to notifications</p>
      </div>
      <AnnouncementList />
    </div>
  );
}

export default StudentDashboard;
