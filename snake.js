// ===== SNAKE GAME =====
let snakeGame;

function initSnake() {
  const difficulty = difficultyConfig.snake[gameStateManager.currentDifficulty];
  
  const badge = document.getElementById('snakeDifficulty');
  if (badge) badge.textContent = difficulty.name;
  
  snakeGame = {
    snake: [{x: 200, y: 200}],
    dx: 5, dy: 0,
    food: {x: 0, y: 0},
    score: 0,
    gameOver: false,
    speed: Math.max(20, difficulty.speed / 4), // 4x szybsze odświeżanie
    multiplier: difficulty.multiplier,
    direction: 'right',
    stepCounter: 0 // Do sprawdzania skrętu tylko co pełen 'blok' 20px
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
  snakeGame.stepCounter += 5;
  
  // Pozwól na skręt tylko na "siatce" 20px wokół środka bloku, by nie łamać kratek w pół
  if (snakeGame.stepCounter >= 20) {
     snakeGame.stepCounter = 0;
     
     if (inputHandler.isPressed('left')) {
       if (snakeGame.direction !== 'right') { snakeGame.dx = -5; snakeGame.dy = 0; snakeGame.direction = 'left'; }
     }
     else if (inputHandler.isPressed('right')) {
       if (snakeGame.direction !== 'left') { snakeGame.dx = 5; snakeGame.dy = 0; snakeGame.direction = 'right'; }
     }
     else if (inputHandler.isPressed('up')) {
       if (snakeGame.direction !== 'down') { snakeGame.dx = 0; snakeGame.dy = -5; snakeGame.direction = 'up'; }
     }
     else if (inputHandler.isPressed('down')) {
       if (snakeGame.direction !== 'up') { snakeGame.dx = 0; snakeGame.dy = 5; snakeGame.direction = 'down'; }
     }
  }
  
  const head = {
    x: snakeGame.snake[0].x + snakeGame.dx,
    y: snakeGame.snake[0].y + snakeGame.dy
  };
  
  if (head.x < 0) head.x = 380;
  if (head.x >= 400) head.x = 0;
  if (head.y < 0) head.y = 380;
  if (head.y >= 400) head.y = 0;
  
  if (snakeGame.snake.some((s, idx) => idx > 3 && Math.abs(s.x - head.x) < 5 && Math.abs(s.y - head.y) < 5)) { 
    snakeGame.gameOver = true;
    achievementsManager.checkAchievements('snake', snakeGame.score);
    levelSystem.addXP(Math.floor(snakeGame.score / 2));
    dailyChallengeSystem.updateProgress('snake', snakeGame.score);
    soundSystem.play('gameOver');
    return;
  }
  
  snakeGame.snake.unshift(head);
  
  // Sprawdzanie kolizji z jedzeniem (z tolerancją wielkości)
  if (Math.abs(head.x - snakeGame.food.x) < 15 && Math.abs(head.y - snakeGame.food.y) < 15) {
    snakeGame.score += Math.floor(10 * snakeGame.multiplier);
    // Efekt zjedzenia - dodajemy tymczasowo większy promień do ciała
    snakeGame.snake[0].justAte = true;
    setTimeout(() => { if (snakeGame && snakeGame.snake[0]) snakeGame.snake[0].justAte = false; }, 200);
    
    const scoreEl = document.getElementById('snakeScore');
    generateFood();
    // Żeby wąż nie oderwał się nagle od ciała, dodajemy 'wypełniacze' przy płynnym ruchu
    for(let k=0; k<3; k++) {
       const tail = snakeGame.snake[snakeGame.snake.length - 1];
       snakeGame.snake.push({x: tail.x, y: tail.y});
    }
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
      // Głowa - większa kropka
      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.arc(segment.x + 10, segment.y + 10, 11, 0, Math.PI * 2);
      ctx.fill();
      
      // Oczy
      ctx.fillStyle = '#000';
      ctx.beginPath();
      
      // Rotacja oczu w zależności od kierunku
      let eyeOffsets = [];
      if (snakeGame.direction === 'right') eyeOffsets = [[6, -4], [6, 4]];
      else if (snakeGame.direction === 'left') eyeOffsets = [[-6, -4], [-6, 4]];
      else if (snakeGame.direction === 'up') eyeOffsets = [[-4, -6], [4, -6]];
      else if (snakeGame.direction === 'down') eyeOffsets = [[-4, 6], [4, 6]];
      else eyeOffsets = [[6, -4], [6, 4]]; // Zabezpieczenie
      
      eyeOffsets.forEach(offset => {
        ctx.arc(segment.x + 10 + offset[0], segment.y + 10 + offset[1], 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
      });
      
    } else {
      // Ciało z gradientem koloru
      const greenValue = Math.max(80, 200 - i * 5);
      ctx.fillStyle = `rgb(0, ${greenValue}, 0)`;
      ctx.beginPath();
      ctx.arc(segment.x + 10, segment.y + 10, 9 - (i % 2 === 0 ? 0.5 : 0), 0, Math.PI * 2);
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