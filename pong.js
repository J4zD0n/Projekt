// ===== PONG GAME =====
let pongGame;

function initPong() {
  const difficulty = difficultyConfig.pong[gameStateManager.currentDifficulty];
  
  const badge = document.getElementById('pongDifficulty');
  if (badge) badge.textContent = difficulty.name;
  
  pongGame = {
    ball: { x: 300, y: 150, dx: difficulty.ballSpeed, dy: difficulty.ballSpeed, radius: 8 },
    trail: [],
    shakeAmount: 0,
    player: { y: 110, score: 0, speed: difficulty.playerSpeed },
    ai: { y: 110, score: 0, speed: difficulty.aiSpeed },
    paddleHeight: 80,
    paddleWidth: 15
  };
  
  gameStateManager.currentGameLoop = setInterval(() => {
    updatePong();
    drawPong();
  }, 1000 / 60);
}

function updatePong() {
  if (inputHandler.isPressed('up')) {
    pongGame.player.y = Math.max(0, pongGame.player.y - pongGame.player.speed);
  }
  if (inputHandler.isPressed('down')) {
    pongGame.player.y = Math.min(220, pongGame.player.y + pongGame.player.speed);
  }
  
  // Ślad piłki
  pongGame.trail.push({ x: pongGame.ball.x, y: pongGame.ball.y });
  if (pongGame.trail.length > 8) pongGame.trail.shift();
  
  pongGame.ball.x += pongGame.ball.dx;
  pongGame.ball.y += pongGame.ball.dy;
  
  if (pongGame.ball.y <= 0 || pongGame.ball.y >= 300) {
    pongGame.ball.dy = -pongGame.ball.dy;
  }
  
  if (pongGame.ball.x <= 25 && pongGame.ball.y >= pongGame.player.y && 
      pongGame.ball.y <= pongGame.player.y + 80) {
    // Dynamiczny kąt zależy od miejsca uderzenia paczki (0.5 to środek)
    let hitPoint = (pongGame.ball.y - pongGame.player.y) / 80;
    pongGame.ball.dy = (hitPoint - 0.5) * 10;
    pongGame.ball.dx = Math.abs(pongGame.ball.dx) * 1.05; // przyspiesza!
    pongGame.shakeAmount = 3;
    soundSystem.play('jump');
  }
  
  if (pongGame.ball.x >= 575 && pongGame.ball.y >= pongGame.ai.y && 
      pongGame.ball.y <= pongGame.ai.y + 80) {
    let hitPoint = (pongGame.ball.y - pongGame.ai.y) / 80;
    pongGame.ball.dy = (hitPoint - 0.5) * 10;
    pongGame.ball.dx = -Math.abs(pongGame.ball.dx) * 1.05;
    pongGame.shakeAmount = 3;
    soundSystem.play('jump');
  }
  
  if (pongGame.ball.x < 0) {
    pongGame.ai.score++;
    pongGame.ball.x = 300;
    pongGame.ball.y = 150;
  }
  if (pongGame.ball.x > 600) {
    pongGame.player.score++;
    achievementsManager.checkAchievements('pong', pongGame.player.score);
    levelSystem.addXP(5);
    dailyChallengeSystem.updateProgress('pong', pongGame.player.score);
    soundSystem.play('collect');
    pongGame.ball.x = 300;
    pongGame.ball.y = 150;
  }
  
  if (pongGame.ball.y < pongGame.ai.y + 40) {
    pongGame.ai.y = Math.max(0, pongGame.ai.y - pongGame.ai.speed);
  } else {
    pongGame.ai.y = Math.min(220, pongGame.ai.y + pongGame.ai.speed);
  }
  
  const scoreEl = document.getElementById('pongScore');
  if (scoreEl) {
    scoreEl.textContent = `Ty: ${pongGame.player.score} | AI: ${pongGame.ai.score}`;
  }
}

function drawPong() {
  const canvas = document.getElementById('pongCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Efekt shake ekranu
  if (pongGame.shakeAmount > 0) {
     const dx = (Math.random() - 0.5) * pongGame.shakeAmount * 2;
     const dy = (Math.random() - 0.5) * pongGame.shakeAmount * 2;
     ctx.translate(dx, dy);
     pongGame.shakeAmount--;
  }

  // Ciemniejsze tło, ale bez czyszczenia pełnego, by zostawał delikatny smug (motion blur hack)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(0, 0, 600, 300);
  
  // Rysowanie trail
  for(let i=0; i<pongGame.trail.length; i++) {
     let pos = pongGame.trail[i];
     let size = pongGame.ball.radius * (i / pongGame.trail.length);
     ctx.fillStyle = `rgba(0, 112, 243, ${i / pongGame.trail.length})`;
     ctx.beginPath();
     ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
     ctx.fill();
  }
  
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(10, pongGame.player.y, 15, 80);
  
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(575, pongGame.ai.y, 15, 80);
  
  // Kula z blaskiem
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#00b8ff';
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(pongGame.ball.x, pongGame.ball.y, pongGame.ball.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0; // reset
  
  // Reset tłumaczenia shake'a
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function resetPong() {
  gameStateManager.resetGame();
  initPong();
}