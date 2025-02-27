// Shared state
window.quizCompleted = false;

let currentScore = 0;
let totalQuestions = 0;
const maxQuestions = 10;

function generateNewQuestion() {
    // Wait for DOM elements to be ready
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options');
    
    if (!questionElement || !optionsContainer) {
        console.log('Quiz elements not ready, retrying...');
        setTimeout(generateNewQuestion, 100);
        return;
    }

    if (totalQuestions >= maxQuestions) {
        showFinalScore();
        return;
    }

    // Generate two random numbers for addition
    const num1 = Math.floor(Math.random() * 90) + 10; // 2-digit number
    const num2 = Math.floor(Math.random() * 9) + 1;   // 1-digit number
    const correctAnswer = num1 + num2;

    // Generate wrong answers
    let options = [correctAnswer];
    while (options.length < 4) {
        const wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
        if (!options.includes(wrongAnswer)) {
            options.push(wrongAnswer);
        }
    }

    // Shuffle options
    options = options.sort(() => Math.random() - 0.5);

    // Update UI
    questionElement.textContent = `${num1} + ${num2} = ?`;
    optionsContainer.innerHTML = '';

    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'btn';
        button.textContent = option;
        button.onclick = () => checkAnswer(option, correctAnswer);
        optionsContainer.appendChild(button);
    });

    updateProgress();
}

function checkAnswer(selected, correct) {
    totalQuestions++;
    const buttons = document.querySelectorAll('#options button');
    buttons.forEach(button => {
        button.disabled = true;
        if (parseInt(button.textContent) === correct) {
            button.classList.add('correct');
        }
    });

    const feedback = document.getElementById('feedback');
    if (selected === correct) {
        currentScore++;
        feedback.textContent = "Correct! 🎉";
        feedback.style.color = "#28a745";
    } else {
        feedback.textContent = "Incorrect. Try again!";
        feedback.style.color = "#dc3545";
    }

    document.getElementById('score').textContent = currentScore;

    // Wait before next question or resume video
    setTimeout(() => {
        feedback.textContent = "";
        if (totalQuestions < maxQuestions) {
            generateNewQuestion();
        } else {
            showFinalScore();
        }
    }, 2000);
}

function updateProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const progress = (totalQuestions / maxQuestions) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

function showFinalScore() {
    const quizContainer = document.querySelector('.quiz-container');
    const passThreshold = maxQuestions * 0.7; // 70% to pass
    const passed = currentScore >= passThreshold;
    
    quizContainer.innerHTML = `
        <h2 class="chalk-text">Quiz Complete!</h2>
        <p class="chalk-text">Final Score: ${currentScore}/${maxQuestions}</p>
        <p class="chalk-text">${passed ? 'Congratulations! You can now watch the video.' : 'Please try again to unlock the video.'}</p>
        <button class="btn" onclick="restartQuiz()">Try Again</button>
    `;

    if (passed) {
        window.quizCompleted = true;
        enableVideoPlayback();
    }
}

function restartQuiz() {
    currentScore = 0;
    totalQuestions = 0;
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = '0';
    }
    generateNewQuestion();
}

// Initialize quiz when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing Quiz');
    setTimeout(generateNewQuestion, 100); // Small delay to ensure elements are ready
});
