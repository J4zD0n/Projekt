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
    bricksDestroyed: 0,
    particles: [],
    // System power-upów
    powerups: [],           // Spadające power-upy
    activePowerup: null,    // Aktywny efekt: {type, timer}
    extraBalls: [],         // Dodatkowe piłki (MULTI)
    lasers: [],             // Aktywne lasery
    laserCooldown: 0,       // Cooldown strzelania laserem
    shakeAmount: 0,         // Intensywność trzęsienia ekranu
    originalBallSpeed: null // Oryginalna prędkość piłki (SLOW)
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
  const level = breakoutGame.level;
  const cols = 10;
  const brickWidth = 55;
  const brickHeight = 20;
  const padding = 5;
  
  // Kolory tematyczne dla poziomów
  const colorThemes = [
    ['#ff0000', '#ff7700', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'], // Tęcza
    ['#ff4444', '#ff8800', '#ffcc00'],                                              // Ognisty
    ['#00ccff', '#0066ff', '#6600ff', '#cc00ff'],                                   // Lodowy
    ['#ff0066', '#ff3399', '#ff66cc', '#ff99ff'],                                   // Różowy
    ['#00ff88', '#00cc66', '#009944', '#006622'],                                   // Leśny
    ['#ffaa00', '#cc8800', '#996600', '#664400'],                                   // Złoty
    ['#ff0000', '#0000ff', '#ffff00', '#00ff00', '#ff00ff', '#00ffff'],             // Neonowy
  ];
  
  const themeIndex = (level - 1) % colorThemes.length;
  const colors = colorThemes[themeIndex];
  const patternIndex = (level - 1) % 7; // 7 unikalnych wzorów
  
  // Bazowe punkty rosnące z poziomem
  const basePoints = 10 + (level - 1) * 5;
  
  switch (patternIndex) {
    case 0: // === KLASYCZNY — prosta siatka ===
    {
      const rows = Math.min(5 + Math.floor(level / 3), 8);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          breakoutGame.bricks.push({
            x: col * (brickWidth + padding) + 5,
            y: row * (brickHeight + padding) + 30,
            width: brickWidth,
            height: brickHeight,
            color: colors[row % colors.length],
            visible: true,
            points: (rows - row) * basePoints,
            hp: row === 0 && level > 3 ? 2 : 1 // Górny rząd ma 2 HP od poziomu 4
          });
        }
      }
      break;
    }
    
    case 1: // === PIRAMIDA ===
    {
      const rows = Math.min(6 + Math.floor(level / 4), 9);
      for (let row = 0; row < rows; row++) {
        const bricksInRow = row + 1;
        const startCol = Math.floor((cols - bricksInRow) / 2);
        for (let col = 0; col < bricksInRow; col++) {
          breakoutGame.bricks.push({
            x: (startCol + col) * (brickWidth + padding) + 5,
            y: row * (brickHeight + padding) + 30,
            width: brickWidth,
            height: brickHeight,
            color: colors[row % colors.length],
            visible: true,
            points: (rows - row) * basePoints,
            hp: row < 2 ? 2 : 1
          });
        }
      }
      break;
    }
    
    case 2: // === DIAMENT ===
    {
      const halfRows = 4;
      // Górna połowa (rozszerzanie)
      for (let row = 0; row < halfRows; row++) {
        const bricksInRow = (row + 1) * 2 - 1;
        const startCol = Math.floor((cols - bricksInRow) / 2);
        for (let col = 0; col < bricksInRow; col++) {
          breakoutGame.bricks.push({
            x: (startCol + col) * (brickWidth + padding) + 5,
            y: row * (brickHeight + padding) + 30,
            width: brickWidth,
            height: brickHeight,
            color: colors[(row + col) % colors.length],
            visible: true,
            points: basePoints * 2,
            hp: row === 0 ? 3 : 1
          });
        }
      }
      // Dolna połowa (zwężanie)
      for (let row = 0; row < halfRows - 1; row++) {
        const bricksInRow = (halfRows - row - 1) * 2 - 1;
        const startCol = Math.floor((cols - bricksInRow) / 2);
        for (let col = 0; col < bricksInRow; col++) {
          breakoutGame.bricks.push({
            x: (startCol + col) * (brickWidth + padding) + 5,
            y: (halfRows + row) * (brickHeight + padding) + 30,
            width: brickWidth,
            height: brickHeight,
            color: colors[(row + col) % colors.length],
            visible: true,
            points: basePoints * 2,
            hp: 1
          });
        }
      }
      break;
    }
    
    case 3: // === STRIPES — naprzemienne pasy ===
    {
      const rows = 7;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Co drugi rząd — pełny, reszta — co druga cegła
          if (row % 2 === 0) {
            breakoutGame.bricks.push({
              x: col * (brickWidth + padding) + 5,
              y: row * (brickHeight + padding) + 30,
              width: brickWidth,
              height: brickHeight,
              color: colors[0],
              visible: true,
              points: basePoints,
              hp: level > 5 ? 2 : 1
            });
          } else if (col % 2 === 0) {
            breakoutGame.bricks.push({
              x: col * (brickWidth + padding) + 5,
              y: row * (brickHeight + padding) + 30,
              width: brickWidth,
              height: brickHeight,
              color: colors[1 % colors.length],
              visible: true,
              points: basePoints * 2,
              hp: 1
            });
          }
        }
      }
      break;
    }
    
    case 4: // === SZACHOWNICA ===
    {
      const rows = 7;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if ((row + col) % 2 === 0) {
            breakoutGame.bricks.push({
              x: col * (brickWidth + padding) + 5,
              y: row * (brickHeight + padding) + 30,
              width: brickWidth,
              height: brickHeight,
              color: colors[(row + col) % colors.length],
              visible: true,
              points: basePoints,
              hp: (row === 0 || row === rows - 1) && level > 4 ? 2 : 1
            });
          }
        }
      }
      break;
    }
    
    case 5: // === FORTECA — mury z wieżami ===
    {
      // Wieże (kolumny 0,1 i 8,9)
      for (let row = 0; row < 7; row++) {
        for (let col of [0, 1, 8, 9]) {
          breakoutGame.bricks.push({
            x: col * (brickWidth + padding) + 5,
            y: row * (brickHeight + padding) + 30,
            width: brickWidth,
            height: brickHeight,
            color: colors[0],
            visible: true,
            points: basePoints,
            hp: 2
          });
        }
      }
      // Mur (rząd 3-4, kolumny 2-7)
      for (let row = 3; row <= 4; row++) {
        for (let col = 2; col <= 7; col++) {
          breakoutGame.bricks.push({
            x: col * (brickWidth + padding) + 5,
            y: row * (brickHeight + padding) + 30,
            width: brickWidth,
            height: brickHeight,
            color: colors[1 % colors.length],
            visible: true,
            points: basePoints * 2,
            hp: level > 3 ? 3 : 2
          });
        }
      }
      // Blanki na górze
      for (let col = 2; col <= 7; col += 2) {
        breakoutGame.bricks.push({
          x: col * (brickWidth + padding) + 5,
          y: 0 * (brickHeight + padding) + 30,
          width: brickWidth,
          height: brickHeight,
          color: colors[2 % colors.length],
          visible: true,
          points: basePoints * 3,
          hp: 1
        });
      }
      break;
    }
    
    case 6: // === KRZYŻ ===
    {
      const rows = 7;
      const centerCol = Math.floor(cols / 2);
      const centerRow = Math.floor(rows / 2);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Krzyż: środkowy rząd lub środkowa kolumna (±1)
          const inHorizontal = (row >= centerRow - 1 && row <= centerRow + 1);
          const inVertical = (col >= centerCol - 1 && col <= centerCol + 1);
          if (inHorizontal || inVertical) {
            breakoutGame.bricks.push({
              x: col * (brickWidth + padding) + 5,
              y: row * (brickHeight + padding) + 30,
              width: brickWidth,
              height: brickHeight,
              color: colors[(Math.abs(row - centerRow) + Math.abs(col - centerCol)) % colors.length],
              visible: true,
              points: (inHorizontal && inVertical) ? basePoints * 3 : basePoints,
              hp: (inHorizontal && inVertical) ? 3 : 1
            });
          }
        }
      }
      break;
    }
  }
}

