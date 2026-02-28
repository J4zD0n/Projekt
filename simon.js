// ===== SIMON SAYS GAME =====
let simonGame;

const simonLevels = Array.from({length: 20}, (_, i) => ({
  level: i + 1,
  speed: Math.max(150, 800 - i * 35)
}));

function initSimon() {
  simonGame = {
    sequence: [],
    playerSequence: [],
    level: 1,
    playing: false,
    canPlay: false,
    gameOver: false
  };
  
  const startBtn = document.getElementById('simonStart');
  if (startBtn) {
    startBtn.onclick = startSimon;
    startBtn.textContent = 'Start';
  }
  
  document.querySelectorAll('.simon-btn').forEach(btn => {
    btn.onclick = () => {
      if (simonGame.canPlay && !simonGame.gameOver) {
        const color = parseInt(btn.dataset.color);
        playColor(color);
        simonGame.playerSequence.push(color);
        checkSimonSequence();
      }
    };
  });
  
  updateSimonScore();
}

function startSimon() {
  simonGame = {
    sequence: [],
    playerSequence: [],
    level: 1,
    playing: true,
    canPlay: false,
    gameOver: false
  };
  
  const startBtn = document.getElementById('simonStart');
  if (startBtn) startBtn.textContent = 'Gra...';
  
  updateSimonScore();
  nextSimonRound();
}

function nextSimonRound() {
  if (simonGame.gameOver) return;
  
  simonGame.playerSequence = [];
  simonGame.sequence.push(Math.floor(Math.random() * 4));
  simonGame.canPlay = false;
  
  const currentLevel = simonLevels[Math.min(simonGame.level - 1, simonLevels.length - 1)];
  
  updateSimonScore();
  
  setTimeout(() => {
    playSequence(currentLevel.speed);
  }, 500);
}

function playSequence(speed) {
  let i = 0;
  const interval = setInterval(() => {
    if (i < simonGame.sequence.length) {
      playColor(simonGame.sequence[i]);
      i++;
    } else {
      clearInterval(interval);
      simonGame.canPlay = true;
    }
  }, speed);
}

function playColor(color) {
  const btn = document.querySelector(`[data-color="${color}"]`);
  if (!btn) return;
  
  btn.classList.add('active');
  setTimeout(() => btn.classList.remove('active'), 300);
}

function checkSimonSequence() {
  const currentIndex = simonGame.playerSequence.length - 1;
  
  if (simonGame.playerSequence[currentIndex] !== simonGame.sequence[currentIndex]) {
    simonGame.gameOver = true;
    simonGame.canPlay = false;
    
    achievementsManager.checkAchievements('simon', simonGame.level);
    levelSystem.addXP(simonGame.level * 10);
    dailyChallengeSystem.updateProgress('simon', simonGame.level);
    soundSystem.play('gameOver');
    showNotification(`❌ Koniec! Poziom: ${simonGame.level}`);
    
    const startBtn = document.getElementById('simonStart');
    if (startBtn) startBtn.textContent = 'Restart';
    
    return;
  }
  
  if (simonGame.playerSequence.length === simonGame.sequence.length) {
    showNotification(`✅ Poziom ${simonGame.level}!`);
    simonGame.level++;
    setTimeout(nextSimonRound, 1000);
  }
}

function updateSimonScore() {
  const best = achievementsManager.progress.simonBest || 0;
  const scoreEl = document.getElementById('simonScore');
  
  if (scoreEl) {
    scoreEl.textContent = `Poziom: ${simonGame.level} | Sekwencja: ${simonGame.sequence.length} | Rekord: ${best}`;
  }
}