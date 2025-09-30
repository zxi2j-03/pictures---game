document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const startBtn = document.getElementById("startBtn");
  const statusEl = document.getElementById("status");
  const scoreLabel = document.getElementById("scoreLabel");
  const timerLabel = document.getElementById("timerLabel");
  const playerLabel = document.getElementById("playerLabel");

  const endScreen = document.getElementById("endScreen");
  const endTitle = document.getElementById("endTitle");
  const endSummary = document.getElementById("endSummary");
  const restartBtn = document.getElementById("restartBtn");
  const hud = document.getElementById("hud");
  const container = document.getElementById("container");
  const branding = document.getElementById("branding");

  const emojis = ["🐱", "🍕", "🚀", "🎈", "🐶", "🌸", "🦄", "🍩", "🎮", "🐼", "🍉", "🧸", "🦋", "🍔", "🐧"];
  const pastelColors = ["#FADADD", "#D0E8F2", "#FFFACD", "#E6DAF8", "#D4F8D4"];

  let showing = [];
  let scoreP1 = 0;
  let scoreP2 = 0;
  let totalScoreP1 = 0;
  let totalScoreP2 = 0;
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
    }, 1000);
  }

  function handleChoice(btn, symbol) {
    if (!isChallengePhase || btn.classList.contains("correct") || btn.classList.contains("wrong")) return;
    if (attemptsUsed >= maxAttempts) return;

    attemptsUsed++;

    if (showing.includes(symbol)) {
      btn.classList.add("correct");
      correctCount++;
      if (gameMode === "duo") {
        currentPlayer === 1 ? scoreP1++ : scoreP2++;
        currentPlayer === 1 ? totalScoreP1++ : totalScoreP2++;
      } else {
        scoreP1++;
        totalScoreP1++;
      }
    } else {
      btn.classList.add("wrong");
      wrongCount++;
    }

    updateLabels();

    if (attemptsUsed === maxAttempts) {
      clearInterval(timer);
      endRound();
    }
  }

  function endRound() {
    isChallengePhase = false;

    const result = correctCount > wrongCount
      ? "🎉 ممتاز! لقد فزت بالجولة!"
      : "❌ للأسف، خسرت الجولة!";
    statusEl.textContent = result;

    endTitle.textContent = result;
    endSummary.textContent = `✅ صحيحة: ${correctCount} — ❌ خاطئة: ${wrongCount}`;
    container.classList.add("hidden");
    hud.classList.add("hidden");
    branding.classList.add("hidden");
    endScreen.classList.remove("hidden");

    if (gameMode === "duo") {
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      scoreP1 = 0;
      scoreP2 = 0;
      updateLabels();
    }
  }

  startBtn.addEventListener("click", () => {
    startRound();
  });

  restartBtn.addEventListener("click", () => {
    endScreen.classList.add("hidden");
    container.classList.remove("hidden");
    hud.classList.remove("hidden");
    branding.classList.remove("hidden");
    startRound();
  });
});
