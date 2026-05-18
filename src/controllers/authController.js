const db = require('../config/db');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Basic registration (in a real app, hash the password!)
        const userResult = await db.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
            [username, password]
        );
        const userId = userResult.lastID;

        // Initialize Learner Profile
        await db.query(
            "INSERT INTO learner_profiles (user_id, current_difficulty_level, overall_score) VALUES ($1, 'Easy', 0.0)",
            [userId]
        );

        res.status(201).json({ message: 'User registered successfully', userId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await db.query('SELECT * FROM users WHERE username = $1 AND password_hash = $2', [username, password]);
        
        if (result.rows.length > 0) {
            res.json({ message: 'Login successful', user: result.rows[0] });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
