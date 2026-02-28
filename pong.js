// ===== PONG GAME =====
let pongGame;

function initPong() {
  const difficulty = difficultyConfig.pong[gameStateManager.currentDifficulty];
  
  const badge = document.getElementById('pongDifficulty');
  if (badge) badge.textContent = difficulty.name;
  
  pongGame = {
    ball: { x: 300, y: 150, dx: difficulty.ballSpeed, dy: difficulty.ballSpeed, radius: 8 },
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
  
  pongGame.ball.x += pongGame.ball.dx;
  pongGame.ball.y += pongGame.ball.dy;
  
  if (pongGame.ball.y <= 0 || pongGame.ball.y >= 300) {
    pongGame.ball.dy = -pongGame.ball.dy;
  }
  
  if (pongGame.ball.x <= 25 && pongGame.ball.y >= pongGame.player.y && 
      pongGame.ball.y <= pongGame.player.y + 80) {
    pongGame.ball.dx = Math.abs(pongGame.ball.dx);
  }
  
  if (pongGame.ball.x >= 575 && pongGame.ball.y >= pongGame.ai.y && 
      pongGame.ball.y <= pongGame.ai.y + 80) {
    pongGame.ball.dx = -Math.abs(pongGame.ball.dx);
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
  
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 600, 300);
  
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(10, pongGame.player.y, 15, 80);
  
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(575, pongGame.ai.y, 15, 80);
  
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(pongGame.ball.x, pongGame.ball.y, 8, 0, Math.PI * 2);
  ctx.fill();
}

function resetPong() {
  gameStateManager.resetGame();
  initPong();
}