// Typy power-upów
const POWERUP_TYPES = [
  { type: 'WIDE',  color: '#00BFFF', letter: 'W', duration: 600 },  // 10 sekund
  { type: 'MULTI', color: '#00FF00', letter: 'M', duration: 0 },    // Jednorazowy efekt
  { type: 'LASER', color: '#FF0000', letter: 'L', duration: 480 },  // 8 sekund
  { type: 'SLOW',  color: '#FFD700', letter: 'S', duration: 480 }   // 8 sekund
];

// Próba stworzenia power-upa po zniszczeniu cegły
function trySpawnPowerup(brickX, brickY, brickWidth, brickHeight) {
  if (Math.random() < 0.15) {
    const typeInfo = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
    breakoutGame.powerups.push({
      x: brickX + brickWidth / 2 - 10,
      y: brickY + brickHeight / 2 - 10,
      type: typeInfo.type,
      color: typeInfo.color,
      letter: typeInfo.letter,
      vy: 2
    });
  }
}

// Aktywacja power-upa
function activatePowerup(powerup) {
  const typeInfo = POWERUP_TYPES.find(t => t.type === powerup.type);
  
  // Dezaktywuj poprzedni power-up przed aktywacją nowego
  if (breakoutGame.activePowerup) {
    deactivatePowerup();
  }
  
  switch (powerup.type) {
    case 'WIDE':
      breakoutGame.paddle.width = 160;
      breakoutGame.activePowerup = { type: 'WIDE', timer: typeInfo.duration };
      showNotification('⬛ Szeroka paletka!');
      break;
      
    case 'MULTI':
      // Dodaj 2 dodatkowe piłki
      for (let i = 0; i < 2; i++) {
        const angle = (Math.random() - 0.5) * 2;
        breakoutGame.extraBalls.push({
          x: breakoutGame.ball.x,
          y: breakoutGame.ball.y,
          dx: breakoutGame.ball.dx + angle * 2,
          dy: breakoutGame.ball.dy,
          radius: breakoutGame.ball.radius
        });
      }
      // MULTI nie ma timera, piłki żyją dopóki nie spadną
      showNotification('🟢 Multi piłki!');
      break;
      
    case 'LASER':
      breakoutGame.activePowerup = { type: 'LASER', timer: typeInfo.duration };
      breakoutGame.laserCooldown = 0;
      showNotification('🔴 Laser aktywny! SPACJA = strzał');
      break;
      
    case 'SLOW':
      breakoutGame.originalBallSpeed = {
        dx: breakoutGame.ball.dx,
        dy: breakoutGame.ball.dy
      };
      breakoutGame.ball.dx *= 0.5;
      breakoutGame.ball.dy *= 0.5;
      // Spowolnij też dodatkowe piłki
      breakoutGame.extraBalls.forEach(eb => {
        eb.dx *= 0.5;
        eb.dy *= 0.5;
      });
      breakoutGame.activePowerup = { type: 'SLOW', timer: typeInfo.duration };
      showNotification('🟡 Spowolnienie!');
      break;
  }
  
  soundSystem.play('collect');
}

