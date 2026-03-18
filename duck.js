const duckLevels = [
  { 
    name: 'Spokojny Staw', requiredScore: 5, pipeSpeed: 1.5, pipeGap: 180, 
    gravity: 0.25, jump: -5.5, background: ['#87CEEB', '#E0F6FF'], 
    unlockMessage: 'Dobre rozpoczęcie!' 
  },
  { 
    name: 'Wietrzna Łąka', requiredScore: 10, pipeSpeed: 2.0, pipeGap: 160, 
    gravity: 0.3, jump: -6.0, background: ['#4A90E2', '#87CEEB'], 
    unlockMessage: 'Coraz lepiej!' 
  },
  { 
    name: 'Mroczny Las', requiredScore: 15, pipeSpeed: 2.5, pipeGap: 150, 
    gravity: 0.35, jump: -6.5, background: ['#2C3E50', '#4CA1AF'], 
    unlockMessage: 'Jesteś ekspertem!' 
  },
  { 
    name: 'Burzowe Niebo', requiredScore: 20, pipeSpeed: 3.0, pipeGap: 140, 
    gravity: 0.4, jump: -7.0, background: ['#141E30', '#243B55'], 
    unlockMessage: 'Niesamowity refleks!' 
  },
  { 
    name: 'Kosmiczny Lot', requiredScore: 25, pipeSpeed: 3.5, pipeGap: 130, 
    gravity: 0.45, jump: -7.5, background: ['#000000', '#434343'], 
    unlockMessage: 'Mistrz Świata!' 
  }
];

// ===== DUCK HUNT =====
let duckGame = null;

function initDuck() {
  console.log("🟢 INIT DUCK - Start");
  
  if (gameStateManager.currentGameLoop) {
    clearInterval(gameStateManager.currentGameLoop);
    gameStateManager.currentGameLoop = null;
  }
  
  let currentLevel = localStorage.getItem('duckCurrentLevel') || 1;
  currentLevel = parseInt(currentLevel);
  
  let unlockedLevels = JSON.parse(localStorage.getItem('duckUnlockedLevels') || '[1]');
  
  if (currentLevel > Math.max(...unlockedLevels)) {
    currentLevel = Math.max(...unlockedLevels);
  }
  
  const level = duckLevels[currentLevel - 1];
  
  duckGame = {
    duck: { y: 200, velocity: 0, radius: 15 },
    pipes: [],
    score: 0,
    gameOver: false,
    levelComplete: false,
    gravity: level.gravity,
    jump: level.jump,
    pipeSpeed: level.pipeSpeed,
    pipeGap: level.pipeGap,
    frameCount: 0,
    currentLevel: currentLevel,
    levelConfig: level,
    requiredScore: level.requiredScore,
    unlockedLevels: unlockedLevels,
    isStarting: true
  };
  
  gameStateManager.currentGame = 'duck';
  
  gameStateManager.currentGameLoop = setInterval(() => {
    if (duckGame && !duckGame.gameOver && !duckGame.levelComplete) {
      updateDuck();
      drawDuck();
    }
  }, 1000 / 60);
  
  // Aktualizuj nowoczesny HUD
  updateDuckHUD();
  
  // Dodaj przyciski
  setTimeout(addDuckLevelButton, 100);
}

function updateDuckHUD() {
  const levelEl = document.getElementById('duckHudLevel');
  const scoreEl = document.getElementById('duckHudScore');
  const progressEl = document.getElementById('duckHudProgress');
  
  if (levelEl && duckGame) {
    levelEl.textContent = `POZIOM ${duckGame.currentLevel}: ${duckGame.levelConfig.name}`;
  }
  if (scoreEl && duckGame) {
    scoreEl.textContent = `${duckGame.score}/${duckGame.requiredScore}`;
  }
  if (progressEl && duckGame) {
    const progress = Math.min(duckGame.score / duckGame.requiredScore, 1) * 100;
    progressEl.style.width = `${progress}%`;
  }
}

