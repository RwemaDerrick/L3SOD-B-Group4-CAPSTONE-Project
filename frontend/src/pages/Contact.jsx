import React from 'react';

const Contact = () => {
  return (
    <main>
      <section className="landing-section" style={{ textAlign: 'center' }}>
        <div className="badge">Get in Touch</div>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>We are <span className="text-gradient">Listening</span></h1>
        <p style={{ maxWidth: '700px', margin: '0 auto 4rem', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          Have questions or want to learn more about Moodlink? Reach out to our team.
        </p>
        
        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem', textAlign: 'left' }}>
          <form>
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea 
                className="journal-area" 
                placeholder="How can we help?" 
                style={{ 
                  minHeight: '150px', 
                  width: '100%', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--glass-border)', 
                  borderRadius: '12px', 
                  padding: '1rem', 
                  color: 'white',
                  outline: 'none'
                }}
              ></textarea>
            </div>
            <button type="submit" className="btn-primary btn-full glow">Send Message</button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Contact;
