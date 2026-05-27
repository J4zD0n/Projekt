// ===== SNAKE GAME =====
let snakeGame;

function initSnake() {
  if (gameStateManager.currentGameLoop) {
    clearInterval(gameStateManager.currentGameLoop);
    gameStateManager.currentGameLoop = null;
  }

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
    direction: 'right',
    // Specjalne jedzenie
    specialFood: null, // null lub {x, y, type, timer} — type: 'golden' | 'poison'
    poisoned: false,   // Czy sterowanie jest odwrócone
    poisonTimer: 0,    // Odliczanie efektu zatrucia (w klatkach)
    // System combo
    combo: 0,          // Aktualny licznik combo
    comboTimer: 0,     // Odliczanie do zresetowania combo (w klatkach)
    comboText: '',     // Tekst wyświetlany na ekranie
    comboTextY: 0,     // Pozycja Y tekstu combo (animacja unoszenia)
    // Trzęsienie ekranu
    shakeAmount: 0,    // Siła trzęsienia (maleje z czasem)
    // Wewnętrzny licznik klatek (do pulsowania złotego jabłka)
    frameCount: 0
  };
  
  generateFood();
  
  snakeGame.lastMoveTime = Date.now();
  
  gameStateManager.currentGameLoop = setInterval(() => {
    if (!snakeGame.gameOver) {
      // Płynne aktualizacje co klatkę (60 FPS)
      snakeGame.frameCount++;
      
      if (snakeGame.shakeAmount > 0) {
        snakeGame.shakeAmount *= 0.9;
        if (snakeGame.shakeAmount < 0.1) snakeGame.shakeAmount = 0;
      }
      
      if (snakeGame.comboText) {
        snakeGame.comboTextY -= 0.5;
      }
      
      // Logika ruchu węża zależna od wybranej trudności
      const now = Date.now();
      if (now - snakeGame.lastMoveTime > snakeGame.speed) {
        updateSnake();
        snakeGame.lastMoveTime = now;
      }
      
      drawSnake();
    }
  }, 1000 / 60);
}

function generateFood() {
  // Generowanie zwykłego jedzenia
  do {
    snakeGame.food.x = Math.floor(Math.random() * 20) * 20;
    snakeGame.food.y = Math.floor(Math.random() * 20) * 20;
  } while (snakeGame.snake.some(s => s.x === snakeGame.food.x && s.y === snakeGame.food.y));

  // Szansa na specjalne jedzenie (~15% złote, ~10% trujące)
  const roll = Math.random();
  if (roll < 0.15) {
    // Złote jabłko — znika po 5 sekundach
    let sx, sy;
    do {
      sx = Math.floor(Math.random() * 20) * 20;
      sy = Math.floor(Math.random() * 20) * 20;
    } while (
      snakeGame.snake.some(s => s.x === sx && s.y === sy) ||
      (sx === snakeGame.food.x && sy === snakeGame.food.y)
    );
    // Timer: 5 sekund ≈ 5000ms / snakeGame.speed klatek
    const timerFrames = Math.round(5000 / snakeGame.speed);
    snakeGame.specialFood = { x: sx, y: sy, type: 'golden', timer: timerFrames };
  } else if (roll < 0.25) {
    // Trujące jabłko
    let sx, sy;
    do {
      sx = Math.floor(Math.random() * 20) * 20;
      sy = Math.floor(Math.random() * 20) * 20;
    } while (
      snakeGame.snake.some(s => s.x === sx && s.y === sy) ||
      (sx === snakeGame.food.x && sy === snakeGame.food.y)
    );
    snakeGame.specialFood = { x: sx, y: sy, type: 'poison', timer: -1 }; // -1 = nie znika
  } else {
    snakeGame.specialFood = null;
  }
}

// Obliczanie mnożnika combo
function getComboMultiplier() {
  if (snakeGame.combo >= 8) return 5;
  if (snakeGame.combo >= 5) return 3;
  if (snakeGame.combo >= 3) return 2;
  return 1;
}

