document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const startBtn = document.getElementById("startBtn");
  const enterBtn = document.getElementById("enterBtn");
  const statusEl = document.getElementById("status");
  const scoreLabel = document.getElementById("scoreLabel");
  const timerLabel = document.getElementById("timerLabel");
  const playerLabel = document.getElementById("playerLabel");
  const endScreen = document.getElementById("endScreen");
  const endTitle = document.getElementById("endTitle");
  const endSummary = document.getElementById("endSummary");
  const restartBtn = document.getElementById("restartBtn");

  const startScreen = document.getElementById("startScreen");
  const hud = document.querySelector(".hud");
  const container = document.querySelector(".container");
  const branding = document.getElementById("branding");

  const emojis = ["🐱", "🍕", "🚀", "🎈", "🐶", "🌸", "🦄", "🍩", "🎮", "🐼", "🍉", "🧸", "🦋", "🍔", "🐧"];
  const pastelColors = ["#FADADD", "#D0E8F2", "#FFFACD", "#E6DAF8", "#D4F8D4"];

  let showing = [];
  let scoreP1 = 0;
  let scoreP2 = 0;
  let currentPlayer = 1;
  let gameMode = "solo";
  let difficulty = "easy";
  let timer;
  let timeLeft = 0;
  let isChallengePhase = false;
  let maxAttempts = 0;
  let attemptsUsed = 0;
  let correctCount = 0;
  let wrongCount = 0;

  enterBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    hud.classList.remove("hidden");
    container.classList.remove("hidden");
    branding.classList.remove("hidden");
  });

  function setRandomBackground() {
    const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
    document.body.style.background = color;
  }

  function updateLabels() {
    playerLabel.textContent = gameMode === "duo" ? `اللاعبة ${currentPlayer}` : "فردي";
    scoreLabel.textContent = gameMode === "duo"
      ? (currentPlayer === 1 ? scoreP1 : scoreP2)
      : scoreP1;
  }

  function startRound() {
    gameMode = document.querySelector('input[name="mode"]:checked').value;
    difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    updateLabels();
    setRandomBackground();

    let count = difficulty === "easy" ? 6 : difficulty === "medium" ? 9 : 12;
    maxAttempts = count;
    attemptsUsed = 0;
    correctCount = 0;
    wrongCount = 0;

    const pool = [...emojis];
    showing = [];
    while (showing.length < count) {
      const pick = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      showing.push(pick);
    }

    grid.innerHTML = "";
    showing.forEach(sym => {
      const btn = document.createElement("button");
      btn.textContent = sym;
      grid.appendChild(btn);
    });

    statusEl.textContent = "👀 تذكر الرموز الظاهرة...";
    isChallengePhase = false;

    timeLeft = 5;
    timerLabel.textContent = timeLeft;
    clearInterval(timer);
    timer = setInterval(() => {
      timeLeft--;
      timerLabel.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timer);
        showChallenge();
      }
    }, 1000);
  }

  function showChallenge() {
    statusEl.textContent = "🧠 اختر الرموز التي ظهرت!";
    isChallengePhase = true;
    grid.innerHTML = "";

