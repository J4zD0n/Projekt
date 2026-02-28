// ===== RACING GAME =====
let racingGame;

// Konfiguracja trudności dla Racing (ZBALANSOWANA)
const racingDifficultyConfig = {
  easy: {
    name: "Łatwy",
    description: "Wolne samochody, szerokie drogi",
    carSpeed: 6,
    obstacleSpeed: 1.5,
    spawnRate: 100,  // RZADZIEJ przeszkód
    multiplier: 1,
    laneWidth: 120,  // SZERSZE drogi
    carWidth: 45,    // Mniejsze auta
    gapBetweenCars: 150  // Większe odstępy
  },
  medium: {
    name: "Średni",
    description: "Normalna prędkość, średni mnożnik",
    carSpeed: 6.5,
    obstacleSpeed: 2,
    spawnRate: 80,
    multiplier: 1.5,
    laneWidth: 100,
    carWidth: 50,
    gapBetweenCars: 120
  },
  hard: {
    name: "Trudny",
    description: "Szybkie samochody, ciasne drogi",
    carSpeed: 7,
    obstacleSpeed: 2.5,
    spawnRate: 60,
    multiplier: 2,
    laneWidth: 90,
    carWidth: 55,
    gapBetweenCars: 100
  },
  expert: {
    name: "Ekspert",
    description: "Ekstremalna prędkość, minimalne przestrzenie",
    carSpeed: 7.5,
    obstacleSpeed: 3,
    spawnRate: 50,
    multiplier: 3,
    laneWidth: 80,
    carWidth: 60,
    gapBetweenCars: 80
  }
};

function initRacing() {
  const difficulty = racingDifficultyConfig[gameStateManager.currentDifficulty] || racingDifficultyConfig.medium;
  
  // Aktualizuj badge trudności
  const badge = document.querySelector('#racingGame .difficulty-badge');
  if (badge) {
    badge.textContent = difficulty.name;
  }
  
  racingGame = {
    car: { 
      x: 175, 
      y: 300, 
      width: difficulty.carWidth, 
      height: 80, 
      speed: difficulty.carSpeed 
    },
    obstacles: [],
    roadY: 0,
    distance: 0,
    gameOver: false,
    baseSpeed: difficulty.obstacleSpeed,
    currentSpeed: difficulty.obstacleSpeed,
    frameCount: 0,
    scoreMultiplier: difficulty.multiplier,
    difficulty: difficulty,
    lastObstacleY: -200,  // Zapewnia odstęp między przeszkodami
    score: 0
  };
  
  gameStateManager.currentGameLoop = setInterval(() => {
    if (!racingGame.gameOver) {
      updateRacing();
      drawRacing();
    }
  }, 1000 / 60);
}

function updateRacing() {
  racingGame.frameCount++;
  
  // Sterowanie - płynniejsze
  if (inputHandler.isPressed('left') || inputHandler.isPressed('a')) {
    racingGame.car.x = Math.max(50, racingGame.car.x - racingGame.car.speed);
  }
  if (inputHandler.isPressed('right') || inputHandler.isPressed('d')) {
    const maxX = 350 - racingGame.car.width;
    racingGame.car.x = Math.min(maxX, racingGame.car.x + racingGame.car.speed);
  }
  
  // Ruch drogi
  racingGame.roadY += racingGame.currentSpeed;
  if (racingGame.roadY > 40) racingGame.roadY = 0;
  
  // Dystans i punkty
  const distanceGained = racingGame.currentSpeed * 0.1;
  racingGame.distance += distanceGained;
  racingGame.score = Math.floor(racingGame.distance * racingGame.scoreMultiplier);
  
  // Spawnowanie przeszkód z ODSTĘPAMI
  const shouldSpawn = racingGame.frameCount % racingGame.difficulty.spawnRate === 0;
  const enoughSpace = racingGame.obstacles.length === 0 || 
                      racingGame.obstacles[racingGame.obstacles.length - 1].y > racingGame.difficulty.gapBetweenCars;
  
  if (shouldSpawn && enoughSpace) {
    // Tylko 1-2 samochody na raz (nigdy 3)
    const numCars = Math.random() > 0.7 ? 2 : 1;
    const availableLanes = [0, 1, 2];
    
    for (let i = 0; i < numCars; i++) {
      if (availableLanes.length === 0) break;
      
      const laneIndex = Math.floor(Math.random() * availableLanes.length);
      const lane = availableLanes[laneIndex];
      availableLanes.splice(laneIndex, 1); // Usuń użyty pas
      
      const carTypes = ['car', 'car', 'car', 'smallCar']; // 75% normalnych, 25% małych
      const type = carTypes[Math.floor(Math.random() * carTypes.length)];
      
      racingGame.obstacles.push({
        x: 50 + lane * racingGame.difficulty.laneWidth,
        y: -100,
        width: type === 'smallCar' ? 40 : racingGame.difficulty.carWidth,
        height: type === 'smallCar' ? 60 : 80,
        type: type,
        lane: lane
      });
    }
  }
  
  // Aktualizacja przeszkód i kolizje
  for (let i = racingGame.obstacles.length - 1; i >= 0; i--) {
    const obs = racingGame.obstacles[i];
    obs.y += racingGame.currentSpeed * 1.5;
    
    // Usuń przeszkody poza ekranem
    if (obs.y > 500) {
      racingGame.obstacles.splice(i, 1);
      // Punkty za ominięcie
      const pointsEarned = Math.floor(10 * racingGame.scoreMultiplier);
      racingGame.score += pointsEarned;
      continue;
    }
    
    // Kolizja - DOKLADNE sprawdzanie
    const collisionMargin = 5; // Mały margines dla uczciwej gry
    if (
      racingGame.car.x + collisionMargin < obs.x + obs.width - collisionMargin &&
      racingGame.car.x + racingGame.car.width - collisionMargin > obs.x + collisionMargin &&
      racingGame.car.y + collisionMargin < obs.y + obs.height - collisionMargin &&
      racingGame.car.y + racingGame.car.height - collisionMargin > obs.y + collisionMargin
    ) {
      racingGame.gameOver = true;
      const finalScore = racingGame.score;
      achievementsManager.checkAchievements('racing', Math.floor(racingGame.distance));
      levelSystem.addXP(Math.floor(finalScore / 20));
      dailyChallengeSystem.updateProgress('racing', Math.floor(racingGame.distance));
      soundSystem.play('gameOver');
      break;
    }
  }
  
  // Stopniowe zwiększanie prędkości co 500 klatek (wolniej)
  if (racingGame.frameCount % 500 === 0) {
    racingGame.currentSpeed += 0.05;
  }
  
  // Aktualizacja wyniku
  const scoreEl = document.getElementById('racingScore');
  if (scoreEl) {
    scoreEl.textContent = `Dystans: ${Math.floor(racingGame.distance)}m | Wynik: ${racingGame.score} | Mnożnik: x${racingGame.scoreMultiplier}`;
  }
}

