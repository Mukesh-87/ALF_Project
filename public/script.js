let currentUserId = null;
let currentQuestionId = null;
let startTime = 0;
let selectedAnswer = null;

const DOM = {
    authScreen: document.getElementById('auth-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    username: document.getElementById('username'),
    password: document.getElementById('password'),
    btnLogin: document.getElementById('btn-login'),
    btnRegister: document.getElementById('btn-register'),
    authMsg: document.getElementById('auth-msg'),
    
    userDisplay: document.getElementById('user-display'),
    currentDifficulty: document.getElementById('current-difficulty'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    btnSubmit: document.getElementById('btn-submit'),
    
    feedbackPanel: document.getElementById('feedback-panel'),
    feedbackText: document.getElementById('feedback-text'),
    btnNext: document.getElementById('btn-next'),
    quizMsg: document.getElementById('quiz-msg')
};

// --- AUTHENTICATION ---
async function handleAuth(action) {
    const username = DOM.username.value.trim();
    const password = DOM.password.value.trim();

    if (!username || !password) {
        DOM.authMsg.innerText = "Please fill in all fields.";
        return;
    }

    try {
        const response = await fetch(`/api/auth/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            currentUserId = data.user ? data.user.id : data.userId;
            
            DOM.userDisplay.innerText = username;
            switchScreen(DOM.authScreen, DOM.quizScreen);
            loadNextQuestion();
        } else {
            DOM.authMsg.innerText = data.error || "An error occurred.";
        }
    } catch (err) {
        DOM.authMsg.innerText = "Server error. Is the backend running?";
    }
}

DOM.btnLogin.addEventListener('click', () => handleAuth('login'));
DOM.btnRegister.addEventListener('click', () => handleAuth('register'));

// --- QUIZ LOGIC ---
async function loadNextQuestion() {
    DOM.feedbackPanel.classList.add('hidden');
    DOM.btnSubmit.disabled = false;
    DOM.optionsContainer.innerHTML = '';
    selectedAnswer = null;
    DOM.quizMsg.innerText = '';
    DOM.btnNext.style.display = 'none';
    DOM.btnSubmit.style.display = 'block';
    
    try {
        const response = await fetch(`/api/quiz/next?userId=${currentUserId}`);
        const data = await response.json();

        if (response.ok) {
            currentQuestionId = data.question.id;
            DOM.questionText.innerText = data.question.question_text;
            
            // Render options
            data.question.options.forEach(opt => {
                const optEl = document.createElement('div');
                optEl.className = 'option-item';
                optEl.innerText = opt;
                optEl.addEventListener('click', () => {
                    document.querySelectorAll('.option-item').forEach(el => el.classList.remove('selected'));
                    optEl.classList.add('selected');
                    selectedAnswer = opt;
                });
                DOM.optionsContainer.appendChild(optEl);
            });
            
            updateDifficultyBadge(data.question.difficulty_level);
            startTime = Date.now();
        } else {
            DOM.questionText.innerText = "No more questions available.";
            DOM.btnSubmit.disabled = true;
        }
    } catch (err) {
        DOM.quizMsg.innerText = "Failed to load question.";
    }
}

async function submitAnswer() {
    if (!selectedAnswer) {
        DOM.quizMsg.innerText = "Please select an option first.";
        return;
    }

    DOM.btnSubmit.disabled = true;
    
    // Disable selecting options after submit
    document.querySelectorAll('.option-item').forEach(el => {
        el.style.pointerEvents = 'none';
    });

    const timeTakenSeconds = Math.round((Date.now() - startTime) / 1000);

    try {
        const response = await fetch('/api/quiz/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUserId,
                contentBlockId: currentQuestionId,
                selectedAnswer: selectedAnswer,
                timeTakenSeconds: timeTakenSeconds
            })
        });

        const data = await response.json();

        if (response.ok) {
            showFeedback(
                data.oldDifficulty, 
                data.newDifficulty, 
                timeTakenSeconds, 
                data.isCorrect, 
                data.correctAnswer,
                data.adjusted,
                data.correctInPhase,
                data.incorrectInPhase
            );
        } else {
            DOM.quizMsg.innerText = data.error;
            DOM.btnSubmit.disabled = false;
        }
    } catch (err) {
        DOM.quizMsg.innerText = "Failed to submit answer.";
        DOM.btnSubmit.disabled = false;
    }
}

function showFeedback(oldDiff, newDiff, time, isCorrect, correctAnswer, adjusted, correctInPhase, incorrectInPhase) {
    DOM.feedbackPanel.classList.remove('hidden');
    DOM.btnNext.style.display = 'inline-block';
    DOM.btnSubmit.style.display = 'none';
    
    let text = isCorrect 
        ? `<div class="feedback-correct">✔️ True! Correct Answer</div>`
        : `<div class="feedback-wrong">❌ False! Incorrect Answer<br><span style="font-size:0.95rem; color:var(--text-main)">Correct: <strong>${correctAnswer}</strong></span></div>`;
        
    text += `<div style="margin-top: 15px; font-size: 0.95rem; color: var(--text-muted); line-height: 1.5;">`;
    text += `Time taken: <strong>${time}s</strong><br>`;
    
    if (adjusted) {
        text += `<span style="color:#4ade80; font-weight: 600;">Adaptive Level Shift!</span><br>Difficulty Adjusted: <strong style="color:var(--accent-2)">${oldDiff} ➔ ${newDiff}</strong>`;
    } else {
        if (newDiff === 'Easy') {
            const remaining = 3 - correctInPhase;
            text += `<span style="color: #60a5fa; font-weight: 500;">Easy Level Progress: Need <strong>${remaining}</strong> more correct answer${remaining > 1 ? 's' : ''} to upgrade to Medium. (Got: ${correctInPhase}/3)</span>`;
        } else if (newDiff === 'Medium') {
            const correctRemaining = 3 - correctInPhase;
            const incorrectRemaining = 2 - incorrectInPhase;
            text += `<span style="color: #60a5fa; font-weight: 500;">Medium Level Progress:<br>• Upgrade to Hard: Need <strong>${correctRemaining}</strong> more correct answer${correctRemaining > 1 ? 's' : ''} (Got: ${correctInPhase}/3)<br>• Demotion to Easy: Need <strong>${incorrectRemaining}</strong> more incorrect answer${incorrectRemaining > 1 ? 's' : ''} (Got: ${incorrectInPhase}/2)</span>`;
        } else if (newDiff === 'Hard') {
            text += `<span style="color: #eab308; font-weight: 500;">Hard Level Status:<br>• Answering correctly maintains Hard level.<br>• Next incorrect answer will demote you to Medium.</span>`;
        }
    }
    text += `</div>`;
    
    DOM.feedbackText.innerHTML = text;
    updateDifficultyBadge(newDiff);
}

DOM.btnSubmit.addEventListener('click', submitAnswer);
DOM.btnNext.addEventListener('click', loadNextQuestion);

// Keyboard support for Enter
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (!DOM.quizScreen.classList.contains('hidden')) {
            if (DOM.feedbackPanel.classList.contains('hidden')) {
                // If options are shown but none selected, ignore
                if (selectedAnswer) submitAnswer();
            } else {
                // Feedback shown, load next question
                loadNextQuestion();
            }
        }
    }
});

// --- UTILS ---
function switchScreen(hideEl, showEl) {
    hideEl.classList.remove('active');
    setTimeout(() => {
        hideEl.classList.add('hidden');
        showEl.classList.remove('hidden');
        // Trigger reflow
        void showEl.offsetWidth;
        showEl.classList.add('active');
    }, 500);
}

function updateDifficultyBadge(diff) {
    DOM.currentDifficulty.innerText = diff;
    DOM.currentDifficulty.className = 'difficulty-badge ' + diff.toLowerCase();
}
