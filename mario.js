// ===== MARIO PLATFORMER (DUCK HUNT STYLE) =====
let marioGame;
let lastMarioTime = 0;

// Poziomy Mario (jak Duck Hunt) - 5 poziomów
const marioLevels = [
  {
    id: 1,
    name: "Pierwsze kroki",
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
    enemies: [
      {x: 350, y: 250, width: 30, height: 30, speed: 1.0, direction: 1, alive: true, type: 'goomba'},
      {x: 650, y: 150, width: 30, height: 30, speed: 1.2, direction: -1, alive: true, type: 'koopa'}
    ],
    flag: {x: 1100, y: 250, width: 40, height: 100},
    requiredCoins: 3,
    timeLimit: 180,
    difficulty: "Łatwy"
  },
  {
    id: 2,
    name: "Skalna ścieżka",
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
    enemies: [
      {x: 280, y: 220, width: 30, height: 30, speed: 1.3, direction: 1, alive: true, type: 'goomba'},
      {x: 500, y: 170, width: 30, height: 30, speed: 1.1, direction: -1, alive: true, type: 'koopa'},
      {x: 780, y: 220, width: 30, height: 30, speed: 1.5, direction: 1, alive: true, type: 'goomba'}
    ],
    flag: {x: 1000, y: 250, width: 40, height: 100},
    requiredCoins: 4,
    timeLimit: 150,
    difficulty: "Średni"
  },
  {
    id: 3,
    name: "Górska wspinaczka",
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
    enemies: [
      {x: 220, y: 200, width: 35, height: 35, speed: 1.4, direction: 1, alive: true, type: 'koopa'},
      {x: 420, y: 150, width: 30, height: 30, speed: 1.2, direction: -1, alive: true, type: 'goomba'},
      {x: 670, y: 200, width: 35, height: 35, speed: 1.6, direction: 1, alive: true, type: 'koopa'},
      {x: 880, y: 250, width: 30, height: 30, speed: 1.3, direction: -1, alive: true, type: 'goomba'}
    ],
    flag: {x: 1050, y: 200, width: 40, height: 100},
    requiredCoins: 5,
    timeLimit: 120,
    difficulty: "Trudny"
  },
  {
    id: 4,
    name: "Nocna przygoda",
    platforms: [
      {x: 0, y: 350, width: 120, height: 50},
      {x: 180, y: 320, width: 70, height: 20},
      {x: 310, y: 290, width: 70, height: 20},
      {x: 440, y: 260, width: 70, height: 20},
      {x: 570, y: 230, width: 70, height: 20},
      {x: 700, y: 200, width: 70, height: 20},
      {x: 830, y: 230, width: 70, height: 20},
      {x: 960, y: 260, width: 70, height: 20},
      {x: 1090, y: 290, width: 70, height: 20},
      {x: 1020, y: 320, width: 180, height: 30},
      {x: 1150, y: 350, width: 50, height: 50}
    ],
    coins: [
      {x: 210, y: 270}, {x: 340, y: 240}, {x: 470, y: 210},
      {x: 600, y: 180}, {x: 730, y: 150}, {x: 860, y: 180},
      {x: 990, y: 210}, {x: 1120, y: 240}, {x: 1100, y: 280}
    ],
    enemies: [
      {x: 250, y: 240, width: 35, height: 35, speed: 1.2, direction: 1, alive: true, type: 'koopa'},
      {x: 380, y: 210, width: 30, height: 30, speed: 1.0, direction: -1, alive: true, type: 'goomba'},
      {x: 650, y: 180, width: 35, height: 35, speed: 1.3, direction: 1, alive: true, type: 'koopa'},
      {x: 900, y: 210, width: 30, height: 30, speed: 1.1, direction: -1, alive: true, type: 'goomba'},
      {x: 1050, y: 240, width: 35, height: 35, speed: 1.4, direction: 1, alive: true, type: 'koopa'}
    ],
    flag: {x: 1150, y: 220, width: 40, height: 100},
    requiredCoins: 5,
    timeLimit: 150,
    difficulty: "Bardzo trudny"
  },
  {
    id: 5,
    name: "Ostatnie wyzwanie",
    platforms: [
      {x: 0, y: 350, width: 80, height: 50},
      {x: 130, y: 320, width: 50, height: 20},
      {x: 230, y: 290, width: 50, height: 20},
      {x: 330, y: 260, width: 50, height: 20},
      {x: 430, y: 230, width: 50, height: 20},
      {x: 530, y: 200, width: 50, height: 20},
      {x: 630, y: 170, width: 50, height: 20},
      {x: 730, y: 140, width: 50, height: 20},
      {x: 830, y: 170, width: 50, height: 20},
      {x: 930, y: 200, width: 50, height: 20},
      {x: 1030, y: 230, width: 50, height: 20},
      {x: 1130, y: 260, width: 50, height: 20},
      {x: 1200, y: 350, width: 50, height: 50}
    ],
    coins: [
      {x: 160, y: 270}, {x: 260, y: 240}, {x: 360, y: 210},
      {x: 460, y: 180}, {x: 560, y: 150}, {x: 660, y: 120},
      {x: 760, y: 90}, {x: 860, y: 120}, {x: 960, y: 150},
      {x: 1060, y: 180}, {x: 1160, y: 210}, {x: 1100, y: 300}
    ],
    enemies: [
      {x: 200, y: 240, width: 40, height: 40, speed: 1.6, direction: 1, alive: true, type: 'koopa'},
      {x: 300, y: 210, width: 35, height: 35, speed: 1.4, direction: -1, alive: true, type: 'goomba'},
      {x: 500, y: 180, width: 40, height: 40, speed: 1.8, direction: 1, alive: true, type: 'koopa'},
      {x: 700, y: 150, width: 35, height: 35, speed: 1.5, direction: -1, alive: true, type: 'goomba'},
      {x: 900, y: 180, width: 40, height: 40, speed: 2.0, direction: 1, alive: true, type: 'koopa'},
      {x: 1100, y: 210, width: 35, height: 35, speed: 1.7, direction: -1, alive: true, type: 'goomba'}
    ],
    flag: {x: 1250, y: 250, width: 40, height: 100},
    requiredCoins: 7,
    timeLimit: 90,
    difficulty: "Ekspert"
  }
];

