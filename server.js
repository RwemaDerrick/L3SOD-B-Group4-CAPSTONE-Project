const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './')));

// Database simulation (JSON file)
const DB_PATH = path.join(__dirname, 'users.json');

// Initialize DB if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

// Routes
app.post('/api/register', (req, res) => {
    const { name, email, mood } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and Email are required' });
    }

    const users = JSON.parse(fs.readFileSync(DB_PATH));
    const newUser = { id: Date.now(), name, email, mood, createdAt: new Date() };
    
    users.push(newUser);
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));

    res.status(201).json({ message: 'Registration successful!', user: newUser });
});

app.get('/api/users', (req, res) => {
    const users = JSON.parse(fs.readFileSync(DB_PATH));
    res.json(users);
});

// AI Matchmaking Endpoint
app.post('/api/ai/match', (req, res) => {
    const { mood } = req.body;
    const users = JSON.parse(fs.readFileSync(DB_PATH));
    
    // Find users with the same mood, excluding a simulated current user
    const matches = users.filter(u => u.mood.toLowerCase() === mood.toLowerCase());
    
    if (matches.length > 0) {
        const randomMatch = matches[Math.floor(Math.random() * matches.length)];
        res.json({ success: true, match: randomMatch });
    } else {
        res.json({ success: false, message: 'No matches found yet. You are the first with this vibe!' });
    }
});

// AI Emotional Support Chat Endpoint
app.post('/api/ai/chat', (req, res) => {
    const { message } = req.body;
    const msg = message.toLowerCase();
    
    let reply = "";

    // Keyword-based sentiment logic
    if (msg.includes("sad") || msg.includes("cry") || msg.includes("lonely")) {
        reply = "I'm so sorry you're feeling this way. Loneliness can be heavy, but sharing it here is a brave first step. Would you like to talk about what's making you sad?";
    } else if (msg.includes("angry") || msg.includes("mad") || msg.includes("frustrated")) {
        reply = "It's completely okay to feel frustrated. Sometimes we just need to vent. What's bothering you the most right now?";
    } else if (msg.includes("stress") || msg.includes("anxious") || msg.includes("worried") || msg.includes("overwhelmed")) {
        reply = "Take a deep breath. Being overwhelmed is tough, but we can break things down together. Have you tried a quick breathing exercise today?";
    } else if (msg.includes("happy") || msg.includes("good") || msg.includes("great") || msg.includes("excited")) {
        reply = "That's wonderful to hear! I love sharing in your joy. What made your day so bright?";
    } else if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
        reply = "Hello! I'm Aria, your MoodAI companion. I'm here to listen and support you. How's your heart feeling today?";
    } else {
        const generalReplies = [
            "Thank you for sharing that with me. I'm listening.",
            "Tell me more about how that makes you feel.",
            "I'm here for you. Your emotions are valid and important.",
            "That sounds like a lot to process. I'm glad you're talking to me about it."
        ];
        reply = generalReplies[Math.floor(Math.random() * generalReplies.length)];
    }
    
    res.json({ reply: reply });
});

app.listen(PORT, () => {
    console.log(`Moodlink Backend running on http://localhost:${PORT}`);
});
