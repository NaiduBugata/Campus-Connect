import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/role.css';

const RoleSelection = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const roles = [
    {
      id: 'admin',
      title: 'Administrator',
      description: 'Manage platform settings, users, and overall system operations.',
      icon: '👨‍💼',
      path: '/admin/login'
    },
    {
      id: 'student',
      title: 'Student',
      description: 'Access announcements, notifications, and stay updated with latest information.',
      icon: '🎓',
      path: '/home'
    }
  ];

  const handleRoleSelect = (role) => {
    // Store the selected role for the specific login page
    localStorage.setItem('selectedRole', role.id);
    // Navigate to role-specific page
    navigate(role.path);
  };

  return (
    <div className="role-selection-container">
      <header>
        <nav className="navbar">
          <div className="logo">
            CSE<span>Web</span>
          </div>
          <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
            <li>
              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link> 
            </li>
            <li>
              <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            </li>
            <li>
              <a href="#help" onClick={() => setMenuOpen(false)}>Help</a>
            </li>
          </ul>
          <div
            className="menu-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ☰
          </div>
        </nav>
      </header>

      <section className="role-hero">
        <div className="role-content">
          <h2>Select Your <span>Role</span></h2>
          <p>
            <span style={{ fontSize: '1rem', fontWeight: 500 }}>
              Choose how you want to use CSE Web. You can always change this later.
            </span>
          </p>
          
          <div className="role-grid">
            {roles.map((role) => (
              <div 
                key={role.id}
                className="role-card"
                onClick={() => handleRoleSelect(role)}
              >
                <div className="role-icon">{role.icon}</div>
                <h3>{role.title}</h3>
                <p>{role.description}</p>
                <div className="role-select-button">
                  Select {role.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <p>© 2025 CSE Web. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default RoleSelection;
