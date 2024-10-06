const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Create or open a database
const db = new sqlite3.Database('./public/messages.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the messages database.');
        // Create a messages table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

app.use(bodyParser.json());

// Endpoint to get all messages
app.get('/messages', (req, res) => {
    db.all(`SELECT * FROM messages ORDER BY timestamp DESC`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Endpoint to send a new message
app.post('/messages', (req, res) => {
    const { username, message } = req.body;
    db.run(`INSERT INTO messages (username, message) VALUES (?, ?)`, [username, message], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID, username, message });
        }
    });
});
cm
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
