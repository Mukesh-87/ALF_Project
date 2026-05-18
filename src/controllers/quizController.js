const db = require('../config/db');

exports.getNextQuestion = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: 'userId is required' });

        // Get user's current difficulty
        const profileResult = await db.query('SELECT current_difficulty_level FROM learner_profiles WHERE user_id = $1', [userId]);
        if (profileResult.rows.length === 0) return res.status(404).json({ error: 'Profile not found' });
        const currentDifficulty = profileResult.rows[0].current_difficulty_level;

        // Fetch a random question of that difficulty, excluding ones already answered by this user
        let questionResult = await db.query(
            'SELECT id, difficulty_level, question_text, options FROM content_blocks ' +
            'WHERE difficulty_level = $1 AND id NOT IN (' +
            '  SELECT content_block_id FROM performance_logs WHERE user_id = $2' +
            ') ORDER BY RANDOM() LIMIT 1',
            [currentDifficulty, userId]
        );

        if (questionResult.rows.length === 0) {
            // Fallback: If all are answered correctly, allow repeats of this difficulty
            questionResult = await db.query(
                'SELECT id, difficulty_level, question_text, options FROM content_blocks WHERE difficulty_level = $1 ORDER BY RANDOM() LIMIT 1',
                [currentDifficulty]
            );
        }

        if (questionResult.rows.length === 0) {
            return res.status(404).json({ error: 'No questions found for difficulty: ' + currentDifficulty });
        }

        const question = questionResult.rows[0];
        // Parse options back to array since they are stored as JSON string in DB
        question.options = JSON.parse(question.options);

        res.json({ question });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.submitAnswer = async (req, res) => {
    try {
        const { userId, contentBlockId, selectedAnswer, timeTakenSeconds } = req.body;
        
        // Evaluate 'isCorrect' on the server
        const blockResult = await db.query('SELECT correct_answer FROM content_blocks WHERE id = $1', [contentBlockId]);
        if (blockResult.rows.length === 0) {
             return res.status(404).json({ error: 'Question not found' });
        }
        const correctAnswer = blockResult.rows[0].correct_answer;
        const isCorrect = selectedAnswer === correctAnswer;

        const score = isCorrect ? 100.0 : 0.0;

        // Log performance
        await db.query(
            'INSERT INTO performance_logs (user_id, content_block_id, score, time_taken_seconds) VALUES ($1, $2, $3, $4)',
            [userId, contentBlockId, score, timeTakenSeconds]
        );

        // Get current difficulty
        const profileResult = await db.query('SELECT current_difficulty_level FROM learner_profiles WHERE user_id = $1', [userId]);
        const currentDifficulty = profileResult.rows[0].current_difficulty_level;

        // Fetch logs for the current phase (since the user reached this difficulty)
        const logsResult = await db.query(
            'SELECT pl.score, cb.difficulty_level FROM performance_logs pl ' +
            'JOIN content_blocks cb ON pl.content_block_id = cb.id ' +
            'WHERE pl.user_id = $1 ORDER BY pl.id DESC',
            [userId]
        );

        let correctInPhase = 0;
        let incorrectInPhase = 0;

        for (let i = 0; i < logsResult.rows.length; i++) {
            const log = logsResult.rows[i];
            if (log.difficulty_level === currentDifficulty) {
                if (log.score === 100.0) {
                    correctInPhase++;
                } else {
                    incorrectInPhase++;
                }
            } else {
                break;
            }
        }

        let newDifficulty = currentDifficulty;
        let adjusted = false;

        if (currentDifficulty === 'Easy') {
            if (correctInPhase >= 3) {
                newDifficulty = 'Medium';
                adjusted = true;
            }
        } else if (currentDifficulty === 'Medium') {
            if (correctInPhase >= 3) {
                newDifficulty = 'Hard';
                adjusted = true;
            } else if (incorrectInPhase >= 2) {
                newDifficulty = 'Easy';
                adjusted = true;
            }
        } else if (currentDifficulty === 'Hard') {
            if (incorrectInPhase >= 1) {
                newDifficulty = 'Medium';
                adjusted = true;
            }
        }

        // Update profile if difficulty changed
        if (adjusted) {
            await db.query('UPDATE learner_profiles SET current_difficulty_level = $1 WHERE user_id = $2', [newDifficulty, userId]);
        }

        res.json({ 
            message: 'Answer submitted successfully', 
            isCorrect: isCorrect,
            correctAnswer: correctAnswer,
            oldDifficulty: currentDifficulty,
            newDifficulty: newDifficulty,
            adjusted: adjusted,
            correctInPhase: correctInPhase,
            incorrectInPhase: incorrectInPhase
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