function updateSnake() {
  // Odliczanie timera combo
  if (snakeGame.comboTimer > 0) {
    snakeGame.comboTimer--;
    if (snakeGame.comboTimer <= 0) {
      snakeGame.combo = 0;
      snakeGame.comboText = '';
    }
  }

  // Odliczanie timera zatrucia
  if (snakeGame.poisonTimer > 0) {
    snakeGame.poisonTimer--;
    if (snakeGame.poisonTimer <= 0) {
      snakeGame.poisoned = false;
    }
  }

  // Odliczanie timera specjalnego jedzenia (złote jabłko znika)
  if (snakeGame.specialFood && snakeGame.specialFood.timer > 0) {
    snakeGame.specialFood.timer--;
    if (snakeGame.specialFood.timer <= 0) {
      snakeGame.specialFood = null;
    }
  }

  // Odwrócenie sterowania przy zatruciu
  if (snakeGame.poisoned) {
    if (inputHandler.isPressed('left') && snakeGame.direction !== 'left') { snakeGame.dx = 20; snakeGame.dy = 0; snakeGame.direction = 'right'; }
    else if (inputHandler.isPressed('right') && snakeGame.direction !== 'right') { snakeGame.dx = -20; snakeGame.dy = 0; snakeGame.direction = 'left'; }
    else if (inputHandler.isPressed('up') && snakeGame.direction !== 'up') { snakeGame.dx = 0; snakeGame.dy = 20; snakeGame.direction = 'down'; }
    else if (inputHandler.isPressed('down') && snakeGame.direction !== 'down') { snakeGame.dx = 0; snakeGame.dy = -20; snakeGame.direction = 'up'; }
  } else {
    // Normalne sterowanie
    if (inputHandler.isPressed('left') && snakeGame.direction !== 'right') { snakeGame.dx = -20; snakeGame.dy = 0; snakeGame.direction = 'left'; }
    else if (inputHandler.isPressed('right') && snakeGame.direction !== 'left') { snakeGame.dx = 20; snakeGame.dy = 0; snakeGame.direction = 'right'; }
    else if (inputHandler.isPressed('up') && snakeGame.direction !== 'down') { snakeGame.dx = 0; snakeGame.dy = -20; snakeGame.direction = 'up'; }
    else if (inputHandler.isPressed('down') && snakeGame.direction !== 'up') { snakeGame.dx = 0; snakeGame.dy = 20; snakeGame.direction = 'down'; }
  }
  
  const head = {
    x: snakeGame.snake[0].x + snakeGame.dx,
    y: snakeGame.snake[0].y + snakeGame.dy
  };
  
  // Przechodzenie przez ściany
  if (head.x < 0) head.x = 380;
  if (head.x >= 400) head.x = 0;
  if (head.y < 0) head.y = 380;
  if (head.y >= 400) head.y = 0;
  
  // Kolizja ze swoim ciałem
  if (snakeGame.snake.some(s => s.x === head.x && s.y === head.y)) { 
    snakeGame.gameOver = true;
    snakeGame.shakeAmount = 5; // Trzęsienie przy game over
    achievementsManager.checkAchievements('snake', snakeGame.score);
    levelSystem.addXP(Math.floor(snakeGame.score / 2));
    dailyChallengeSystem.updateProgress('snake', snakeGame.score);
    soundSystem.play('gameOver');
    drawSnake(); // Ostatnia klatka z trzęsieniem
    return;
  }
  
  snakeGame.snake.unshift(head);
  
  // Sprawdzanie kolizji z normalnym jedzeniem
  if (head.x === snakeGame.food.x && head.y === snakeGame.food.y) {
    // Combo
    snakeGame.combo++;
    // Timer combo: ~3 sekundy (teraz przy wolniejszym tick rate, przeliczane na ~3s)
    snakeGame.comboTimer = Math.round(3000 / snakeGame.speed);
    const comboMult = getComboMultiplier();
    const points = Math.floor(10 * snakeGame.multiplier * comboMult);
    snakeGame.score += points;

    // Tekst combo
    if (snakeGame.combo >= 2) {
      snakeGame.comboText = `COMBO x${snakeGame.combo}! (x${comboMult})`;
      snakeGame.comboTextY = 160; // Pozycja startowa
    }

    // Trzęsienie przy jedzeniu
    snakeGame.shakeAmount = 2;

    generateFood();
    soundSystem.play('collect');
  }
  // Sprawdzanie kolizji ze specjalnym jedzeniem
  else if (snakeGame.specialFood && head.x === snakeGame.specialFood.x && head.y === snakeGame.specialFood.y) {
    const sf = snakeGame.specialFood;

    if (sf.type === 'golden') {
      // Złote jabłko — 50 pkt × mnożnik × combo
      snakeGame.combo++;
      snakeGame.comboTimer = Math.round(3000 / snakeGame.speed);
      const comboMult = getComboMultiplier();
      const points = Math.floor(50 * snakeGame.multiplier * comboMult);
      snakeGame.score += points;

      if (snakeGame.combo >= 2) {
        snakeGame.comboText = `COMBO x${snakeGame.combo}! (x${comboMult})`;
        snakeGame.comboTextY = 160;
      }

      snakeGame.shakeAmount = 3; // Mocniejsze trzęsienie
      showNotification(`🌟 Złote jabłko! +${points} pkt!`);
      soundSystem.play('collect');
    } else if (sf.type === 'poison') {
      // Trujące jabłko — odwraca sterowanie na 8 sekund
      snakeGame.score += Math.floor(5 * snakeGame.multiplier);
      snakeGame.poisoned = true;
      // 8 sekund
      snakeGame.poisonTimer = Math.round(8000 / snakeGame.speed);

      // Combo resetuje się przy zjedzeniu trucizny
      snakeGame.combo = 0;
      snakeGame.comboTimer = 0;
      snakeGame.comboText = '';

      snakeGame.shakeAmount = 4;
      showNotification('☠️ Trucizna! Sterowanie odwrócone!');
      soundSystem.play('collect');
      
      // Uwaga: trucizna nie powiększa węża, więc musimy wyrzucić ogon!
      snakeGame.snake.pop();
    }

    snakeGame.specialFood = null;
  } else {
    // Brak jedzenia, zdejmujemy ogon
    snakeGame.snake.pop();
  }
}

