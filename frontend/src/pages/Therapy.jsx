import React, { useState, useEffect, useRef } from 'react';
import { useLocalBackend } from '../hooks/useLocalBackend';
import './Therapy.css';

const Therapy = () => {
  const { logMood, getMoodLogs, saveChat, getChat, getAIReply, getCurrentUser } = useLocalBackend();
  const user = getCurrentUser();

  const [activeScreen, setActiveScreen] = useState('home');
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [journalNote, setJournalNote] = useState('');
  const [selectedPills, setSelectedPills] = useState([]);
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hi ${user?.name || ''}, I'm Aria 🌿 I'm here to listen and support you. This is a safe, judgment-free space. What would you like to talk about today?` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathePhase, setBreathePhase] = useState({ label: 'Ready?', emoji: '🌬️', cls: '', countdown: '—' });
  const [moodLogs, setMoodLogs] = useState([]);

  const messagesEndRef = useRef(null);
  const breatheTimerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const savedChat = getChat();
    if (savedChat.length > 0) {
      setMessages(savedChat);
    }
    setMoodLogs(getMoodLogs());
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      saveChat(messages);
    }
  }, [messages]);

  const moods = [
    { label: 'Joyful', emoji: '😊' },
    { label: 'Calm', emoji: '😌' },
    { label: 'Anxious', emoji: '😰' },
    { label: 'Sad', emoji: '😔' },
    { label: 'Stressed', emoji: '😤' },
    { label: 'Hopeful', emoji: '🌱' },
    { label: 'Tired', emoji: '😴' },
    { label: 'Angry', emoji: '😠' },
  ];

  const pills = ['Work', 'Relationships', 'Health', 'Family', 'Finances', 'Sleep', 'Loneliness'];

  const togglePill = (pill) => {
    setSelectedPills(prev => prev.includes(pill) ? prev.filter(p => p !== pill) : [...prev, pill]);
  };

  const startChat = () => {
    const mood = selectedMood || 'something';
    const note = journalNote.trim();
    
    logMood({ mood, intensity, context: selectedPills, note });

    let intro = `I'm feeling ${mood.toLowerCase()}`;
    if (intensity >= 7) intro += ` quite intensely (${intensity}/10)`;
    if (selectedPills.length) intro += `, related to ${selectedPills.join(', ')}`;
    if (note) intro += `. ${note}`;

    setActiveScreen('chat');
    setTimeout(() => {
      handleSendMessage(intro);
    }, 400);
  };

  const handleSendMessage = (text) => {
    if (!text.trim()) return;
    
    const newUserMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const reply = getAIReply(text, selectedMood);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'ai', content: reply }]);
    }, 1500);
  };

  // Breathing logic
  const phases = [
    { label: 'Inhale', duration: 4, emoji: '🌬️', cls: 'expand' },
    { label: 'Hold', duration: 4, emoji: '🤍', cls: 'hold' },
    { label: 'Exhale', duration: 4, emoji: '🍃', cls: 'shrink' },
    { label: 'Hold', duration: 4, emoji: '✨', cls: 'hold' }
  ];

  const startBreathing = () => {
    setBreathingActive(true);
    let phaseIdx = 0;
    let count = phases[0].duration;

    const run = () => {
      const p = phases[phaseIdx];
      setBreathePhase({ ...p, countdown: count });

      breatheTimerRef.current = setTimeout(() => {
        if (count <= 1) {
          phaseIdx = (phaseIdx + 1) % phases.length;
          count = phases[phaseIdx].duration;
        } else {
          count--;
        }
        run();
      }, 1000);
    };
    run();
  };

  const stopBreathing = () => {
    setBreathingActive(false);
    clearTimeout(breatheTimerRef.current);
    setBreathePhase({ label: 'Ready?', emoji: '🌬️', cls: '', countdown: '—' });
  };

  const getFrequentEmotions = () => {
    const counts = moodLogs.reduce((acc, log) => {
      acc[log.mood] = (acc[log.mood] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(counts)
      .map(([label, count]) => ({
        label: `${moods.find(m => m.label === label)?.emoji || ''} ${label}`,
        pct: Math.round((count / moodLogs.length) * 100)
      }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 4);
  };

  return (
    <div className="therapy-page">
      <div className="therapy-container">
        <div className="chat-layout">
          {/* Modern Sidebar */}
          <aside className="therapy-sidebar">
            <div className="sidebar-header">
              <h2 className="text-gradient">Therapy Hub</h2>
              <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>Safe Space for {user?.name}</p>
            </div>
            
            <nav className="sidebar-nav">
              <button 
                className={`sidebar-btn ${activeScreen === 'home' ? 'active' : ''}`}
                onClick={() => setActiveScreen('home')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                Mood Check-in
              </button>
              <button 
                className={`sidebar-btn ${activeScreen === 'chat' ? 'active' : ''}`}
                onClick={() => setActiveScreen('chat')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                AI Therapist
              </button>
              <button 
                className={`sidebar-btn ${activeScreen === 'breathe' ? 'active' : ''}`}
                onClick={() => setActiveScreen('breathe')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>
                Breathing Space
              </button>
              <button 
                className={`sidebar-btn ${activeScreen === 'insights' ? 'active' : ''}`}
                onClick={() => setActiveScreen('insights')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                My Insights
              </button>
            </nav>

            <div className="sidebar-footer" style={{marginTop: 'auto'}}>
               <div className="glass-card" style={{padding: '1rem', borderRadius: '15px', fontSize: '0.9rem'}}>
                  <p>🔥 {moodLogs.length} Day Streak</p>
               </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="chat-main">
            {activeScreen === 'home' && (
              <div className="therapy-home-modern">
                <div className="greeting">
                  <span className="badge">Welcome Back</span>
                  <h2 style={{fontSize: '2.5rem', marginTop: '1rem'}}>How are you feeling, <span className="text-gradient">{user?.name}</span>?</h2>
                </div>

                <div className="mood-selector-modern">
                  {moods.map(m => (
                    <div 
                      key={m.label}
                      className={`mood-card-modern ${selectedMood === m.label ? 'selected' : ''}`}
                      onClick={() => setSelectedMood(m.label)}
                    >
                      <span className="mood-emoji-large">{m.emoji}</span>
                      <span style={{fontWeight: 600}}>{m.label}</span>
                    </div>
                  ))}
                </div>

                <div className="form-group" style={{maxWidth: '100%'}}>
                   <label>Intensity Level ({intensity}/10)</label>
                   <input 
                     type="range" 
                     min="1" max="10" 
                     value={intensity} 
                     onChange={(e) => setIntensity(e.target.value)}
                     style={{width: '100%', accentColor: 'var(--accent-2)', margin: '1rem 0'}}
                   />
                </div>

                <div className="form-group">
                   <label>What's on your mind? (Optional)</label>
                   <textarea 
                     className="chat-input-modern" 
                     placeholder="Write a few words..."
                     style={{width: '100%', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)'}}
                     value={journalNote}
                     onChange={(e) => setJournalNote(e.target.value)}
                   />
                </div>

                <button className="btn-primary btn-nav" style={{marginTop: '2rem', padding: '1.2rem'}} onClick={startChat}>
                  Start Session with Aria
                </button>
              </div>
            )}

            {activeScreen === 'chat' && (
              <>
                <header className="chat-header-modern">
                  <div className="msg-avatar-modern">🌿</div>
                  <div className="therapist-status">
                    <h3>Aria</h3>
                    <span className="status-indicator">
                      <span className="status-dot-pulse"></span>
                      Active Now
                    </span>
                  </div>
                </header>

                <div className="messages-container">
                  {messages.map((m, i) => (
                    <div key={i} className={`msg-wrapper ${m.role}`}>
                      <div className="msg-avatar-modern">{m.role === 'ai' ? '🌿' : '👤'}</div>
                      <div className="msg-bubble-modern">
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="msg-wrapper ai">
                      <div className="msg-avatar-modern">🌿</div>
                      <div className="msg-bubble-modern">
                        <div className="typing-indicator" style={{display: 'flex', gap: '4px'}}>
                           <div className="typing-dot"></div>
                           <div className="typing-dot"></div>
                           <div className="typing-dot"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <footer className="chat-input-area">
                  <div className="input-wrapper-modern">
                    <textarea 
                      className="chat-input-modern" 
                      placeholder="Type your message..." 
                      rows="1"
                      ref={inputRef}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <div className="action-btns">
                      <button className="icon-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                      </button>
                      <button className="send-btn-modern" onClick={() => {
                        handleSendMessage(inputRef.current.value);
                        inputRef.current.value = '';
                      }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                      </button>
                    </div>
                  </div>
                </footer>
              </>
            )}

            {activeScreen === 'breathe' && (
              <div className="breathe-container-modern">
                <div className={`breathe-circle-modern ${breathePhase.cls}`}>
                  <span className="breathe-text-modern">{breathePhase.countdown}</span>
                </div>
                <h3 style={{marginTop: '4rem', fontSize: '2rem'}}>{breathePhase.label}</h3>
                <p style={{color: 'var(--text-secondary)', marginBottom: '3rem'}}>{breathePhase.emoji} Focus on your breath</p>
                <button className="btn-primary btn-nav" onClick={breathingActive ? stopBreathing : startBreathing} style={{minWidth: '200px'}}>
                  {breathingActive ? 'Stop Session' : 'Begin Breathing'}
                </button>
              </div>
            )}

            {activeScreen === 'insights' && (
              <div className="therapy-home-modern">
                <h2 className="text-gradient" style={{fontSize: '2.5rem'}}>Your Emotional Journey</h2>
                
                {moodLogs.length === 0 ? (
                  <div style={{textAlign: 'center', marginTop: '5rem'}}>
                    <p style={{fontSize: '1.2rem', color: 'var(--text-secondary)'}}>No data collected yet. Start a session to see your insights!</p>
                  </div>
                ) : (
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem'}}>
                    <div className="glass-card" style={{padding: '2rem'}}>
                      <h3>Top Emotions</h3>
                      <div style={{marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                         {getFrequentEmotions().map(e => (
                           <div key={e.label}>
                             <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                               <span>{e.label}</span>
                               <span>{e.pct}%</span>
                             </div>
                             <div style={{height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden'}}>
                                <div style={{width: `${e.pct}%`, height: '100%', background: 'var(--accent-1)'}}></div>
                             </div>
                           </div>
                         ))}
                      </div>
                    </div>

                    <div className="glass-card" style={{padding: '2rem'}}>
                       <h3>Intensity Logs</h3>
                       <div style={{height: '200px', display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginTop: '2rem'}}>
                          {moodLogs.slice(-10).map((l, i) => (
                            <div 
                              key={i} 
                              style={{
                                flex: 1, 
                                height: `${l.intensity * 10}%`, 
                                background: 'var(--accent-2)', 
                                borderRadius: '5px 5px 0 0',
                                opacity: 0.5 + (i * 0.05)
                              }}
                              title={`Intensity: ${l.intensity}`}
                            ></div>
                          ))}
                       </div>
                       <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'center'}}>Last 10 entries</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Therapy;
