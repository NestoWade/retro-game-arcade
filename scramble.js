const words = [
    { word: "cat", hint: "A small pet animal" },
    { word: "dog", hint: "A loyal pet animal" },
    { word: "game", hint: "Something you play for fun" },
    { word: "code", hint: "Instructions written for a computer" },
    { word: "apple", hint: "A red or green fruit" },
    { word: "planet", hint: "Earth is one of these" },
    { word: "school", hint: "A place where people learn" },
    { word: "browser", hint: "Used to open websites" },
    { word: "computer", hint: "An electronic machine used for work or games" },
    { word: "javascript", hint: "A programming language used for websites" },
    { word: "development", hint: "The process of building software or websites" },
    { word: "technology", hint: "Tools and systems created using science" },
    { word: "programming", hint: "Writing instructions for a computer" }
];

let availableWords = words.slice();

let currentWordObject = null;
let currentWord = "";
let scrambledWord = "";

let timerCount = 0;
let timerInterval = null;

let score = 0;
let streak = 0;
let multiplier = 1;

let roundActive = false;
let gameOver = false;

const initialsInput = document.getElementById("initialsInput");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const resetLeaderboardButton = document.getElementById("resetLeaderboardButton");

const timerDisplay = document.getElementById("timer");
const scrambledWordDisplay = document.getElementById("scrambledWord");
const hintText = document.getElementById("hintText");
const answerInput = document.getElementById("answerInput");
const message = document.getElementById("message");

const scoreDisplay = document.getElementById("score");
const streakDisplay = document.getElementById("streak");
const multiplierDisplay = document.getElementById("multiplier");
const leaderboard = document.getElementById("leaderboard");

loadLeaderboard();

answerInput.disabled = true;

startButton.addEventListener("click", startRound);
resetButton.addEventListener("click", resetGame);
resetLeaderboardButton.addEventListener("click", resetLeaderboard);

answerInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});

function playGameSound(filePath) {
    const sound = new Audio(filePath);

    sound.play().catch(function(error) {
        console.log("Game sound error:", error);
    });
}

function showWinAnimation() {
    message.classList.remove("win-glow");
    void message.offsetWidth;
    message.classList.add("win-glow");
}

function startRound() {
    const initials = initialsInput.value.trim().toUpperCase();

    if (initials === "") {
        message.textContent = "Enter your initials first.";
        initialsInput.focus();
        return;
    }

    if (gameOver) {
        message.textContent = "Game over. Press Reset Score to play again.";
        return;
    }

    if (availableWords.length === 0) {
        winGame();
        return;
    }

    clearInterval(timerInterval);

    currentWordObject = getRandomWordObject();
    currentWord = currentWordObject.word;

    scrambledWord = scrambleWord(currentWord);

    while (scrambledWord === currentWord) {
        scrambledWord = scrambleWord(currentWord);
    }

    timerCount = getTimeForWord(currentWord);

    scrambledWordDisplay.textContent = scrambledWord.toUpperCase();
    hintText.textContent = currentWordObject.hint;
    timerDisplay.textContent = timerCount;

    answerInput.value = "";
    answerInput.disabled = false;
    answerInput.focus();

    roundActive = true;
    startButton.disabled = true;

    message.textContent = "Unscramble the word and press Enter.";

    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(function() {
        timerCount--;
        timerDisplay.textContent = timerCount;

        if (timerCount <= 0) {
            clearInterval(timerInterval);
            loseGame("Time ran out!");
        }
    }, 1000);
}

function checkAnswer() {
    if (!roundActive || gameOver) {
        return;
    }

    const initials = initialsInput.value.trim().toUpperCase();
    const userAnswer = answerInput.value.trim().toLowerCase();

    if (userAnswer === "") {
        message.textContent = "Type your answer first.";
        answerInput.focus();
        return;
    }

    if (userAnswer === currentWord) {
        clearInterval(timerInterval);

        let points = calculatePoints(currentWord);

        streak++;

        if (streak >= 3) {
            multiplier = 2;
        } else {
            multiplier = 1;
        }

        points = points * multiplier;
        score = score + points;

        scoreDisplay.textContent = score;
        streakDisplay.textContent = streak;
        multiplierDisplay.textContent = multiplier + "x";

        message.textContent = "Correct! +" + points + " points.";
        showWinAnimation();
        playGameSound("./sounds/you_won.wav");

        updateLeaderboard(initials, score);
        removeUsedWord(currentWord);

        roundActive = false;
        answerInput.disabled = true;
        startButton.disabled = false;

        if (availableWords.length === 0) {
            winGame();
        }
    } else {
        loseGame("Wrong answer!");
    }
}

