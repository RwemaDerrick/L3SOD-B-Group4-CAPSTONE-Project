import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Therapy from './pages/Therapy';
import About from './pages/About';
import Features from './pages/Features';
import Services from './pages/Services';
import Contact from './pages/Contact';
import { useLocalBackend } from './hooks/useLocalBackend';
import './App.css';

// Modal Component
const AuthModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', mood: 'chill' });
  const [response, setResponse] = useState({ message: '', type: '' });

  const { registerUser } = useLocalBackend();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const newUser = registerUser(formData);
      setResponse({ message: `Welcome ${newUser.name}! Your journey begins.`, type: 'success' });
      setTimeout(() => {
        onClose();
        setResponse({ message: '', type: '' });
      }, 2000);
    } catch (err) {
      setResponse({ message: 'Error saving your profile.', type: 'error' });
    }
  };

  return (
    <div className={`modal-overlay active`}>
      <div className="glass-card modal-content">
        <button className="close-modal" onClick={onClose}>&times;</button>
        <div className="modal-header">
          <h2 className="text-gradient">Begin Your Journey</h2>
          <p>Join Moodlink and find your emotional match.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>How are you feeling today?</label>
            <select 
              value={formData.mood}
              onChange={(e) => setFormData({...formData, mood: e.target.value})}
            >
              <option value="chill">🍃 Chill</option>
              <option value="creative">🎨 Creative</option>
              <option value="stressed">😫 Stressed</option>
              <option value="happy">✨ Happy</option>
            </select>
          </div>
          <button type="submit" className="btn-primary btn-full glow">Create Account</button>
        </form>
        {response.message && (
          <div className={`form-message ${response.type}`}>
            {response.message}
          </div>
        )}
      </div>
    </div>
  );
};

const AppContent = () => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getCurrentUser } = useLocalBackend();
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    const handleScroll = () => {
      const nav = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        nav?.classList.add('scrolled');
      } else {
        nav?.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {loading && (
        <div id="preloader">
          <div className="preloader-content">
            <img src="/Assets/logo.png" alt="Moodlinks Logo" className="pulse-logo" />
            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>
          </div>
        </div>
      )}

      <div className="background-effects">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <Navbar onGetStarted={() => navigate('/therapy')} currentUser={currentUser} />
      
      <Routes>
        <Route path="/" element={<Home onGetStarted={() => navigate('/therapy')} />} />
        <Route path="/therapy" element={<Therapy />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />

      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setCurrentUser(getCurrentUser());
        }} 
      />
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
