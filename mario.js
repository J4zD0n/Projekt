// ===== MARIO PLATFORMER =====
let marioGame;

const marioLevels = [
  {
    platforms: [
      {x: 0, y: 350, width: 200, height: 50},
      {x: 250, y: 300, width: 100, height: 20},
      {x: 400, y: 250, width: 100, height: 20},
      {x: 550, y: 200, width: 150, height: 20},
      {x: 750, y: 300, width: 100, height: 20},
      {x: 900, y: 350, width: 300, height: 50}
    ],
    coins: [
      {x: 280, y: 250}, {x: 430, y: 200}, {x: 600, y: 150},
      {x: 780, y: 250}, {x: 1000, y: 300}
    ],
    flag: {x: 1100, y: 250}
  },
  {
    platforms: [
      {x: 0, y: 350, width: 150, height: 50},
      {x: 200, y: 320, width: 80, height: 20},
      {x: 330, y: 270, width: 80, height: 20},
      {x: 460, y: 220, width: 80, height: 20},
      {x: 590, y: 270, width: 80, height: 20},
      {x: 720, y: 320, width: 80, height: 20},
      {x: 850, y: 350, width: 200, height: 50}
    ],
    coins: [
      {x: 230, y: 270}, {x: 360, y: 220}, {x: 490, y: 170},
      {x: 620, y: 220}, {x: 750, y: 270}, {x: 950, y: 300}
    ],
    flag: {x: 1000, y: 250}
  },
  {
    platforms: [
      {x: 0, y: 350, width: 100, height: 50},
      {x: 150, y: 300, width: 60, height: 20},
      {x: 260, y: 250, width: 60, height: 20},
      {x: 370, y: 200, width: 60, height: 20},
      {x: 480, y: 150, width: 60, height: 20},
      {x: 590, y: 200, width: 60, height: 20},
      {x: 700, y: 250, width: 60, height: 20},
      {x: 810, y: 300, width: 60, height: 20},
      {x: 920, y: 350, width: 200, height: 50}
    ],
    coins: [
      {x: 180, y: 250}, {x: 290, y: 200}, {x: 400, y: 150},
      {x: 510, y: 100}, {x: 620, y: 150}, {x: 730, y: 200},
      {x: 840, y: 250}, {x: 1000, y: 300}
    ],
    flag: {x: 1050, y: 250}
  }
];

function initMario() {
  marioGame = {
    mario: {
      x: 50, y: 300, width: 24, height: 32,
      velocityX: 0, velocityY: 0,
      onGround: false, speed: 4, jumpPower: -11,
      facingRight: true
    },
    camera: 0,
    currentLevel: 0,
    score: 0,
    coinsCollected: [],
    gameOver: false,
    levelComplete: false
  };
  
  gameStateManager.currentGameLoop = setInterval(() => {
    if (!marioGame.gameOver && !marioGame.levelComplete) {
      updateMario();
      drawMario();
    }
  }, 1000 / 60);
}

