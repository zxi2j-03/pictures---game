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
      const pick =
