import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/universal.css';

const formFieldStyle = {
  marginBottom: '25px',
  width: '100%'
};

const AdminLogin = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Temporary check (replace with backend API later)
      if (loginData.username === 'admin' && loginData.password === 'admin123') {
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('user', JSON.stringify({ username: loginData.username, role: 'admin' }));
        
        alert('✅ Login successful!');
        navigate('/admin');
      } else {
        alert('❌ Invalid Admin Credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('❌ An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Navbar */}
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

      {/* Admin Login Form */}
      <div className="container">
        <div className="curved-shape"></div>
        <div className="curved-shape2"></div>

        {/* Login Form */}
        <div className="form-box Login">
          <h2>Admin Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-field" style={formFieldStyle}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px', color: '#fff', fontWeight: '600', textAlign: 'left' }}>Username</label>
              <div className="input-box">
                <input
                  type="text"
                  name="username"
                  value={loginData.username}
                  onChange={handleChange}
                  placeholder="Enter admin username"
                  required
                />
              </div>
            </div>

            <div className="form-field" style={formFieldStyle}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '16px', color: '#fff', fontWeight: '600', textAlign: 'left' }}>Password</label>
              <div className="input-box">
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  placeholder="Enter admin password"
                  required
                />
              </div>
            </div>

            <div className="input-box">
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>

            <div className="regi-link">
              <p>
                <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>← Back to Role Selection</Link>
              </p>
            </div>
          </form>
        </div>

        {/* Login Info */}
        <div className="info-content Login">
          <h2>WELCOME BACK!</h2>
          <p>Enter your admin credentials to access the dashboard.</p>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