function updateMario() {
  const gravity = 0.5;
  const level = marioLevels[marioGame.currentLevel];
  
  if (inputHandler.isPressed('left')) {
    marioGame.mario.velocityX = -marioGame.mario.speed;
    marioGame.mario.facingRight = false;
  } else if (inputHandler.isPressed('right')) {
    marioGame.mario.velocityX = marioGame.mario.speed;
    marioGame.mario.facingRight = true;
  } else {
    marioGame.mario.velocityX *= 0.8;
  }
  
  if (inputHandler.isPressed('space') && marioGame.mario.onGround) {
    marioGame.mario.velocityY = marioGame.mario.jumpPower;
    marioGame.mario.onGround = false;
    soundSystem.play('jump');
  }
  
  marioGame.mario.velocityY += gravity;
  
  marioGame.mario.x += marioGame.mario.velocityX;
  marioGame.mario.y += marioGame.mario.velocityY;
  
  marioGame.mario.onGround = false;
  
  level.platforms.forEach(platform => {
    if (
      marioGame.mario.x + marioGame.mario.width > platform.x &&
      marioGame.mario.x < platform.x + platform.width &&
      marioGame.mario.y + marioGame.mario.height > platform.y &&
      marioGame.mario.y < platform.y + platform.height
    ) {
      if (marioGame.mario.velocityY > 0) {
        marioGame.mario.y = platform.y - marioGame.mario.height;
        marioGame.mario.velocityY = 0;
        marioGame.mario.onGround = true;
      }
    }
  });
  
  level.coins.forEach((coin, index) => {
    if (
      !marioGame.coinsCollected.includes(index) &&
      Math.abs(marioGame.mario.x - coin.x) < 20 &&
      Math.abs(marioGame.mario.y - coin.y) < 20
    ) {
      marioGame.coinsCollected.push(index);
      marioGame.score += 10;
      soundSystem.play('collect');
    }
  });
  
  if (
    Math.abs(marioGame.mario.x - level.flag.x) < 30 &&
    Math.abs(marioGame.mario.y - level.flag.y) < 50
  ) {
    marioGame.levelComplete = true;
    marioGame.currentLevel++;
    achievementsManager.checkAchievements('mario', marioGame.currentLevel);
    levelSystem.addXP(100);
    dailyChallengeSystem.updateProgress('mario', marioGame.coinsCollected.length);
    soundSystem.play('levelUp');
    
    if (marioGame.currentLevel >= marioLevels.length) {
      marioGame.gameOver = true;
      showNotification('🎉 Wszystkie poziomy!');
    } else {
      showNotification(`✅ Poziom ${marioGame.currentLevel}!`);
      setTimeout(() => {
        marioGame.mario.x = 50;
        marioGame.mario.y = 300;
        marioGame.camera = 0;
        marioGame.coinsCollected = [];
        marioGame.levelComplete = false;
      }, 2000);
    }
  }
  
  if (marioGame.mario.y > 400) {
    marioGame.mario.x = 50;
    marioGame.mario.y = 300;
    marioGame.mario.velocityX = 0;
    marioGame.mario.velocityY = 0;
  }
  
  marioGame.camera = Math.max(0, marioGame.mario.x - 200);
  
  const scoreEl = document.getElementById('marioScore');
  if (scoreEl) {
    scoreEl.textContent = `Poziom: ${marioGame.currentLevel + 1} | Monety: ${marioGame.coinsCollected.length} | Wynik: ${marioGame.score}`;
  }
}

function drawMario() {
  const canvas = document.getElementById('marioCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, '#87CEEB');
  gradient.addColorStop(1, '#E0F6FF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 400);
  
  const level = marioLevels[marioGame.currentLevel];
  
  ctx.fillStyle = '#8B4513';
  level.platforms.forEach(platform => {
    ctx.fillRect(
      platform.x - marioGame.camera,
      platform.y,
      platform.width,
      platform.height
    );
  });
  
  ctx.fillStyle = '#FFD700';
  level.coins.forEach((coin, index) => {
    if (!marioGame.coinsCollected.includes(index)) {
      ctx.beginPath();
      ctx.arc(coin.x - marioGame.camera, coin.y, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(level.flag.x - marioGame.camera, level.flag.y, 5, 100);
  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  ctx.moveTo(level.flag.x - marioGame.camera, level.flag.y);
  ctx.lineTo(level.flag.x - marioGame.camera + 30, level.flag.y + 10);
  ctx.lineTo(level.flag.x - marioGame.camera, level.flag.y + 20);
  ctx.fill();
  
  const mx = marioGame.mario.x - marioGame.camera;
  const my = marioGame.mario.y;
  
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(mx + 4, my, 16, 8);
  
  ctx.fillStyle = '#ffcc99';
  ctx.fillRect(mx + 4, my + 8, 16, 12);
  
  ctx.fillStyle = '#000';
  ctx.fillRect(mx + 8, my + 10, 3, 3);
  ctx.fillRect(mx + 13, my + 10, 3, 3);
  
  ctx.fillStyle = '#000';
  ctx.fillRect(mx + 6, my + 16, 12, 2);
  
  ctx.fillStyle = '#0000ff';
  ctx.fillRect(mx + 4, my + 20, 16, 8);
  
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(mx + 6, my + 28, 6, 4);
  ctx.fillRect(mx + 12, my + 28, 6, 4);
  
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(mx + 4, my + 28, 4, 4);
  ctx.fillRect(mx + 16, my + 28, 4, 4);
  
  if (marioGame.levelComplete || marioGame.gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, 600, 400);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      marioGame.gameOver ? 'UKOŃCZONO!' : `POZIOM ${marioGame.currentLevel}!`,
      300, 180
    );
    ctx.font = '20px Arial';
    ctx.fillText(`Wynik: ${marioGame.score}`, 300, 220);
  }
}

function resetMario() {
  gameStateManager.resetGame();
  initMario();
}