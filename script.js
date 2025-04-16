let playerName = "";
let score = 0;
let questionIndex = 0;
let timeLeft = 15;
let timer;
let currentDifficulty = "";
let playerScores = { easy: [], medium: [], hard: [] };
let questionsAnswered = [];

// Function to handle name submission
function handleNameSubmit() {
    playerName = document.getElementById("playerName").value.trim();
    if (!playerName) {
        alert("Please enter your name first."); // Notification for empty name input
        return;
    }
    document.getElementById("nameInputSection").style.display = "none"; // Hide name input section
    document.getElementById("difficultySelection").style.display = "block"; // Show difficulty selection section
}

// Function to handle difficulty selection
function handleDifficultySelection(difficulty) {
    currentDifficulty = difficulty;
    startGame(currentDifficulty);
}

// Event listener for name submission
document.getElementById("nameSubmit").addEventListener("click", handleNameSubmit);

// Event listener for Enter key in name input
document.getElementById("playerName").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleNameSubmit();
    }
});

// Event listeners for difficulty buttons
document.querySelectorAll(".difficulty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        handleDifficultySelection(btn.getAttribute("data-mode"));
    });
});

// Event listener for Enter key in difficulty selection
document.querySelectorAll(".difficulty-btn").forEach(btn => {
    btn.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            handleDifficultySelection(btn.getAttribute("data-mode"));
        }
    });
});

function startGame(difficulty) {
    // Hide difficulty selection and show game section
    document.getElementById("difficultySelection").style.display = "none";
    document.getElementById("gameSection").style.display = "block";
    document.getElementById("currentDifficulty").innerText = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    score = 0;
    questionIndex = 0;
    questionsAnswered = [];
    generateQuestion(difficulty);
}

function generateQuestion(difficulty) {
    let num1 = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    let num2 = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    let correctAnswer;
    let questionText;

    if (difficulty === "easy") {
        correctAnswer = num1 + num2; // Addition for easy
        questionText = `${num1} + ${num2} = ?`;
    } else if (difficulty === "medium") {
        correctAnswer = num1 * num2; // Multiplication for medium
        questionText = `${num1} × ${num2} = ?`;
    } else {
        correctAnswer = Math.pow(num1, 2) - num2; // Squaring and subtracting for hard
        questionText = `${num1}² - ${num2} = ?`;
    }

    // Display the question
    document.getElementById("questionText").innerText = questionText;
    document.getElementById("questionTracker").innerText = `Question ${questionIndex + 1}/10`; // Update question tracker

    // Generate answer choices
    let choices = [correctAnswer, correctAnswer + 1, correctAnswer - 1, correctAnswer + 2];
    choices.sort(() => Math.random() - 0.5);

    let answerContainer = document.getElementById("answerChoices");
    answerContainer.innerHTML = ""; // Clear previous answers

    choices.forEach(choice => {
        let btn = document.createElement("button");
        btn.innerText = choice;
        btn.className = "answer-btn";
        btn.onclick = () => checkAnswer(btn, correctAnswer, choice); // Use onclick instead of addEventListener
        answerContainer.appendChild(btn);
    });

    resetTimer(correctAnswer);
}

function checkAnswer(selectedBtn, correctAnswer, selectedAnswer) {
    let isCorrect = parseInt(selectedBtn.innerText) === correctAnswer;
    if (!isCorrect) {
        selectedBtn.classList.add("wrong-answer");
        setTimeout(() => selectedBtn.classList.remove("wrong-answer"), 300);
    } else {
        score++;
    }

    // Store question data
    questionsAnswered.push({
        question: document.getElementById("questionText").innerText,
        correctAnswer: correctAnswer,
        selectedAnswer: selectedAnswer
    });

    questionIndex++;
    if (questionIndex < 10) {
        generateQuestion(currentDifficulty);
    } else {
        endGame();
    }
}

