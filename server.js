const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/'))); // Serve static files from root

const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Helper to read users
const readUsers = () => {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            return [];
        }
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading users file:", err);
        return [];
    }
};

// Helper to write users
const writeUsers = (users) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        return true;
    } catch (err) {
        console.error("Error writing users file:", err);
        return false;
    }
};


app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ message: 'Login successful', user });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// API: Get all users (for debugging/admin)
app.get('/api/users', (req, res) => {
    const users = readUsers();
    res.json(users);
});

// API: Signup (Create new user)
app.post('/api/signup', (req, res) => {
    const newUser = req.body;

    // Basic validation
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const users = readUsers();

    // Check if email already exists
    if (users.find(u => u.email === newUser.email)) {
        return res.status(409).json({ message: 'Email already exists' });
    }

    // Add new user
    // Generate a simple ID (in production use UUID)
    newUser.id = Date.now().toString();
    users.push(newUser);

    if (writeUsers(users)) {
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } else {
        res.status(500).json({ message: 'Failed to save user' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
