let secretNumber = Math.floor(Math.random() * 100) + 1;
let attemptsLeft = 10;
let score = 0;

const initialsInput = document.getElementById("initialsInput");
const guessInput = document.getElementById("guessInput");
const continueButton = document.getElementById("continueButton");
const resetButton = document.getElementById("resetButton");
const resetLeaderboardButton = document.getElementById("resetLeaderboardButton");

const message = document.getElementById("message");
const attemptsLeftDisplay = document.getElementById("attemptsLeft");
const scoreDisplay = document.getElementById("score");
const leaderboard = document.getElementById("leaderboard");

loadLeaderboard();

guessInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        checkGuess();
    }
});

continueButton.addEventListener("click", continueGame);
resetButton.addEventListener("click", resetScore);
resetLeaderboardButton.addEventListener("click", resetLeaderboard);

function playGameSound(filePath) {
    const sound = new Audio(filePath);
    sound.play().catch(function(error) {
        console.log("Sound error:", error);
    });
}

function showWinAnimation() {
    message.classList.remove("win-glow");
    void message.offsetWidth;
    message.classList.add("win-glow");
}

function checkGuess() {
    const initials = initialsInput.value.trim().toUpperCase();
    const userGuess = Number(guessInput.value);

    if (initials === "") {
        message.textContent = "Enter your initials first.";
        initialsInput.focus();
        return;
    }

    if (guessInput.value === "" || userGuess < 1 || userGuess > 100) {
        message.textContent = "Enter a number between 1 and 100.";
        guessInput.focus();
        return;
    }

    if (userGuess === secretNumber) {
        score += 10;
        scoreDisplay.textContent = score;

        playGameSound("./sounds/you_won.wav");

        message.textContent = "Correct! +10 points.";
        showWinAnimation();

        updateLeaderboard(initials, score);

        guessInput.disabled = true;
        return;
    }

    attemptsLeft--;
    attemptsLeftDisplay.textContent = attemptsLeft;

    if (attemptsLeft === 0) {
        message.textContent = "You lost! The number was " + secretNumber;
        playGameSound("./sounds/you_lost.wav");
        guessInput.disabled = true;
    } 
    else if (userGuess > secretNumber) {
        message.textContent = "Too high!";
    } 
    else {
        message.textContent = "Too low!";
    }

    guessInput.value = "";
}

function continueGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attemptsLeft = 10;

    attemptsLeftDisplay.textContent = attemptsLeft;
    message.textContent = "New number. Keep going!";

    guessInput.value = "";
    guessInput.disabled = false;
    guessInput.focus();
}

function resetScore() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attemptsLeft = 10;
    score = 0;

    attemptsLeftDisplay.textContent = attemptsLeft;
    scoreDisplay.textContent = score;

    message.textContent = "Score reset.";

    guessInput.value = "";
    guessInput.disabled = false;
    guessInput.focus();

    loadLeaderboard();
}

function resetLeaderboard() {
    localStorage.removeItem("guessLeaderboard");
    loadLeaderboard();
    message.textContent = "Top scores reset.";
}

function updateLeaderboard(initials, newScore) {
    let scores = JSON.parse(localStorage.getItem("guessLeaderboard")) || [];

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

    localStorage.setItem("guessLeaderboard", JSON.stringify(scores));

    displayLeaderboard(scores);
}

function loadLeaderboard() {
    let scores = JSON.parse(localStorage.getItem("guessLeaderboard")) || [];
    displayLeaderboard(scores);
}

function displayLeaderboard(scores) {
    leaderboard.innerHTML = "";

    for (let i = 0; i < 3; i++) {
        let li = document.createElement("li");

        if (scores[i]) {
            li.textContent = scores[i].initials + " - " + scores[i].score;
        } else {
            li.textContent = "None";
        }

        leaderboard.appendChild(li);
    }
}