function resetTimer(correctAnswer) {
    clearInterval(timer); // Clear any existing timer
    timeLeft = 15;
    document.getElementById("timeLeft").innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timeLeft").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer); // Clear timer when time is up
            questionIndex++;
            if (questionIndex < 10) {
                generateQuestion(currentDifficulty);
            } else {
                endGame();
            }
        }
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    document.getElementById("gameSection").style.display = "none";
    document.getElementById("highScores").style.display = "block";
    document.querySelectorAll(".answer-btn").forEach(btn => btn.disabled = true); // Disable answer buttons
    addPlayerScore(playerName, score, currentDifficulty);
    displayFinalScore(); // Display final score
}

function addPlayerScore(name, score, difficulty) {
    playerScores[difficulty].push({ name: name, score: score });
    updateRankings();
}

function updateRankings() {
    for (let difficulty in playerScores) {
        playerScores[difficulty].sort((a, b) => b.score - a.score);
    }
    displayRankings();
}

function displayRankings() {
    ["easy", "medium", "hard"].forEach(difficulty => {
        const tableBody = document.getElementById(`${difficulty}Scores`);
        tableBody.innerHTML = "";
        
        playerScores[difficulty].forEach((player, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${index + 1}</td><td>${player.name}</td><td>${player.score}</td>`;
            tableBody.appendChild(row);
        });
    });
}

// Show Correct & Wrong Answers in High Scores
document.getElementById("showAnswersHighScores").addEventListener("click", () => {
    let resultContainer = document.getElementById("answersContainerHighScores");
    if (resultContainer.style.display === "none") {
        resultContainer.innerHTML = "<h3>Your Answers</h3>";
        questionsAnswered.forEach((q, index) => {
            let questionResult = document.createElement("p");
            questionResult.innerHTML = `<strong>Q${index + 1}:</strong> ${q.question} <br>
                Your Answer: <span style="color: ${q.selectedAnswer == q.correctAnswer ? 'green' : 'red'}">${q.selectedAnswer}</span> 
                <br> Correct Answer: <span style="font-weight: bold; color: green">${q.correctAnswer}</span>`;
            resultContainer.appendChild(questionResult);
        });
        resultContainer.style.display = "block"; // Show answers
        document.getElementById("showAnswersHighScores").innerText = "Hide Your Answers"; // Change button text
    } else {
        resultContainer.style.display = "none"; // Hide answers
        document.getElementById("showAnswersHighScores").innerText = "Show Your Answers"; // Change button text
    }
});

// Display final score and circles for correct/wrong answers
function displayFinalScore() {
    const finalScoreElement = document.getElementById("finalScore");
    finalScoreElement.innerText = `You've scored ${score} out of 10`;
    finalScoreElement.style.display = "block";

    const answerCircles = document.getElementById("answerCircles");
    answerCircles.innerHTML = ""; // Clear previous circles

    questionsAnswered.forEach((q) => {
        const circle = document.createElement("div");
        circle.className = "circle";
        circle.style.backgroundColor = q.selectedAnswer == q.correctAnswer ? "#28a745" : "#dc3545"; // Green for correct, red for wrong
        answerCircles.appendChild(circle);
    });

    answerCircles.style.display = "block"; // Show answer circles
}

// Back Button - Show Difficulty Selection or Name Input Section
document.getElementById("backButton").addEventListener("click", () => {
    // Hide the game section
    document.getElementById("gameSection").style.display = "none";

    // Show the difficulty selection section
    document.getElementById("difficultySelection").style.display = "block";

    // Reset game-related states
    score = 0;
    questionIndex = 0;
    questionsAnswered = [];
    document.getElementById("currentDifficulty").innerText = ""; // Clear the difficulty text

    // Also hide the highScores section
    document.getElementById("highScores").style.display = "none"; // Ensure highScores is hidden
});

// Retry Button
document.getElementById("retry").addEventListener("click", () => {
    document.getElementById("highScores").style.display = "none";
    document.getElementById("difficultySelection").style.display = "block";
});

// Quit Button
document.getElementById("quit").addEventListener("click", () => {
    document.getElementById("highScores").style.display = "none";
    document.getElementById("nameInputSection").style.display = "block";
});
