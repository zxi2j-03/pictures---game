document.addEventListener("DOMContentLoaded", () => {
  const enterBtn = document.getElementById("enterBtn");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");

  const startScreen = document.getElementById("startScreen");
  const hud = document.getElementById("hud");
  const container = document.getElementById("container");
  const branding = document.getElementById("branding");
  const endScreen = document.getElementById("endScreen");

  const grid = document.getElementById("grid");
  const statusEl = document.getElementById("status");
  const scoreLabel = document.getElementById("scoreLabel");
  const timerLabel = document.getElementById("timerLabel");
  const playerLabel = document.getElementById("playerLabel");
  const endTitle = document.getElementById("endTitle");
  const endSummary = document.getElementById("endSummary");

  const emojis = ["🐱", "🍕", "🚀", "🎈", "🐶", "🌸", "🦄", "🍩", "🎮", "🐼", "🍉", "🧸", "🦋", "🍔", "🐧"];
  const pastelColors = ["#FADADD", "#D0E8F2", "#FFFACD", "#E6DAF8", "#D4F8D4"];

  let showing = [];
  let scoreP1 = 0, scoreP2 = 0;
  let totalScoreP1 = 0, totalScoreP2 = 0;
  let currentPlayer = 1;
  let gameMode = "solo", difficulty = "easy";
  let timer, timeLeft = 0;
  let isChallengePhase = false;
  let maxAttempts = 0, attemptsUsed = 0;
  let correctCount = 0, wrongCount = 0;

  enterBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    hud.classList.remove("hidden");
    container.classList.remove("hidden");
    branding.classList.remove("hidden");
  });

  restartBtn.addEventListener("click", () => {
    endScreen.classList.add("hidden");
    container.classList.remove("hidden");
    hud.classList.remove("hidden");
    branding.classList.remove("hidden");
    startRound();
  });

  startBtn.addEventListener("click", () => {
    startRound();
  });

  function setRandomBackground() {
    const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
    document.body.style.background = color;
  }

  function updateLabels() {
    playerLabel.textContent = gameMode === "duo" ? `اللاعبة ${currentPlayer}` : "فردي";
    scoreLabel.textContent = gameMode === "duo"
      ? `${currentPlayer === 1 ? scoreP1 : scoreP2} (الإجمالي: ${currentPlayer === 1 ? totalScoreP1 : totalScoreP2})`
      : `${scoreP1} (الإجمالي: ${totalScoreP1})`;
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

    const challengeSet = [...showing];
    while (challengeSet.length < showing.length + 3) {
      const extra = emojis[Math.floor(Math.random() * emojis.length)];
      if (!challengeSet.includes(extra)) challengeSet.push(extra);
    }

    challengeSet.sort(() => Math.random() - 0.5);

    challengeSet.forEach(sym => {
      const btn = document.createElement("button");
      btn.textContent = sym;
      btn.addEventListener("click", () => handleChoice(btn, sym));
      grid.appendChild(btn);
    });

    timeLeft = 15;
    timerLabel.textContent = timeLeft;
    clearInterval(timer);
    timer = setInterval(() => {
      timeLeft--;
      timerLabel.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timer);
        endRound();
      }
    }, 