// ===== GŁÓWNA FUNKCJA STARTU GRY MARIO =====
function startMarioGame() {
  console.log("🎮 Rozpoczynam grę Mario...");
  
  // Zatrzymaj inne gry
  if (gameStateManager.currentGameLoop) {
    clearInterval(gameStateManager.currentGameLoop);
    gameStateManager.currentGameLoop = null;
  }
  
  if (marioGame && marioGame.animationId) {
    cancelAnimationFrame(marioGame.animationId);
    marioGame.animationId = null;
  }
  
  // Wyczyść input
  inputHandler.clearAll();
  
  // Pokaż wybór poziomu (jak w Duck Hunt)
  showMarioLevelSelect();
}

// Upewnij się, że uiStart obsługuje Mario
function selectMarioGame() {
  uiStart('mario');
}

// ===== SYSTEM ODBLOKOWANYCH POZIOMÓW =====
function getMarioUnlockedLevels() {
  const saved = localStorage.getItem('marioUnlockedLevels');
  return saved ? JSON.parse(saved) : [1];
}

function saveMarioUnlockedLevels(levels) {
  localStorage.setItem('marioUnlockedLevels', JSON.stringify(levels));
}

function unlockMarioLevel(level) {
  const unlocked = getMarioUnlockedLevels();
  if (!unlocked.includes(level)) {
    unlocked.push(level);
    unlocked.sort((a, b) => a - b);
    saveMarioUnlockedLevels(unlocked);
    return true;
  }
  return false;
}

function getMarioCurrentLevel() {
  const saved = localStorage.getItem('marioCurrentLevel');
  return saved ? parseInt(saved) : 1;
}

function saveMarioCurrentLevel(level) {
  localStorage.setItem('marioCurrentLevel', level.toString());
}

