const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database(':memory:'); // Creates an in-memory database for simplicity

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Create a "forum" table in the database
db.run(`
    CREATE TABLE forum (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        message TEXT
    )
`);

// Show the forum
app.get('/', (req, res) => {
    db.all('SELECT * FROM forum', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('index', { messages: rows });
    });
});

// Add a new message to the forum
app.post('/add', (req, res) => {
    const { username, message } = req.body;
    db.run(`INSERT INTO forum (username, message) VALUES (?, ?)`, [username, message], (err) => {
        if (err) {
            throw err;
        }
        res.redirect('/');
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
