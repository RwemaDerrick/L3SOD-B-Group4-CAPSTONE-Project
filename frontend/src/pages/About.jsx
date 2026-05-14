import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const About = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i=0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xff2a85,
        transparent: true,
        opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    const linesMaterial = new THREE.LineBasicMaterial({ color: 0x8a2be2, transparent: true, opacity: 0.2 });
    const linesGeometry = new THREE.BufferGeometry();
    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);

    camera.position.z = 5;

    let animationId;
    function animate() {
        animationId = requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        const positions = particlesGeometry.attributes.position.array;
        const linePositions = [];
        for(let i=0; i < particlesCount; i++) {
            for(let j=i+1; j < particlesCount; j++) {
                const dx = positions[i*3] - positions[j*3];
                const dy = positions[i*3+1] - positions[j*3+1];
                const dz = positions[i*3+2] - positions[j*3+2];
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                if(dist < 2.5) {
                    linePositions.push(positions[i*3], positions[i*3+1], positions[i*3+2]);
                    linePositions.push(positions[j*3], positions[j*3+1], positions[j*3+2]);
                }
            }
        }
        linesGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));

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
      <section className="landing-section">
        <div className="badge fade-in-up">Our Story</div>
        <h1 className="fade-in-up delay-1" style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
          Pioneering <span className="text-gradient">Emotional Intelligence</span>
        </h1>
        
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginTop: '4rem' }}>
          <div className="about-content fade-in-up delay-2">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Why Moodlink?</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}>
              Moodlink was born from a simple observation: in an increasingly connected world, we are feeling more isolated than ever. Traditional social media focuses on the highlight reel; Moodlink focuses on the real you.
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              We believe that every emotion—whether it's joy, sorrow, anxiety, or excitement—is a bridge to connection. Our AI-driven platform helps you navigate your emotional landscape and find others who truly understand your current state of mind.
            </p>
            <div className="cta-group" style={{ marginTop: '3rem' }}>
              <button className="btn-primary glow">Join the Movement</button>
            </div>
          </div>
          <div className="about-image fade-in delay-2" style={{ position: 'relative', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', height: '400px' }}>
            <div id="about-three-container" ref={canvasRef} style={{ width: '100%', height: '100%' }}></div>
          </div>
        </div>

        <div className="values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '6rem' }}>
          <div className="glass-card value-card fade-in-up delay-1" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div className="value-icon" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🛡️</div>
            <h3>Radical Safety</h3>
            <p>We prioritize your mental well-being with industry-leading moderation and privacy controls.</p>
          </div>
          <div className="glass-card value-card fade-in-up delay-2" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div className="value-icon" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🤝</div>
            <h3>True Empathy</h3>
            <p>Our algorithms are designed to foster genuine understanding, not just surface-level interactions.</p>
          </div>
          <div className="glass-card value-card fade-in-up delay-3" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div className="value-icon" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>⚡</div>
            <h3>Real-time Connection</h3>
            <p>Find your emotional match in seconds, when you need it most, without the noise of traditional social media.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
