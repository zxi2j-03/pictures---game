document.addEventListener("DOMContentLoaded", () => {
  // عناصر DOM
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
  const hud = document.getElementById("hud");
  const container = document.getElementById("container");
  const branding = document.getElementById("branding");

  // بيانات
  const emojis = ["🐱","🍕","🚀","🎈","🐶","🌸","🦄","🍩","🎮","🐼","🍉","🧸","🦋","🍔","🐧"];
  const pastelColors = ["#FADADD", "#D0E8F2", "#FFFACD", "#E6DAF8", "#D4F8D4"]; // وردي/أزرق/أصفر/بنفسجي/أخضر

  // حالة اللعبة
  let showing = [];
  let scoreP1 = 0;
  let scoreP2 = 0;
  let currentPlayer = 1;
  let gameMode = "solo";
  let difficulty = "easy";
  let timer = null;
  let timeLeft = 0;
  let inRound = false;        // لمنع بدء جولة أثناء أخرى
  let isChallengePhase = false;

  let maxAttempts = 0;
  let attemptsUsed = 0;
  let correctCount = 0;
  let wrongCount = 0;

  // وظائف مساعدة
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

  function clearTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // تدفق الجولة
  function startRound() {
    if (inRound) return; // حماية
    inRound = true;
    startBtn.disabled = true;

    gameMode = document.querySelector('input[name="mode"]:checked').value;
    difficulty = document.querySelector('input[name="difficulty"]:checked').value;

    updateLabels();
    setRandomBackground();

    const count = difficulty === "easy" ? 6 : (difficulty === "medium" ? 9 : 12);
    maxAttempts = count;
    attemptsUsed = 0;
    correctCount = 0;
    wrongCount = 0;

    // اختيار الرموز
    const pool = [...emojis];
    showing = [];
    while (showing.length < count && pool.length > 0) {
      const pick = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      showing.push(pick);
    }

    // عرض الرموز
    grid.innerHTML = "";
    showing.forEach(sym => {
      const btn = document.createElement("button");
      btn.textContent = sym;
      btn.type = "button";
      grid.appendChild(btn);
    });

    statusEl.textContent = "👀 تذكر الرموز الظاهرة...";
    isChallengePhase = false;

    // مؤقت العرض: 5 ثوانٍ
    timeLeft = 5;
    timerLabel.textContent = timeLeft;
    clearTimer();
    timer = setInterval(() => {
      timeLeft--;
      timerLabel.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearTimer();
        showChallenge();
      }
    }, 1000);
  }

  function showChallenge() {
    statusEl.textContent = "🧠 اختر الرموز التي ظهرت!";
    isChallengePhase = true;

    // بناء مجموعة التحدي (الرموز الصحيحة + 3 تشتيت على الأقل إن أمكن)
    const challengeSet = [...showing];
    while (challengeSet.length < showing.length + 3 && challengeSet.length < emojis.length) {
      const extra = emojis[Math.floor(Math.random() * emojis.length)];
      if (!challengeSet.includes(extra)) challengeSet.push(extra);
    }
    // ترتيب عشوائي
    challengeSet.sort(() => Math.random() - 0.5);

    // رسم الشبكة للتحدي
    grid.innerHTML = "";
    challengeSet.forEach(sym => {
      const btn = document.createElement("button");
      btn.textContent = sym;
      btn.type = "button";
      btn.addEventListener("click", () => handleChoice(btn, sym));
      grid.appendChild(btn);
    });

    // مؤقت التحدي: 15 ثانية
    timeLeft = 15;
    timerLabel.textContent = timeLeft;
    clearTimer();
    timer = setInterval(() => {
      timeLeft--;
      timerLabel.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearTimer();
        endRound();
      }
    }, 1000);
  }

  function handleChoice(btn, symbol) {
    if (!isChallengePhase) return;
    if (btn.classList.contains("correct") || btn.classList.contains("wrong")) return;
    if (attemptsUsed >= maxAttempts) return;

    attemptsUsed++;

    if (showing.includes(symbol)) {
      btn.classList.add("correct");
      correctCount++;
      // النقاط حسب اللاعب
      if (gameMode === "duo") {
        if (currentPlayer === 1) scoreP1++; else scoreP2++;
      } else {
        scoreP1++;
      }
    } else {
      btn.classList.add("wrong");
      wrongCount++;
    }

    updateLabels();

    // إذا انتهت المحاولات، ننهي الجولة فورًا
    if (attemptsUsed >= maxAttempts) {
      clearTimer();
      endRound();
    }
  }

  function endRound() {
    isChallengePhase = false;

    const isWin = correctCount > wrongCount;
    const resultText = isWin ? "🎉 ممتاز! لقد فزت بالجولة!" : "❌ للأسف، خسرت الجولة!";
    statusEl.textContent = resultText;

    // شاشة النهاية
    endTitle.textContent = resultText;
    const playerText = gameMode === "duo" ? `اللاعبة ${currentPlayer}` : "فردي";
    endSummary.textContent = `✅ صحيحة: ${correctCount} — ❌ خاطئة: ${wrongCount} — 👤 ${playerText}`;
    endScreen.classList.remove("hidden");

    // تبديل الدور للجولة التالية في الثنائي
    if (gameMode === "duo") {
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      updateLabels();
    }

    // إنهاء الجولة
    inRound = false;
    startBtn.disabled = false;
  }

  // أحداث الواجهة
  enterBtn.addEventListener("click", () => {
    // إخفاء شاشة البداية وإظهار اللعبة
    startScreen.classList.add("hidden");
    hud.classList.remove("hidden");
    container.classList.remove("hidden");
    branding.classList.remove("hidden");
  });

  startBtn.addEventListener("click", () => {
    // لا تبدأ جولة جديدة إذا شاشة النهاية مفتوحة
    if (!endScreen.classList.contains("hidden")) return;
    startRound();
  });

  restartBtn.addEventListener("click", () => {
    endScreen.classList.add("hidden");
    startRound();
  });
});
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

