// ===== DUCK HUNT =====
let duckGame;

function initDuck() {
  duckGame = {
    duck: { y: 200, velocity: 0, radius: 15 },
    pipes: [],
    score: 0,
    gameOver: false,
    gravity: 0.3,
    jump: -6,
    pipeSpeed: 1.5,
    pipeGap: 180,
    frameCount: 0
  };
  
  // Upewnij się że jest tylko jeden interval
  if (gameStateManager.currentGameLoop) {
    clearInterval(gameStateManager.currentGameLoop);
  }
  
  gameStateManager.currentGameLoop = setInterval(() => {
    if (duckGame && !duckGame.gameOver) {
      updateDuck();
      drawDuck();
    }
  }, 1000 / 60);
}

function updateDuck() {
  duckGame.frameCount++;
  
  duckGame.duck.velocity += duckGame.gravity;
  duckGame.duck.y += duckGame.duck.velocity;
  
  if (duckGame.duck.velocity > 8) {
    duckGame.duck.velocity = 8;
  }
  
  if (duckGame.duck.y + duckGame.duck.radius > 400 || duckGame.duck.y - duckGame.duck.radius < 0) {
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
  
  duckGame.pipes.forEach((pipe, index) => {
    pipe.x -= duckGame.pipeSpeed;
    
    if (pipe.x + 50 < 0) {
      duckGame.pipes.splice(index, 1);
    }
    
    if (!pipe.scored && pipe.x + 50 < 100) {
      duckGame.score++;
      pipe.scored = true;
    }
    
    if (
      100 > pipe.x && 100 < pipe.x + 50 &&
      (duckGame.duck.y - duckGame.duck.radius < pipe.y ||
       duckGame.duck.y + duckGame.duck.radius > pipe.y + duckGame.pipeGap)
    ) {
      duckGame.gameOver = true;
      achievementsManager.checkAchievements('duck', duckGame.score);
      levelSystem.addXP(duckGame.score * 5);
      dailyChallengeSystem.updateProgress('duck', duckGame.score);
      soundSystem.play('gameOver');
    }
  });
  
  const scoreEl = document.getElementById('duckScore');
  if (scoreEl) scoreEl.textContent = `Wynik: ${duckGame.score}`;
}

function drawDuck() {
  const canvas = document.getElementById('duckCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, '#87CEEB');
  gradient.addColorStop(1, '#E0F6FF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 400);
  
  // Rury
  duckGame.pipes.forEach(pipe => {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(pipe.x, 0, 50, pipe.y);
    ctx.fillRect(pipe.x, pipe.y + duckGame.pipeGap, 50, 400 - pipe.y - duckGame.pipeGap);
    
    ctx.fillStyle = '#008800';
    ctx.fillRect(pipe.x - 5, pipe.y - 20, 60, 20);
    ctx.fillRect(pipe.x - 5, pipe.y + duckGame.pipeGap, 60, 20);
  });
  
  // KACZKA
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
  
  // Skrzydło
  ctx.fillStyle = '#DAA520';
  ctx.beginPath();
  ctx.ellipse(dx - 3, dy + 3, 8, 5, -0.3, 0, Math.PI * 2);
  ctx.fill();
  
  if (duckGame.gameOver) {
    // Ciemne tło
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, 400, 400);
    
    // Tekst GAME OVER
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', 200, 180);
    
    // Wynik
    ctx.font = '25px Arial';
    ctx.fillText(`Wynik: ${duckGame.score}`, 200, 220);
  }
}

function resetDuck() {
  // Zatrzymaj starą grę
  if (gameStateManager.currentGameLoop) {
    clearInterval(gameStateManager.currentGameLoop);
    gameStateManager.currentGameLoop = null;
  }
  
  // Wyczyść input
  inputHandler.clearAll();
  
  // Resetuj stan gry
  gameStateManager.currentGame = null;
  
  // Poczekaj chwilę i rozpocznij nową grę
  setTimeout(() => {
    initDuck();
    gameStateManager.currentGame = 'duck';
  }, 50);
}

// Usuwamy obsługę kliknięć na ekranie Game Over (bo nie ma już przycisków)