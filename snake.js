// ===== SNAKE GAME =====
let snakeGame;

function initSnake() {
  const difficulty = difficultyConfig.snake[gameStateManager.currentDifficulty];
  
  const badge = document.getElementById('snakeDifficulty');
  if (badge) badge.textContent = difficulty.name;
  
  snakeGame = {
    snake: [{x: 200, y: 200}],
    dx: 20, dy: 0,
    food: {x: 0, y: 0},
    score: 0,
    gameOver: false,
    speed: difficulty.speed,
    multiplier: difficulty.multiplier,
    direction: 'right'
  };
  
  generateFood();
  
  gameStateManager.currentGameLoop = setInterval(() => {
    if (!snakeGame.gameOver) {
      updateSnake();
      drawSnake();
    }
  }, snakeGame.speed);
}

function generateFood() {
  do {
    snakeGame.food.x = Math.floor(Math.random() * 20) * 20;
    snakeGame.food.y = Math.floor(Math.random() * 20) * 20;
  } while (snakeGame.snake.some(s => s.x === snakeGame.food.x && s.y === snakeGame.food.y));
}

function updateSnake() {
  const head = {
    x: snakeGame.snake[0].x + snakeGame.dx,
    y: snakeGame.snake[0].y + snakeGame.dy
  };
  
  if (head.x < 0) head.x = 380;
  if (head.x >= 400) head.x = 0;
  if (head.y < 0) head.y = 380;
  if (head.y >= 400) head.y = 0;
  
  if (snakeGame.snake.some(s => s.x === head.x && s.y === head.y)) {
    snakeGame.gameOver = true;
    achievementsManager.checkAchievements('snake', snakeGame.score);
    levelSystem.addXP(Math.floor(snakeGame.score / 2));
    dailyChallengeSystem.updateProgress('snake', snakeGame.score);
    soundSystem.play('gameOver');
    return;
  }
  
  snakeGame.snake.unshift(head);
  
  if (head.x === snakeGame.food.x && head.y === snakeGame.food.y) {
    snakeGame.score += Math.floor(10 * snakeGame.multiplier);
    const scoreEl = document.getElementById('snakeScore');
    if (scoreEl) scoreEl.textContent = `Wynik: ${snakeGame.score}`;
    soundSystem.play('collect');
    generateFood();
  } else {
    snakeGame.snake.pop();
  }
}

function drawSnake() {
  const canvas = document.getElementById('snakeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Tło z kratkami
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 400, 400);
  
  // Rysowanie kratek
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 0.5;
  
  // Pionowe linie
  for (let x = 0; x <= 400; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 400);
    ctx.stroke();
  }
  
  // Poziome linie
  for (let y = 0; y <= 400; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(400, y);
    ctx.stroke();
  }
  
  // Wąż
  snakeGame.snake.forEach((segment, i) => {
    if (i === 0) {
      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.arc(segment.x + 10, segment.y + 10, 10, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const greenValue = Math.max(100, 200 - i * 10);
      ctx.fillStyle = `rgb(0, ${greenValue}, 0)`;
      ctx.beginPath();
      ctx.arc(segment.x + 10, segment.y + 10, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  
  // Jedzenie
  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  ctx.arc(snakeGame.food.x + 10, snakeGame.food.y + 10, 8, 0, Math.PI * 2);
  ctx.fill();
  
  if (snakeGame.gameOver) {
    // Ciemne tło
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, 400, 400);
    
    // Tekst GAME OVER
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', 200, 180);
    
    // Wynik
    ctx.fillStyle = '#ffffff';
    ctx.font = '25px Arial';
    ctx.fillText(`Wynik: ${snakeGame.score}`, 200, 220);
  }
}

function resetSnake() {
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
    initSnake();
    gameStateManager.currentGame = 'snake';
  }, 50);
}

// Usuwamy obsługę kliknięć na ekranie Game Over (bo nie ma już przycisków)