function updateDuck() {
  if (!duckGame || duckGame.gameOver || duckGame.levelComplete) return;
  
  duckGame.frameCount++;
  
  if (duckGame.frameCount <= 120) {
    duckGame.isStarting = true;
    updateDuckHUD();
    return;
  } else {
    duckGame.isStarting = false;
  }
  
  duckGame.duck.velocity += duckGame.gravity;
  duckGame.duck.y += duckGame.duck.velocity;
  
  if (duckGame.duck.velocity > 8) {
    duckGame.duck.velocity = 8;
  }
  
  if (duckGame.duck.y + duckGame.duck.radius > 400 || duckGame.duck.y - duckGame.duck.radius < 0) {
    if (!duckGame.gameOver) {
       createFeathers(duckGame.duck.x || 100, duckGame.duck.y);
       duckGame.duck.velocity = -5; // lekko odbij przy upadku
    }
    duckGame.gameOver = true;
    achievementsManager.checkAchievements('duck', duckGame.score);
    levelSystem.addXP(duckGame.score * 5);
    dailyChallengeSystem.updateProgress('duck', duckGame.score);
    soundSystem.play('gameOver');
    return;
  }
  
  if (duckGame.frameCount % 120 === 0) {
    const pipeY = Math.random() * (400 - duckGame.pipeGap - 100) + 50;
    duckGame.pipes.push({
      x: 400,
      y: pipeY,
      scored: false
    });
  }
  
  for (let i = duckGame.pipes.length - 1; i >= 0; i--) {
    const pipe = duckGame.pipes[i];
    pipe.x -= duckGame.pipeSpeed;
    
    if (pipe.x + 50 < 0) {
      duckGame.pipes.splice(i, 1);
      continue;
    }
    
    if (!pipe.scored && pipe.x + 50 < 100) {
      duckGame.score++;
      pipe.scored = true;
      if (soundSystem.enabled) soundSystem.play('collect');
      
      if (duckGame.score >= duckGame.requiredScore) {
        completeDuckLevel();
      }
    }
    
    if (
      100 > pipe.x && 100 < pipe.x + 50 &&
      (duckGame.duck.y - duckGame.duck.radius < pipe.y ||
       duckGame.duck.y + duckGame.duck.radius > pipe.y + duckGame.pipeGap)
    ) {
      if (!duckGame.gameOver) {
         createFeathers(100, duckGame.duck.y);
         duckGame.duck.velocity = -4; // odbicie do tyłu wizualne
      }
      duckGame.gameOver = true;
      achievementsManager.checkAchievements('duck', duckGame.score);
      levelSystem.addXP(duckGame.score * 5);
      dailyChallengeSystem.updateProgress('duck', duckGame.score);
      if (soundSystem.enabled) soundSystem.play('gameOver');
      break;
    }
  }
  
  // Aktualizuj nowy HUD
  updateDuckHUD();
}

function createFeathers(x, y) {
  // Simple particle system simulation on canvas
  duckGame.particles = duckGame.particles || [];
  for (let i = 0; i < 15; i++) {
    duckGame.particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 1.0,
      color: Math.random() > 0.5 ? '#FFD700' : '#FFF'
    });
  }
}

function completeDuckLevel() {
  duckGame.levelComplete = true;
  
  const xpEarned = duckGame.currentLevel * 50 + duckGame.score * 2;
  levelSystem.addXP(xpEarned);
  
  const coinsEarned = duckGame.currentLevel * 20 + duckGame.score;
  levelRewardsSystem.addCoins(coinsEarned);
  
  let unlockedLevels = duckGame.unlockedLevels;
  const nextLevel = duckGame.currentLevel + 1;
  
  if (nextLevel <= duckLevels.length && !unlockedLevels.includes(nextLevel)) {
    unlockedLevels.push(nextLevel);
    localStorage.setItem('duckUnlockedLevels', JSON.stringify(unlockedLevels));
    showNotification(`🎉 ${duckGame.levelConfig.unlockMessage} Odblokowano poziom ${nextLevel}!`);
  }
  
  localStorage.setItem('duckLastPlayedLevel', duckGame.currentLevel);
  
  if (soundSystem.enabled) soundSystem.play('achievement');
}