function loseGame(reason) {
    clearInterval(timerInterval);

    message.textContent = reason + " Game Over! The correct word was: " + currentWord.toUpperCase() + ".";
    playGameSound("./sounds/you_lost.wav");

    gameOver = true;
    roundActive = false;

    streak = 0;
    multiplier = 1;

    streakDisplay.textContent = streak;
    multiplierDisplay.textContent = multiplier + "x";

    answerInput.disabled = true;
    startButton.disabled = true;
}

function winGame() {
    const initials = initialsInput.value.trim().toUpperCase();

    clearInterval(timerInterval);

    message.textContent = "You completed all words! You win!";
    showWinAnimation();
    playGameSound("./sounds/you_won.wav");

    updateLeaderboard(initials, score);

    gameOver = true;
    roundActive = false;

    answerInput.disabled = true;
    startButton.disabled = true;
}

function removeUsedWord(word) {
    availableWords = availableWords.filter(function(item) {
        return item.word !== word;
    });
}

function getRandomWordObject() {
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    return availableWords[randomIndex];
}

function scrambleWord(word) {
    let letters = word.split("");

    for (let i = letters.length - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));

        let temporaryLetter = letters[i];
        letters[i] = letters[randomIndex];
        letters[randomIndex] = temporaryLetter;
    }

    return letters.join("");
}

function getTimeForWord(word) {
    if (word.length >= 3 && word.length <= 5) {
        return 10;
    }

    if (word.length >= 6 && word.length <= 10) {
        return 20;
    }

    return 30;
}

function calculatePoints(word) {
    if (word.length >= 3 && word.length <= 5) {
        return 10;
    }

    if (word.length >= 6 && word.length <= 10) {
        return 20;
    }

    return timerCount;
}

function resetGame() {
    clearInterval(timerInterval);

    availableWords = words.slice();

    currentWordObject = null;
    currentWord = "";
    scrambledWord = "";

    timerCount = 0;
    score = 0;
    streak = 0;
    multiplier = 1;

    roundActive = false;
    gameOver = false;

    scoreDisplay.textContent = score;
    streakDisplay.textContent = streak;
    multiplierDisplay.textContent = "1x";

    timerDisplay.textContent = 0;
    scrambledWordDisplay.textContent = "----";
    hintText.textContent = "Press Start Round";

    answerInput.value = "";
    answerInput.disabled = true;

    startButton.disabled = false;

    message.textContent = "Game reset. Press Start Round.";
}

function updateLeaderboard(initials, newScore) {
    let scores = JSON.parse(localStorage.getItem("scrambleLeaderboard")) || [];

    let existingPlayer = scores.find(function(player) {
        return player.initials === initials;
    });

    if (existingPlayer) {
        if (newScore > existingPlayer.score) {
            existingPlayer.score = newScore;
        }
    } else {
        scores.push({
            initials: initials,
            score: newScore
        });
    }

    scores.sort(function(a, b) {
        return b.score - a.score;
    });

    scores = scores.slice(0, 3);

    localStorage.setItem("scrambleLeaderboard", JSON.stringify(scores));

    displayLeaderboard(scores);
}

function loadLeaderboard() {
    let scores = JSON.parse(localStorage.getItem("scrambleLeaderboard")) || [];
    displayLeaderboard(scores);
}

function displayLeaderboard(scores) {
    leaderboard.innerHTML = "";

    for (let i = 0; i < 3; i++) {
        let listItem = document.createElement("li");

        if (scores[i]) {
            listItem.textContent = scores[i].initials + " - " + scores[i].score;
        } else {
            listItem.textContent = "None";
        }

        leaderboard.appendChild(listItem);
    }
}

function resetLeaderboard() {
    localStorage.removeItem("scrambleLeaderboard");
    loadLeaderboard();
    message.textContent = "Top scores reset.";
}