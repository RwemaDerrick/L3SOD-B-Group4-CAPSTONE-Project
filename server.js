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
    
    // Simple empathetic response simulation
    const responses = [
        "I hear you. That sounds really challenging, but remember you're not alone.",
        "It's completely valid to feel that way. How long have you been feeling this?",
        "Thank you for sharing that with me. Moodlink is here to help you process these emotions.",
        "That's a very interesting perspective. Let's explore that feeling together.",
        "I'm sensing a lot of strength in how you're handling this."
    ];
    
    const aiResponse = responses[Math.floor(Math.random() * responses.length)];
    res.json({ reply: aiResponse });
});

app.listen(PORT, () => {
    console.log(`Moodlink Backend running on http://localhost:${PORT}`);
});
