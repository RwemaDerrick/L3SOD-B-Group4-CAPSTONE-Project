import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ padding: '80px 0 40px', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
      <div className="section-container" style={{ flexDirection: 'column', gap: '2rem' }}>
        <div className="logo">
          <img src="/Assets/logo.png" alt="Moodlinks Logo" style={{ height: '50px' }} />
        </div>
        <div className="footer-links" style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <Link to="/about">Our Mission</Link>
          <Link to="/features">Features</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Privacy Policy</Link>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>&copy; 2026 Moodlink. Pioneering digital empathy.</p>
      </div>
    </footer>
  );
};

export default Footer;
