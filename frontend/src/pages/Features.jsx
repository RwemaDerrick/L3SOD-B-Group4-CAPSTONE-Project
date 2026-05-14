import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Features = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const colors = [0xff2a85, 0x8a2be2, 0x00d2ff, 0x00ff88];
    for(let i=0; i < 40; i++) {
        const size = Math.random() * 0.1 + 0.05;
        const geometry = new THREE.SphereGeometry(size, 16, 16);
        const material = new THREE.MeshStandardMaterial({
            color: colors[Math.floor(Math.random() * colors.length)],
            emissive: colors[Math.floor(Math.random() * colors.length)],
            emissiveIntensity: 0.5
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6
        );
        group.add(sphere);
    }

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    camera.position.z = 6;

    let animationId;
    function animate() {
        animationId = requestAnimationFrame(animate);
        group.rotation.y += 0.002;
        group.rotation.x += 0.001;
        renderer.render(scene, camera);
    }

    const handleResize = () => {
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <main>
      <section className="landing-section" style={{ textAlign: 'center' }}>
        <div className="badge fade-in-up">The Ecosystem</div>
        <h1 className="fade-in-up delay-1" style={{ fontSize: '4rem' }}>Empower Your <span className="text-gradient">Inner World</span></h1>
        <p className="fade-in-up delay-2" style={{ maxWidth: '700px', margin: '1.5rem auto', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          Explore the tools designed to help you understand, express, and connect through the spectrum of human emotion.
        </p>
      </section>

      <section className="landing-section" style={{ paddingTop: 0 }}>
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
          <div className="glass-card feature-card fade-in-up delay-1">
            <div className="feature-icon">🧠</div>
            <h3>AI Therapist (Aria)</h3>
            <p>Engage in 24/7 private, judgment-free conversations with Aria, our advanced emotional AI trained in CBT and mindfulness techniques.</p>
          </div>
          
          <div className="glass-card feature-card fade-in-up delay-2">
            <div className="feature-icon">📊</div>
            <h3>Mood Insights</h3>
            <p>Visualize your emotional journey over time. Discover patterns in your mood and receive personalized suggestions for mental clarity.</p>
          </div>

          <div className="glass-card feature-card fade-in-up delay-3">
            <div className="feature-icon">🎭</div>
            <h3>Mood Matching</h3>
            <p>Anonymously connect with individuals currently experiencing similar emotions. Share the burden or multiply the joy in real-time.</p>
          </div>

          <div className="glass-card feature-card fade-in-up delay-1">
            <div className="feature-icon">🌬️</div>
            <h3>Box Breathing</h3>
            <p>Interactive, guided breathing exercises integrated directly into the dashboard to help you regain focus and calm your nervous system.</p>
          </div>

          <div className="glass-card feature-card fade-in-up delay-2">
            <div className="feature-icon">🔒</div>
            <h3>Radical Privacy</h3>
            <p>Your emotional data is your own. We use end-to-end encryption for all conversations and anonymous identities for mood matching.</p>
          </div>

          <div className="glass-card feature-card fade-in-up delay-3">
            <div className="feature-icon">🌈</div>
            <h3>Safe Circles</h3>
            <p>Join moderated, interest-based communities where empathy is the only language. No reels, no filters, just real connection.</p>
          </div>
        </div>
      </section>

      <section style={{ background: 'rgba(255,255,255,0.02)', padding: '100px 0' }}>
        <div className="section-container">
          <div className="showcase-text fade-in-up">
            <h2 style={{ fontSize: '2.8rem', marginBottom: '1.5rem' }}>Powered by <span className="text-gradient">Emotional AI</span></h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '2rem' }}>
              Our proprietary algorithms don't just process text; they understand sentiment, intensity, and context. Moodlink helps you find the right words when they feel out of reach.
            </p>
            <button className="btn-primary">Learn about our tech</button>
          </div>
          <div className="showcase-visual fade-in delay-2" style={{ flex: 1, height: '400px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '40px', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div id="features-three-container" ref={canvasRef} style={{ width: '100%', height: '100%' }}></div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Features;
