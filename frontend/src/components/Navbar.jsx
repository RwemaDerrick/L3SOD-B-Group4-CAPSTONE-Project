import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLocalBackend } from '../hooks/useLocalBackend';

const Navbar = ({ onGetStarted }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCurrentUser } = useLocalBackend();
  const user = getCurrentUser();

  return (
    <nav className="navbar glass">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/">
            <img src="/Assets/logo.png" alt="Moodlinks Logo" />
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          </li>
          <li>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
          </li>
          <li>
            <Link to="/features" className={location.pathname === '/features' ? 'active' : ''}>Features</Link>
          </li>
          <li>
            <Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>Services</Link>
          </li>
          <li>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
          </li>
        </ul>
        <div className="nav-actions">
          {user ? (
            <button className="btn-primary btn-nav" onClick={() => navigate('/therapy')}>
              {user.name}'s Therapy
            </button>
          ) : (
            <button className="btn-primary btn-nav" onClick={onGetStarted}>Get Started</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