function drawRacing() {
  const canvas = document.getElementById('racingCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Trawa
  ctx.fillStyle = '#228B22';
  ctx.fillRect(0, 0, 400, 500);
  
  // Droga
  ctx.fillStyle = '#333';
  ctx.fillRect(50, 0, 300, 500);
  
  // Linie na drodze
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.setLineDash([25, 25]);
  
  // Trzy pasy ruchu
  const laneWidth = racingGame.difficulty.laneWidth;
  for (let i = 1; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(50 + i * laneWidth, racingGame.roadY);
    ctx.lineTo(50 + i * laneWidth, 500 + racingGame.roadY);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  
  // Krawędzie drogi
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(50, 0);
  ctx.lineTo(50, 500);
  ctx.moveTo(350, 0);
  ctx.lineTo(350, 500);
  ctx.stroke();
  
  // Gracz (niebieskie auto) - LEPIEJ WIDOCZNE
  ctx.fillStyle = '#0000ff';
  ctx.fillRect(racingGame.car.x, racingGame.car.y, racingGame.car.width, racingGame.car.height);
  
  // Detale auta gracza
  ctx.fillStyle = '#ADD8E6';
  ctx.fillRect(racingGame.car.x + 5, racingGame.car.y + 10, racingGame.car.width - 10, 30);
  
  // Reflektory
  ctx.fillStyle = '#FFFF00';
  ctx.fillRect(racingGame.car.x + 5, racingGame.car.y + 5, 8, 5);
  ctx.fillRect(racingGame.car.x + racingGame.car.width - 13, racingGame.car.y + 5, 8, 5);
  
  // Koła
  ctx.fillStyle = '#000';
  ctx.fillRect(racingGame.car.x + 5, racingGame.car.y + racingGame.car.height - 15, 12, 12);
  ctx.fillRect(racingGame.car.x + racingGame.car.width - 17, racingGame.car.y + racingGame.car.height - 15, 12, 12);
  
  // Przeszkody
  racingGame.obstacles.forEach(obs => {
    // Kolor w zależności od typu
    if (obs.type === 'smallCar') {
      ctx.fillStyle = '#FF4500'; // Pomarańczowy dla małych aut
    } else {
      ctx.fillStyle = '#DC143C'; // Czerwony dla normalnych aut
    }
    
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    
    // Detale przeszkody
    ctx.fillStyle = obs.type === 'smallCar' ? '#FFD700' : '#FFB6C1';
    ctx.fillRect(obs.x + 5, obs.y + 10, obs.width - 10, obs.height - 30);
    
    // Koła przeszkód
    ctx.fillStyle = '#000';
    ctx.fillRect(obs.x + 5, obs.y + obs.height - 15, 12, 12);
    ctx.fillRect(obs.x + obs.width - 17, obs.y + obs.height - 15, 12, 12);
    
    // Reflektory przeszkód
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(obs.x + 5, obs.y + 5, 6, 4);
    ctx.fillRect(obs.x + obs.width - 11, obs.y + 5, 6, 4);
  });
  
  // Game Over screen
  if (racingGame.gameOver) {
    // Ciemne tło
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, 400, 500);
    
    // Tekst GAME OVER
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', 200, 180);
    
    // Statystyki
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Dystans: ${Math.floor(racingGame.distance)}m`, 200, 230);
    ctx.fillText(`Wynik: ${racingGame.score}`, 200, 270);
    ctx.fillText(`Poziom: ${racingGame.difficulty.name}`, 200, 310);
    ctx.fillText(`Mnożnik: x${racingGame.scoreMultiplier}`, 200, 350);
  }
}

// Naprawiona funkcja resetu
function resetRacing() {
  // Najpierw wyczyść stare intervaly
  if (gameStateManager.currentGameLoop) {
    clearInterval(gameStateManager.currentGameLoop);
    gameStateManager.currentGameLoop = null;
  }
  
  // Wyczyść input
  inputHandler.clearAll();
  
  // Ustaw flagę że nie gramy
  gameStateManager.currentGame = null;
  
  // Poczekaj chwilę przed restartem
  setTimeout(() => {
    initRacing();
    gameStateManager.currentGame = 'racing';
  }, 100);
}

// Usuwamy obsługę kliknięć na ekranie Game Over (bo nie ma już przycisków)