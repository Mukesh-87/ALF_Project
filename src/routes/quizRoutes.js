const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.get('/next', quizController.getNextQuestion);
router.post('/submit', quizController.submitAnswer);

module.exports = router;
