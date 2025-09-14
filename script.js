document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const startBtn = document.getElementById("startBtn");
  const statusEl = document.getElementById("status");
  const scoreLabel = document.getElementById("scoreLabel");
  const timerLabel = document.getElementById("timerLabel");
  const playerLabel = document.getElementById("playerLabel");

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

    timeLeft = Math.floor(Math.random() * 6) + 5;
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

    if (showing.includes(symbol)) {
      btn.classList.add("correct");
      if (gameMode === "duo") {
        currentPlayer === 1 ? scoreP1++ : scoreP2++;
      } else {
        scoreP1++;
      }
    } else {
      btn.classList.add("wrong");
    }

    updateLabels();

    const correctCount = grid.querySelectorAll(".correct").length;
    if (correctCount === showing.length) {
      clearInterval(timer);
      statusEl.textContent = "🎉 ممتاز! لقد فزت بالجولة!";
      isChallengePhase = false;

      if (gameMode === "duo") {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateLabels();
      }
    }
  }

  function endRound() {
    statusEl.textContent = "🎉 الجولة انتهت!";
    isChallengePhase = false;

    if (gameMode === "duo") {
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      updateLabels();
    }
  }

  startBtn.addEventListener("click", () => {
    startRound();
  });
});
