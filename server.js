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

app.listen(PORT, () => {
    console.log(`Moodlink Backend running on http://localhost:${PORT}`);
});
