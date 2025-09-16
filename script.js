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

                          
