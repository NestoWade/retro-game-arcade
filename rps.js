let timerCount = 5;
let timerInterval;

let roundNumber = 1;
let playerRounds = 0;
let computerRounds = 0;
let score = 0;

let roundActive = false;
let matchFinished = false;

const initialsInput = document.getElementById("initialsInput");
const timerDisplay = document.getElementById("timer");
const choiceButtons = document.querySelectorAll(".rps-choice");

const startRoundButton = document.getElementById("startRoundButton");
const resetButton = document.getElementById("resetButton");
const resetLeaderboardButton = document.getElementById("resetLeaderboardButton");

const message = document.getElementById("message");

const playerChoiceDisplay = document.getElementById("playerChoice");
const computerChoiceDisplay = document.getElementById("computerChoice");

const playerImage = document.getElementById("playerImage");
const computerImage = document.getElementById("computerImage");

const roundNumberDisplay = document.getElementById("roundNumber");
const playerRoundsDisplay = document.getElementById("playerRounds");
const computerRoundsDisplay = document.getElementById("computerRounds");
const scoreDisplay = document.getElementById("score");

const leaderboard = document.getElementById("leaderboard");

loadLeaderboard();
disableChoiceButtons();

startRoundButton.addEventListener("click", startRound);
resetButton.addEventListener("click", resetGame);
resetLeaderboardButton.addEventListener("click", resetLeaderboard);

choiceButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const playerChoice = button.getAttribute("data-choice");
        playRound(playerChoice);
    });
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

    if (matchFinished) {
        message.textContent = "Match finished. Press Reset Game to play again.";
        return;
    }

    if (roundActive) {
        message.textContent = "Round already started. Choose your hand!";
        return;
    }

    playerChoiceDisplay.textContent = "None";
    computerChoiceDisplay.textContent = "None";

    playerImage.classList.add("hidden");
    computerImage.classList.add("hidden");

    message.textContent = "Choose Rock, Paper, or Scissors before time runs out.";

    enableChoiceButtons();
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);

    timerCount = 5;
    timerDisplay.textContent = timerCount;
    roundActive = true;

    timerInterval = setInterval(function() {
        timerCount--;
        timerDisplay.textContent = timerCount;

        if (timerCount === 0) {
            clearInterval(timerInterval);
            timeOutRound();
        }
    }, 1000);
}

function timeOutRound() {
    if (!roundActive) {
        return;
    }

    roundActive = false;
    disableChoiceButtons();

    const computerChoice = getComputerChoice();

    computerRounds++;
    computerRoundsDisplay.textContent = computerRounds;

    playerChoiceDisplay.textContent = "No Choice";
    computerChoiceDisplay.textContent = capitalize(computerChoice);

    playerImage.classList.add("hidden");
    showChoiceImage(computerImage, computerChoice);

    message.textContent = "Time ran out! Computer wins this round.";
    playGameSound("./sounds/you_lost.wav");

    finishRound();
}

function playRound(playerChoice) {
    const initials = initialsInput.value.trim().toUpperCase();

    if (initials === "") {
        message.textContent = "Enter your initials first.";
        initialsInput.focus();
        return;
    }

    if (!roundActive) {
        message.textContent = "Press Start Round first.";
        return;
    }

    clearInterval(timerInterval);

    roundActive = false;
    disableChoiceButtons();

    const computerChoice = getComputerChoice();
    const result = getRoundResult(playerChoice, computerChoice);

    playerChoiceDisplay.textContent = capitalize(playerChoice);
    computerChoiceDisplay.textContent = capitalize(computerChoice);

    showChoiceImage(playerImage, playerChoice);
    showChoiceImage(computerImage, computerChoice);

    if (result === "win") {
        playerRounds++;
        score += 10;

        playerRoundsDisplay.textContent = playerRounds;
        scoreDisplay.textContent = score;

        message.textContent = "You won this round! +10 points.";
        showWinAnimation();
    } 
    else if (result === "lose") {
        computerRounds++;
        computerRoundsDisplay.textContent = computerRounds;

        message.textContent = "Computer won this round.";
    } 
    else {
        message.textContent = "Draw! No points awarded.";
    }

    finishRound();
}

function finishRound() {
    const initials = initialsInput.value.trim().toUpperCase();

    if (playerRounds === 3) {
        message.textContent = "You won the match! Final score saved.";
        showWinAnimation();
        playGameSound("./sounds/you_won.wav");
        updateLeaderboard(initials, score);
        matchFinished = true;
        startRoundButton.disabled = true;
        return;
    }

    if (computerRounds === 3) {
        message.textContent = "Computer won the match!";
        playGameSound("./sounds/you_lost.wav");
        matchFinished = true;
        startRoundButton.disabled = true;
        return;
    }

    if (roundNumber === 5) {
        if (playerRounds > computerRounds) {
            message.textContent = "You won the match! Final score saved.";
            showWinAnimation();
            playGameSound("./sounds/you_won.wav");
            updateLeaderboard(initials, score);
        } 
        else {
            message.textContent = "Computer won the match!";
            playGameSound("./sounds/you_lost.wav");
        }

        matchFinished = true;
        startRoundButton.disabled = true;
        return;
    }

    roundNumber++;
    roundNumberDisplay.textContent = roundNumber;

    message.textContent += " Press Start Round for the next round.";
}

function getComputerChoice() {
    const choices = ["rock", "paper", "scissors"];
    const randomIndex = Math.floor(Math.random() * choices.length);

    return choices[randomIndex];
}

function getRoundResult(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return "draw";
    }

    if (
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")
    ) {
        return "win";
    }

    return "lose";
}

function showChoiceImage(imageElement, choice) {
    imageElement.src = "images/" + choice + ".png";
    imageElement.classList.remove("hidden");
}

function resetGame() {
    clearInterval(timerInterval);

    timerCount = 5;
    roundNumber = 1;
    playerRounds = 0;
    computerRounds = 0;
    score = 0;
    roundActive = false;
    matchFinished = false;

    timerDisplay.textContent = timerCount;
    roundNumberDisplay.textContent = roundNumber;
    playerRoundsDisplay.textContent = playerRounds;
    computerRoundsDisplay.textContent = computerRounds;
    scoreDisplay.textContent = score;

    playerChoiceDisplay.textContent = "None";
    computerChoiceDisplay.textContent = "None";

    playerImage.classList.add("hidden");
    computerImage.classList.add("hidden");

    message.textContent = "New match started. Press Start Round.";

    startRoundButton.disabled = false;
    disableChoiceButtons();

    loadLeaderboard();
}

function disableChoiceButtons() {
    choiceButtons.forEach(function(button) {
        button.disabled = true;
    });
}

function enableChoiceButtons() {
    choiceButtons.forEach(function(button) {
        button.disabled = false;
    });
}

function updateLeaderboard(initials, newScore) {
    let scores = JSON.parse(localStorage.getItem("rpsLeaderboard")) || [];

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

    localStorage.setItem("rpsLeaderboard", JSON.stringify(scores));

    displayLeaderboard(scores);
}

function loadLeaderboard() {
    let scores = JSON.parse(localStorage.getItem("rpsLeaderboard")) || [];
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

function resetLeaderboard() {
    localStorage.removeItem("rpsLeaderboard");
    loadLeaderboard();
    message.textContent = "Top scores reset.";
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}