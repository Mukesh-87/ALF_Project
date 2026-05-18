const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve static frontend UI
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`ALF Server running on port ${PORT}`);
});
