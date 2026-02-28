// ===== TETRIS GAME =====
let tetrisGame;
let lastTetrisTime = 0;

const TETRIS_PIECES = {
  I: [[1,1,1,1]],
  O: [[1,1],[1,1]],
  T: [[0,1,0],[1,1,1]],
  S: [[0,1,1],[1,1,0]],
  Z: [[1,1,0],[0,1,1]],
  J: [[1,0,0],[1,1,1]],
  L: [[0,0,1],[1,1,1]]
};

const TETRIS_COLORS = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000'
};

function initTetris() {
  tetrisGame = {
    board: Array(20).fill().map(() => Array(10).fill(0)),
    currentPiece: null,
    currentX: 0,
    currentY: 0,
    nextPiece: null,
    score: 0,
    lines: 0,
    level: 1,
    gameOver: false,
    speed: 500,
    lastDrop: Date.now(),
    animationId: null
  };
  
  tetrisGame.nextPiece = getRandomPiece();
  spawnNewPiece();
  
  startTetrisLoop();
}

function startTetrisLoop() {
  function tetrisLoop(timestamp) {
    if (!tetrisGame || tetrisGame.gameOver) {
      if (tetrisGame && tetrisGame.animationId) {
        cancelAnimationFrame(tetrisGame.animationId);
        tetrisGame.animationId = null;
      }
      return;
    }
    
    const delta = timestamp - lastTetrisTime;
    if (delta > 1000 / 60) {
      lastTetrisTime = timestamp;
      
      const now = Date.now();
      if (now - tetrisGame.lastDrop > tetrisGame.speed) {
        if (!tetrisGame.gameOver) {
          moveDown();
          tetrisGame.lastDrop = now;
        }
      }
      
      drawTetris();
    }
    
    tetrisGame.animationId = requestAnimationFrame(tetrisLoop);
  }
  
  if (tetrisGame.animationId) {
    cancelAnimationFrame(tetrisGame.animationId);
  }
  
  tetrisGame.animationId = requestAnimationFrame(tetrisLoop);
}

function getRandomPiece() {
  const pieces = Object.keys(TETRIS_PIECES);
  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
  return {
    shape: TETRIS_PIECES[randomPiece],
    color: TETRIS_COLORS[randomPiece],
    type: randomPiece
  };
}

function spawnNewPiece() {
  tetrisGame.currentPiece = tetrisGame.nextPiece;
  tetrisGame.nextPiece = getRandomPiece();
  tetrisGame.currentX = 3;
  tetrisGame.currentY = 0;
  
  if (checkCollision()) {
    tetrisGame.gameOver = true;
    const finalScore = tetrisGame.score;
    achievementsManager.checkAchievements('tetris', finalScore);
    levelSystem.addXP(tetrisGame.lines * 10);
    dailyChallengeSystem.updateProgress('tetris', tetrisGame.lines);
    soundSystem.play('gameOver');
  }
  
  drawNextPiece();
}

function checkCollision(offsetX = 0, offsetY = 0, piece = tetrisGame.currentPiece.shape) {
  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (piece[y][x]) {
        const newX = tetrisGame.currentX + x + offsetX;
        const newY = tetrisGame.currentY + y + offsetY;
        
        if (newX < 0 || newX >= 10 || newY >= 20) return true;
        if (newY >= 0 && tetrisGame.board[newY][newX]) return true;
      }
    }
  }
  return false;
}

function moveDown() {
  if (!checkCollision(0, 1)) {
    tetrisGame.currentY++;
  } else {
    mergePiece();
    clearLines();
    spawnNewPiece();
  }
}

function moveLeft() {
  if (!checkCollision(-1, 0)) {
    tetrisGame.currentX--;
    soundSystem.play('click');
  }
}

function moveRight() {
  if (!checkCollision(1, 0)) {
    tetrisGame.currentX++;
    soundSystem.play('click');
  }
}

function rotatePiece() {
  const rotated = tetrisGame.currentPiece.shape[0].map((_, i) =>
    tetrisGame.currentPiece.shape.map(row => row[i]).reverse()
  );
  
  if (!checkCollision(0, 0, rotated)) {
    tetrisGame.currentPiece.shape = rotated;
    soundSystem.play('click');
  }
}