// Dezaktywacja power-upa (przywrócenie efektów)
function deactivatePowerup() {
  if (!breakoutGame.activePowerup) return;
  
  switch (breakoutGame.activePowerup.type) {
    case 'WIDE':
      breakoutGame.paddle.width = 100;
      // Upewnij się, że paletka nie wychodzi poza ekran
      if (breakoutGame.paddle.x + breakoutGame.paddle.width > 600) {
        breakoutGame.paddle.x = 600 - breakoutGame.paddle.width;
      }
      break;
      
    case 'LASER':
      breakoutGame.lasers = [];
      break;
      
    case 'SLOW':
      if (breakoutGame.originalBallSpeed) {
        // Przywróć oryginalną prędkość, zachowując kierunek
        const currentDx = breakoutGame.ball.dx;
        const currentDy = breakoutGame.ball.dy;
        breakoutGame.ball.dx = Math.sign(currentDx) * Math.abs(breakoutGame.originalBallSpeed.dx);
        breakoutGame.ball.dy = Math.sign(currentDy) * Math.abs(breakoutGame.originalBallSpeed.dy);
        // Przywróć prędkość dodatkowych piłek
        breakoutGame.extraBalls.forEach(eb => {
          eb.dx *= 2;
          eb.dy *= 2;
        });
        breakoutGame.originalBallSpeed = null;
      }
      break;
  }
  
  breakoutGame.activePowerup = null;
}

