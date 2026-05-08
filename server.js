const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies from frontend requests
app.use(express.json());

// Serve the static HTML, CSS, and JS files from the current directory
app.use(express.static(__dirname));

// Initialize SQLite database
// This will create a file named 'database.sqlite' in the same folder
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create the 'users' table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err.message);
            } else {
                console.log('Users table ready.');
            }
        });
    }
});

// API endpoint to handle the login form submission
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const insertQuery = `INSERT INTO users (username, password) VALUES (?, ?)`;
        
        db.run(insertQuery, [username, hashedPassword], function(err) {
            if (err) {
                console.error('Error inserting user', err.message);
                return res.status(500).json({ error: 'Failed to save to database' });
            }
            
            console.log(`Successfully stored login for username: ${username} (Record ID: ${this.lastID})`);
            
            // Send success response back to the frontend
            res.status(200).json({ 
                success: true, 
                message: 'Credentials securely stored in SQLite database!',
                id: this.lastID
            });
        });
    } catch (error) {
        console.error('Error hashing password', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`\n======================================`);
    console.log(` Server is running at http://localhost:${PORT}`);
    console.log(`======================================\n`);
    console.log(`1. Open http://localhost:${PORT} in your web browser`);
    console.log(`2. Enter a username and password`);
    console.log(`3. Check this console to see the database save confirmation!`);
});