function drawDuck() {
  const canvas = document.getElementById('duckCanvas');
  if (!canvas || !duckGame) return;
  
  const ctx = canvas.getContext('2d');
  
  // Tło z gradientem
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, duckGame.levelConfig.background[0]);
  gradient.addColorStop(1, duckGame.levelConfig.background[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 400);
  
  // Rury
  duckGame.pipes.forEach(pipe => {
    ctx.fillStyle = duckGame.levelConfig.pipesColor || '#00ff00';
    ctx.fillRect(pipe.x, 0, 50, pipe.y);
    ctx.fillRect(pipe.x, pipe.y + duckGame.pipeGap, 50, 400 - pipe.y - duckGame.pipeGap);
    
    // Krawędzie rur
    ctx.fillStyle = '#008800';
    ctx.fillRect(pipe.x - 5, pipe.y - 20, 60, 20);
    ctx.fillRect(pipe.x - 5, pipe.y + duckGame.pipeGap, 60, 20);
  });
  
  // KACZKA (identycznie jak w oryginale)
  const dx = 100;
  const dy = duckGame.duck.y;
  
  // Ciało kaczki (żółte)
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.ellipse(dx, dy, 16, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Głowa kaczki
  ctx.beginPath();
  ctx.arc(dx + 12, dy - 5, 10, 0, Math.PI * 2);
  ctx.fill();
  
  // Dziób (pomarańczowy)
  ctx.fillStyle = '#FF8C00';
  ctx.beginPath();
  ctx.moveTo(dx + 20, dy - 5);
  ctx.lineTo(dx + 28, dy - 3);
  ctx.lineTo(dx + 20, dy - 1);
  ctx.fill();
  
  // Oko
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(dx + 15, dy - 7, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Skrzydło (animowane zależnie od prędkości)
  ctx.fillStyle = '#DAA520';
  ctx.beginPath();
  let wingAngle = duckGame.duck.velocity < 0 ? 0.5 : -0.3; // Macha w dół gdy leci w górę
  ctx.ellipse(dx - 3, dy + 3, 8, 5, wingAngle, 0, Math.PI * 2);
  ctx.fill();
  
  // Rysuj cząsteczki (pióra)
  if (duckGame.particles) {
    for (let i = duckGame.particles.length - 1; i >= 0; i--) {
      let p = duckGame.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.5; // grawitacja dla piór
      p.life -= 0.02;
      
      if (p.life <= 0) {
        duckGame.particles.splice(i, 1);
      } else {
        ctx.fillStyle = `rgba(${p.color === '#FFF' ? '255,255,255' : '255,215,0'}, ${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  
  // Game Over (identycznie jak w oryginale)
  if (duckGame.gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, 400, 400);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', 200, 180);
    
    ctx.font = '25px Arial';
    ctx.fillText(`Poziom ${duckGame.currentLevel}`, 200, 220);
    ctx.fillText(`Wynik: ${duckGame.score}`, 200, 260);
  }
  
  // Start Delay Countdown
  if (duckGame.isStarting) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, 400, 400);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    let timeLeft = Math.ceil((120 - duckGame.frameCount) / 60);
    ctx.fillText(timeLeft > 0 ? timeLeft : 'GO!', 200, 210);
  }
  
  // Level Complete screen
  if (duckGame.levelComplete) {
    ctx.fillStyle = 'rgba(0, 100, 0, 0.85)';
    ctx.fillRect(0, 0, 400, 400);
    
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 POZIOM UKOŃCZONY!', 200, 100);
    
    ctx.fillStyle = '#fff';
    ctx.font = '22px Arial';
    ctx.fillText(`Poziom ${duckGame.currentLevel}: ${duckGame.levelConfig.name}`, 200, 140);
    
    const nextLevel = duckGame.currentLevel + 1;
    const hasNextLevel = nextLevel <= duckLevels.length;
    
    if (hasNextLevel) {
      // Przycisk Następny Poziom
      ctx.fillStyle = '#0070f3';
      ctx.fillRect(100, 180, 200, 45);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`POZIOM ${nextLevel}`, 200, 210);
    }
    
    // Przycisk Wybór Poziomu
    ctx.fillStyle = '#FF8C00';
    ctx.fillRect(100, 240, 200, 45);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('WYBÓR POZIOMU', 200, 270);
  }
}

function resetDuck() {
  console.log("🔄 RESET DUCK");
  
  if (gameStateManager.currentGameLoop) {
    clearInterval(gameStateManager.currentGameLoop);
    gameStateManager.currentGameLoop = null;
  }
  
  inputHandler.clearAll();
  gameStateManager.currentGame = null;
  
  setTimeout(() => {
    initDuck();
  }, 100);
}

function startDuckLevel(level) {
  console.log("🚀 START DUCK LEVEL", level);
  localStorage.setItem('duckCurrentLevel', level);
  closeModal('duckLevelModal');
  resetDuck();
}

function openDuckLevelSelect() {
  console.log("📖 OPEN DUCK LEVEL SELECT");
  
  if (!document.getElementById('duckLevelModal')) {
    const modal = document.createElement('div');
    modal.id = 'duckLevelModal';
    modal.className = 'modal hidden';
    modal.innerHTML = `
      <div class="modal-backdrop" onclick="closeModal('duckLevelModal')"></div>
      <div class="modal-box" style="max-width: 800px;">
        <div class="modal-header">
          <h2>🦆 Wybierz Poziom Duck Hunt</h2>
          <button class="modal-close" onclick="closeModal('duckLevelModal')">✕</button>
        </div>
        <div class="modal-body">
          <div id="duckLevelContent"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  const unlockedLevels = JSON.parse(localStorage.getItem('duckUnlockedLevels') || '[1]');
  const currentLevel = parseInt(localStorage.getItem('duckCurrentLevel') || '1');
  
  let html = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h3 style="color: var(--accent-primary);">Odblokowano: ${unlockedLevels.length}/${duckLevels.length} poziomów</h3>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
  `;
  
  duckLevels.forEach((level, index) => {
    const levelNum = index + 1;
    const isUnlocked = unlockedLevels.includes(levelNum);
    const isCurrent = currentLevel === levelNum;
    
    html += `
      <div class="difficulty-btn" style="background: ${isUnlocked ? 'var(--bg-tertiary)' : 'var(--bg-primary)'}; 
            border: 2px solid ${isCurrent ? 'var(--accent-primary)' : (isUnlocked ? '#444' : '#666')}; 
            opacity: ${isUnlocked ? '1' : '0.6'}; cursor: ${isUnlocked ? 'pointer' : 'not-allowed'};
            padding: 20px; border-radius: 12px; text-align: center;">
        <div style="font-size: 32px; font-weight: bold; color: ${isUnlocked ? 'var(--accent-primary)' : '#666'}; margin-bottom: 10px;">
          ${levelNum}
        </div>
        <h3 style="margin: 0 0 10px 0; color: ${isUnlocked ? 'var(--text-primary)' : '#666'};">${level.name}</h3>
        <div style="margin-top: 15px;">
          ${isUnlocked ? 
            `<button onclick="startDuckLevel(${levelNum})" 
              style="padding: 10px 24px; background: ${isCurrent ? 'var(--accent-primary)' : 'var(--success)'}; 
              color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: bold; font-size: 16px;">
              ${isCurrent ? 'KONTYNUUJ' : 'GRAJ'}
            </button>` : 
            '<div style="font-size: 30px; opacity: 0.5;">🔒</div>'
          }
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  
  const content = document.getElementById('duckLevelContent');
  if (content) {
    content.innerHTML = html;
  }
  
  const modal = document.getElementById('duckLevelModal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function addDuckLevelButton() {
  const gameScreen = document.getElementById('duckGame');
  if (!gameScreen) return;
  
  const gameActions = gameScreen.querySelector('.game-actions');
  if (!gameActions) return;
  
  // Usuń stary przycisk
  const oldBtn = document.getElementById('duckLevelSelectBtn');
  if (oldBtn && oldBtn.parentNode) {
    oldBtn.parentNode.removeChild(oldBtn);
  }
  
  // Dodaj nowy
  const levelBtn = document.createElement('button');
  levelBtn.id = 'duckLevelSelectBtn';
  levelBtn.className = 'action-btn secondary';
  levelBtn.innerHTML = '🎮 Wybierz Poziom';
  levelBtn.onclick = openDuckLevelSelect;
  
  const menuBtn = gameScreen.querySelector('.back-to-menu');
  if (menuBtn) {
    gameActions.insertBefore(levelBtn, menuBtn);
  } else {
    gameActions.appendChild(levelBtn);
  }
  
  console.log("✅ Dodano przycisk wyboru poziomu Duck");
}

// Inicjalizacja
document.addEventListener('DOMContentLoaded', function() {
  if (!document.getElementById('duckLevelModal')) {
    const modal = document.createElement('div');
    modal.id = 'duckLevelModal';
    modal.className = 'modal hidden';
    modal.innerHTML = `
      <div class="modal-backdrop" onclick="closeModal('duckLevelModal')"></div>
      <div class="modal-box" style="max-width: 800px;">
        <div class="modal-header">
          <h2>🦆 Wybierz Poziom Duck Hunt</h2>
          <button class="modal-close" onclick="closeModal('duckLevelModal')">✕</button>
        </div>
        <div class="modal-body">
          <div id="duckLevelContent"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  setTimeout(addDuckLevelButton, 500);
});

// Obsługa kliknięć na ekranie Level Complete
document.addEventListener('click', function(e) {
  if (gameStateManager.currentGame === 'duck' && duckGame && duckGame.levelComplete) {
    const canvas = document.getElementById('duckCanvas');
    if (canvas && e.target === canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const nextLevel = duckGame.currentLevel + 1;
      const hasNextLevel = nextLevel <= duckLevels.length;
      
      if (hasNextLevel && x >= 100 && x <= 300 && y >= 180 && y <= 225) {
        startDuckLevel(nextLevel);
      }
      else if (x >= 100 && x <= 300 && y >= 240 && y <= 285) {
        openDuckLevelSelect();
      }
    }
  }
});

// Obsługa skoku - kliknięcie na canvas
document.addEventListener('click', function(e) {
  if (gameStateManager.currentGame === 'duck' && duckGame && !duckGame.gameOver && !duckGame.levelComplete && !duckGame.isStarting) {
    const canvas = document.getElementById('duckCanvas');
    if (canvas && e.target === canvas) {
      duckGame.duck.velocity = duckGame.jump;
      if (soundSystem.enabled) soundSystem.play('jump');
    }
  }
});

// Obsługa skoku - klawiatura (dodaj do javascript.js w keydown)
// W javascript.js w eventListener keydown dodaj:
// } else if (gameStateManager.currentGame === 'duck' && duckGame && !duckGame.gameOver && !duckGame.levelComplete) {
//   if (key === 'space' || key === 'w' || key === 'up') {
//     duckGame.duck.velocity = duckGame.jump;
//     soundSystem.play('jump');
//   }
// }