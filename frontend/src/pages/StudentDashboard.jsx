import AnnouncementList from '../components/user/AnnouncementList';
import SubscribeButton from '../components/user/SubscribeButton';
import '../styles/studentDashboard.css';

function StudentDashboard() {
  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>📚 Student Dashboard</h1>
        <p>Stay updated with the latest announcements and notifications</p>
        <SubscribeButton />
      </div>
      <AnnouncementList />
    </div>
  );
}

export default StudentDashboard;