// Zniszczenie cegły (współdzielone przez piłkę i laser)
function destroyBrick(brick) {
  // System HP — cegły wielouderzeniowe
  if (!brick.hp) brick.hp = 1;
  brick.hp--;
  
  if (brick.hp > 0) {
    // Cegła jeszcze żyje — przyciemnij kolor
    breakoutGame.shakeAmount = 2;
    soundSystem.play('click');
    // Cząsteczki (mniej niż przy zniszczeniu)
    for (let i = 0; i < 3; i++) {
      breakoutGame.particles.push({
        x: brick.x + brick.width / 2,
        y: brick.y + brick.height / 2,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 0.5,
        color: '#ffffff',
        size: Math.random() * 2 + 1
      });
    }
    return;
  }
  
  brick.visible = false;
  breakoutGame.score += brick.points;
  breakoutGame.bricksDestroyed++;
  breakoutGame.shakeAmount = 3;
  
  // Cząsteczki rozbicia
  for (let i = 0; i < 8; i++) {
    breakoutGame.particles.push({
      x: brick.x + brick.width / 2,
      y: brick.y + brick.height / 2,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 1.0,
      color: brick.color,
      size: Math.random() * 4 + 2
    });
  }
  
  // Próba spawnu power-upa
  trySpawnPowerup(brick.x, brick.y, brick.width, brick.height);
  
  dailyChallengeSystem.updateProgress('breakout', breakoutGame.bricksDestroyed);
  levelSystem.addXP(5);
  soundSystem.play('collect');
  
  updateBreakoutScore();
}

