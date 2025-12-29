import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <h2>🏫 Campus Connect</h2>
        </Link>

        <div className="navbar-menu">
          {isAuthenticated() && user?.role === 'admin' ? (
            <>
              <Link to="/admin" className="nav-link">📊 Dashboard</Link>
              <button onClick={handleLogout} className="btn-logout">
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">🏠 Home</Link>
              <Link to="/student" className="nav-link">🔔 Notifications</Link>
              <Link to="/admin/login" className="nav-link">🔐 Admin</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;