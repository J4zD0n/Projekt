// ===== BREAKOUT GAME =====
let breakoutGame;

function initBreakout() {
  breakoutGame = {
    paddle: { x: 250, y: 450, width: 100, height: 15, speed: 8 },
    ball: { x: 300, y: 400, dx: 4, dy: -4, radius: 8, stuck: true },
    bricks: [],
    score: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    bricksDestroyed: 0
  };
  
  createBricks();
  
  gameStateManager.currentGameLoop = setInterval(() => {
    if (!breakoutGame.gameOver) {
      updateBreakout();
      drawBreakout();
    }
  }, 1000 / 60);
}

function createBricks() {
  breakoutGame.bricks = [];
  const rows = 5 + breakoutGame.level;
  const cols = 10;
  const brickWidth = 55;
  const brickHeight = 20;
  const padding = 5;
  
  const colors = ['#ff0000', '#ff7700', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      breakoutGame.bricks.push({
        x: col * (brickWidth + padding) + 5,
        y: row * (brickHeight + padding) + 30,
        width: brickWidth,
        height: brickHeight,
        color: colors[row % colors.length],
        visible: true,
        points: (rows - row) * 10
      });
    }
  }
}

function updateBreakout() {
  if (inputHandler.isPressed('left')) {
    breakoutGame.paddle.x = Math.max(0, breakoutGame.paddle.x - breakoutGame.paddle.speed);
  }
  if (inputHandler.isPressed('right')) {
    breakoutGame.paddle.x = Math.min(500, breakoutGame.paddle.x + breakoutGame.paddle.speed);
  }
  
  if (breakoutGame.ball.stuck && inputHandler.isPressed('space')) {
    breakoutGame.ball.stuck = false;
    soundSystem.play('jump');
  }
  
  if (breakoutGame.ball.stuck) {
    breakoutGame.ball.x = breakoutGame.paddle.x + breakoutGame.paddle.width / 2;
    breakoutGame.ball.y = breakoutGame.paddle.y - breakoutGame.ball.radius;
  } else {
    breakoutGame.ball.x += breakoutGame.ball.dx;
    breakoutGame.ball.y += breakoutGame.ball.dy;
    
    if (breakoutGame.ball.x - breakoutGame.ball.radius < 0 || 
        breakoutGame.ball.x + breakoutGame.ball.radius > 600) {
      breakoutGame.ball.dx = -breakoutGame.ball.dx;
      soundSystem.play('click');
    }
    
    if (breakoutGame.ball.y - breakoutGame.ball.radius < 0) {
      breakoutGame.ball.dy = -breakoutGame.ball.dy;
      soundSystem.play('click');
    }
    
    if (breakoutGame.ball.y + breakoutGame.ball.radius > breakoutGame.paddle.y &&
        breakoutGame.ball.x > breakoutGame.paddle.x &&
        breakoutGame.ball.x < breakoutGame.paddle.x + breakoutGame.paddle.width &&
        breakoutGame.ball.dy > 0) {
      
      const hitPos = (breakoutGame.ball.x - breakoutGame.paddle.x) / breakoutGame.paddle.width;
      breakoutGame.ball.dx = (hitPos - 0.5) * 10;
      breakoutGame.ball.dy = -Math.abs(breakoutGame.ball.dy);
      soundSystem.play('jump');
    }
    
    breakoutGame.bricks.forEach(brick => {
      if (brick.visible &&
          breakoutGame.ball.x + breakoutGame.ball.radius > brick.x &&
          breakoutGame.ball.x - breakoutGame.ball.radius < brick.x + brick.width &&
          breakoutGame.ball.y + breakoutGame.ball.radius > brick.y &&
          breakoutGame.ball.y - breakoutGame.ball.radius < brick.y + brick.height) {
        
        brick.visible = false;
        breakoutGame.ball.dy = -breakoutGame.ball.dy;
        breakoutGame.score += brick.points;
        breakoutGame.bricksDestroyed++;
        
        dailyChallengeSystem.updateProgress('breakout', breakoutGame.bricksDestroyed);
        levelSystem.addXP(5);
        soundSystem.play('collect');
        
        updateBreakoutScore();
      }
    });
    
    if (breakoutGame.bricks.every(b => !b.visible)) {
      breakoutGame.level++;
      breakoutGame.ball.stuck = true;
      breakoutGame.ball.dx *= 1.1;
      breakoutGame.ball.dy *= 1.1;
      createBricks();
      soundSystem.play('levelUp');
      showNotification(`Poziom ${breakoutGame.level}!`);
    }
    
    if (breakoutGame.ball.y > 500) {
      breakoutGame.lives--;
      soundSystem.play('gameOver');
      
      if (breakoutGame.lives <= 0) {
        breakoutGame.gameOver = true;
        achievementsManager.checkAchievements('breakout', breakoutGame.score);
        levelSystem.addXP(Math.floor(breakoutGame.score / 10));
      } else {
        breakoutGame.ball.stuck = true;
        breakoutGame.ball.x = 300;
        breakoutGame.ball.y = 400;
      }
    }
  }
  
  updateBreakoutScore();
}

function updateBreakoutScore() {
  const scoreEl = document.getElementById('breakoutScore');
  if (scoreEl) {
    scoreEl.textContent = `Wynik: ${breakoutGame.score} | Życia: ${breakoutGame.lives} | Poziom: ${breakoutGame.level}`;
  }
}

function drawBreakout() {
  const canvas = document.getElementById('breakoutCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, 0, 500);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#16213e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 500);
  
  breakoutGame.bricks.forEach(brick => {
    if (brick.visible) {
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
    }
  });
  
  const paddleGradient = ctx.createLinearGradient(
    breakoutGame.paddle.x, 0, 
    breakoutGame.paddle.x + breakoutGame.paddle.width, 0
  );
  paddleGradient.addColorStop(0, '#0070f3');
  paddleGradient.addColorStop(1, '#00d4ff');
  ctx.fillStyle = paddleGradient;
  ctx.fillRect(
    breakoutGame.paddle.x, 
    breakoutGame.paddle.y, 
    breakoutGame.paddle.width, 
    breakoutGame.paddle.height
  );
  
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(breakoutGame.ball.x, breakoutGame.ball.y, breakoutGame.ball.radius, 0, Math.PI * 2);
  ctx.fill();
  
  if (breakoutGame.gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, 600, 500);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', 300, 230);
    ctx.font = '25px Arial';
    ctx.fillText(`Wynik: ${breakoutGame.score}`, 300, 270);
  }
}

function resetBreakout() {
  gameStateManager.resetGame();
  initBreakout();
}