function drawSnake() {
  const canvas = document.getElementById('snakeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Trzęsienie ekranu — przesunięcie canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformacji
  if (snakeGame.shakeAmount > 0) {
    const shakeX = (Math.random() - 0.5) * snakeGame.shakeAmount * 2;
    const shakeY = (Math.random() - 0.5) * snakeGame.shakeAmount * 2;
    ctx.translate(shakeX, shakeY);
  }

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
      ctx.fillStyle = snakeGame.poisoned ? '#88ff88' : '#00ff00';
      ctx.beginPath();
      ctx.arc(segment.x + 10, segment.y + 10, 11, 0, Math.PI * 2);
      ctx.fill();
      
      // Oczy (czerwone przy zatruciu)
      ctx.fillStyle = snakeGame.poisoned ? '#ff0000' : '#000';
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
      ctx.fillStyle = snakeGame.poisoned
        ? `rgb(${Math.floor(greenValue * 0.3)}, ${greenValue}, ${Math.floor(greenValue * 0.5)})`
        : `rgb(0, ${greenValue}, 0)`;
      ctx.beginPath();
      ctx.arc(segment.x + 10, segment.y + 10, 9 - (i % 2 === 0 ? 0.5 : 0), 0, Math.PI * 2);
      ctx.fill();
    }
  });
  
  // Normalne jedzenie (czerwone jabłko)
  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  ctx.arc(snakeGame.food.x + 10, snakeGame.food.y + 10, 8, 0, Math.PI * 2);
  ctx.fill();

  // Specjalne jedzenie
  if (snakeGame.specialFood) {
    const sf = snakeGame.specialFood;
    const cx = sf.x + 10;
    const cy = sf.y + 10;

    if (sf.type === 'golden') {
      // Złote jabłko z pulsującą poświatą (zoptymalizowane - brak shadowBlur)
      const pulse = Math.sin(snakeGame.frameCount * 0.15) * 0.4 + 0.6; // 0.2 – 1.0
      const glowRadius = 14 + pulse * 6;

      // Poświata (proste przezroczyste koła zamiast drogiego cienia)
      ctx.fillStyle = `rgba(255, 215, 0, ${0.4 * pulse})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(cx, cy, 8 + pulse * 2, 0, Math.PI * 2);
      ctx.fill();

      // Zewnętrzny pierścień poświaty
      ctx.strokeStyle = `rgba(255, 215, 0, ${pulse * 0.5})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Timer — pasek pod jabłkiem
      if (sf.timer > 0) {
        const maxTimer = Math.round(5000 / snakeGame.speed);
        const ratio = sf.timer / maxTimer;
        ctx.fillStyle = `rgba(255, 215, 0, 0.7)`;
        ctx.fillRect(sf.x, sf.y + 22, 20 * ratio, 3);
      }
    } else if (sf.type === 'poison') {
      // Trujące jabłko z ciemną aurą (zoptymalizowane)
      ctx.fillStyle = 'rgba(148, 0, 211, 0.5)';
      ctx.beginPath();
      ctx.arc(cx, cy, 16, 0, Math.PI * 2);
      ctx.fill();

      // Jabłko
      ctx.fillStyle = '#9400D3';
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();

      // Mała czaszka (symbol trucizny) — krzyżyk
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('☠', cx, cy);
    }
  }

  // Nakładka fioletowa przy zatruciu
  if (snakeGame.poisoned) {
    const poisonAlpha = 0.08 + Math.sin(snakeGame.frameCount * 0.1) * 0.04;
    ctx.fillStyle = `rgba(148, 0, 211, ${poisonAlpha})`;
    ctx.fillRect(0, 0, 400, 400);

    // Tekst ostrzeżenia
    ctx.fillStyle = `rgba(200, 100, 255, ${0.5 + Math.sin(snakeGame.frameCount * 0.12) * 0.3})`;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    const remainSec = Math.ceil(snakeGame.poisonTimer * snakeGame.speed / 1000);
    ctx.fillText(`☠ ZATRUCIE! (${remainSec}s) ☠`, 200, 20);
  }

  // Wyświetlanie combo
  if (snakeGame.combo >= 2 && snakeGame.comboText) {
    const comboAlpha = Math.min(1, snakeGame.comboTimer / 20);
    const comboMult = getComboMultiplier();

    // Kolor zależy od poziomu combo
    let comboColor;
    if (comboMult >= 5) comboColor = `rgba(255, 50, 50, ${comboAlpha})`;
    else if (comboMult >= 3) comboColor = `rgba(255, 165, 0, ${comboAlpha})`;
    else comboColor = `rgba(255, 255, 0, ${comboAlpha})`;

    ctx.fillStyle = comboColor;
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(snakeGame.comboText, 200, snakeGame.comboTextY);
  }

  // Wynik na ekranie (prawy górny róg)
  const scoreEl = document.getElementById('snakeScore');
  if (scoreEl) scoreEl.textContent = snakeGame.score;
  
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

    // Informacja o najwyższym combo
    if (snakeGame.combo >= 2) {
      ctx.fillStyle = '#FFD700';
      ctx.font = '18px Arial';
      ctx.fillText(`Najlepsze combo: x${snakeGame.combo}`, 200, 255);
    }
  }

  // Reset transformacji po trzęsieniu
  ctx.setTransform(1, 0, 0, 1, 0, 0);
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