function updateBreakout() {
  // Ruch paletki
  if (inputHandler.isPressed('left')) {
    breakoutGame.paddle.x = Math.max(0, breakoutGame.paddle.x - breakoutGame.paddle.speed);
  }
  if (inputHandler.isPressed('right')) {
    breakoutGame.paddle.x = Math.min(600 - breakoutGame.paddle.width, breakoutGame.paddle.x + breakoutGame.paddle.speed);
  }
  
  // Wystrzał piłki
  if (breakoutGame.ball.stuck && inputHandler.isPressed('space')) {
    breakoutGame.ball.stuck = false;
    soundSystem.play('jump');
  }
  
  // Strzelanie laserem
  if (breakoutGame.activePowerup && breakoutGame.activePowerup.type === 'LASER') {
    if (breakoutGame.laserCooldown > 0) breakoutGame.laserCooldown--;
    
    if (inputHandler.isPressed('space') && !breakoutGame.ball.stuck && breakoutGame.laserCooldown <= 0) {
      breakoutGame.lasers.push({
        x: breakoutGame.paddle.x + breakoutGame.paddle.width / 2 - 2,
        y: breakoutGame.paddle.y,
        speed: -8,
        width: 4,
        height: 15
      });
      breakoutGame.laserCooldown = 10;
      soundSystem.play('click');
    }
  }
  
  // Piłka przyklejona do paletki
  if (breakoutGame.ball.stuck) {
    breakoutGame.ball.x = breakoutGame.paddle.x + breakoutGame.paddle.width / 2;
    breakoutGame.ball.y = breakoutGame.paddle.y - breakoutGame.ball.radius;
  } else {
    // Ruch głównej piłki
    breakoutGame.ball.x += breakoutGame.ball.dx;
    breakoutGame.ball.y += breakoutGame.ball.dy;
    
    // Odbicie od ścian bocznych
    if (breakoutGame.ball.x - breakoutGame.ball.radius < 0 || 
        breakoutGame.ball.x + breakoutGame.ball.radius > 600) {
      breakoutGame.ball.dx = -breakoutGame.ball.dx;
      soundSystem.play('click');
    }
    
    // Odbicie od górnej ściany
    if (breakoutGame.ball.y - breakoutGame.ball.radius < 0) {
      breakoutGame.ball.dy = -breakoutGame.ball.dy;
      soundSystem.play('click');
    }
    
    // Odbicie od paletki
    if (breakoutGame.ball.y + breakoutGame.ball.radius > breakoutGame.paddle.y &&
        breakoutGame.ball.x > breakoutGame.paddle.x &&
        breakoutGame.ball.x < breakoutGame.paddle.x + breakoutGame.paddle.width &&
        breakoutGame.ball.dy > 0) {
      
      const hitPos = (breakoutGame.ball.x - (breakoutGame.paddle.x + breakoutGame.paddle.width/2)) / (breakoutGame.paddle.width/2);
      breakoutGame.ball.dx = hitPos * 8; // Kąt zależy od odległości od środka (max 8)
      breakoutGame.ball.dy = -Math.abs(breakoutGame.ball.dy);
      // Minimalna wysokość podbicia, żeby piłka nie latała poziomo
      if (Math.abs(breakoutGame.ball.dy) < 3) breakoutGame.ball.dy = -3;
      
      soundSystem.play('jump');
    }
    
    // Kolizja głównej piłki z cegłami
    breakoutGame.bricks.forEach(brick => {
      if (brick.visible &&
          breakoutGame.ball.x + breakoutGame.ball.radius > brick.x &&
          breakoutGame.ball.x - breakoutGame.ball.radius < brick.x + brick.width &&
          breakoutGame.ball.y + breakoutGame.ball.radius > brick.y &&
          breakoutGame.ball.y - breakoutGame.ball.radius < brick.y + brick.height) {
        
        breakoutGame.ball.dy = -breakoutGame.ball.dy;
        destroyBrick(brick);
      }
    });
    
    // Sprawdzenie czy wszystkie cegły zniszczone
    if (breakoutGame.bricks.every(b => !b.visible)) {
      breakoutGame.level++;
      breakoutGame.ball.stuck = true;
      breakoutGame.ball.dx *= 1.1;
      breakoutGame.ball.dy *= 1.1;
      // Wyczyść power-upy przy nowym poziomie
      deactivatePowerup();
      breakoutGame.powerups = [];
      breakoutGame.extraBalls = [];
      breakoutGame.lasers = [];
      createBricks();
      soundSystem.play('levelUp');
      showNotification(`Poziom ${breakoutGame.level}!`);
    }
    
    // Piłka spadła poza ekran
    if (breakoutGame.ball.y > 500) {
      breakoutGame.lives--;
      soundSystem.play('gameOver');
      
      if (breakoutGame.lives <= 0) {
        breakoutGame.gameOver = true;
        breakoutGame.shakeAmount = 8;
        deactivatePowerup();
        achievementsManager.checkAchievements('breakout', breakoutGame.score);
        levelSystem.addXP(Math.floor(breakoutGame.score / 10));
      } else {
        breakoutGame.ball.stuck = true;
        breakoutGame.ball.x = 300;
        breakoutGame.ball.y = 400;
      }
    }
  }
  
  // === Aktualizacja dodatkowych piłek (MULTI) ===
  for (let i = breakoutGame.extraBalls.length - 1; i >= 0; i--) {
    const eb = breakoutGame.extraBalls[i];
    eb.x += eb.dx;
    eb.y += eb.dy;
    
    // Odbicia od ścian
    if (eb.x - eb.radius < 0 || eb.x + eb.radius > 600) {
      eb.dx = -eb.dx;
    }
    if (eb.y - eb.radius < 0) {
      eb.dy = -eb.dy;
    }
    
    // Odbicie od paletki
    if (eb.y + eb.radius > breakoutGame.paddle.y &&
        eb.x > breakoutGame.paddle.x &&
        eb.x < breakoutGame.paddle.x + breakoutGame.paddle.width &&
        eb.dy > 0) {
      const hitPos = (eb.x - (breakoutGame.paddle.x + breakoutGame.paddle.width/2)) / (breakoutGame.paddle.width/2);
      eb.dx = hitPos * 8;
      eb.dy = -Math.abs(eb.dy);
      if (Math.abs(eb.dy) < 3) eb.dy = -3;
    }
    
    // Kolizja z cegłami
    breakoutGame.bricks.forEach(brick => {
      if (brick.visible &&
          eb.x + eb.radius > brick.x &&
          eb.x - eb.radius < brick.x + brick.width &&
          eb.y + eb.radius > brick.y &&
          eb.y - eb.radius < brick.y + brick.height) {
        eb.dy = -eb.dy;
        destroyBrick(brick);
      }
    });
    
    // Usunięcie gdy spadnie poza ekran (bez utraty życia)
    if (eb.y > 500) {
      breakoutGame.extraBalls.splice(i, 1);
    }
  }
  
  // === Aktualizacja laserów ===
  for (let i = breakoutGame.lasers.length - 1; i >= 0; i--) {
    const laser = breakoutGame.lasers[i];
    laser.y += laser.speed;
    
    // Usunięcie gdy wyleci poza ekran
    if (laser.y + laser.height < 0) {
      breakoutGame.lasers.splice(i, 1);
      continue;
    }
    
    // Kolizja lasera z cegłami
    let laserHit = false;
    breakoutGame.bricks.forEach(brick => {
      if (!laserHit && brick.visible &&
          laser.x + laser.width > brick.x &&
          laser.x < brick.x + brick.width &&
          laser.y > brick.y &&
          laser.y < brick.y + brick.height) {
        destroyBrick(brick);
        laserHit = true;
      }
    });
    
    if (laserHit) {
      breakoutGame.lasers.splice(i, 1);
    }
  }
  
  // === Aktualizacja spadających power-upów ===
  for (let i = breakoutGame.powerups.length - 1; i >= 0; i--) {
    const pu = breakoutGame.powerups[i];
    pu.y += pu.vy;
    
    // Kolizja z paletką (złapanie)
    if (pu.x + 20 > breakoutGame.paddle.x &&
        pu.x < breakoutGame.paddle.x + breakoutGame.paddle.width &&
        pu.y + 20 > breakoutGame.paddle.y &&
        pu.y < breakoutGame.paddle.y + breakoutGame.paddle.height) {
      activatePowerup(pu);
      breakoutGame.powerups.splice(i, 1);
      continue;
    }
    
    // Usunięcie gdy spadnie poza ekran
    if (pu.y > 500) {
      breakoutGame.powerups.splice(i, 1);
    }
  }
  
  // === Timer aktywnego power-upa ===
  if (breakoutGame.activePowerup) {
    breakoutGame.activePowerup.timer--;
    if (breakoutGame.activePowerup.timer <= 0) {
      deactivatePowerup();
    }
  }
  
  // === Zmniejszanie trzęsienia ekranu ===
  if (breakoutGame.shakeAmount > 0) {
    breakoutGame.shakeAmount *= 0.9;
    if (breakoutGame.shakeAmount < 0.5) breakoutGame.shakeAmount = 0;
  }
  
  // Aktualizacja partykuł
  for (let i = breakoutGame.particles.length - 1; i >= 0; i--) {
     let p = breakoutGame.particles[i];
     p.x += p.vx;
     p.y += p.vy;
     p.vy += 0.2; // Grawitacja
     p.life -= 0.05;
     
     if (p.life <= 0) {
        breakoutGame.particles.splice(i, 1);
     }
  }
  
  updateBreakoutScore();
}