function hardDrop() {
  while (!checkCollision(0, 1)) {
    tetrisGame.currentY++;
  }
  mergePiece();
  clearLines();
  spawnNewPiece();
  soundSystem.play('collect');
}

function mergePiece() {
  tetrisGame.currentPiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        const boardY = tetrisGame.currentY + y;
        const boardX = tetrisGame.currentX + x;
        if (boardY >= 0) {
          tetrisGame.board[boardY][boardX] = tetrisGame.currentPiece.color;
        }
      }
    });
  });
}

function clearLines() {
  let linesCleared = 0;
  
  for (let y = tetrisGame.board.length - 1; y >= 0; y--) {
    if (tetrisGame.board[y].every(cell => cell !== 0)) {
      tetrisGame.board.splice(y, 1);
      tetrisGame.board.unshift(Array(10).fill(0));
      linesCleared++;
      y++;
    }
  }
  
  if (linesCleared > 0) {
    tetrisGame.lines += linesCleared;
    const points = [0, 100, 300, 500, 800][linesCleared];
    tetrisGame.score += points * tetrisGame.level;
    
    tetrisGame.level = Math.floor(tetrisGame.lines / 10) + 1;
    tetrisGame.speed = Math.max(100, 500 - (tetrisGame.level - 1) * 50);
    
    dailyChallengeSystem.updateProgress('tetris', tetrisGame.lines);
    levelSystem.addXP(linesCleared * 15);
    soundSystem.play('collect');
    
    updateTetrisScore();
  }
}

function updateTetrisScore() {
  const scoreEl = document.getElementById('tetrisScore');
  if (scoreEl) {
    scoreEl.textContent = `Wynik: ${tetrisGame.score} | Linie: ${tetrisGame.lines} | Poziom: ${tetrisGame.level}`;
  }
}

function drawTetris() {
  const canvas = document.getElementById('tetrisCanvas');
  if (!canvas || !tetrisGame) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Tło z kratkami
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 300, 600);
  
  // Rysowanie siatki
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 0.5;
  
  // Pionowe linie
  for (let x = 0; x <= 300; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 600);
    ctx.stroke();
  }
  
  // Poziome linie
  for (let y = 0; y <= 600; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(300, y);
    ctx.stroke();
  }
  
  // Rysowanie bloków na planszy
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = tetrisGame.board[y][x];
      if (cell) {
        ctx.fillStyle = cell;
        ctx.fillRect(x * 30 + 1, y * 30 + 1, 28, 28);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(x * 30 + 1, y * 30 + 1, 28, 28);
      }
    }
  }
  
  // Rysowanie aktualnego klocka
  if (tetrisGame.currentPiece) {
    ctx.fillStyle = tetrisGame.currentPiece.color;
    const shape = tetrisGame.currentPiece.shape;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const drawX = (tetrisGame.currentX + x) * 30;
          const drawY = (tetrisGame.currentY + y) * 30;
          ctx.fillRect(drawX + 1, drawY + 1, 28, 28);
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.strokeRect(drawX + 1, drawY + 1, 28, 28);
        }
      }
    }
  }
  
  // Game Over
  if (tetrisGame.gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, 300, 600);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', 150, 280);
    ctx.font = '18px Arial';
    ctx.fillText(`Wynik: ${tetrisGame.score}`, 150, 320);
  }
}

function drawNextPiece() {
  const canvas = document.getElementById('nextPieceCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, 100, 100);
  
  if (tetrisGame.nextPiece) {
    ctx.fillStyle = tetrisGame.nextPiece.color;
    const offsetX = (4 - tetrisGame.nextPiece.shape[0].length) * 10;
    const offsetY = (4 - tetrisGame.nextPiece.shape.length) * 10;
    
    tetrisGame.nextPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          ctx.fillRect(offsetX + x * 20, offsetY + y * 20, 19, 19);
        }
      });
    });
  }
}

function resetTetris() {
  if (tetrisGame && tetrisGame.animationId) {
    cancelAnimationFrame(tetrisGame.animationId);
    tetrisGame.animationId = null;
  }
  
  gameStateManager.cleanupCurrentGame();
  inputHandler.clearAll();
  initTetris();
}