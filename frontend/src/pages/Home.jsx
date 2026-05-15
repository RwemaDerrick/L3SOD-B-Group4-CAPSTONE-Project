import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { useLocalBackend } from '../hooks/useLocalBackend';

const Home = ({ onGetStarted }) => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { getCurrentUser } = useLocalBackend();
  const user = getCurrentUser();

  useEffect(() => {
    // --- Typewriter Effect ---
    const setupTypewriter = (t) => {
      const HTML = t.innerHTML;
      t.innerHTML = "";
      let cursor = 0;
      let tag = "";
      let writingTag = false;

      function type() {
        if (cursor < HTML.length) {
          if (HTML[cursor] === "<") writingTag = true;
          if (writingTag) tag += HTML[cursor];
          else t.innerHTML += HTML[cursor];
          
          if (HTML[cursor] === ">") {
            writingTag = false;
            t.innerHTML += tag;
            tag = "";
          }
          cursor++;
          setTimeout(type, writingTag ? 0 : 50);
        }
      }
      type();
    };

    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
      heroTitle.classList.remove('fade-in-up', 'delay-1');
      setupTypewriter(heroTitle);
    }

    // --- Three.js 3D Mind Sphere ---
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(2, 20);
    const material = new THREE.MeshStandardMaterial({
      color: 0x8a2be2,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
      emissive: 0xff2a85,
      emissiveIntensity: 0.5
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 5;

    const initialPositions = geometry.attributes.position.array.slice();
    let time = 0;
    let animationId;

    function animate() {
      animationId = requestAnimationFrame(animate);
      time += 0.01;

      const positions = geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = initialPositions[i];
        const y = initialPositions[i + 1];
        const z = initialPositions[i + 2];
        
        const noise = Math.sin(x * 1.5 + time) * Math.cos(y * 1.5 + time) * 0.3;
        
        const length = Math.sqrt(x*x + y*y + z*z);
        positions[i] = x * (1 + noise / length);
        positions[i+1] = y * (1 + noise / length);
        positions[i+2] = z * (1 + noise / length);
      }
      geometry.attributes.position.needsUpdate = true;

      sphere.rotation.y += 0.005;
      sphere.rotation.x += 0.002;

      renderer.render(scene, camera);
    }

    const handleResize = () => {
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    };

    const handleMouseMove = (e) => {
      const mouseX = (e.clientX / window.innerWidth) - 0.5;
      const mouseY = (e.clientY / window.innerHeight) - 0.5;
      sphere.rotation.y += mouseX * 0.05;
      sphere.rotation.x += mouseY * 0.05;
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="badge fade-in-up">Every Emotion Matters</div>
            <h1 className="fade-in-up delay-1">Find Your <br /><span className="text-gradient">Perfect Vibe</span></h1>
            <p className="fade-in-up delay-2">Connect with people who share your mood. Let our AI-driven platform find your emotional match in real-time in a safe, supportive environment.</p>
            <div className="cta-group fade-in-up delay-3">
              {user ? (
                <button className="btn-primary glow" onClick={() => navigate('/therapy')}>Go to Dashboard</button>
              ) : (
                <button className="btn-primary glow" onClick={() => navigate('/therapy')}>Find a Match</button>
              )}
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>
          <div className="hero-visual fade-in delay-2">
            <div id="three-canvas-container" ref={canvasRef}></div>
            <div className="glass-card main-card">
              <div className="card-header">
                <div className="user-avatar"></div>
                <div>
                  <h4>Alex J.</h4>
                  <p>Feeling: 🍃 Chill</p>
                </div>
              </div>
              <div className="card-body">
                "Looking for someone to just relax and listen to lofi with today."
              </div>
              <div className="card-footer">
                <button className="btn-match" onClick={() => alert("Connection request sent! We'll notify you when they respond.")}>Connect</button>
              </div>
            </div>
            
            <div className="glass-card sub-card">
              <div className="card-header">
                <div className="user-avatar avatar-2"></div>
                <div>
                  <h4>Sarah M.</h4>
                  <p>Feeling: 🎨 Creative</p>
                </div>
              </div>
              <div className="card-body">
                "Just painted something new, wanting to share the energy!"
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emotions Section */}
      <section className="landing-section" style={{ textAlign: 'center' }}>
        <div className="badge">Real People. Real Emotions.</div>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Every <span className="text-gradient">Emotion</span> is a Bridge</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '4rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
          Moodlink isn't just for the highlights. We are here for the heavy moments, the confusion, and the genuine hope that comes from being understood.
        </p>
        
        <div className="emotions-grid">
          <div className="emotion-card fade-in-up">
            <img src="/Assets/Stressed.jpg" alt="Overwhelmed" />
            <div className="emotion-overlay">
              <h3>Stressed</h3>
              <p>When the weight of the world feels too heavy, share the load.</p>
            </div>
          </div>
          <div className="emotion-card fade-in-up delay-1">
            <img src="/Assets/Confused.jpg" alt="Confused" />
            <div className="emotion-overlay">
              <h3>Confused</h3>
              <p>Not sure how to feel? Connect with others navigating their own uncertainty.</p>
            </div>
          </div>
          <div className="emotion-card fade-in-up delay-2">
            <img src="/Assets/Angry.jpg" alt="Intense Emotion" />
            <div className="emotion-overlay">
              <h3>Intense</h3>
              <p>For those moments when you just need to be heard and validated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-section" style={{ textAlign: 'center' }}>
        <div className="badge">Simple Steps</div>
        <h2 style={{ fontSize: '3rem', marginBottom: '4rem' }}>How Moodlink <span className="text-gradient">Connects You</span></h2>
        
        <div className="steps-grid">
          <div className="step-card fade-in-up">
            <div className="step-num">01</div>
            <h3>Check In</h3>
            <p>Share your current mood with our empathetic AI. Be as honest as you want.</p>
          </div>
          <div className="step-card fade-in-up delay-1">
            <div className="step-num">02</div>
            <h3>Get Matched</h3>
            <p>Our algorithm finds others in the same "Mud" or mood frequency instantly.</p>
          </div>
          <div className="step-card fade-in-up delay-2">
            <div className="step-num">03</div>
            <h3>Real Connection</h3>
            <p>Enter a safe, anonymous chat space to share experiences and find support.</p>
          </div>
        </div>
      </section>

      {/* Stats / Impact */}
      <section className="landing-section impact-section glass">
        <div className="impact-grid">
          <div className="impact-item">
            <div className="impact-val">500k+</div>
            <p>Daily Check-ins</p>
          </div>
          <div className="impact-item">
            <div className="impact-val">98%</div>
            <p>Empathy Score</p>
          </div>
          <div className="impact-item">
            <div className="impact-val">24/7</div>
            <p>AI Support</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-section cta-final" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>Ready to <span className="text-gradient">Find Your Tribe?</span></h2>
        <p style={{ maxWidth: '600px', margin: '0 auto 3rem', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          Join thousands of others who are reclaiming their emotional well-being through real connection.
        </p>
        {user ? (
          <button className="btn-primary btn-large glow" onClick={() => navigate('/therapy')}>Go to Dashboard</button>
        ) : (
          <button className="btn-primary btn-large glow" onClick={() => navigate('/therapy')}>Join Moodlink Now</button>
        )}
      </section>
    </main>
  );
};

export default Home;