function updateBreakoutScore() {
  const scoreEl = document.getElementById('breakoutScore');
  if (scoreEl) {
    let text = `Wynik: ${breakoutGame.score} | Życia: ${breakoutGame.lives} | Poziom: ${breakoutGame.level}`;
    
    // Wyświetl aktywny power-up i pozostały czas
    if (breakoutGame.activePowerup) {
      const secondsLeft = Math.ceil(breakoutGame.activePowerup.timer / 60);
      const names = { WIDE: '⬛ Szeroka', LASER: '🔴 Laser', SLOW: '🟡 Wolno' };
      const name = names[breakoutGame.activePowerup.type] || breakoutGame.activePowerup.type;
      text += ` | ${name}: ${secondsLeft}s`;
    }
    
    // Pokaż liczbę dodatkowych piłek
    if (breakoutGame.extraBalls.length > 0) {
      text += ` | 🟢 Piłki: +${breakoutGame.extraBalls.length}`;
    }
    
    scoreEl.textContent = text;
  }
}

function drawBreakout() {
  const canvas = document.getElementById('breakoutCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Zastosuj trzęsienie ekranu
  ctx.save();
  if (breakoutGame.shakeAmount > 0) {
    const shakeX = (Math.random() - 0.5) * breakoutGame.shakeAmount * 2;
    const shakeY = (Math.random() - 0.5) * breakoutGame.shakeAmount * 2;
    ctx.translate(shakeX, shakeY);
  }
  
  // Tło
  const gradient = ctx.createLinearGradient(0, 0, 0, 500);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(1, '#16213e');
  ctx.fillStyle = gradient;
  ctx.fillRect(-10, -10, 620, 520); // Trochę większe, żeby shake nie odkrywał krawędzi
  
  // Cegły
  breakoutGame.bricks.forEach(brick => {
    if (brick.visible) {
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
      
      // Wizualne oznaczenie HP
      const hp = brick.hp || 1;
      if (hp >= 3) {
        // HP 3 — złoty kontur + ciemniejsze tło
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.strokeRect(brick.x + 1, brick.y + 1, brick.width - 2, brick.height - 2);
        ctx.lineWidth = 1;
        // Numer HP
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('3', brick.x + brick.width / 2, brick.y + brick.height / 2);
      } else if (hp === 2) {
        // HP 2 — białe paski (pęknięcie)
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(brick.x + 2, brick.y + brick.height / 2 - 1, brick.width - 4, 2);
        // Numer HP
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('2', brick.x + brick.width / 2, brick.y + brick.height / 2);
      }
    }
  });
  
  // Cząsteczki rozbicia
  breakoutGame.particles.forEach(p => {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });
  ctx.globalAlpha = 1.0;
  
  // === Rysowanie spadających power-upów ===
  breakoutGame.powerups.forEach(pu => {
    // Tło power-upa
    ctx.fillStyle = pu.color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(pu.x, pu.y, 20, 20);
    ctx.globalAlpha = 1.0;
    
    // Ramka
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pu.x, pu.y, 20, 20);
    
    // Litera typu
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pu.letter, pu.x + 10, pu.y + 10);
    
    ctx.lineWidth = 1;
  });
  
  // === Rysowanie laserów ===
  breakoutGame.lasers.forEach(laser => {
    ctx.fillStyle = '#FF0000';
    ctx.shadowColor = '#FF0000';
    ctx.shadowBlur = 6;
    ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
    ctx.shadowBlur = 0;
  });
  
  // Paletka z gradientem
  const paddleGradient = ctx.createLinearGradient(
    breakoutGame.paddle.x, 0, 
    breakoutGame.paddle.x + breakoutGame.paddle.width, 0
  );
  paddleGradient.addColorStop(0, '#0070f3');
  paddleGradient.addColorStop(1, '#00d4ff');
  
  // Zmień kolor paletki gdy WIDE jest aktywny
  if (breakoutGame.activePowerup && breakoutGame.activePowerup.type === 'WIDE') {
    const widePaddleGradient = ctx.createLinearGradient(
      breakoutGame.paddle.x, 0,
      breakoutGame.paddle.x + breakoutGame.paddle.width, 0
    );
    widePaddleGradient.addColorStop(0, '#00BFFF');
    widePaddleGradient.addColorStop(1, '#0070f3');
    ctx.fillStyle = widePaddleGradient;
  } else if (breakoutGame.activePowerup && breakoutGame.activePowerup.type === 'LASER') {
    // Czerwone miganie przy laserze
    const laserPaddleGradient = ctx.createLinearGradient(
      breakoutGame.paddle.x, 0,
      breakoutGame.paddle.x + breakoutGame.paddle.width, 0
    );
    laserPaddleGradient.addColorStop(0, '#f30000');
    laserPaddleGradient.addColorStop(1, '#ff4444');
    ctx.fillStyle = laserPaddleGradient;
  } else {
    ctx.fillStyle = paddleGradient;
  }
  
  ctx.fillRect(
    breakoutGame.paddle.x, 
    breakoutGame.paddle.y, 
    breakoutGame.paddle.width, 
    breakoutGame.paddle.height
  );
  
  // Główna piłka
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(breakoutGame.ball.x, breakoutGame.ball.y, breakoutGame.ball.radius, 0, Math.PI * 2);
  ctx.fill();
  
  // === Rysowanie dodatkowych piłek (MULTI) ===
  breakoutGame.extraBalls.forEach(eb => {
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.arc(eb.x, eb.y, eb.radius, 0, Math.PI * 2);
    ctx.fill();
    // Biały kontur dla widoczności
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
  
  // === Wskaźnik aktywnego power-upa na canvasie ===
  if (breakoutGame.activePowerup) {
    const secondsLeft = Math.ceil(breakoutGame.activePowerup.timer / 60);
    const typeInfo = POWERUP_TYPES.find(t => t.type === breakoutGame.activePowerup.type);
    if (typeInfo) {
      // Pasek timera na dole
      const timerWidth = (breakoutGame.activePowerup.timer / (typeInfo.duration || 480)) * 100;
      ctx.fillStyle = typeInfo.color;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(250, 485, 100, 8);
      ctx.globalAlpha = 0.9;
      ctx.fillRect(250, 485, timerWidth, 8);
      ctx.globalAlpha = 1.0;
      
      ctx.fillStyle = '#fff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${typeInfo.type} ${secondsLeft}s`, 300, 483);
    }
  }
  
  // Ekran Game Over
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
  
  // Przywróć transformację (koniec trzęsienia)
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function resetBreakout() {
  gameStateManager.resetGame();
  initBreakout();
}