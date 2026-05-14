import { useState, useEffect } from 'react';

// Centralized Local Storage keys
const KEYS = {
  USERS: 'moodlink_users',
  CURRENT_USER: 'moodlink_current_user',
  CHATS: 'moodlink_chats',
  MOOD_LOGS: 'moodlink_mood_logs',
};

export const useLocalBackend = () => {
  // --- Auth Logic ---
  const registerUser = (userData) => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const newUser = { ...userData, id: Date.now(), createdAt: new Date() };
    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(newUser));
    return newUser;
  };

  const loginUser = (email) => {
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const user = users.find(u => u.email === email);
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  };

  const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || 'null');
  };

  const logout = () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
  };

  // --- Mood Logic ---
  const logMood = (moodData) => {
    const user = getCurrentUser();
    if (!user) return;

    const logs = JSON.parse(localStorage.getItem(KEYS.MOOD_LOGS) || '[]');
    const newLog = { ...moodData, userId: user.id, timestamp: new Date() };
    logs.push(newLog);
    localStorage.setItem(KEYS.MOOD_LOGS, JSON.stringify(logs));
    return newLog;
  };

  const getMoodLogs = () => {
    const user = getCurrentUser();
    if (!user) return [];
    const logs = JSON.parse(localStorage.getItem(KEYS.MOOD_LOGS) || '[]');
    return logs.filter(l => l.userId === user.id);
  };

  // --- Chat Logic ---
  const saveChat = (messages) => {
    const user = getCurrentUser();
    if (!user) return;

    const allChats = JSON.parse(localStorage.getItem(KEYS.CHATS) || '{}');
    allChats[user.id] = messages;
    localStorage.setItem(KEYS.CHATS, JSON.stringify(allChats));
  };

  const getChat = () => {
    const user = getCurrentUser();
    if (!user) return [];
    const allChats = JSON.parse(localStorage.getItem(KEYS.CHATS) || '{}');
    return allChats[user.id] || [];
  };

  // --- AI Simulation Logic ---
  const getAIReply = (message, mood = 'neutral') => {
    const msg = message.toLowerCase();
    
    const responses = {
      greeting: ["I'm here to listen. How are you feeling right now?", "Hello! I'm Aria. Thank you for sharing with me.", "It's good to see you. How can I support you today?"],
      anxious: ["Take a deep breath with me. You're safe here.", "It's okay to feel overwhelmed. What's one small thing we can focus on?", "Anxiety is a heavy weight, but you don't have to carry it alone."],
      sad: ["I'm so sorry you're feeling this way. It's okay to not be okay.", "I'm holding space for your sadness. What would feel most comforting right now?", "Your feelings are valid. Take all the time you need."],
      stressed: ["Stress can be so draining. Let's try to unpack what's weighing on you.", "You've been carrying a lot. Remember to be kind to yourself.", "What's one thing you can let go of today to breathe a little easier?"],
      joyful: ["That's wonderful to hear! What's bringing you this joy?", "I'm so happy for you! Sharing these moments is just as important.", "Hold onto this feeling. You deserve this happiness."],
      generic: ["Tell me more about that.", "I hear you. How does that make you feel in your body?", "Thank you for being so honest with me. Go on.", "I'm listening. What else is on your mind?"]
    };

    if (msg.includes('hello') || msg.includes('hi')) return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    if (msg.includes('anxious') || msg.includes('worry') || msg.includes('scared')) return responses.anxious[Math.floor(Math.random() * responses.anxious.length)];
    if (msg.includes('sad') || msg.includes('lonely') || msg.includes('cry')) return responses.sad[Math.floor(Math.random() * responses.sad.length)];
    if (msg.includes('stress') || msg.includes('work') || msg.includes('busy')) return responses.stressed[Math.floor(Math.random() * responses.stressed.length)];
    if (msg.includes('happy') || msg.includes('good') || msg.includes('great')) return responses.joyful[Math.floor(Math.random() * responses.joyful.length)];

    // Fallback to mood-based if no keywords
    if (mood === 'Anxious') return responses.anxious[0];
    if (mood === 'Sad') return responses.sad[0];
    if (mood === 'Stressed') return responses.stressed[0];
    if (mood === 'Joyful') return responses.joyful[0];

    return responses.generic[Math.floor(Math.random() * responses.generic.length)];
  };

  return {
    registerUser,
    loginUser,
    getCurrentUser,
    logout,
    logMood,
    getMoodLogs,
    saveChat,
    getChat,
    getAIReply,
  };
};