// ===== WYBÓR POZIOMU =====
function showMarioLevelSelect() {
  const unlockedLevels = getMarioUnlockedLevels();
  const currentLevel = getMarioCurrentLevel();
  const container = document.getElementById('marioLevelsContainer');
  
  if (!container) {
    console.error("❌ Nie znaleziono marioLevelsContainer");
    return;
  }
  
  let levelsHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h3 style="color: var(--accent-primary);">Odblokowano: ${unlockedLevels.length}/${marioLevels.length} poziomów</h3>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
  `;
  
  marioLevels.forEach(level => {
    const isUnlocked = unlockedLevels.includes(level.id);
    const isCurrent = currentLevel === level.id;
    
    levelsHTML += `
      <div class="difficulty-btn ${isUnlocked ? '' : 'locked'}" 
           style="background: ${isCurrent ? 'var(--bg-secondary)' : 'var(--bg-tertiary)'};
                  border: 2px solid ${isCurrent ? 'var(--accent-primary)' : (isUnlocked ? '#444' : '#666')};
                  opacity: ${isUnlocked ? '1' : '0.6'};
                  cursor: ${isUnlocked ? 'pointer' : 'not-allowed'};
                  padding: 20px; border-radius: 12px; text-align: center;">
        <div style="font-size: 32px; font-weight: bold; color: ${isUnlocked ? 'var(--accent-primary)' : '#666'}; margin-bottom: 10px;">
          ${level.id}
        </div>
        <h3 style="margin: 0 0 10px 0; color: ${isUnlocked ? 'var(--text-primary)' : '#666'};">${level.name}</h3>
        <p style="color: ${isUnlocked ? 'var(--text-secondary)' : '#666'}; margin: 5px 0; font-size: 14px;">
          Trudność: ${level.difficulty}
        </p>
        <p style="color: ${isUnlocked ? 'var(--text-secondary)' : '#666'}; margin: 5px 0; font-size: 14px;">
          Monety: ${level.requiredCoins}/${level.coins.length}
        </p>
        <p style="color: ${isUnlocked ? 'var(--text-secondary)' : '#666'}; margin: 5px 0; font-size: 14px;">
          Czas: ${level.timeLimit}s
        </p>
        <div style="margin-top: 15px;">
          ${isUnlocked ? 
            `<button onclick="startMarioLevel(${level.id}); closeModal('marioLevelSelectModal')" 
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
  
  levelsHTML += `</div>`;
  container.innerHTML = levelsHTML;
  
  // Otwórz modal
  const modal = document.getElementById('marioLevelSelectModal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function startMarioLevel(levelId) {
  const unlockedLevels = getMarioUnlockedLevels();
  if (!unlockedLevels.includes(levelId)) {
    showNotification("🔒 Ten poziom jest jeszcze zablokowany!");
    return;
  }
  
  closeModal('marioLevelModal');
  saveMarioCurrentLevel(levelId);
  
  if (gameStateManager.currentGameLoop) {
    clearInterval(gameStateManager.currentGameLoop);
    gameStateManager.currentGameLoop = null;
  }
  
  if (marioGame && marioGame.animationId) {
    cancelAnimationFrame(marioGame.animationId);
    marioGame.animationId = null;
  }
  
  setTimeout(() => {
    const gameMenu = document.getElementById('gameMenu');
    if (gameMenu) gameMenu.style.display = 'none';
    
    document.querySelectorAll('.game-screen').forEach(screen => {
      screen.classList.remove('active');
    });
    
    const gameScreen = document.getElementById('marioGame');
    if (gameScreen) {
      gameScreen.classList.add('active');
    }
    
    gameStateManager.currentGame = 'mario';
    initMarioWithLevel(levelId - 1);
    
    showNotification(`🎮 Rozpoczynasz poziom ${levelId}: ${marioLevels[levelId - 1].name}`);
  }, 300);
}

// ===== INICJALIZACJA GRY =====
function initMarioWithLevel(levelIndex) {
  const canvas = document.getElementById('marioCanvas');
  if (!canvas) return;
  
  const level = marioLevels[levelIndex];
  
  marioGame = {
    mario: {
      x: 50,
      y: 300,
      width: 30,
      height: 40,
      velocityX: 0,
      velocityY: 0,
      onGround: false,
      speed: 3.5,
      jumpPower: -12.5,
      facingRight: true,
      canJump: true,
      isCrouching: false
    },
    camera: {
      x: 0,
      y: 0,
      width: 600,
      height: 400
    },
    currentLevelIndex: levelIndex,
    level: level,
    score: 0,
    coinsCollected: [],
    lives: 3,
    gameOver: false,
    levelComplete: false,
    enemies: JSON.parse(JSON.stringify(level.enemies)),
    particles: [],
    levelTime: level.timeLimit,
    startTime: Date.now(),
    animationId: null,
    wasCompleted: false
  };
  
  updateMarioScore();
  
  if (marioGame.animationId) {
    cancelAnimationFrame(marioGame.animationId);
    marioGame.animationId = null;
  }
  
  function marioLoop() {
    if (marioGame) {
      const currentTime = Date.now();
      const deltaTime = Math.min((currentTime - lastMarioTime) / 1000, 0.1);
      
      if (lastMarioTime > 0) {
        if (!marioGame.gameOver && !marioGame.levelComplete) {
          updateMario(deltaTime);
        }
        drawMario();
      }
      
      lastMarioTime = currentTime;
      
      if (!marioGame.gameOver) {
        marioGame.animationId = requestAnimationFrame(marioLoop);
      }
    }
  }
  
  lastMarioTime = 0;
  marioGame.animationId = requestAnimationFrame(marioLoop);
}

function initMario() {
  const currentLevel = getMarioCurrentLevel();
  initMarioWithLevel(currentLevel - 1);
}

// ===== UPDATE GAME LOGIC =====
function updateMario(deltaTime) {
  if (!marioGame || marioGame.gameOver || marioGame.levelComplete) return;
  
  const level = marioGame.level;
  const mario = marioGame.mario;
  
  // Czas
  const elapsedSeconds = (Date.now() - marioGame.startTime) / 1000;
  marioGame.levelTime = Math.max(0, level.timeLimit - elapsedSeconds);
  
  if (marioGame.levelTime <= 0) {
    marioGame.lives--;
    if (marioGame.lives <= 0) {
      gameOverMario();
    } else {
      resetMarioPosition();
      showNotification(`⏰ Czas minął! Pozostało żyć: ${marioGame.lives}`);
    }
    return;
  }
  
  // Sterowanie
  let targetVelocityX = 0;
  
  mario.isCrouching = (inputHandler.isPressed('down') || inputHandler.isPressed('s'));
  
  if (mario.isCrouching) {
    mario.height = 30;
    mario.y += 10;
  } else {
    mario.height = 40;
  }
  
  if ((inputHandler.isPressed('left') || inputHandler.isPressed('a')) && !mario.isCrouching) {
    targetVelocityX = -mario.speed;
    mario.facingRight = false;
  } else if ((inputHandler.isPressed('right') || inputHandler.isPressed('d')) && !mario.isCrouching) {
    targetVelocityX = mario.speed;
    mario.facingRight = true;
  }
  
  mario.velocityX += (targetVelocityX - mario.velocityX) * 0.2;
  
  // Skok
  if ((inputHandler.isPressed('space') || inputHandler.isPressed('up') || inputHandler.isPressed('w')) && 
      mario.onGround && mario.canJump && !mario.isCrouching) {
    mario.velocityY = mario.jumpPower;
    mario.onGround = false;
    mario.canJump = false;
    soundSystem.play('jump');
  }
  
  if (!inputHandler.isPressed('space') && !inputHandler.isPressed('up') && !inputHandler.isPressed('w')) {
    mario.canJump = true;
  }
  
  // Fizyka
  const gravity = 0.5;
  mario.velocityY += gravity;
  if (mario.velocityY > 12) mario.velocityY = 12;
  
  const newX = mario.x + mario.velocityX;
  const newY = mario.y + mario.velocityY;
  
  // Kolizje z platformami
  mario.onGround = false;
  let nextY = newY;
  
  for (const platform of level.platforms) {
    if (mario.velocityY < 0 && 
        nextY < platform.y + platform.height &&
        mario.y + mario.height > platform.y &&
        mario.x + mario.width - 5 > platform.x &&
        mario.x + 5 < platform.x + platform.width) {
      
      mario.velocityY = 0;
      nextY = platform.y + platform.height;
    }
    
    if (mario.velocityY > 0 &&
        nextY + mario.height > platform.y &&
        mario.y + mario.height <= platform.y &&
        mario.x + mario.width - 5 > platform.x &&
        mario.x + 5 < platform.x + platform.width) {
      
      mario.velocityY = 0;
      nextY = platform.y - mario.height;
      mario.onGround = true;
    }
  }
  
  let nextX = newX;
  
  for (const platform of level.platforms) {
    if (mario.velocityX < 0 &&
        nextX < platform.x + platform.width &&
        mario.x >= platform.x + platform.width &&
        nextY + mario.height - 5 > platform.y &&
        nextY + 5 < platform.y + platform.height) {
      
      nextX = platform.x + platform.width;
      mario.velocityX = 0;
    }
    
    if (mario.velocityX > 0 &&
        nextX + mario.width > platform.x &&
        mario.x + mario.width <= platform.x &&
        nextY + mario.height - 5 > platform.y &&
        nextY + 5 < platform.y + platform.height) {
      
      nextX = platform.x - mario.width;
      mario.velocityX = 0;
    }
  }
  
  mario.x = nextX;
  mario.y = nextY;
  
  // Ograniczenia
  mario.x = Math.max(0, Math.min(mario.x, 1300 - mario.width));
  mario.y = Math.max(0, Math.min(mario.y, 500));
  
  // Kolizja z flagą
  if (!marioGame.levelComplete) {
    const flag = level.flag;
    if (mario.x + mario.width > flag.x && 
        mario.x < flag.x + flag.width && 
        mario.y + mario.height > flag.y && 
        mario.y < flag.y + flag.height) {
      completeMarioLevel();
      return;
    }
  }
  
  // Zbieranie monet
  for (let i = 0; i < level.coins.length; i++) {
    if (marioGame.coinsCollected.includes(i)) continue;
    
    const coin = level.coins[i];
    const dx = Math.abs(mario.x + mario.width/2 - coin.x);
    const dy = Math.abs(mario.y + mario.height/2 - coin.y);
    
    if (dx < 25 && dy < 25) {
      marioGame.coinsCollected.push(i);
      marioGame.score += 10;
      
      // USUNIĘTO efekty cząsteczkowe przy monetach
      
      soundSystem.play('collect');
      updateMarioScore();
    }
  }
  
  // Aktualizacja wrogów
  marioGame.enemies.forEach(enemy => {
    if (!enemy.alive) return;
    
    // Ruch wroga
    enemy.x += enemy.direction * enemy.speed * 50 * deltaTime;
    
    // Sprawdź kolizje z platformami dla AI wroga
    let onPlatform = false;
    let willFall = true;
    
    for (const platform of level.platforms) {
      // Sprawdź czy wróg stoi na platformie
      if (enemy.x + enemy.width > platform.x && 
          enemy.x < platform.x + platform.width &&
          enemy.y + enemy.height >= platform.y - 1 && 
          enemy.y + enemy.height <= platform.y + 5) {
        onPlatform = true;
        
        // Sprawdź czy przed wrogiem jest krawędź
        const checkX = enemy.x + (enemy.direction > 0 ? enemy.width + 5 : -5);
        let hasGroundAhead = false;
        
        for (const platform2 of level.platforms) {
          if (checkX > platform2.x && 
              checkX < platform2.x + platform2.width &&
              enemy.y + enemy.height >= platform2.y - 1 && 
              enemy.y + enemy.height <= platform2.y + 5) {
            hasGroundAhead = true;
            break;
          }
        }
        
        if (!hasGroundAhead || 
            enemy.x <= platform.x || 
            enemy.x + enemy.width >= platform.x + platform.width) {
          enemy.direction *= -1;
        }
        break;
      }
      
      // Sprawdź czy wróg będzie miał podłoże przed sobą
      const futureX = enemy.x + (enemy.direction * enemy.width * 0.5);
      if (futureX > platform.x && 
          futureX < platform.x + platform.width &&
          enemy.y + enemy.height >= platform.y - 1 && 
          enemy.y + enemy.height <= platform.y + 10) {
        willFall = false;
      }
    }
    
    if (!onPlatform || willFall) {
      enemy.direction *= -1;
      enemy.x += enemy.direction * enemy.speed * 50 * deltaTime;
    }
    
    // Kolizja z Mario
    if (mario.x + mario.width > enemy.x &&
        mario.x < enemy.x + enemy.width &&
        mario.y + mario.height > enemy.y &&
        mario.y < enemy.y + enemy.height) {
      
      if (mario.velocityY > 0 && mario.y + mario.height - enemy.y < 10) {
        // Mario skacze na wroga
        enemy.alive = false;
        mario.velocityY = mario.jumpPower * 0.7;
        marioGame.score += enemy.type === 'koopa' ? 75 : 50;
        
        // USUNIĘTO efekty cząsteczkowe przy zabijaniu wrogów
        
        soundSystem.play('collect');
        updateMarioScore();
      } else {
        // Mario traci życie
        marioGame.lives--;
        if (marioGame.lives <= 0) {
          gameOverMario();
        } else {
          resetMarioPosition();
          soundSystem.play('gameOver');
          showNotification(`💔 Trafiłeś wroga! Pozostało żyć: ${marioGame.lives}`);
        }
        updateMarioScore();
      }
    }
  });
  
  // Spadnięcie
  if (mario.y > 450) {
    marioGame.lives--;
    if (marioGame.lives <= 0) {
      gameOverMario();
    } else {
      resetMarioPosition();
      soundSystem.play('gameOver');
      showNotification(`💔 Spadłeś! Pozostało żyć: ${marioGame.lives}`);
    }
    updateMarioScore();
  }
  
  // Kamera
  marioGame.camera.x = mario.x - marioGame.camera.width / 2 + mario.width / 2;
  marioGame.camera.x = Math.max(0, Math.min(marioGame.camera.x, 1300 - marioGame.camera.width));
  
  updateMarioScore();
}

function resetMarioPosition() {
  if (!marioGame) return;
  
  const mario = marioGame.mario;
  mario.x = 50;
  mario.y = 300;
  mario.velocityX = 0;
  mario.velocityY = 0;
  mario.onGround = false;
  mario.canJump = true;
  mario.isCrouching = false;
  mario.height = 40;
  
  if (marioGame.camera) {
    marioGame.camera.x = 0;
  }
  
  if (marioGame.startTime) {
    marioGame.startTime = Date.now();
  }
  
  // USUNIĘTO efekty cząsteczkowe przy resetowaniu pozycji
}

function gameOverMario() {
  if (!marioGame) return;
  
  marioGame.gameOver = true;
  
  // Zatrzymaj animację
  if (marioGame.animationId) {
    cancelAnimationFrame(marioGame.animationId);
    marioGame.animationId = null;
  }
  
  // Sprawdź osiągnięcia
  achievementsManager.checkAchievements('mario', marioGame.currentLevelIndex + 1);
  
  // Zagraj dźwięk
  soundSystem.play('gameOver');
  
  // Pokaż powiadomienie
  showNotification(`💔 Koniec gry! Wynik: ${marioGame.score}`);
  
  // Narysuj ekran Game Over
  drawMario();
}

function completeMarioLevel() {
  if (marioGame.levelComplete) return;
  
  marioGame.levelComplete = true;
  marioGame.wasCompleted = true;
  
  const level = marioGame.level;
  const timeLeft = Math.floor(marioGame.levelTime);
  const coinBonus = marioGame.coinsCollected.length * 10;
  const timeBonus = Math.max(0, timeLeft * 5);
  const levelBonus = (marioGame.currentLevelIndex + 1) * 100;
  
  marioGame.score += coinBonus + timeBonus + levelBonus;
  
  // Odblokuj następny poziom
  const nextLevelId = marioGame.currentLevelIndex + 2;
  if (nextLevelId <= marioLevels.length) {
    if (unlockMarioLevel(nextLevelId)) {
      showNotification(`🎉 Odblokowano poziom ${nextLevelId}!`);
    }
  }
  
  saveMarioCurrentLevel(marioGame.currentLevelIndex + 1);
  
  achievementsManager.checkAchievements('mario', marioGame.currentLevelIndex + 1);
  levelSystem.addXP(200 + marioGame.currentLevelIndex * 100);
  dailyChallengeSystem.updateProgress('mario', marioGame.coinsCollected.length);
  levelRewardsSystem.addCoins(50 + (marioGame.currentLevelIndex + 1) * 25);
  
  // USUNIĘTO efekty cząsteczkowe przy ukończeniu poziomu
  
  soundSystem.play('levelUp');
  showNotification(`🏆 Poziom ${marioGame.currentLevelIndex + 1} ukończony! +${coinBonus + timeBonus + levelBonus} punktów`);
  updateMarioScore();
}

// ===== DRAW GAME =====
function drawMario() {
  if (!marioGame) return;
  
  const canvas = document.getElementById('marioCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const level = marioGame.level;
  const camera = marioGame.camera;
  const mario = marioGame.mario;
  
  // Tło nocne dla poziomu 4
  if (level.id === 4) {
    const nightGradient = ctx.createLinearGradient(0, 0, 0, 400);
    nightGradient.addColorStop(0, '#1a237e');
    nightGradient.addColorStop(0.7, '#283593');
    nightGradient.addColorStop(1, '#3949ab');
    ctx.fillStyle = nightGradient;
    ctx.fillRect(0, 0, 600, 400);
    
    // Gwiazdy
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 50; i++) {
      const x = (i * 47) % 1200;
      const y = (i * 23) % 400;
      if (x - camera.x > -10 && x - camera.x < 610) {
        ctx.beginPath();
        ctx.arc(x - camera.x, y, Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else {
    // Normalne tło
    const skyGradient = ctx.createLinearGradient(0, 0, 0, 400);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(0.7, '#E0F6FF');
    skyGradient.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, 600, 400);
  }
  
  // Platformy
  level.platforms.forEach(platform => {
    const px = platform.x - camera.x;
    const py = platform.y;
    
    if (px + platform.width < 0 || px > 600) return;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(px + 3, py + 3, platform.width, platform.height);
    
    if (level.id === 4) {
      // Nocne platformy
      ctx.fillStyle = '#5D4037';
    } else {
      ctx.fillStyle = '#8B4513';
    }
    ctx.fillRect(px, py, platform.width, platform.height);
  });
  
  // Monety
  level.coins.forEach((coin, index) => {
    if (marioGame.coinsCollected.includes(index)) return;
    
    const cx = coin.x - camera.x;
    const cy = coin.y;
    
    if (cx + 20 < 0 || cx - 20 > 600) return;
    
    ctx.save();
    ctx.translate(cx, cy);
    
    const pulse = 0.9 + Math.sin(Date.now() / 200) * 0.1;
    
    // Animacja obrotu monety
    ctx.rotate(Date.now() / 500);
    
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(0, 0, 10 * pulse, 7 * pulse, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.ellipse(0, 0, 6 * pulse, 4 * pulse, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  });
  
  // Flaga
  const flag = level.flag;
  const fx = flag.x - camera.x;
  const fy = flag.y;
  
  if (fx + 50 > 0 && fx < 600) {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(fx, fy, 10, flag.height);
    
    const flagWave = Math.sin(Date.now() / 300) * 5;
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.moveTo(fx + 10, fy + 20);
    ctx.lineTo(fx + 50 + flagWave, fy + 30);
    ctx.lineTo(fx + 10, fy + 40);
    ctx.closePath();
    ctx.fill();
    
    // Kula na szczycie
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(fx + 5, fy, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Wrogowie z lepszymi kolorami i animacją
  marioGame.enemies.forEach(enemy => {
    if (!enemy.alive) return;
    
    const ex = enemy.x - camera.x;
    const ey = enemy.y;
    
    if (ex + enemy.width < 0 || ex > 600) return;
    
    // Animacja chodzenia
    const walkOffset = Math.sin(Date.now() / 200 + enemy.x) * 2;
    
    if (enemy.type === 'koopa') {
      // Koopa Troopa (zielony żółw)
      ctx.fillStyle = '#00AA00';
      ctx.beginPath();
      ctx.ellipse(ex + enemy.width/2, ey + enemy.height/2, enemy.width/2, enemy.height/2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Skorupa
      ctx.fillStyle = '#008800';
      ctx.beginPath();
      ctx.ellipse(ex + enemy.width/2, ey + enemy.height/3, enemy.width/2, enemy.height/3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Oczy
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(ex + enemy.width/3, ey + enemy.height/3, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ex + enemy.width*2/3, ey + enemy.height/3, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(ex + enemy.width/3 + (enemy.direction > 0 ? 1 : -1), ey + enemy.height/3, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ex + enemy.width*2/3 + (enemy.direction > 0 ? 1 : -1), ey + enemy.height/3, 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Nogi - animacja chodzenia
      ctx.fillStyle = '#006600';
      ctx.fillRect(ex + 5, ey + enemy.height - 5, 5, 8 + walkOffset);
      ctx.fillRect(ex + enemy.width - 10, ey + enemy.height - 5, 5, 8 - walkOffset);
    } else {
      // Goomba (brązowy grzybek)
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.ellipse(ex + enemy.width/2, ey + enemy.height/2, enemy.width/2, enemy.height/2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Kapelusz
      ctx.fillStyle = '#A0522D';
      ctx.beginPath();
      ctx.ellipse(ex + enemy.width/2, ey + enemy.height/3, enemy.width/2, enemy.height/4, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Oczy
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(ex + enemy.width/3, ey + enemy.height/2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ex + enemy.width*2/3, ey + enemy.height/2, 4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(ex + enemy.width/3 + (enemy.direction > 0 ? 1 : -1), ey + enemy.height/2, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ex + enemy.width*2/3 + (enemy.direction > 0 ? 1 : -1), ey + enemy.height/2, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Usta
      ctx.fillStyle = '#000000';
      ctx.fillRect(ex + enemy.width/3, ey + enemy.height*2/3, enemy.width/3, 2);
      
      // Nogi - animacja chodzenia
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(ex + 5, ey + enemy.height - 5, 5, 8 + walkOffset);
      ctx.fillRect(ex + enemy.width - 10, ey + enemy.height - 5, 5, 8 - walkOffset);
    }
  });
  
  // USUNIĘTO rysowanie cząsteczek
  
  // Mario
  const mx = mario.x - camera.x;
  const my = mario.y;
  
  if (mx + mario.width > 0 && mx < 600) {
    // Buty
    ctx.fillStyle = '#E52521';
    ctx.fillRect(mx, my + mario.height - 10, mario.width, 10);
    
    // Spodnie
    ctx.fillStyle = '#1E90FF';
    ctx.fillRect(mx, my + 25, mario.width, mario.height - 35);
    
    // Koszula
    ctx.fillStyle = '#E52521';
    ctx.fillRect(mx + 5, my + 15, mario.width - 10, 10);
    
    // Głowa
    ctx.fillStyle = '#FFCC99';
    ctx.fillRect(mx + 5, my, mario.width - 10, 15);
    
    // Czapka
    ctx.fillStyle = '#E52521';
    ctx.fillRect(mx + 3, my - 5, mario.width - 6, 10);
    ctx.fillRect(mx + mario.width/2 - 10, my - 10, 20, 8);
    
    // Włosy
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(mx + 8, my + 2, mario.width - 16, 3);
    
    // Oczy
    ctx.fillStyle = '#1E90FF';
    if (mario.facingRight) {
      ctx.fillRect(mx + 10, my + 4, 4, 4);
      ctx.fillRect(mx + 16, my + 4, 4, 4);
    } else {
      ctx.fillRect(mx + mario.width - 14, my + 4, 4, 4);
      ctx.fillRect(mx + mario.width - 20, my + 4, 4, 4);
    }
    
    // Wąs
    ctx.fillStyle = '#8B4513';
    if (mario.facingRight) {
      ctx.fillRect(mx + 10, my + 8, 12, 2);
    } else {
      ctx.fillRect(mx + mario.width - 22, my + 8, 12, 2);
    }
  }
  
  // HUD
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(10, 10, 200, 90);
  ctx.fillRect(390, 10, 200, 90);
  
  // Lewy panel
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 18px Arial';
  ctx.fillText(`💰 ${marioGame.coinsCollected.length}/${level.requiredCoins}`, 20, 35);
  
  ctx.fillStyle = '#FF4444';
  ctx.fillText(`❤️ ${marioGame.lives}`, 20, 60);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`🎯 ${marioGame.score}`, 20, 85);
  
  // Prawy panel
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'right';
  ctx.fillText(`Poziom: ${marioGame.currentLevelIndex + 1}`, 580, 35);
  
  const minutes = Math.floor(marioGame.levelTime / 60);
  const seconds = Math.floor(marioGame.levelTime % 60);
  ctx.fillText(`⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`, 580, 60);
  ctx.textAlign = 'left';
  
  // Przycisk "Wybierz Poziom"
  ctx.fillStyle = 'rgba(255, 140, 0, 0.9)';
  ctx.fillRect(250, 10, 120, 35);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.strokeRect(250, 10, 120, 35);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('🎮 Wybierz Poziom', 310, 32);
  ctx.textAlign = 'left';
  
  // Level Complete Screen
  if (marioGame.levelComplete) {
    ctx.fillStyle = 'rgba(0, 100, 0, 0.9)';
    ctx.fillRect(0, 0, 600, 400);
    
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎉 POZIOM UKOŃCZONY!', 300, 100);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px Arial';
    ctx.fillText(`Poziom ${marioGame.currentLevelIndex + 1}: ${level.name}`, 300, 150);
    ctx.fillText(`Zebrane monety: ${marioGame.coinsCollected.length}/${level.requiredCoins}`, 300, 190);
    ctx.fillText(`Pozostały czas: ${Math.floor(marioGame.levelTime)}s`, 300, 230);
    ctx.fillText(`Wynik: ${marioGame.score}`, 300, 270);
    
    const nextLevelId = marioGame.currentLevelIndex + 2;
    const hasNextLevel = nextLevelId <= marioLevels.length;
    
    if (hasNextLevel) {
      ctx.fillStyle = '#0070f3';
      ctx.fillRect(200, 300, 200, 45);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`POZIOM ${nextLevelId}`, 300, 330);
    }
    
    ctx.fillStyle = '#FF8C00';
    ctx.fillRect(200, 360, 200, 45);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('WYBÓR POZIOMU', 300, 390);
  }
  
  // Game Over Screen
  if (marioGame.gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
    ctx.fillRect(0, 0, 600, 400);
    
    ctx.fillStyle = '#FF0000';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', 300, 150);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '30px Arial';
    ctx.fillText(`Poziom: ${marioGame.currentLevelIndex + 1}`, 300, 200);
    ctx.fillText(`Wynik: ${marioGame.score}`, 300, 240);
    ctx.fillText(`Monety: ${marioGame.coinsCollected.length}/${level.requiredCoins}`, 300, 280);
    
    ctx.font = '22px Arial';
    ctx.fillText('Kliknij RESTART aby spróbować ponownie', 300, 340);
  }
}

// ===== OBSŁUGA KLIKNIĘĆ NA EKRANIE =====
function setupMarioCanvasClick() {
  const canvas = document.getElementById('marioCanvas');
  if (!canvas) return;
  
  canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (marioGame && marioGame.levelComplete) {
      const nextLevelId = marioGame.currentLevelIndex + 2;
      const hasNextLevel = nextLevelId <= marioLevels.length;
      
      if (hasNextLevel && x >= 200 && x <= 400 && y >= 300 && y <= 345) {
        startMarioLevel(nextLevelId);
        return;
      }
      
      if (x >= 200 && x <= 400 && y >= 360 && y <= 405) {
        showMarioLevelSelect();
        return;
      }
    }
    
    if (marioGame && !marioGame.gameOver && !marioGame.levelComplete) {
      if (x >= 250 && x <= 370 && y >= 10 && y <= 45) {
        showMarioLevelSelect();
      }
    }
  });
}

function updateMarioScore() {
  const scoreEl = document.getElementById('marioScore');
  if (scoreEl && marioGame) {
    const minutes = Math.floor(marioGame.levelTime / 60);
    const seconds = Math.floor(marioGame.levelTime % 60);
    scoreEl.textContent = `Poziom: ${marioGame.currentLevelIndex + 1} | Monety: ${marioGame.coinsCollected.length}/${marioGame.level.requiredCoins} | Wynik: ${marioGame.score} | Życia: ${marioGame.lives} | Czas: ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// ===== RESET GRY =====
function resetMario() {
  if (marioGame && marioGame.animationId) {
    cancelAnimationFrame(marioGame.animationId);
    marioGame.animationId = null;
  }
  
  if (gameStateManager.currentGameLoop) {
    clearInterval(gameStateManager.currentGameLoop);
    gameStateManager.currentGameLoop = null;
  }
  
  inputHandler.clearAll();
  marioGame = null;
  gameStateManager.currentGame = null;
  
  setTimeout(() => {
    initMario();
    gameStateManager.currentGame = 'mario';
    setupMarioCanvasClick();
  }, 100);
}

// ===== OBSŁUGA PRZYCISKU W MENU GŁÓWNYM =====
function selectMarioGame() {
  showMarioLevelSelect();
}

// ===== NAPRAWA SKLEPU - DODAJ TĘ FUNKCJĘ DO javascript.js =====
function fixShopBug() {
  console.log("🔧 Naprawiam błąd sklepu...");
  
  if (window.levelRewardsSystem) {
    levelRewardsSystem.updateDisplay();
    
    if (document.getElementById('shopModal') && 
        !document.getElementById('shopModal').classList.contains('hidden')) {
      levelRewardsSystem.updateShopDisplay();
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(setupMarioCanvasClick, 1000);
  
  const marioTile = document.querySelector('.game-tile:nth-child(6)');
  if (marioTile) {
    const marioButton = marioTile.querySelector('.play-button');
    if (marioButton) {
      marioButton.onclick = selectMarioGame;
    }
  }
});

function initializeMarioLevelSystem() {
  const unlocked = getMarioUnlockedLevels();
  if (!unlocked.includes(1)) {
    saveMarioUnlockedLevels([1]);
  }
  
  if (!localStorage.getItem('marioCurrentLevel')) {
    saveMarioCurrentLevel(1);
  }
}

initializeMarioLevelSystem();