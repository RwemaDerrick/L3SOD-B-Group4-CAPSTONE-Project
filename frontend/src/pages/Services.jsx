import React from 'react';

const Services = () => {
  return (
    <main>
      <section className="landing-section" style={{ textAlign: 'center' }}>
        <div className="badge">Our Services</div>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>How We <span className="text-gradient">Support You</span></h1>
        <p style={{ maxWidth: '700px', margin: '0 auto 4rem', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          We offer a range of digital tools and communities to help you navigate your emotional journey.
        </p>
        
        <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass-card step-card">
            <h3>Personal AI Therapy</h3>
            <p>24/7 access to Aria, your emotional companion.</p>
          </div>
          <div className="glass-card step-card">
            <h3>Community Circles</h3>
            <p>Join safe spaces to share and connect with others.</p>
          </div>
          <div className="glass-card step-card">
            <h3>Wellness Workshops</h3>
            <p>Interactive sessions on mindfulness and emotional health.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
